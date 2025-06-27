import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";
import "../admin/styles/summaryCards.css"

const PaymentsByMonth = () => {
  const [month, setMonth] = useState('');
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ received: 0.00, pending: 0.00, total: 0.00 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatMonth = (input) => {
    const [year, month] = input.split('-');
    return `${month}-${year}`;
  };

  const fetchPayments = async () => {
    if (!month) return;
    setLoading(true);
    setError(null);
    try {
      const formattedMonth = formatMonth(month);

      // Fetch payments list
      const response = await fetch(`http://localhost:3000/admin/payments/month?month=${formattedMonth}`);
      if (!response.ok) throw new Error('Failed to fetch payments');
      const data = await response.json();
      setPayments(data);

      // Fetch summary
      const summaryRes = await fetch(`http://localhost:3000/admin/payments/summary?month=${formattedMonth}`);
      if (!summaryRes.ok) throw new Error('Failed to fetch summary');
      const summaryData = await summaryRes.json();
      setSummary({
        received: Number(summaryData.received).toFixed(2) || 0.00,
        pending: Number(summaryData.pending).toFixed(2) || 0.00,
        total: (Number(summaryData.total).toFixed(2) || 0.00)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, [month]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <h2 className='table-heading'>Monthly Payment Status</h2>
      <p className='page-desc'>Select a month to see its payment status</p>

      <div className="month-selector">
        <label>Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="form-input"
        />
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-card-title">Total Receivable</div>
          <div className="summary-card-value primary">₹{summary.total}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-title">Amount Received</div>
          <div className="summary-card-value success">₹{summary.received}</div>
        </div>
        <div className="summary-card">
          <div className="summary-card-title">Amount Pending</div>
          <div className="summary-card-value warning">₹{summary.pending}</div>
        </div>
      </div>

      {loading && <p className="loading-message">Loading payments...</p>}
      {error && <p className="error-message"><strong>Error:</strong> {error}</p>}
      {!loading && payments.length === 0 && month && (
        <p className="no-data-message">
          📊 No payments found for this month.
          <br />
          <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            Try selecting a different month or check if data is available.
          </span>
        </p>
      )}

      {payments.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment.payment_id}>
                  <td>{payment.name}</td>
                  <td>{payment.email}</td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.payment_status}</td>
                  <td>{formatDate(payment.payment_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentsByMonth;