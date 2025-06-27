import React, { useEffect, useState } from "react";
import "../common/table.css";
import "../common/common.css";
import ConfirmDialog from "../common/ConfirmDialog";

const Defaulters = () => {
  const [month, setMonth] = useState("");
  const [payments, setPayments] = useState([]);
  const [blockedStudents, setBlockedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockingStudentId, setBlockingStudentId] = useState(null);
  const [blockError, setBlockError] = useState(null);
  const [blockSuccess, setBlockSuccess] = useState(null);

  const [dialog, setDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => {}
  });

  const openConfirmDialog = (message, onConfirmAction) => {
    setDialog({
      isOpen: true,
      message,
      onConfirm: () => {
        onConfirmAction();
        setDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const formatMonthForQuery = (input) => {
    const [year, month] = input.split("-");
    return `${month}-${year}`;
  };

  const fetchPayments = async () => {
    if (!month) return;
    setLoading(true);
    setError(null);
    try {
      const formattedMonth = formatMonthForQuery(month);
      const response = await fetch(
        `http://localhost:3000/admin/payments/month?month=${formattedMonth}`
      );
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      const enhancedData = data.map((payment) => ({
        ...payment,
        student_id: payment.student_id || parseInt(payment.payment_id)
      }));
      setPayments(enhancedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedStudents = async () => {
    try {
      const response = await fetch(`http://localhost:3000/admin/students/blocked-students`);
      if (!response.ok) throw new Error("Failed to fetch blocked students");
      const data = await response.json();
      setBlockedStudents(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchBlockedStudents();
  }, [month]); // ⚠️ See note on warning below

  const isPastDueDate = () => {
    if (!month) return false;
    const today = new Date();
    const [year, monthNum] = month.split("-");
    const dueDate = new Date(year, parseInt(monthNum) - 1, 10);
    return today > dueDate;
  };

  const paidPayments = payments.filter(p => p.payment_status === "paid");
  const pendingPayments = payments.filter(p => p.payment_status === "pending");

  const blockStudent = async (studentId) => {
    setBlockingStudentId(studentId);
    setBlockError(null);
    setBlockSuccess(null);
    try {
      const response = await fetch(
        `http://localhost:3000/admin/block-student/${studentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: `Payment defaulted for ${month}` })
        }
      );
      if (!response.ok) throw new Error("Failed to block student");
      setBlockSuccess(`Student blocked successfully`);
      fetchPayments();
      fetchBlockedStudents();
    } catch (err) {
      setBlockError(err.message);
    } finally {
      setBlockingStudentId(null);
    }
  };

  const confirmAndBlockStudent = (studentId, studentName) => {
    openConfirmDialog(
      `Are you sure you want to block ${studentName} for missing payment in ${month}?`,
      () => blockStudent(studentId)
    );
  };

  return (
    <div className="content-wrapper">
      <h2 className="table-heading">Defaulters</h2>
      <p className="page-desc">Select a month to see its payment defaulters</p>
      <div className="form-group">
        <label className="form-label">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="form-input"
        />
      </div>

      {loading && <p className="message">Loading...</p>}
      {error && <p className="message error">{error}</p>}
      {blockError && <p className="message error">{blockError}</p>}
      {blockSuccess && <p className="message success">{blockSuccess}</p>}

      {!loading && month && (
        <>
          <div className="section">
            <h3 className="section-heading warning">Defaulters</h3>
            <div className="table-container">
              {pendingPayments.length === 0 ? (
                <p className="empty-message">No defaulters for this month.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPayments.map((payment) => (
                      <tr key={payment.payment_id}>
                        <td>{payment.name}</td>
                        <td>{payment.email}</td>
                        <td>₹{payment.amount}</td>
                        <td>
                          <button
                            onClick={() =>
                              confirmAndBlockStudent(payment.student_id, payment.name)
                            }
                            disabled={
                              !isPastDueDate() ||
                              blockingStudentId === payment.student_id
                            }
                            className={`${
                              isPastDueDate()
                                ? "btn-warning"
                                : "btn-warning-disabled"
                            }`}
                            title={
                              !isPastDueDate()
                                ? "Cannot block until after the due date (10th)"
                                : ""
                            }
                          >
                            {blockingStudentId === payment.student_id
                              ? "Blocking..."
                              : "Block Student"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Paid Section */}
          <div className="section">
            <h3 className="section-heading success">Paid Students</h3>
            <div className="table-container">
              {paidPayments.length === 0 ? (
                <p className="empty-message">
                  No students have paid for this month yet.
                </p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidPayments.map((payment) => (
                      <tr key={payment.payment_id}>
                        <td>{payment.name}</td>
                        <td>{payment.email}</td>
                        <td>₹{payment.amount}</td>
                        <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Blocked Section */}
          <div className="section">
            <h3 className="section-heading error">Blocked Students</h3>
            <div className="table-container">
              {blockedStudents.length === 0 ? (
                <p className="empty-message">No students are currently blocked.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Blocked Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockedStudents.map((student) => (
                      <tr key={student.student_id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.blocked_reason || "No reason provided"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {!loading && !month && (
        <p className="message">Please select a month to view payment status</p>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={() => setDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default Defaulters;
