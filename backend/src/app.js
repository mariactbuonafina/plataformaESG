require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('../routes/auth');
const usersRoutes = require('../routes/users');
const responsesRoutes = require('../routes/responses');
const evidencesRoutes = require('../routes/evidences');
const sealsRoutes = require('../routes/seals');

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/ping', (_req, res) => res.json({ message: 'pong' }));

app.use('/', authRoutes);
app.use('/users', usersRoutes);
app.use('/responses', responsesRoutes);
app.use('/evidences', evidencesRoutes);
app.use('/seals', sealsRoutes);

// Catch-all para servir o index.html do frontend para rotas de SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.BACKEND_PORT || 3003;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});