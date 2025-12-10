const express = require('express');
const db = require('./db');
const authenticate = require('../middlewares/auth_middleware');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  const { filename, filepath, mimetype, description } = req.body;
  const userId = req.user.id;
  try {
    await db.query('INSERT INTO evidences (user_id, filename, filepath, mimetype, description) VALUES ($1,$2,$3,$4,$5)', [userId, filename, filepath, mimetype, description]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM evidences WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;