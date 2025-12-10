const { Pool } = require('pg');

let pool;
let isDbConnected = false;

(async () => {
  try {
    pool = new Pool({
      user: process.env.DB_USER || 'esg_user',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'esg_db',
      password: process.env.DB_PASS || 'esg_pass',
      port: Number(process.env.DB_PORT || 5432),
    });

    await pool.connect();
    console.log('✅ Conectado ao PostgreSQL');
    isDbConnected = true;
  } catch (err) {
    console.warn('⚠️ Não foi possível conectar ao PostgreSQL. Usando modo FAKE.');
    console.warn(err.message || err);
    isDbConnected = false;
  }
})();

module.exports = {
  query: async (text, params) => {
    if (!isDbConnected) {
      if (typeof text === 'string' && text.toLowerCase().includes('select') && text.toLowerCase().includes('users')) {
        return {
          rows: [
            { id: 1, name: 'Usuário Fake', email: 'fake@empresa.com', role: 'user' },
            { id: 2, name: 'Maria', email: 'maria@teste.com', role: 'user' },
          ],
        };
      }
      return { rows: [] };
    }
    return pool.query(text, params);
  },
  getPool: () => pool,
};