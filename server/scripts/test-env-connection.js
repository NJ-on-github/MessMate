// server/scripts/test-env-connection.js
// require('dotenv').config();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Client } = require('pg');

console.log('Testing connection from .env file...');
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  // Log the URL without password for security
  const url = process.env.DATABASE_URL;
  const safeUrl = url.replace(/:[^@]*@/, ':****@');
  console.log('Connection URL:', safeUrl);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ Connected successfully using .env!');
    return client.query('SELECT version()');
  })
  .then(result => {
    console.log('Database version:', result.rows[0].version.split(',')[0]);
    client.end();
  })
  .catch(err => {
    console.error('❌ Connection failed:');
    console.error('Error message:', err.message);
    
    if (err.message.includes('password')) {
      console.log('💡 Issue: Password authentication failed');
      console.log('💡 Tip: Check if your password contains special characters that need encoding');
    }
  });