const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const queries = require('../queries/queries.js');

router.post('/register', async (req, res) => {

    const { name, email, password, hostel_name, branch } = req.body;

    try {
        // Insert into users table
        const userResult = await pool.query(queries.INSERT_USER, [
            name,
            email,
            password,
            'student'
        ]);
        const userId = userResult.rows[0].user_id;

        // Insert into students table (pending by default)
        const studentResult = await pool.query(queries.INSERT_STUDENT, [
            userId,
            hostel_name,
            branch
        ]);
        const studentId = studentResult.rows[0].student_id;

        // Create entry in account_status (not blocked)
        await pool.query(queries.INSERT_ACCOUNT_STATUS, [studentId]);

        // Respond with success
        res.status(201).json({
            message: 'Registration successful. Awaiting admin approval.',
            student_id: studentId
        });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed.' });
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