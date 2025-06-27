const express = require('express');
const router = express.Router();
const pool = require('../db.js');
const queries = require('../queries/queries.js');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminResult = await pool.query(queries.MATCH_ADMIN_LOGIN,
      [email]
    );

    if (adminResult.rows.length === 0) {
      return res.status(400).json({ error: 'Admin not found!' });
    }

    const admin = adminResult.rows[0];

    //no hashing yet, simple password match
    if (admin.password_hash !== password) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    res.json({ message: 'Admin login successful!', adminId: admin.user_id });

  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Failed to login as admin.' });
  }
});

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

//Dashboard
router.get('/pending-approvals/count', async (req, res) => {
  try {
    const result = await pool.query(queries.COUNT_PENDING_REGISTRATIONS);
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

router.get('/payments/summary', async (req, res) => {
  const { month } = req.query;
  console.log(month)

  if (!month) {
    return res.status(400).json({ error: 'Month parameter is required (format: MM-YYYY)' });
  }

  try {
    const result = await pool.query(queries.GET_MONTHLY_PAYMENT, [month]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching payment summary:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/students/count', async (req, res) => {
  try {
    const result = await pool.query(queries.COUNT_APPROVED_STUDENTS);
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student count' });
  }
});

router.patch('/students/unblock/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    await pool.query(queries.UNBLOCK_STUDENT, [student_id]);
    res.json({ message: 'Student unblocked successfully' });
  } catch (err) {
    console.error('Error unblocking student:', err.message);
    res.status(500).json({ error: 'Failed to unblock student' });
  }
});

//registrations
router.patch('/approve-registration/:id', async (req, res) => {
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query('BEGIN');

    // Set status to approved
    await client.query(queries.APPROVE_REGISTRATION, [req.params.id]);

    // Initialize payment rows for all fee months if not already inserted
    await client.query(queries.INITIALIZE_STUDENT_PAYMENTS, [req.params.id]);

    // Commit transaction if all operations succeed
    await client.query('COMMIT');

    res.status(200).json({ message: 'Student approved and payments initialized.' });
  } catch (err) {
    // Rollback transaction if any operation fails
    await client.query('ROLLBACK');

    console.error('Approval error:', err);
    res.status(500).json({ error: 'Failed to approve student.' });
  } finally {
    // Release the client back to the pool
    client.release();
  }
});

router.patch('/reject-registration/:id', async (req, res) => {
  try {
    await pool.query(queries.REJECT_REGISTRATION,
      [req.params.id]
    );
    res.json({ message: "Registration rejected. successfully" });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: 'Rejection failed.' });
  }
});

//registration - blocked registrations
router.get('/blocked-registrations', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_BLOCKED_REGISTRATIONS);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching blocked registrations:', err.message);
    res.status(500).json({ error: 'Failed to fetch blocked registrations.' });
  }
});

router.patch('/unblock-registration/:id', async (req, res) => {
  try {
    await pool.query(queries.UNBLOCK_REGISTRATION, [req.params.id]);
    res.json({ message: "Registration status updated to pending successfully." });
  } catch (err) {
    console.error('Error unblocking registration:', err.message);
    res.status(500).json({ error: 'Failed to unblock registration.' });
  }
});

router.patch('/block-student/:id', async (req, res) => {
  const reason = req.body.reason || 'Unpaid dues'; // Default reason if not provided
  console.log(req.body)
  console.log(reason)
  const studentId = req.params.id;

  try {
    await pool.query(queries.BLOCK_STUDENT, [reason, studentId]);
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
  const client = await pool.connect();

  try {
    // Begin transaction
    await client.query('BEGIN');

    // Insert new fee structure
    const feeResult = await client.query(
      'INSERT INTO fees_structure (monthly_fee, effective_from) VALUES ($1, $2) RETURNING *',
      [monthly_fee, effective_from]
    );

    const newFee = feeResult.rows[0];

    // If the fee is for current month or future, create pending payments
    if (new Date(effective_from) >= new Date(new Date().setDate(1))) {
      await client.query(
        queries.CREATE_PAYMENTS_FOR_NEW_FEE,
        [newFee.fee_id, newFee.monthly_fee, newFee.effective_from]
      );
    }

    // Commit transaction
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Fee structure added and payments created',
      fee: newFee
    });
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');

    res.status(500).json({
      success: false,
      message: 'Failed to add fee structure',
      error: error.message
    });
  } finally {
    client.release();
  }
});

router.get('/pending-approvals', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_PENDING_REGISTRATIONS);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending registrations.' });
  }
})

router.get('/pending-approvals', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_PENDING_REGISTRATIONS);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending registrations.' });
  }
})

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

