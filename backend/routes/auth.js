const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'minha_chave_secreta_jwt_super_segura';

// LOGIN (email + password)
router.post('/login', async (req, res) => {
  const { username, password, email } = req.body;
  // frontend usa { username, password } onde username == email
  const loginEmail = email || username;

  if (!loginEmail || !password) {
    return res.status(400).json({ success: false, message: 'Email e senha obrigatórios' });
  }

  try {
    const result = await db.query('SELECT id, name, email, password, role FROM users WHERE email = $1', [loginEmail]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // don't return password
    delete user.password;

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email e password obrigatórios' });

  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) ON CONFLICT(email) DO NOTHING', [name, email, hash, 'user']);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;