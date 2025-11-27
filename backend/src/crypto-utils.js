const crypto = require('crypto');
require('dotenv').config();

const KEY = Buffer.from(process.env.CRYPTO_KEY, 'hex'); // 32 bytes
const IV = Buffer.from(process.env.CRYPTO_IV, 'hex');   // 16 bytes

function encryptToBuffer(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
  return Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
}

function decryptFromBuffer(buf) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
  return Buffer.concat([decipher.update(buf), decipher.final()]).toString("utf8");
}

module.exports = { encryptToBuffer, decryptFromBuffer };