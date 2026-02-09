// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const cookieName = process.env.COOKIE_NAME;
  const token = req.cookies?.[cookieName];
  if (!token) return res.status(401).json({ error: 'No autenticado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) return res.status(403).json({ error: 'Prohibido' });
    next();
  };
}

module.exports = auth;
module.exports.requireRole = requireRole;
