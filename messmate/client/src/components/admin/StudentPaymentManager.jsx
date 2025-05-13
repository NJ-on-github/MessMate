import React, { useState } from 'react';
import "../common/table.css";
import "../common/common.css";

const StudentPaymentManager = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/admin/payments/update-payments/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (paymentId) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/payments/update-payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: 'paid' })
      });

      if (!res.ok) {
        throw new Error('Failed to update payment');
      }

      const data = await res.json();
      console.log('Payment update response:', data);

      setResults(prev =>
        prev.map(p => p.payment_id === paymentId ? 
          { ...p, payment_status: 'paid', payment_date: new Date().toISOString() } : p
        )
      );
    } catch (err) {
      console.error('Failed to update payment:', err);
    }
  };

  return (
    <div>
      <h2 className="table-heading">Search Student Payments</h2>
      <p>Search Student's name to get all the payments</p>
      <div className="search-group">
        <input
          type="text"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={searchPayments} 
          className="btn"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map(payment => (
                <tr key={payment.payment_id}>
                  <td>{payment.name}</td>
                  <td>{payment.email}</td>
                  <td>{payment.month_year}</td>
                  <td>₹{payment.amount}</td>
                  <td>
                    <span className={payment.payment_status === 'paid' ? 'text-success' : 'text-warning'}>
                      {payment.payment_status}
                    </span>
                  </td>
                  <td>
                    {payment.payment_status !== 'paid' && (
                      <button
                        onClick={() => markAsPaid(payment.payment_id)}
                        className="btn-success"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default StudentPaymentManager;