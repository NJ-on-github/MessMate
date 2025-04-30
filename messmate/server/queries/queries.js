// queries.js

//admin login
const MATCH_ADMIN_LOGIN = `
  SELECT * FROM users WHERE email = $1 AND role = 'admin';`;

// ✅ User + Student registration
const INSERT_USER = `
  INSERT INTO users (name, email, password_hash, role)
  VALUES ($1, $2, $3, $4)
  RETURNING user_id;
`;

const INSERT_STUDENT = `
  INSERT INTO students (user_id, hostel_name, branch, registration_status)
  VALUES ($1, $2, $3, $4)
  RETURNING student_id;
`;

const INSERT_ACCOUNT_STATUS = `
  INSERT INTO account_status (student_id, is_blocked, blocked_reason)
  VALUES ($1, false, NULL);
`;

// Student - Get all payments
const GET_STUDENT_PAYMENTS = `
  SELECT month_year, amount, payment_status AS status, due_date, payment_date
  FROM payments
  WHERE student_id = $1
  ORDER BY due_date ASC;
`;

// Student - Get current month's pending status (for dashboard alert)
const CHECK_CURRENT_MONTH_PAYMENT = `
  SELECT payment_status
  FROM payments
  WHERE student_id = $1
  AND to_char(due_date, 'YYYY-MM') = to_char(CURRENT_DATE, 'YYYY-MM')
  LIMIT 1;
`;

const GET_STUDENT_DASHBOARD_DATA = `
  SELECT u.name, u.email, s.hostel_name, s.branch, s.registration_status, a.is_blocked
  FROM users u
  JOIN students s ON u.user_id = s.user_id
  JOIN account_status a ON s.student_id = a.student_id
  WHERE s.student_id = $1;
`;

// ✅ Admin - Dashboard Queries

const GET_ALL_STUDENTS = `
  SELECT s.student_id, u.name, u.email, s.hostel_name, s.branch, s.registration_status, a.is_blocked
  FROM students s
  JOIN users u ON s.user_id = u.user_id
  JOIN account_status a ON s.student_id = a.student_id
  ORDER BY s.student_id ASC;
`;

const COUNT_PENDING_REGISTRATIONS = `
  SELECT COUNT(*) FROM students WHERE registration_status = 'pending';
`;

const COUNT_PENDING_PAYMENTS_THIS_MONTH = `
  SELECT COUNT(*) FROM payments 
  WHERE payment_status = 'pending' 
  AND to_char(due_date, 'YYYY-MM') = to_char(CURRENT_DATE, 'YYYY-MM');
`;

// ✅ Admin - Approval/Blocking
const APPROVE_REGISTRATION = `
UPDATE students SET registration_status = 'approved' WHERE student_id = $1;
`;

const REJECT_REGISTRATION = `
  UPDATE students SET registration_status = 'rejected' WHERE student_id = $1;`;

const BLOCK_STUDENT = `
  UPDATE account_status SET is_blocked = true, blocked_reason = $1 WHERE student_id = $2;
`;

const UNBLOCK_STUDENT = `
  UPDATE account_status SET is_blocked = false, blocked_reason = NULL WHERE student_id = $1;
`;

const GET_PENDING_REGISTRATIONS = `
  SELECT s.student_id, u.name, u.email, s.hostel_name, s.branch
  FROM students s
  JOIN users u ON s.user_id = u.user_id
  WHERE s.registration_status = 'pending'
  ORDER BY s.student_id ASC;
`;

const GET_PENDING_PAYMENTS_BY_MONTH = `SELECT s.student_id, u.name, u.email, s.hostel_name, s.branch
      FROM payments p
      JOIN students s ON p.student_id = s.student_id
      JOIN users u ON s.user_id = u.user_id
      WHERE p.month_year = $1
      AND p.payment_status = 'pending'
    `;


// ✅ Fee Management
const INSERT_FEE = `
  INSERT INTO fees_structure (monthly_fee, effective_from)
  VALUES ($1, $2);
`;

const GET_ALL_FEES = `
  SELECT * FROM fees_structure ORDER BY effective_from DESC;
`;

const GET_ALL_FEES_BY_MONTH = `
  SELECT * FROM fees_structure WHERE effective_from = $1;
  `;

