const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3333;
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'minha_chave_secreta_jwt_super_segura';

app.use(cors()); // habilita cors em todas as rotas

app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [username]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      } else {
        res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acesso autorizado', user: req.user });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
