const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const ExcelJS = require("exceljs");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Crear conexión a MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inventario"
});

connection.connect(err => {
  if (err) {
    console.error("❌ Error conectando a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

app.post('/api/inventario/implemento', (req, res) => {
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
    descripcion
  } = req.body || {};

  console.log("Datos recibidos:", req.body);

  const sql = `
    INSERT INTO inventario.implemento (
    nombre, categoria, departamento, condicion,
    pertenencia, propietario, valor, fecha, sede, descripcion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


  db.query(sql, [
    nombre, categoria, departamento, condicion,
    pertenencia, propietario, valor, fecha, sede, descripcion
  ], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar:', err);
      return res.status(500).json({ mensaje: 'Error al guardar en la base de datos' });
    }
    res.json({ mensaje: '✅ Datos guardados correctamente' });
  });
});


app.listen(3000, () => {
  console.log('servidor corriendo en el puerto 3000');
})

app.get('/api/inventario/implemento', (req, res) => {
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
    i.fecha FROM inventario.implemento AS i 
    LEFT JOIN inventario.departamento AS d ON d.id = i.departamento LEFT JOIN inventario.propietario AS p ON p.id = i.propietario;`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
    res.json(results);
  })
})


//API PARA RECORRER DEPARTAMENTOS
app.get('/api/inventario/departamento', (req, res) => {
  const sql = 'SELECT * FROM inventario.departamento ORDER BY nombre ASC;';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
    res.json(results);
  })
})

//API PARA RECORRER NOMBRE ACORDE AL IMPLEMENTO
app.get('/api/inventario/cat_implemento/:categoria', (req, res) => {
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


app.get('/api/inventario/implemento/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT implemento.nombre, implemento.categoria, implemento.condicion, implemento.pertenencia, 
  implemento.propietario, implemento.cantidad, implemento.valor, implemento.fecha, implemento.estado,implemento.departamento,implemento.sede, implemento.descripcion,implemento.estado,
    CONCAT('ARCSAS-',
	  CASE 
		WHEN categoria = 'Muebles' THEN 'M'
        ELSE 'T'
        END,implemento.id) AS id_implemento
        FROM implemento
        WHERE implemento.id = ?;`;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener implementos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener implementos' });
    }
    res.json(results[0]);
  });
});


//API PARA FILTRAR POR CATEGORIA
app.get('/api/inventario/implemento', (req, res) => {
  const categoria = req.body
  const sql = 'SELECT * FROM inventario.implemento WHERE categoria = ?';
  db.query(sql, [categoria], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
    res.json(results);
  });
})



app.put('/api/inventario/implemento/:id', (req, res) => {
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
    estado } = req.body;

  const { id } = req.params;


  const sql = `UPDATE implemento SET nombre = ?, categoria = ?, 
    departamento = ?, condicion = ?, pertenencia = ?, propietario = ?, valor = ?, fecha = ?, 
    sede = ?, descripcion = ?, estado = ? WHERE id = ?;`

  db.query(sql, [
    nombre, categoria, departamento, condicion,
    pertenencia, propietario, valor, fecha, sede, descripcion, estado, id
  ], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar:', err);
      return res.status(500).json({ mensaje: 'Error al actualizar en la base de datos' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'No se encontró el implemento con ese ID' });
    }
    console.log(req.body);
  });
});


//Exportar archivos

const db = connection;

app.get("/api/exportar", async (req, res) => {
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
      ON p.id = i.propietario;
  `;

  connection.query(sql, async (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      return res.status(500).send("Error exportando datos");
    }

    try {
      // Crear libro y hoja
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Inventario");

      // Encabezados
      worksheet.columns = [
        { header: "ID Implemento", key: "id_implemento", width: 20 },
        { header: "Nombre", key: "nombre", width: 25 },
        { header: "Categoría", key: "categoria", width: 20 },
        { header: "Departamento", key: "departamento", width: 20 },
        { header: "Condición", key: "condicion", width: 15 },
        { header: "Pertenencia", key: "pertenencia", width: 15 },
        { header: "Propietario", key: "propietario", width: 25 },
        { header: "Cantidad", key: "cantidad", width: 10 },
        { header: "Valor", key: "valor", width: 15 },
        { header: "Sede", key: "sede", width: 15 },
        { header: "Descripción", key: "descripcion", width: 20 },
        { header: "Estado", key: "estado", width: 15 },
        { header: "Fecha", key: "fecha", width: 20 }
      ];

      // Insertar datos
      results.forEach(row => worksheet.addRow(row));

      // 🎨 Estilo de encabezados (fila 1)
      worksheet.getRow(1).eachCell(cell => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } }; // Blanco
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" } // Azul
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });

      // 🎨 Estilo para las filas de datos
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

      // Configurar descarga
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
