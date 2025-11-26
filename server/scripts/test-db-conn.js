// server/scripts/test-db-conn.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = require('../db');

(async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() AS now');
    console.log('Connected. Time:', res.rows[0].now);
    client.release();
  } catch (err) {
    console.error('DB connection error:', err);
  } finally {
    pool.end();
  }
})();
