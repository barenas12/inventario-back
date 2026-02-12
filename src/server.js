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

// ✅ MIDDLEWARE DE VERIFICACIÓN DE ROL ADMINISTRADOR
const verificarAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ mensaje: 'Usuario no autenticado' });
  }

  if (req.user.role !== 'administrador') {
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
    SELECT id, user, password_hash, role
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
      console.log('❌ Usuario no encontrado:', user);
      return res.status(401).json({ mensaje: 'Credenciales inactivas o no encontradas' });
    }

    const usuario = results[0];
    const passwordOk = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordOk) {
      console.log('❌ Contraseña incorrecta para:', user);
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // ✅ Generar JWT (válido por 1 hora)
    const token = jwt.sign(
      {
        id: usuario.id,
        user: usuario.user,
        role: usuario.role
      },
      JWT_SECRET,
      { expiresIn: '1H' }
    );

    console.log('✅ Login exitoso para:', user);
    
    res.json({
      mensaje: 'Login exitoso ✅',
      token: token,
      user: usuario.user,
      role: usuario.role
    });
  });
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

app.get("/api/exportar", verificarToken, verificarAdmin, async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
});
