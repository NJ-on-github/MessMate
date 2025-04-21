const { Pool } = require('pg');
import dotenv from 'dotenv';
dotenv.config();
// Create the pool with your PostgreSQL credentials
const pool = new Pool({
  user: process.env.PG_user,
  host: process.env.PG_host,
  database: process.env.PG_database,
  password: process.env.PG_password,
  port: process.env.PG_port, // default port for PostgreSQL
});

let a = await (process.env.PG_user, process.env.PG_host, process.env.PG_database, process.env.PG_password, process.env.PG_port);

console.log(a);

module.exports = pool;