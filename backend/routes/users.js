const express = require('express');
const db = require('./db');
const authenticate = require('../middlewares/auth_middleware');

const router = express.Router();

// GET /users
router.get('/', authenticate, async (_req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;