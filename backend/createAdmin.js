const db = require('./src/db');
const bcrypt = require('bcrypt');
const { encryptToBuffer } = require('./src/crypto-utils');
require('dotenv').config();

async function main() {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const pass = process.env.ADMIN_PASS;
    const cpf = process.env.ADMIN_CPF;
    const company = process.env.ADMIN_COMPANY;

    let empresaId = null;

    if (company) {
      const r = await db.query(`
        INSERT INTO empresas (nome_fantasia)
        VALUES ($1)
        RETURNING id
      `, [company]);
      empresaId = r.rows[0].id;
    }

    await db.query(`
      INSERT INTO usuarios (nome, senha_hash, email_encrypted, cpf_encrypted, empresa_id)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      name,
      await bcrypt.hash(pass, 10),
      encryptToBuffer(email),
      encryptToBuffer(cpf),
      empresaId
    ]);

    console.log("Administrador criado com sucesso!");
    process.exit(0);

  } catch (err) {
    console.error("Erro ao criar admin:", err);
    process.exit(1);
  }
}

main();