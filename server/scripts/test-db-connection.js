// server/scripts/test-db-connection.js
require('dotenv').config();
const pool = require('../db');

(async () => {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present (hidden for security)' : 'Missing');
  console.log('PGSSLMODE:', process.env.PGSSLMODE);
  
  const client = await pool.connect();
  try {
    // Test basic connection
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful!');
    console.log('Current database time:', result.rows[0].current_time);
    
    // Test if users table exists and has data
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log('Users in database:', usersResult.rows[0].count);
    
    // Check if admin user exists
    const adminResult = await client.query(
      'SELECT user_id, email, role FROM users WHERE role = $1', 
      ['admin']
    );
    console.log('Admin users found:', adminResult.rows.length);
    console.log('Admin details:', adminResult.rows);
    
  } catch (err) {
    console.error('❌ Database connection failed:');
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    console.error('Full error:', err);
  } finally {
    client.release();
    process.exit(0);
  }
})();