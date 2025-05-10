import React, { useState, useEffect } from 'react';

const pending_payments_by_month = () => {
  const [month, setMonth] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingPayments = async () => {
    if (!month) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/admin/payments/pending?month=${month}`);
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      console.error('Failed to fetch pending payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, [month]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pending Payments by Month</h2>

      <div className="mb-4">
        <label className="mr-2">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No pending payments for selected month.</p>
      ) : (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Student Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Month</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.payment_id} className="border-b">
                <td className="p-2">{payment.name}</td>
                <td className="p-2">{payment.email}</td>
                <td className="p-2">₹{payment.amount}</td>
                <td className="p-2">{payment.month_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default pending_payments_by_month;
