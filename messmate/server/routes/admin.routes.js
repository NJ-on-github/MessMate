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
      return res.status(400).json({ error: 'Admin not found.' });
    }

    const admin = adminResult.rows[0];

    // Since no hashing yet, simple password match
    if (admin.password_hash !== password) {
      return res.status(400).json({ error: 'Incorrect password.' });
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
// router.patch('/approve-registration/:id', async (req, res) => {
//   try {
//     //set status to approved
//     await pool.query(queries.APPROVE_REGISTRATION,
//       [req.params.id]
//     );
    
//     // 2. Insert payment rows for all fee months if not already inserted
//     await pool.query(queries.INITIALIZE_STUDENT_PAYMENTS,
//       [req.params.id]
//     );

//     res.status(200).json({ message: 'Student approved and payments initialized.' });
//   } catch (err) {
//     console.error('Approval error:', err);
//     res.status(500).json({ error: 'Failed to approve student.' });
//   }
// });

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


// router.post('/insert-fee', async (req, res) => {
//   const { monthly_fee, effective_from } = req.body;
//   try {
//     const existing = await pool.query(queries.GET_SET_FEES_BY_MONTH, [effective_from]);
//     if (existing.rows.length > 0) {
//       return res.status(400).json({ error: 'Fee for this month already set' });
//     }

//     await pool.query(queries.INSERT_FEE, [monthly_fee, effective_from]);
//     res.json({ message: 'Fee added successfully.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to insert fee.' });
//   }
// });

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
        queries.createPaymentsForNewFee,
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


// router.get('/student-search', async (req, res) => {
//   console.log('Search endpoint hit with query params:', req.query);
//   const { type, query } = req.query;
  
//   if (!type || !query) {
//     console.log('Missing parameters');
//     return res.status(400).json({ error: 'Type and query parameters are required' });
//   }
  
//   try {
//     let searchQuery;
    
//     if (type === 'name') {
//       searchQuery = `
//         SELECT s.student_id, u.name, u.email, s.hostel_name, s.branch, s.registration_status
//         FROM students s
//         JOIN users u ON s.user_id = u.user_id
//         WHERE u.name ILIKE $1
//         ORDER BY u.name
//       `;
//     } else if (type === 'email') {
//       searchQuery = `
//         SELECT s.student_id, u.name, u.email, s.hostel_name, s.branch, s.registration_status
//         FROM students s
//         JOIN users u ON s.user_id = u.user_id
//         WHERE u.email ILIKE $1
//         ORDER BY u.name
//       `;
//     } else {
//       console.log('Invalid search type:', type);
//       return res.status(400).json({ error: 'Invalid search type' });
//     }
    
//     console.log('Executing query with param:', `%${query}%`);
//     const result = await pool.query(searchQuery, [`%${query}%`]);
//     console.log('Query result rows:', result.rows.length);
    
//     // Set appropriate headers
//     res.setHeader('Content-Type', 'application/json');
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Student search error:', err);
//     res.status(500).json({ error: `An error occurred while searching for students: ${err.message}` });
//   }
// });

// router.get('/student-get_payment/:studentId', async (req, res) => {
//   const { studentId } = req.params;
  
//   try {
//     const query = `
//       SELECT 
//         p.payment_id,
//         p.student_id,
//         p.fee_id,
//         p.amount,
//         p.payment_status,
//         p.payment_date,
//         p.due_date,
//         p.month_year
//       FROM payments p
//       WHERE p.student_id = $1
//       ORDER BY 
//         CASE
//           WHEN p.month_year ~ '^\\d{2}/\\d{4}$' THEN 
//             to_date(p.month_year, 'MM/YYYY')
//           ELSE NULL
//         END ASC
//     `;
    
//     const result = await pool.query(query, [studentId]);
//     res.json(result.rows);
//   } catch (err) {
//     console.error('Get student payments error:', err);
//     res.status(500).json({ error: 'An error occurred while retrieving student payments' });
//   }
// });

// router.patch('student-update_payment/:paymentId', async (req, res) => {
//   const { paymentId } = req.params;
//   const { payment_date, payment_status } = req.body;
  
//   if (!payment_date) {
//     return res.status(400).json({ error: 'Payment date is required' });
//   }
  
//   const client = await pool.connect();
  
//   try {
//     await client.query('BEGIN');
    
//     const query = `
//       UPDATE payments
//       SET payment_date = $1, payment_status = $2
//       WHERE payment_id = $3
//       RETURNING *
//     `;
    
//     const result = await client.query(query, [payment_date, payment_status, paymentId]);
    
//     if (result.rows.length === 0) {
//       await client.query('ROLLBACK');
//       return res.status(404).json({ error: 'Payment not found' });
//     }
    
//     await client.query('COMMIT');
//     res.json(result.rows[0]);
//   } catch (err) {
//     await client.query('ROLLBACK');
//     console.error('Update payment error:', err);
//     res.status(500).json({ error: 'An error occurred while updating the payment' });
//   } finally {
//     client.release();
//   }
// });


router.get('/payments/search', async (req, res) => {
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


router.patch('/payments/:payment_id', async (req, res) => {
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
      [payment_status,payment_status, payment_id]
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


module.exports = router;