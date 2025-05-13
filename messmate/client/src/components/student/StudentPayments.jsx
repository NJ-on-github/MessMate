import React, { useEffect, useState } from 'react';
import './styles/StudentPayments.css';
import { useParams } from 'react-router-dom';

const StudentPayments = () => {
  const { studentId } = useParams();
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/student/payments/${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch payments');
        const data = await response.json();
        setPayments(data);
        console.log('Payments data:', data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching payments:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [studentId]);

  if (loading) return <div className="payments-container">Loading...</div>;
  if (error) return <div className="payments-container">Error: {error}</div>;

  return (
    <div className="payments-container">
      <h2 className="table-heading">Your Payments</h2>

      <div className="payments-list">
        {payments.map((payment) => {
          // Using "status" which is what the backend sends as alias for payment_status
          const { month_year, amount, status } = payment;
          return (
            <div key={`${month_year}-${amount}`} className="payment-card">
              <div className={`status-indicator ${status?.toLowerCase()}`} />
              <div className="payment-info">
                <h3>{month_year}</h3>
                <p>Amount: ₹{amount}</p>
                <p>Status: {' '}
                  <span className={`status-text ${
                    status ? 
                    (status.toLowerCase() === 'paid' ? 'status-paid' : 'status-pending')
                    : 'status-pending'}`}>
                    {status || 'Pending'}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {payments.length === 0 && (
        <p>No payments found.</p>
      )}
    </div>
  );
};

export default StudentPayments;