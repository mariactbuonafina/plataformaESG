const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const { encryptToBuffer, decryptFromBuffer } = require('./crypto-utils');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3333;

app.get('/ping', (_, res) => res.json({ message: 'pong' }));

// DEBUG: listar usuários (descriptografando email/cpf)
app.get('/usuarios', async (_req, res) => {
  try {
    const result = await db.query(`
      SELECT id, nome, senha_hash, email_encrypted, cpf_encrypted, empresa_id, criado_em
      FROM usuarios
    `);

    const users = result.rows.map(u => ({
      id: u.id,
      nome: u.nome,
      empresa_id: u.empresa_id,
      criado_em: u.criado_em,
      email: u.email_encrypted ? decryptFromBuffer(u.email_encrypted) : null,
      cpf: u.cpf_encrypted ? decryptFromBuffer(u.cpf_encrypted) : null
    }));

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// registro/cadastro do user
app.post('/register', async (req, res) => {
  try {
    const { nome, email, cpf, password, empresa_id } = req.body;

    if (!nome || !email || !password)
      return res.status(400).json({ error: "nome, email e password são obrigatórios" });

    const senhaHash = await bcrypt.hash(password, 10);

    await db.query(`
      INSERT INTO usuarios (nome, senha_hash, email_encrypted, cpf_encrypted, empresa_id)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      nome,
      senhaHash,
      encryptToBuffer(email),
      cpf ? encryptToBuffer(cpf) : null,
      empresa_id || null
    ]);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login com AES + BCRYPT
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "email e password são obrigatórios" });

    const encryptedEmail = encryptToBuffer(email);

    const result = await db.query(`
      SELECT id, nome, senha_hash, empresa_id
      FROM usuarios
      WHERE email_encrypted = $1
      LIMIT 1
    `, [encryptedEmail]);

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Usuário não encontrado" });

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.senha_hash);
    if (!valid)
      return res.status(401).json({ error: "Senha incorreta" });

    return res.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        empresa_id: user.empresa_id
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`Backend rodando na porta ${PORT}`)
);