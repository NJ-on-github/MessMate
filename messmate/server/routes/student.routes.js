const express = require('express');
const router = express.Router();
const pool = require('../db.js'); 

router.post('/register', async (req, res) => {
    const { name, email, password, hostel_name, branch } = req.body;

    
    // try {
        
    const userResult = await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, 'student') RETURNING user_id`,
        [name, email, password,]
    );
    
    console.log(userResult);
    res.send(userResult); 
  
    //   const userId = userResult.rows[0].user_id;
  
    //   // 3. Insert into students table (initial status is 'pending')
    //   await pool.query(
    //     `INSERT INTO students (user_id, hostel_name, branch)
    //      VALUES ($1, $2, $3)`,
    //     [userId, hostel_name, branch]
    //   );
  
    //   // 4. Optionally insert into account_status (not blocked by default)
    //   await pool.query(
    //     `INSERT INTO account_status (student_id, is_blocked)
    //      SELECT student_id, false FROM students WHERE user_id = $1`,
    //     [userId]
    //   );
  
    //   res.status(201).json({ message: "Registration successful. Awaiting admin approval." });
  
    // } catch (err) {
    //   console.error(err);
    //   res.status(500).json({ error: "Registration failed." });
    // }
  });

  module.exports = router;