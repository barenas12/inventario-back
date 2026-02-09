// src/modules/auth/auth.controller.js
const { findUserByUsername, verifyPassword, signAccessToken } = require('./auth.service');

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  const user = await findUserByUsername(username);
  if (!user || user.status !== 'Activo') return res.status(401).json({ error: 'Usuario no válido' });

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = signAccessToken(user);

  res.cookie(process.env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: false, // true en producción con HTTPS
    sameSite: 'Lax',
    maxAge: 15 * 60 * 1000
  });

  return res.json({ ok: true, user: { id: user.id, name: user.name, username: user.user } });
}

function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.json({ ok: true });
}

function me(req, res) {
  // req.user viene del middleware auth
  res.json({ ok: true, user: req.user });
}

module.exports = { login, logout, me };
