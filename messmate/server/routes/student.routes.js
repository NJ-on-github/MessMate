const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const queries = require('../queries/queries.js');


router.post('/register', async (req, res) => {
    const { name, email, password, hostel_name, branch } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insert into users table
        const userResult = await client.query(
            queries.INSERT_USER,
            [name, email, password, 'student']
        );
        const userId = userResult.rows[0].user_id;

        // 2. Insert into students table
        const studentResult = await client.query(
            queries.INSERT_STUDENT,
            [userId, hostel_name, branch, 'pending']
        );
        const studentId = studentResult.rows[0].student_id;

        // 3. Insert into account_status table
        await client.query(
            queries.INSERT_ACCOUNT_STATUS,
            [studentId]
        );

        await client.query('COMMIT');
        res.status(201).json({ message: 'Registration successful! Please wait for admin approval.' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Failed to register. Please try again.' });
    } finally {
        client.release();
    }
});


router.post('/login', async (req, res) => {
const { email, password } = req.body;
  
    try {
      // 1. Find user
      const userResult = await pool.query(
        queries.LOGIN_FIND_USER,
        [email]
      );
  
      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: 'Student not found.' });
      }
  
      const user = userResult.rows[0];
  
      // 2. Check password (simple match for now)
      if (user.password_hash !== password) {
        return res.status(400).json({ error: 'Incorrect password.' });
      }
  
      // 3. Get student ID and registration status
      const studentResult = await pool.query(
        queries.LOGIN_FIND_STUDENT_BY_USER_ID,
        [user.user_id]
      );
  
      if (studentResult.rows.length === 0) {
        return res.status(400).json({ error: 'Student record not found.' });
      }
  
      const student = studentResult.rows[0];
  
      // 4. Check registration status
      if (student.registration_status === 'pending') {
        return res.status(403).json({ error: "pending", registration_status: "pending" });
      }
  
      // 5. Check if blocked
      const statusResult = await pool.query(
        queries.LOGIN_CHECK_ACCOUNT_BLOCK,
        [student.student_id]
      );
  
      const { is_blocked } = statusResult.rows[0];
  
      if (is_blocked) {
        return res.status(403).json({ error: "blocked",
        registration_status: "blocked",
        message: "Your account is blocked. Please contact the admin."
         });
      }
  
      // ✅ Login success: return minimal info
      res.json({
        message: 'Login successful!',
        studentId: student.student_id,
        name: user.name,
        email: user.email
      });
  
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  });


router.get('/payments/:student_id', async (req, res) => {
    const studentId = req.params.student_id;

    try {
        const result = await pool.query(queries.GET_STUDENT_PAYMENTS, [studentId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch payments.' });
    }
});

router.get('/dashboard/:student_id', async (req, res) => {
    const studentId = req.params.student_id;

    try {
        const result = await pool.query(queries.GET_STUDENT_DASHBOARD_DATA, [studentId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch dashboard data.' });
    }
});


router.get('/todays-menu', async (req, res) => {
    try {
        const menuIdResult = await pool.query(queries.GET_TODAYS_MENU_ID);
        if (menuIdResult.rows.length === 0) {
            return res.json({ breakfast: [], lunch: [], dinner: [] });
        }

        const menuId = menuIdResult.rows[0].id;

        const [breakfast, lunch, dinner] = await Promise.all([
            pool.query(queries.GET_TODAYS_BREAKFAST, [menuId]),
            pool.query(queries.GET_TODAYS_LUNCH, [menuId]),
            pool.query(queries.GET_TODAYS_DINNER, [menuId])
        ]);

        res.json({
            breakfast: breakfast.rows.map(r => r.name),
            lunch: lunch.rows.map(r => r.name),
            dinner: dinner.rows.map(r => r.name)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch today’s menu.' });
    }
});


module.exports = router;