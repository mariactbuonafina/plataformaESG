const express = require('express');
const db = require('./db');
const authenticate = require('../middlewares/auth_middleware');

const router = express.Router();

// create
router.post('/', authenticate, async (req, res) => {
  const { question_key, answer, score } = req.body;
  const userId = req.user.id;
  try {
    await db.query('INSERT INTO responses (user_id, question_key, answer, score) VALUES ($1,$2,$3,$4)', [userId, question_key, answer, score || 0]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// lista respostas do usuário autenticado
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM responses WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;