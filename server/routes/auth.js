const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    //If user not found, return error
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const user = userResult.rows[0];

    // 2. Compare passwords 
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid  password' });
    }

    // 3. If role is student, check approval
    if (user.role === 'student') {
      const studentResult = await pool.query(
        'SELECT registration_status FROM students WHERE user_id = $1',
        [user.user_id]
      );
      const status = studentResult.rows[0]?.registration_status;

      if (status !== 'approved') {
        return res.status(403).json({ error: 'Your registration is under process' });
      }
    }

    // 4. Success response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
