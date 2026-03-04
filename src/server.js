const express = require("express");
const ExcelJS = require("exceljs");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require("./config/db");
const loginDB = require("./config/dbLogin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_muy_segura_2024";

const app = express();

// Agrega middlewares necesarios
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// ✅ MIDDLEWARE DE VERIFICACIÓN DE JWT
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.headers['x-token'] || req.query.token;

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('❌ Token inválido:', err.message);
      return res.status(403).json({ mensaje: 'Token inválido o expirado' });
    }
    req.user = decoded;
    next();
  });
};

// helper para normalizar y comprobar roles
function roleIsAdmin(rawRole) {
  if (!rawRole) return false;
  const r = String(rawRole).toLowerCase();
  return r === 'admin' || r === 'administrador' || r === 'administrador' || r === 'administrador';
}

// ✅ MIDDLEWARE DE VERIFICACIÓN DE ROL ADMINISTRADOR
const verificarAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }

  if (!roleIsAdmin(req.user.role)) {
    console.warn(`⚠️ Acceso denegado - Usuario ${req.user.user} (${req.user.role}) intentó realizar acción administrativa`);
    return res.status(403).json({ mensaje: 'Acceso denegado - Requiere rol de administrador' });
  }

  next();
};

const authRoutes = require('./modules/auth/auth.routes');
app.use('/auth', authRoutes);

// ✅ RUTA DE LOGIN
app.post('/api/login', (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña requeridos' });
  }

  const sql = `
    SELECT id, user, password_hash, role, reset_pass
    FROM users
    WHERE user = ? AND status = 'Activo'
    LIMIT 1;
  `;

  loginDB.query(sql, [user], async (err, results) => {
    if (err) {
      console.error('DB LOGIN ERROR:', err);
      return res.status(500).json({ mensaje: 'Error en base de datos' });
    }

    if (!results || results.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales inactivas o no encontradas' });
    }

    const usuario = results[0];
    const passwordOk = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordOk) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const normalizedRole = roleIsAdmin(usuario.role) ? 'admin' : 'user';
    const token = jwt.sign(
      { id: usuario.id, user: usuario.user, role: normalizedRole },
      JWT_SECRET,
      { expiresIn: '1H' }
    );

    // ✅ NUEVO: indicar si debe cambiar contraseña
    const mustChangePassword = String(usuario.reset_pass).toLowerCase() === 'si';

    res.json({
      mensaje: 'Login exitoso ✅',
      token,
      user: usuario.user,
      role: usuario.role,
      mustChangePassword   // <-- frontend lo detecta
    });
  });
});

