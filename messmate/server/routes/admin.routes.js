const express = require('express');
const router = express.Router();
const pool = require('../db.js');

router.get('/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE role = $1', ['student']);
        console.log(result.rows);
        res.status(200);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;