router.get('/menu/todays', async (req, res) => {
  try {
    // Get today's menu id
    const menuRes = await pool.query('SELECT id FROM todays_menu WHERE menu_date = CURRENT_DATE');
    if (menuRes.rows.length === 0) return res.status(404).json({ error: "Today's menu not set" });
    const menuId = menuRes.rows[0].id;

    // Get items for each meal
    const [breakfastRes, lunchRes, dinnerRes] = await Promise.all([
      pool.query(`SELECT b.id, b.name FROM todays_breakfast tb JOIN breakfast_items b ON tb.breakfast_item_id = b.id WHERE tb.todays_menu_id = $1`, [menuId]),
      pool.query(`SELECT l.id, l.name FROM todays_lunch tl JOIN lunch_items l ON tl.lunch_item_id = l.id WHERE tl.todays_menu_id = $1`, [menuId]),
      pool.query(`SELECT d.id, d.name FROM todays_dinner td JOIN dinner_items d ON td.dinner_item_id = d.id WHERE td.todays_menu_id = $1`, [menuId]),
    ]);

    res.json({
      breakfast: breakfastRes.rows,
      lunch: lunchRes.rows,
      dinner: dinnerRes.rows,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch today's menu" });
  }
});

//PAYMENTS

//get all the payments of all the students
router.get('/payments', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_ALL_PAYMENTS);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Payment fetch failed.' });
  }
});

// Get all payments for a specific month
router.get('/payments/month', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Month is required (e.g. 2024-05)' });
  }

  try {
    const result = await pool.query(
      `SELECT 
        p.payment_id,
        p.student_id,
        p.amount,
        p.payment_status,
        p.payment_date,
        u.name,
        u.email
       FROM payments p
       JOIN students s ON s.student_id = p.student_id
       JOIN users u ON u.user_id = s.user_id
       WHERE p.month_year = $1
       ORDER BY u.name`,
      [month]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching monthly payments:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all payments for a specific student
router.get('/payments/update-payments/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    const result = await pool.query(
      `SELECT p.payment_id, p.month_year, p.amount, p.payment_status, p.payment_date,
              u.name, u.email
       FROM payments p
       JOIN students s ON p.student_id = s.student_id
       JOIN users u ON s.user_id = u.user_id
       WHERE u.name ILIKE $1 OR u.email ILIKE $1
       ORDER BY p.month_year`,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error searching payments:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set payment status for a specific payment of a student
router.patch('/payments/update-payments/:payment_id', async (req, res) => {
  const { payment_id } = req.params;
  const { payment_status } = req.body;

  if (!['paid', 'pending'].includes(payment_status)) {
    return res.status(400).json({ error: 'Invalid payment status' });
  }

  try {
    const result = await pool.query(
      `UPDATE payments
       SET payment_status = $1,
           payment_date = CASE WHEN $2 = 'paid' THEN CURRENT_DATE ELSE NULL END
       WHERE payment_id = $3
       RETURNING *`,
      [payment_status, payment_status, payment_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment updated successfully', payment: result.rows[0] });
  } catch (err) {
    console.error('Error updating payment:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// MENU
router.delete('/Menu/remove-item', async (req, res) => {
  const { itemId, category } = req.body;
  
  if (!itemId || !category) {
    return res.status(400).json({ error: 'Item ID and category are required' });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    let deleteQuery;
    let todaysMenuDeleteQuery;
    
    // Set appropriate queries based on category
    if (category === 'breakfast') {
      deleteQuery = queries.DELETE_BREAKFAST_ITEM;
      todaysMenuDeleteQuery = queries.DELETE_FROM_TODAYS_BREAKFAST;
    } else if (category === 'lunch') {
      deleteQuery = queries.DELETE_LUNCH_ITEM;
      todaysMenuDeleteQuery = queries.DELETE_FROM_TODAYS_LUNCH;
    } else if (category === 'dinner') {
      deleteQuery = queries.DELETE_DINNER_ITEM;
      todaysMenuDeleteQuery = queries.DELETE_FROM_TODAYS_DINNER;
    } else {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    // First remove the item from today's menu if it exists
    await client.query(todaysMenuDeleteQuery, [itemId]);
    
    // Then delete the item from the main items table
    const result = await client.query(deleteQuery, [itemId]);
    
    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Item not found' });
    }
    
    await client.query('COMMIT');
    
    return res.status(200).json({ 
      message: 'Item deleted successfully',
      deletedItem: result.rows[0]
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Error deleting menu item:`, err);
    return res.status(500).json({ error: 'Failed to delete item' });
  } finally {
    client.release();
  }
});

//students
router.get('/students/all-students', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_ALL_STUDENTS);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

router.get('/students/blocked-students', async (req, res) => {
  try {
    const result = await pool.query(queries.GET_BLOCKED_STUDENTS);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

module.exports = router;