const { Pool } = require('pg');

// Create the pool with your PostgreSQL credentials
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'messmate',
  password: '123',
  port: 5000, // default port for PostgreSQL
});

module.exports = pool;



// // pool.connect((err, client, done) => {
// //   if (err) {
// //     console.error('Error connecting to the database', err.stack);
// //   } else {
// //     console.log('Connected to the database');
// //   }
// // });

// const initialQuery = '';

// pool.query(initialQuery, (err, res) => {
//   if (err) {
//     console.error('Error creating database', err.stack);
//   } else {
//     console.log('Database created successfully');
//   }
// });



// const { Pool } = require('pg');
// const fs = require('fs');
// const path = require('path');

// // First create a pool to connect to postgres database
// const initialPool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   password: '123',
//   port: 5000,
//   database: 'postgres' // Connect to default postgres database first
// });

// // Query to create new database
// const createDbQuery = 'CREATE DATABASE messmate';

// // Function to read and execute SQL files
// async function executeSqlFile(pool, filePath) {
//   try {
//     const sql = fs.readFileSync(filePath, 'utf8');
//     await pool.query(sql);
//     console.log(`Successfully executed ${path.basename(filePath)}`);
//   } catch (err) {
//     console.error(`Error executing ${path.basename(filePath)}:`, err);
//   }
// }

// // Initialize database and tables
// async function initializeDatabase() {
//   try {
//     // Create database
//     await initialPool.query(createDbQuery);
//     console.log('Database created successfully');
//     await initialPool.end();

//     // Create new pool with messmate database
//     const messPool = new Pool({
//       user: 'postgres',
//       host: 'localhost',
//       password: '123',
//       port: 5000,
//       database: 'messmate'
//     });

//     // Execute SQL files in order
//     const sqlFiles = [
//       path.join(__dirname, 'sql_queries', 'structure.sql'),
//       path.join(__dirname, 'sql_queries', 'Menu.sql')
//     ];

//     for (const file of sqlFiles) {
//       await executeSqlFile(messPool, file);
//     }

//     await messPool.end();
    
//   } catch (err) {
//     if (err.code === '42P04') {
//       console.log('Database already exists, skipping creation');
//     } else {
//       console.error('Error initializing database:', err);
//     }
//   }
// }

// // Run initialization
// initializeDatabase().catch(console.error);

// // Export pool configured to use messmate database
// module.exports = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'messmate',
//   password: '123',
//   port: 5000
// });