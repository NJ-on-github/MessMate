import React, { useEffect, useState } from 'react';

const PendingPaymentsList = () => {
  const [month, setMonth] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    if (!month) return;

    setLoading(true);
    setError(null);
    try {
      const formattedMonth = formatMonth(month)
      const response = await fetch(`http://localhost:3000/admin/payments/month?month=${formattedMonth}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (input) => {
    const [year, month] = input.split('-');
    return `${month}-${year}`;
  };

  useEffect(() => {
    fetchPayments();
  }, [month]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Payments for a Month</h2>

      <div className="mb-4">
        <label className="mr-2">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && payments.length === 0 && <p>No payments found for this month.</p>}

      {payments.length > 0 && (
        <table className="w-full border text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Student Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.payment_id} className="border-b">
                <td className="p-2">{payment.name}</td>
                <td className="p-2">{payment.email}</td>
                <td className="p-2">₹{payment.amount}</td>
                <td className="p-2 capitalize">{payment.payment_status}</td>
                <td className="p-2">{payment.payment_date || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingPaymentsList;


// import React, { useEffect, useState } from 'react';

// const PendingPaymentsList = () => {
//   const [monthYear, setMonthYear] = useState('2025-04'); // Default month
//   const [pendingStudents, setPendingStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const months = [
//     '2025-01', '2025-02', '2025-03', '2025-04',
//     '2025-05', '2025-06', '2025-07', '2025-08',
//     '2025-09', '2025-10', '2025-11', '2025-12'
//   ];

//   const fetchPendingStudents = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`http://localhost:3000/admin/pending-payments/${monthYear}`);
//       if (!res.ok) throw new Error('Failed to fetch pending payments');
//       const data = await res.json();
//       setPendingStudents(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPendingStudents();
//   }, [monthYear]);

//   const blockStudent = async (studentId) => {
//     try {
//       const res = await fetch(`http://localhost:3000/admin/block-student/${studentId}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ reason: 'Payment pending for ' + monthYear })
//       });
//       if (!res.ok) throw new Error('Blocking failed');
//       alert('Student blocked successfully!');
//       fetchPendingStudents(); // Refresh list after blocking
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

//   return (
//     <div>
//       <h2>Students with Pending Payment - {monthYear}</h2>

//       <div>
//         <label>Select Month: </label>
//         <select value={monthYear} onChange={(e) => setMonthYear(e.target.value)}>
//           {months.map((m) => (
//             <option key={m} value={m}>{m}</option>
//           ))}
//         </select>
//       </div>

//       {pendingStudents.length === 0 ? (
//         <p>No pending payments for this month.</p>
//       ) : (
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th style={thStyle}>ID</th>
//               <th style={thStyle}>Name</th>
//               <th style={thStyle}>Email</th>
//               <th style={thStyle}>Hostel</th>
//               <th style={thStyle}>Branch</th>
//               <th style={thStyle}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {pendingStudents.map(student => (
//               <tr key={student.student_id}>
//                 <td style={tdStyle}>{student.student_id}</td>
//                 <td style={tdStyle}>{student.name}</td>
//                 <td style={tdStyle}>{student.email}</td>
//                 <td style={tdStyle}>{student.hostel_name}</td>
//                 <td style={tdStyle}>{student.branch}</td>
//                 <td style={tdStyle}>
//                   <button onClick={() => blockStudent(student.student_id)}>Block</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// const thStyle = {
//   border: '1px solid #ccc',
//   backgroundColor: '#0a2540',
//   color: '#fff',
//   padding: '10px',
//   textAlign: 'left'
// };

// const tdStyle = {
//   border: '1px solid #ddd',
//   padding: '10px',
// };

// export default PendingPaymentsList;
