const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'minha_chave_secreta_jwt_super_segura';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    // Compatibilidade: definir req.user e req.userId (algumas rotas usam req.userId)
    req.user = payload;
    req.userId = payload.id || payload.userId || null;
    next();
  });
};