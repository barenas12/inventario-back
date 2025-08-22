const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// archivo: db.js
const mysql = require('mysql2/promise');

// Datos de conexión (ajusta con los tuyos)
const conexion = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'inventario',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const conectarDB = async () => {
    try {
        const connection = await conexion.getConnection();
        console.log('✅ Conexión exitosa a MySQL');
        connection.release(); // Liberar conexión al pool
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error);
        process.exit(1);
    }
};
module.exports = { conectarDB, conexion };

