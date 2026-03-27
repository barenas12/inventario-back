const bcrypt = require('bcryptjs'); // mejor usar bcryptjs en Windows
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

async function findUserByUsername(username) {
  const [rows] = await db.execute(
    "SELECT * FROM users WHERE user = ? LIMIT 1", [username]);
  return rows[0] || null;
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function signAccessToken(user) {
  const payload = { sub: user.id, username: user.user, role: user.role, name: user.name };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
}

module.exports = { findUserByUsername, verifyPassword, signAccessToken };
