const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const ExcelJS = require("exceljs");
require("dotenv").config();

const app = express();

app.use(express.json());

// 🔗 Conexión a MySQL
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

// Aquí defines tus rutas
app.use("/auth", require("./modules/auth/auth.routes"));

// app.use("/productos", require("./src/modules/productos/productos.routes"));
// etc...

module.exports = app;
