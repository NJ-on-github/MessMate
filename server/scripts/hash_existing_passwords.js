// server/scripts/hash_existing_passwords.js
require('dotenv').config();
const pool = require('../db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
console.log('Using DATABASE_URL:', process.env.DATABASE_URL ? '[present]' : '[missing]');

async function run() {
  const client = await pool.connect();
  try {
    console.log('Starting password hash migration...');
    const res = await client.query('SELECT user_id, password_hash FROM users');
    let updated = 0;
    for (const row of res.rows) {
      const { user_id, password_hash } = row;
      if (!password_hash) continue;
      const isBcrypt = typeof password_hash === 'string' && /^\$2[aby]\$\d{2}\$/.test(password_hash);
      if (isBcrypt) continue;
      const newHash = await bcrypt.hash(password_hash, SALT_ROUNDS);
      await client.query('UPDATE users SET password_hash = $1 WHERE user_id = $2', [newHash, user_id]);
      updated++;
      if (updated % 50 === 0) console.log(`Updated ${updated} users...`);
    }
    console.log(`Done. Updated ${updated} users.`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

run();
