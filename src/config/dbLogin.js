const mysql = require('mysql2');

const loginDB = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login',
  connectionLimit: 10
});

module.exports = loginDB;
