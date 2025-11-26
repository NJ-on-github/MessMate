// server/db.js
const path = require('path');

// Load .env from server directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { Pool } = require('pg');

console.log('✅ db.js - DATABASE_URL present:', !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  // Log a safe version of the URL (without password)
  const safeUrl = process.env.DATABASE_URL.replace(/:[^@]*@/, ':****@');
  console.log('✅ Connecting to:', safeUrl);
} else {
  console.error('❌ DATABASE_URL is missing!');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
});

// Test connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection verified');
    client.release();
  } catch (err) {
    console.error('❌ Database connection test failed:', err.message);
  }
})();

module.exports = pool;