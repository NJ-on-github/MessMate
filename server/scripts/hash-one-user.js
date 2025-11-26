// server/scripts/hash-one-user.js
require('dotenv').config();
const pool = require('../db');
const bcrypt = require('bcrypt');

const email = process.argv[2];
const plain = process.argv[3];
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

if (!email || !plain) {
  console.error('Usage: node scripts/hash-one-user.js <email> <plainPassword>');
  process.exit(1);
}

(async () => {
  const client = await pool.connect();
  try {
    const hash = await bcrypt.hash(plain, SALT_ROUNDS);
    await client.query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, email]);
    console.log('Updated hash for', email);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    process.exit(0);
  }
})();
