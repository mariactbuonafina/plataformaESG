<<<<<<< HEAD
const { Pool } = require('pg');

let isDbConnected = false;
exports.isDbConnected = isDbConnected;
let pool;
exports.pool = pool;

// Configuração do pool de conexão
const poolConfig = {
  user: process.env.DB_USER || 'esg_user',
  // prefer the container service name 'db' when DB_HOST not provided
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'esg_db',
  password: process.env.DB_PASS || 'esg_pass',
  port: process.env.DB_PORT || 5432,
  // Configurações para melhor conexão no Docker
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
};

console.log('Tentando conectar ao PostgreSQL...');
if (!process.env.DB_HOST) {
  console.warn('Atenção: variável DB_HOST não definida — usando fallback para o hostname do serviço Docker: "db".');
}
console.log(`Host: ${poolConfig.host}`);
console.log(`Database: ${poolConfig.database}`);
console.log(`Port: ${poolConfig.port}`);
console.log(`User: ${poolConfig.user}`);

try {
  pool = new Pool(poolConfig);

  pool.connect()
    .then((client) => {
      console.log('Conectado ao PostgreSQL com sucesso!');
      isDbConnected = true;
      client.release();
    })
    .catch(err => {
      console.error('Erro ao conectar ao PostgreSQL:', err.message);
      console.warn('Usando modo FAKE até que a conexão seja estabelecida.');
      isDbConnected = false;
      
      setTimeout(() => {
        console.log('Tentando reconectar ao PostgreSQL...');
        pool.connect()
          .then((client) => {
            console.log('Reconectado ao PostgreSQL!');
            isDbConnected = true;
            client.release();
          })
          .catch(() => {
            console.warn('Ainda não foi possível reconectar. Continuando em modo FAKE.');
          });
      }, 5000);
    });

} catch (err) {
  console.error('Erro ao inicializar pool de conexão:', err.message);
  console.warn('Usando modo FAKE.');
  isDbConnected = false;
};
=======
// backend/src/db.js
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
      // opcional: idleTimeoutMillis, connectionTimeoutMillis
    });

    // test connection
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
      // ---------- DADOS FAKE (apenas se n tiver DB) ----------
      if (typeof text === 'string' && text.toUpperCase().includes('SELECT') && text.toLowerCase().includes('users')) {
        return {
          rows: [
            { id: 1, name: 'Usuário Fake', email: 'fake@empresa.com' },
            { id: 2, name: 'Maria', email: 'maria@teste.com' },
          ],
        };
      }
      return { rows: [] };
    }

    return pool.query(text, params);
  },
  // opcional: expose pool para operações avançadas
  getPool: () => pool,
};
>>>>>>> 345ab443f55dc387622fc8db5c44ac0e2bb2071a