// ✅ NUEVA RUTA: Cambio de contraseña en primer login
// ✅ RUTA: Cambio de contraseña en primer login
app.put('/api/login/change-password', verificarToken, async (req, res) => {
  const { nuevaContrasena } = req.body;
  const userId = req.user.id;

  if (!nuevaContrasena) {
    return res.status(400).json({ mensaje: 'La contraseña es requerida' });
  }

  // ✅ Validar requisitos en el backend (seguridad real)
  const requisitos = [
    { regex: /.{8,}/,        texto: 'Mínimo 8 caracteres' },
    { regex: /[A-Z]/,        texto: 'Al menos 1 letra mayúscula' },
    { regex: /[a-z]/,        texto: 'Al menos 1 letra minúscula' },
    { regex: /[0-9]/,        texto: 'Al menos 1 número' },
    { regex: /[^A-Za-z0-9]/, texto: 'Al menos 1 carácter especial (!@#$...)' },
  ];

  const fallidos = requisitos.filter(r => !r.regex.test(nuevaContrasena));
  if (fallidos.length > 0) {
    return res.status(400).json({
      mensaje: 'La contraseña no cumple los requisitos: ' + fallidos.map(f => f.texto).join(', ')
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(nuevaContrasena, salt);

    const sql = `
      UPDATE login.users
      SET password_hash = ?, reset_pass = 'No'
      WHERE id = ?;
    `;

    loginDB.query(sql, [hash, userId], (err, result) => {
      if (err) {
        console.error('❌ Error al cambiar contraseña:', err);
        return res.status(500).json({ mensaje: 'Error al actualizar contraseña' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      console.log(`✅ Contraseña actualizada para userId: ${userId}`);
      res.json({ mensaje: '✅ Contraseña actualizada correctamente' });
    });
  } catch (e) {
    console.error('❌ Error generando hash:', e);
    res.status(500).json({ mensaje: 'Error interno al crear contraseña' });
  }
});

// ✅ RUTA PARA VERIFICAR TOKEN (opcional, para refrescar sesión)
app.get('/api/verify-token', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Token válido',
    user: req.user.user,
    role: req.user.role
  });
});

// ✅ RUTA PARA LOGOUT (opcional)
app.post('/api/logout', (req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente' });
});

// ✅ Aplicar verificación a las rutas protegidas
app.post('/api/inventario/implemento', verificarToken, verificarAdmin, (req, res) => {
  const {
    nombre,
    categoria,
    departamento,
    condicion,
    pertenencia,
    propietario,
    valor,
    fecha,
    sede,
    descripcion,
    responsable
  } = req.body || {};

  console.log("Datos recibidos:", req.body);

  const sql = `
    INSERT INTO inventario.implemento (
    nombre, categoria, departamento, condicion,
    pertenencia, propietario, valor, fecha, sede, descripcion, responsable
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    nombre, categoria, departamento, condicion,
    pertenencia, propietario, valor, fecha, sede, descripcion, responsable
  ], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar:', err);
      return res.status(500).json({ mensaje: 'Error al guardar en la base de datos' });
    }
    res.json({ mensaje: '✅ Datos guardados correctamente' });
  });
});

app.get('/api/inventario/implemento', verificarToken, (req, res) => {
  const sql = `SELECT 
  CONCAT('ARCSAS-',
      CASE 
          WHEN i.categoria = 'Muebles' THEN 'M'
          ELSE 'T'
          END,i.id) AS id_implemento, i.nombre,i.id, 
      i.categoria, 
      d.nombre AS departamento, 
      i.condicion, 
      i.pertenencia, 
      p.nombre_proveedor AS propietario,
      i.cantidad, 
      i.valor, 
      i.estado,
      i.sede,
      i.descripcion,
      r.nombre AS responsable,
      i.fecha FROM inventario.implemento AS i 
      LEFT JOIN inventario.departamento AS d ON d.id = i.departamento LEFT JOIN inventario.propietario AS p ON p.id = i.propietario 
      LEFT JOIN inventario.responsable AS r ON responsable = r.id;`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
    res.json(results);
  })
});

app.get('/api/inventario/departamento', verificarToken, (req, res) => {
  const sql = 'SELECT * FROM inventario.departamento WHERE estado="Activo" ORDER BY nombre ASC;';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
    res.json(results);
  })
});

app.get('/api/inventario/responsable', verificarToken, (req, res) => {
  const sql = 'SELECT * FROM inventario.responsable WHERE Estado="Activo" ORDER BY nombre ASC;';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
    res.json(results);
  })
});

app.get('/api/inventario/cat_implemento/:categoria', verificarToken, (req, res) => {
  const categoria = req.params.categoria;
  const sql = 'SELECT * FROM inventario.cat_implemento WHERE categoria = ? ORDER BY nom_implemento ASC;';
  db.query(sql, [categoria], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener implementos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener implementos' });
    }
    res.json(results);
  });
});

app.get('/api/inventario/implemento/:id', verificarToken, (req, res) => {
  const id = req.params.id;
  const sql = `SELECT 
  implemento.nombre, 
  implemento.categoria, 
  implemento.condicion, 
  implemento.pertenencia, 
  implemento.propietario, 
  implemento.cantidad, 
  implemento.valor, 
  implemento.fecha, 
  implemento.estado, 
  implemento.departamento, 
  implemento.sede, 
  implemento.descripcion,
  implemento.responsable AS responsable,
  CONCAT('ARCSAS-',
    CASE 
      WHEN implemento.categoria = 'Muebles' THEN 'M'
      ELSE 'T'
    END,
    implemento.id
  ) AS id_implemento
FROM implemento
LEFT JOIN inventario.responsable AS r ON implemento.responsable = r.id
WHERE implemento.id = ?;`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener implementos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener implementos' });
    }
    res.json(results[0]);
  });
});

app.get('/api/inventario/implemento/categoria/:categoria', verificarToken, (req, res) => {
  const { categoria } = req.params;
  const sql = 'SELECT * FROM inventario.implemento WHERE categoria = ?';

  db.query(sql, [categoria], (err, results) => {
    if (err) return res.status(500).json({ mensaje: 'Error' });
    res.json(results);
  });
});

app.put('/api/inventario/implemento/:id', verificarToken, verificarAdmin, (req, res) => {
  const {
    nombre,
    categoria,
    departamento,
    condicion,
    pertenencia,
    propietario,
    valor,
    fecha,
    sede,
    descripcion,
    responsable,
    estado } = req.body;

  const { id } = req.params;

  const sql = `UPDATE implemento SET nombre = ?, categoria = ?, 
    departamento = ?, condicion = ?, pertenencia = ?, propietario = ?, responsable = ?, valor = ?, fecha = ?, 
    sede = ?, descripcion = ?, estado = ? WHERE id = ?;`

  db.query(sql, [
    nombre, categoria, departamento, condicion,
    pertenencia, propietario, responsable, valor, fecha, sede, descripcion, estado, id
  ], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar:', err);
      return res.status(500).json({ mensaje: 'Error al actualizar en la base de datos' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'No se encontró el implemento con ese ID' });
    }
    return res.json({ mensaje: '✅ Datos actualizados correctamente' });
  });
});

app.get("/api/exportar/implementos", verificarToken, verificarAdmin, async (req, res) => {
  const sql = `
    SELECT 
      CONCAT('ARCSAS-',
        CASE 
          WHEN i.categoria = 'Muebles' THEN 'M'
          ELSE 'T'
        END, i.id) AS id_implemento,
      i.nombre,
      i.categoria,
      d.nombre AS departamento,
      i.condicion,
      i.pertenencia,
      r.nombre as Responsable,
      p.nombre_proveedor AS propietario,
      i.cantidad,
      i.valor,
      i.estado,
      i.fecha,
      i.sede,
      i.descripcion,
      i.estado
    FROM inventario.implemento AS i
    LEFT JOIN inventario.departamento AS d 
      ON d.id = i.departamento
    LEFT JOIN inventario.propietario AS p 
      ON p.id = i.propietario
      LEFT JOIN inventario.responsable AS r
      ON r.id = i.responsable;
  `;

  db.query(sql, async (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      return res.status(500).send("Error exportando datos");
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Inventario");

      worksheet.columns = [
        { header: "ID Implemento", key: "id_implemento", width: 15 },
        { header: "Nombre", key: "nombre", width: 30 },
        { header: "Categoría", key: "categoria", width: 20 },
        { header: "Departamento", key: "departamento", width: 35 },
        { header: "Condición", key: "condicion", width: 10 },
        { header: "Pertenencia", key: "pertenencia", width: 12 },
        { header: "Propietario", key: "propietario", width: 15 },
        { header: "Responsable", key: "Responsable", width: 30 },
        { header: "Cantidad", key: "cantidad", width: 10 },
        { header: "Valor", key: "valor", width: 10 },
        { header: "Sede", key: "sede", width: 10 },
        { header: "Descripción", key: "descripcion", width: 25 },
        { header: "Estado", key: "estado", width: 13 },
        { header: "Fecha", key: "fecha", width: 13 }
      ];

      results.forEach(row => worksheet.addRow(row));

      worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" }
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          row.eachCell(cell => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" }
            };
          });
        }
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=inventario.xlsx");

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("❌ Error generando Excel:", error);
      res.status(500).send("Error generando Excel");
    }
  });
});

app.get('/api/login/users', verificarToken, (req, res) => {
  const sql = `SELECT 
    id,
    user,
    status,
    nombre,
    apellido,
    reset_pass,
    CASE 
        WHEN role = 'Admin' THEN 'Administrador'
        ELSE 'Gestor'
    END AS role
FROM login.users;`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
    res.json(results);
  })
});

app.get('/api/login/users/:id', verificarToken, (req, res) => {
  const id = req.params.id;
  const sql = `SELECT 
    id,
    user,
    status,
    nombre,
    apellido,
    reset_pass,
    CASE 
        WHEN role = 'Admin' THEN 'Administrador'
        ELSE 'Gestor'
    END AS role
FROM login.users
where users.id=?;`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener implementos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener implementos' });
    }
    res.json(results[0]);
  });
});

app.put('/api/login/users/:id', verificarToken, verificarAdmin, async (req, res) => {
  const {
    nombre,
    apellido,
    usuario,
    rol,
    estado,
    reset_pass
  } = req.body || {};

  const { id } = req.params;

  // determine whether we need to regenerate password
  const shouldReset = String(reset_pass).toLowerCase() === 'si';
  let newPlain = null;
  let passwordHash = null;

  if (shouldReset) {
    // reuse same default logic as in POST
    newPlain = `Arcsas${new Date().getFullYear()}/*`;
    try {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(newPlain, salt);
    } catch (e) {
      console.error('❌ Error generando hash de contraseña:', e);
      return res.status(500).json({ mensaje: 'Error al crear contraseña' });
    }
  }

  // build SQL depending on reset flag
  let sql;
  let params;

  if (shouldReset) {
    sql = `UPDATE login.users 
SET 
    nombre = ?, 
    apellido = ?, 
    user = ?,
    reset_pass = ?,
    password_hash = ?,
    role = CASE 
              WHEN ? = 'Administrador' THEN 'admin'
              ELSE 'gestor'
           END,
    status = ? 
WHERE id = ?;`;
    params = [
      nombre,
      apellido,
      usuario,
      reset_pass,
      passwordHash,
      rol,
      estado,
      id
    ];
  } else {
    sql = `UPDATE login.users 
SET 
    nombre = ?, 
    apellido = ?, 
    user = ?,
    reset_pass = ?,
    role = CASE 
              WHEN ? = 'Administrador' THEN 'admin'
              ELSE 'gestor'
           END,
    status = ? 
WHERE id = ?;`;
    params = [
      nombre,
      apellido,
      usuario,
      reset_pass,
      rol,
      estado,
      id
    ];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar usuario:', err);
      return res.status(500).json({ mensaje: 'Error al actualizar usuario en la base de datos' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'No se encontró el usuario con ese ID' });
    }
    const response = { mensaje: '✅ Usuario actualizado correctamente' };
    if (shouldReset && newPlain) {
      response.password = newPlain;
    }
    return res.json(response);
  });
});

app.get("/api/exportar/usuarios", verificarToken, verificarAdmin, async (req, res) => {
  const sql = `
    SELECT 
    id,
    user,
    status,
    nombre,
    apellido,
    CASE 
        WHEN role = 'Admin' THEN 'Administrador'
        ELSE 'Gestor'
    END AS role
FROM login.users;
  `;

  db.query(sql, async (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      return res.status(500).send("Error exportando datos");
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Inventario");

      worksheet.columns = [
        { header: "ID Usuario", key: "id", width: 15 },
        { header: "Usuario", key: "user", width: 15 },
        { header: "Estado", key: "status", width: 15 },
        { header: "Nombre", key: "nombre", width: 20 },
        { header: "Apellido", key: "apellido", width: 20 },
        { header: "Rol", key: "role", width: 15 }
      ];

      results.forEach(row => worksheet.addRow(row));

      worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" }
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          row.eachCell(cell => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" }
            };
          });
        }
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=inventario.xlsx");

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error("❌ Error generando Excel:", error);
      res.status(500).send("Error generando Excel");
    }
  });
});

app.post('/api/login/users', verificarToken, verificarAdmin, async (req, res) => {
  const {
    nombre,
    apellido,
    usuario,
    rol
  } = req.body || {};

  // Generar contraseña por defecto: "Arcsas" + año actual + "/*"
  const defaultPlain = `Arcsas${new Date().getFullYear()}/*`;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(defaultPlain, salt);

    const sql = `
      INSERT INTO login.users (
        nombre, apellido, user, role, status, password_hash
      ) VALUES (?, ?, ?, ?, 'Activo', ?);`;

    db.query(sql, [
      nombre,
      apellido,
      usuario,
      rol === 'Administrador' ? 'admin' : 'gestor',
      hashed
    ], (err, result) => {
      if (err) {
        console.error('❌ Error al insertar usuario:', err);
        return res.status(500).json({ mensaje: 'Error al guardar usuario en la base de datos' });
      }
      // opcional: devolver la contraseña en claro para que el admin la copie
      res.json({ mensaje: '✅ Usuario guardado correctamente', password: defaultPlain });
    });
  } catch (e) {
    console.error('❌ Error creando contraseña por defecto:', e);
    res.status(500).json({ mensaje: 'Error interno al crear contraseña' });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
