const db = require('./db');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const name = process.env.ADMIN_NAME || process.argv[2] || 'Admin';
    const email = process.env.ADMIN_EMAIL || process.argv[3] || 'admin@empresa.com';
    const password = process.env.ADMIN_PASSWORD || process.argv[4] || 'digital@123';

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING',
      [name, email, hash, 'admin']
    );

    console.log('Admin criado (ou já existia):', email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
