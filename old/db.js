const { Pool } = require('pg');

// Create the pool with your PostgreSQL credentials
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'messmate',
  password: '123',
  port: 5000, // default port for PostgreSQL
});

module.exports = pool;
