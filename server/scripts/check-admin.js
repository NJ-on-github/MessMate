// server/scripts/check-admin.js
require('dotenv').config();
const pool = require('../db');

(async () => {
  const client = await pool.connect();
  try {
    const email = 'admin@example.com';
    const result = await client.query(
      'SELECT user_id, name, email, password_hash, role FROM users WHERE email = $1 AND role = $2',
      [email, 'admin']
    );
    
    console.log('Admin user check:');
    console.log('Found rows:', result.rows.length);
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      console.log('Admin details:', {
        user_id: admin.user_id,
        email: admin.email,
        role: admin.role,
        password_hash: admin.password_hash,
        hash_length: admin.password_hash?.length,
        hash_preview: admin.password_hash?.substring(0, 30) + '...'
      });
      
      // Test the password
      const bcrypt = require('bcrypt');
      const testPassword = 'admin123';
      const match = await bcrypt.compare(testPassword, admin.password_hash);
      console.log('Password "admin123" matches:', match);
    } else {
      console.log('❌ No admin user found with email:', email);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    process.exit(0);
  }
})();