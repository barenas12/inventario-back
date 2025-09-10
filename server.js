const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'inventario'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a MySQL');
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
    fecha
  } = req.body;

  console.log("Datos recibidos:", req.body);

  const sql = `
    INSERT INTO inventario.implemento (
    nombre, categoria, departamento, condicion,
    pertenencia, propietario, valor, fecha
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;


  db.query(sql, [
    nombre, categoria, departamento, condicion,
    pertenencia, propietario, valor, fecha
  ], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar:', err);
      return res.status(500).json({ mensaje: 'Error al guardar en la base de datos' });
    }
    res.json({ mensaje: '✅ Datos guardados correctamente' });
  });
});


app.listen(3000,()=>{
    console.log('servidor corriendo en el puerto 3000');
})

app.get('/api/inventario/implemento', (req, res) => {
  const sql = `SELECT 
CONCAT('ARCSAS-',
	CASE 
		WHEN i.categoria = 'Muebles' THEN 'M'
        ELSE 'T'
        END,i.id) AS id_implemento, i.nombre, 
    i.categoria, 
    d.nombre AS departamento, 
    i.condicion, 
    i.pertenencia, 
    p.nombre_proveedor AS propietario,
    i.cantidad, 
    i.valor, 
    i.estado, 
    i.fecha FROM inventario.implemento AS i LEFT JOIN inventario.departamento AS d ON d.id = i.departamento LEFT JOIN inventario.propietario AS p ON p.id = i.propietario;`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener datos:', err);
      return res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
    res.json(results);
  })
})


//API PARA RECORRER DEPARTAMENTOS
app.get('/api/inventario/departamento',(req,res)=>{
    const sql = 'SELECT * FROM inventario.departamento ORDER BY nombre ASC;';
    db.query(sql, (err, results) =>{
        if (err){
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


app.get('/api/inventario/implemento/:id_implemento', (req, res) => {
    const id_implemento = req.params.id_implemento;
    const sql = 'SELECT * FROM `implemento` WHERE id_implemento = ?;';
    db.query(sql, [id_implemento], (err, results) => {
        if (err) {
            console.error('❌ Error al obtener implementos:', err);
            return res.status(500).json({ mensaje: 'Error al obtener implementos' });
        }
        res.json(results[0]);
    });
});


//API PARA FILTRAR POR CATEGORIA
app.get('/api/inventario/implemento',(req,res)=>{
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

app.post('/api/inventario/implemento/:id_implemento', (req, res) => {
    const {
    nombre,
    categoria,
    departamento,
    condicion,
    pertenencia,
    propietario,
    valor,
    fecha,
    estado} = req.body;

    const { id_implemento } = req.params; 


    const sql = `UPDATE implemento SET id_implemento = ?, nombre = ?, categoria = ?, 
    departamento = ?, condicion = ?, pertenencia = ?, propietario = ? valor = ?, fecha = ?, 
    estado = ? WHERE id_implemento = ?;`

    db.query(sql, [
      id_implemento, nombre, categoria, departamento, condicion,
      pertenencia, propietario, valor, fecha, estado, id_implemento
    ], (err, result) => {
      if (err) {
        console.error('❌ Error al actualizar:', err);
        return res.status(500).json({ mensaje: 'Error al actualizar en la base de datos' });
      }
      if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: 'No se encontró el implemento con ese ID' });
            }
      res.json({ mensaje: '✅ Datos actualizados correctamente' });
      console.log(req.body);
    });
});