// ✅ Payments
const GET_ALL_PAYMENTS = `
  SELECT p.*, u.name FROM payments p
  JOIN students s ON p.student_id = s.student_id
  JOIN users u ON s.user_id = u.user_id
  ORDER BY payment_date DESC;
`;

const GET_PENDING_PAYMENTS = `
  SELECT * FROM payments WHERE payment_status = 'pending';
`;

// ✅ Menu Management

const GET_BREAKFAST_ITEMS = `
  SELECT id, name
  FROM breakfast_items
  ORDER BY name ASC;
`;

const GET_LUNCH_ITEMS = `
  SELECT id, name
  FROM lunch_items
  ORDER BY name ASC;
`;

const GET_DINNER_ITEMS = `
  SELECT id, name
  FROM dinner_items
  ORDER BY name ASC;
`;

const ADD_BREAKFAST_ITEM = `
  INSERT INTO breakfast_items (name)
  VALUES ($1);
`;

const ADD_LUNCH_ITEM = `
  INSERT INTO lunch_items (name)
  VALUES ($1);
`;

const ADD_DINNER_ITEM = `
  INSERT INTO dinner_items (name)
  VALUES ($1);
`;

const INSERT_TODAYS_MENU = `
  INSERT INTO todays_menu (menu_date) VALUES (CURRENT_DATE) RETURNING id;
`;

const INSERT_TODAYS_BREAKFAST = `
  INSERT INTO todays_breakfast (todays_menu_id, breakfast_item_id) VALUES ($1, $2);
`;

const INSERT_TODAYS_LUNCH = `
  INSERT INTO todays_lunch (todays_menu_id, lunch_item_id) VALUES ($1, $2);
`;

const INSERT_TODAYS_DINNER = `
  INSERT INTO todays_dinner (todays_menu_id, dinner_item_id) VALUES ($1, $2);
`;



const GET_MENU_BY_DATE = `
  SELECT * FROM todays_menu WHERE menu_date = $1;
`;

const GET_TODAYS_MENU_ID = `
  SELECT id FROM todays_menu WHERE menu_date = CURRENT_DATE;
`;

const GET_TODAYS_BREAKFAST = `
  SELECT b.name FROM todays_breakfast tb
  JOIN breakfast_items b ON tb.breakfast_item_id = b.id
  WHERE tb.todays_menu_id = $1;
`;

const GET_TODAYS_LUNCH = `
  SELECT l.name FROM todays_lunch tl
  JOIN lunch_items l ON tl.lunch_item_id = l.id
  WHERE tl.todays_menu_id = $1;
`;

const GET_TODAYS_DINNER = `
  SELECT d.name FROM todays_dinner td
  JOIN dinner_items d ON td.dinner_item_id = d.id
  WHERE td.todays_menu_id = $1;
`;


module.exports = {
    MATCH_ADMIN_LOGIN,
    INSERT_USER,
    INSERT_STUDENT,
    INSERT_ACCOUNT_STATUS,
    COUNT_PENDING_REGISTRATIONS,
    COUNT_PENDING_PAYMENTS_THIS_MONTH,
    GET_ALL_STUDENTS,
    APPROVE_REGISTRATION,
    REJECT_REGISTRATION,
    BLOCK_STUDENT,
    UNBLOCK_STUDENT,
    GET_PENDING_REGISTRATIONS,
    GET_PENDING_PAYMENTS_BY_MONTH,
    INSERT_FEE,
    GET_ALL_FEES,
    GET_ALL_FEES_BY_MONTH,
    GET_ALL_PAYMENTS,
    GET_PENDING_PAYMENTS,
    INSERT_TODAYS_MENU,
    INSERT_TODAYS_BREAKFAST,
    INSERT_TODAYS_LUNCH,
    INSERT_TODAYS_DINNER,
    GET_MENU_BY_DATE,
    GET_STUDENT_PAYMENTS,
    CHECK_CURRENT_MONTH_PAYMENT,
    GET_STUDENT_DASHBOARD_DATA,
    GET_BREAKFAST_ITEMS,
    GET_LUNCH_ITEMS,
    GET_DINNER_ITEMS,
    ADD_BREAKFAST_ITEM,
    ADD_LUNCH_ITEM,
    ADD_DINNER_ITEM,
    GET_TODAYS_MENU_ID,
    GET_TODAYS_BREAKFAST,
    GET_TODAYS_LUNCH,
    GET_TODAYS_DINNER,
};
