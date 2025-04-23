const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const queries = require('../queries/queries.js');

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

router.patch('/admin/approve-student/:id', async (req, res) => {
    try {
        await pool.query(queries.APPROVE_STUDENT,
            [req.params.id]
        );
        res.json({ message: "Student approved." });
    } catch (err) {
        res.status(500).json({ error: 'Approval failed.' });
    }
});

router.patch('/admin/block-student/:id', async (req, res) => {
    const reason = req.body.reason || 'Unpaid dues';
    try {
        await pool.query(queries.BLOCK_STUDENT, [reason, req.params.id]);
        res.json({ message: "Student blocked." });
    } catch (err) {
        res.status(500).json({ error: 'Blocking failed.' });
    }
});

router.patch('/admin/unblock-student/:id', async (req, res) => {
    try {
        await pool.query(queries.UNBLOCK_STUDENT, [req.params.id]
        );
        res.json({ message: "Student unblocked." });
    } catch (err) {
        res.status(500).json({ error: 'Unblocking failed.' });
    }
});

router.post('/admin/fee', async (req, res) => {
    const { monthly_fee, effective_from } = req.body;
    try {
      await pool.query(queries.INSERT_FEE,[monthly_fee, effective_from]
      );
      res.json({ message: "New fee added." });
    } catch (err) {
      res.status(500).json({ error: 'Fee creation failed.' });
    }
  });

  router.get('/admin/payments', async (req, res) => {
    try {
      const result = await pool.query(queries.GET_ALL_PAYMENTS);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Payment fetch failed.' });
    }
  });
  
  


module.exports = router;