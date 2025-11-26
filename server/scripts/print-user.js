// server/scripts/print-user.js
require('dotenv').config();
const pool = require('../db');

(async () => {
  const email = process.argv[2] || 'admin@example.com';
  const client = await pool.connect();
  try {
    const r = await client.query('SELECT user_id, name, email, password_hash, role FROM users WHERE email = $1', [email]);
    console.log('rows:', r.rows);
  } catch (err) {
    console.error('error:', err);
  } finally {
    client.release();
    process.exit(0);
  }
})();
