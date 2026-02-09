// src/modules/auth/auth.routes.js
const express = require('express');
const { login, logout, me } = require('./auth.controller');
const auth = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, me);

module.exports = router;
