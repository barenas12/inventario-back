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
    id_implemento,
    nombre,
    categoria,
    departamento,
    condicion,
    pertenencia,
    valor,
    fecha
  } = req.body;

  const sql = `
    INSERT INTO implemento (
      id_implemento, nombre, categoria, departamento, condicion,
      pertenencia, valor, fecha
    ) VALUES (?, ?, ?, ?, ?,?, ?, ?)
  `;


  db.query(sql, [
    id_implemento, nombre, categoria, departamento, condicion,
    pertenencia, valor, fecha
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

app.get('/api/inventario/implemento',(req,res)=>{
    const sql = 'SELECT i.id_implemento, i.nombre, i.categoria, D.nombre as departamento, i.condicion, i.pertenencia, i.cantidad, i.valor, i.estado, i.fecha FROM inventario.implemento AS I LEFT JOIN inventario.departamento as D ON D.id = I.departamento;';
    db.query(sql, (err, results) =>{
        if (err){
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
