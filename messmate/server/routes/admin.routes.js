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

router.get('/students', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_ALL_STUDENTS);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});


// admin
router.patch('/approve-registration/:id', async (req, res) => {
  try {
    await pool.query(queries.APPROVE_REGISTRATION,
      [req.params.id]
    );
    res.json({ message: "Student approved." });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed.' });
  }
});

router.patch('/reject-registration/:id', async (req, res) => {
  try {
    await pool.query(queries.REJECT_REGISTRATION,
      [req.params.id]
    );
    res.json({ message: "Registration rejected. successfully" });
  } catch (err) {
    res.status(500).json({ error: 'Rejection failed.' });
  }
});

router.patch('/block-student/:id', async (req, res) => {
  const reason = req.body.reason || 'Unpaid dues';
  try {
    await pool.query(queries.BLOCK_STUDENT, [reason, req.params.id]);
    res.json({ message: "Student blocked." });
  } catch (err) {
    res.status(500).json({ error: 'Blocking failed.' });
  }
});

router.patch('/unblock-student/:id', async (req, res) => {
  try {
    await pool.query(queries.UNBLOCK_STUDENT, [req.params.id]
    );
    res.json({ message: "Student unblocked." });
  } catch (err) {
    res.status(500).json({ error: 'Unblocking failed.' });
  }
});


//fees
router.get('/fees', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_ALL_FEES);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fees.' });
  }
});


router.post('/insert-fee', async (req, res) => {
  const { monthly_fee, effective_from } = req.body;
  try {
    const existing = await pool.query(queries.GET_ALL_FEES_BY_MONTH, [effective_from]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Fee for this month already set' });
    }

    await pool.query(queries.INSERT_FEE, [monthly_fee, effective_from]);
    res.json({ message: 'Fee added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert fee.' });
  }
});


router.get('/payments', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_ALL_PAYMENTS);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Payment fetch failed.' });
  }
});



//router.ge
router.get('/pending-approvals', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_PENDING_REGISTRATIONS);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending registrations.' });
  }
})


router.get('/pending-payments/:monthYear', async (req, res) => {
  const { monthYear } = req.params;
  try {
    const result = await pool.query(queries.GET_PENDING_PAYMENTS_BY_MONTH, [monthYear]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending payments.' });
  }
});

router.get('pending-payments/:month_year', async (req, res) => {
  const { month_year } = req.params;
  try {
    const result = await pool.query(queries.GET_PENDING_PAYMENTS_BY_MONTH, [month_year]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending payments.' });
  }
});



router.get('/view-table/:tableName', async (req, res) => {
  const tableName = req.params.tableName;

  // IMPORTANT: To avoid SQL injection, only allow known tables
  const allowedTables = ['users', 'students', 'account_status', 'payments', 'fees_structure', 'todays_menu'];

  if (!allowedTables.includes(tableName)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch table data.' });
  }
});


router.get('/menu/breakfast-items', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_BREAKFAST_ITEMS);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch breakfast items.' });
  }
});

router.get('/menu/lunch-items', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_LUNCH_ITEMS);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch lunch items.' });
  }
});

router.get('/menu/dinner-items', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_DINNER_ITEMS);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dinner items.' });
  }
});

router.post('/menu/add-item', async (req, res) => {
  const { name, category } = req.body;

  try {
    if (!['breakfast', 'lunch', 'dinner'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    let query;
    if (category === 'breakfast') query = queries.ADD_BREAKFAST_ITEM;
    if (category === 'lunch') query = queries.ADD_LUNCH_ITEM;
    if (category === 'dinner') query = queries.ADD_DINNER_ITEM;

    await pool.query(query, [name]);
    res.json({ message: 'Item added successfully.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item.' });
  }
});

router.post('/menu/save-todays-menu', async (req, res) => {
  const { breakfast, lunch, dinner } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 0. Validate: At least one item should be selected
    if ((!breakfast || breakfast.length === 0) &&
        (!lunch || lunch.length === 0) &&
        (!dinner || dinner.length === 0)) {
      return res.status(400).json({ error: 'At least one menu item must be selected.' });
    }

    // 1. Check if today's menu already exists
    const checkMenu = await client.query(`
      SELECT * FROM todays_menu
      WHERE menu_date = CURRENT_DATE;
    `);

    if (checkMenu.rows.length > 0) {
      return res.status(400).json({ error: "Today's menu has already been saved." });
    }

    // 2. Insert into todays_menu
    const menuResult = await client.query(queries.INSERT_TODAYS_MENU);
    const todaysMenuId = menuResult.rows[0].id;

    // 3. Insert Breakfast Items
    for (const item of breakfast) {
      await client.query(queries.INSERT_TODAYS_BREAKFAST, [todaysMenuId, item.id]);
    }

    // 4. Insert Lunch Items
    for (const item of lunch) {
      await client.query(queries.INSERT_TODAYS_LUNCH, [todaysMenuId, item.id]);
    }

    // 5. Insert Dinner Items
    for (const item of dinner) {
      await client.query(queries.INSERT_TODAYS_DINNER, [todaysMenuId, item.id]);
    }

    await client.query('COMMIT');
    res.json({ message: "Today's menu saved successfully." });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error saving today\'s menu:', err);
    res.status(500).json({ error: "Failed to save today's menu." });
  } finally {
    client.release();
  }
});


module.exports = router;