// scripts/hash-passwords.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  const [rows] = await conn.execute('SELECT id, password FROM users WHERE password IS NOT NULL');
  for (const u of rows) {
    const hash = await bcrypt.hash(u.password, 10);
    await conn.execute('UPDATE users SET password_hash = ?, password = NULL WHERE id = ?', [hash, u.id]);
    console.log(`Usuario ${u.id} migrado`);
  }
  await conn.end();
})();
