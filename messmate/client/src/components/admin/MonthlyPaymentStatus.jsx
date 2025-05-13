import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";

const MonthlyPaymentStatus = () => {
  const [month, setMonth] = useState('');
  const [payments, setPayments] = useState([]);
  const [blockedStudents, setBlockedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockingStudentId, setBlockingStudentId] = useState(null);
  const [blockError, setBlockError] = useState(null);
  const [blockSuccess, setBlockSuccess] = useState(null);

  const fetchPayments = async () => {
    if (!month) return;

    setLoading(true);
    setError(null);
    try {
      const formattedMonth = formatMonthForQuery(month);
      const response = await fetch(`http://localhost:3000/admin/payments/month?month=${formattedMonth}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await response.json();
      const enhancedData = await Promise.all(data.map(async payment => {
        return { 
          ...payment, 
          student_id: payment.student_id || parseInt(payment.payment_id) // Fallback method
        };
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
      if (!response.ok) {
        throw new Error('Failed to fetch blocked students');
      }
      const data = await response.json();
      setBlockedStudents(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Format month from YYYY-MM to MM-YYYY format expected by the API
  const formatMonthForQuery = (input) => {
    const [year, month] = input.split('-');
    return `${month}-${year}`;
  };

  useEffect(() => {
    fetchPayments();
    fetchBlockedStudents(); // Fetch blocked students on component mount
  }, [month]);

  const handleBlockStudent = async (studentId) => {
    setBlockingStudentId(studentId);
    setBlockError(null);
    setBlockSuccess(null);

    try {
      const response = await fetch(`http://localhost:3000/admin/block-student/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: `Payment defaulted for ${month}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to block student');
      }

      setBlockSuccess(`Student blocked successfully`);
      fetchPayments(); // Refresh payments list
      fetchBlockedStudents(); // Refresh blocked students list
    } catch (err) {
      setBlockError(err.message);
    } finally {
      setBlockingStudentId(null);
    }
  };

  const isPastDueDate = () => {
    if (!month) return false;
    
    const today = new Date();
    const [year, monthNum] = month.split('-');
    const dueDate = new Date(year, parseInt(monthNum) - 1, 10);
    
    return today > dueDate;
  };

  const paidPayments = payments.filter(p => p.payment_status === 'paid');
  const pendingPayments = payments.filter(p => p.payment_status === 'pending');

  return (
    <div className="content-wrapper">
      <h2 className="table-heading">Monthly Payment Status</h2>

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
          {/* Defaulters Section */}
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
  onClick={() => handleBlockStudent(payment.student_id)}
  disabled={!isPastDueDate() || blockingStudentId === payment.student_id}
  className={`${isPastDueDate() ? 'btn-warning' : 'btn-warning-disabled'}`}
  title={!isPastDueDate() ? "Cannot block until after the due date (10th)" : ""}
>
  {blockingStudentId === payment.student_id ? 'Blocking...' : 'Block Student'}
</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Paid Students Section */}
          <div className="section">
            <h3 className="section-heading success">Paid Students</h3>
            <div className="table-container">
              {paidPayments.length === 0 ? (
                <p className="empty-message">No students have paid for this month yet.</p>
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

          {/* Blocked Students Section */}
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
                        <td>{student.blocked_reason || 'No reason provided'}</td>
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
    </div>
  );
};

export default MonthlyPaymentStatus;


// import React, { useEffect, useState } from 'react';

// const MonthlyPaymentStatus = () => {
//   const [month, setMonth] = useState('');
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [blockingStudentId, setBlockingStudentId] = useState(null);
//   const [blockError, setBlockError] = useState(null);
//   const [blockSuccess, setBlockSuccess] = useState(null);

//   const fetchPayments = async () => {
//     if (!month) return;

//     setLoading(true);
//     setError(null);
//     try {
//       const formattedMonth = formatMonthForQuery(month);
//       const response = await fetch(`http://localhost:3000/admin/payments/month?month=${formattedMonth}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch payments');
//       }
//       const data = await response.json();
      
//       // Modify the data to include student_id if it's not included
//       // We'll fetch the student IDs in a real implementation
//       const enhancedData = await Promise.all(data.map(async payment => {
//         // In a real implementation, you would make an API call to get student_id from email
//         // For now, let's extract it from the additional data or do a second fetch
//         try {
//           // If needed, you could fetch student details here
//           // const studentResponse = await fetch(`http://localhost:3000/admin/student-lookup?email=${payment.email}`);
//           // const studentData = await studentResponse.json();
//           // return { ...payment, student_id: studentData.student_id };
          
//           // For demo, let's assume we can extract a student_id from existing data
//           // In real implementation, replace this with proper API call
//           return { 
//             ...payment, 
//             student_id: payment.student_id || parseInt(payment.payment_id) // Fallback method
//           };
//         } catch (err) {
//           console.error("Error enhancing payment data:", err);
//           return payment;
//         }
//       }));
      
//       setPayments(enhancedData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format month from YYYY-MM to MM-YYYY format expected by the API
//   const formatMonthForQuery = (input) => {
//     const [year, month] = input.split('-');
//     return `${month}-${year}`;
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, [month]);

//   const handleBlockStudent = async (studentId) => {
//     setBlockingStudentId(studentId);
//     setBlockError(null);
//     setBlockSuccess(null);

//     try {
//       const response = await fetch(`http://localhost:3000/admin/block-student/${studentId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           reason: `Payment defaulted for ${month}`
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to block student');
//       }

//       setBlockSuccess(`Student blocked successfully`);
      
//       // Refresh the payments list
//       fetchPayments();
//     } catch (err) {
//       setBlockError(err.message);
//     } finally {
//       setBlockingStudentId(null);
//     }
//   };

//   // Check if today is past the due date (assuming due date is always 10th of the month)
//   const isPastDueDate = () => {
//     if (!month) return false;
    
//     const today = new Date();
//     const [year, monthNum] = month.split('-');
//     const dueDate = new Date(year, parseInt(monthNum) - 1, 10);
    
//     return today > dueDate;
//   };

//   // Group payments by status
//   const paidPayments = payments.filter(p => p.payment_status === 'paid');
//   const pendingPayments = payments.filter(p => p.payment_status === 'pending');

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Monthly Payment Status</h2>

//       <div className="mb-6 bg-white p-4 rounded shadow">
//         <label className="block text-sm font-medium mb-2">Select Month:</label>
//         <input
//           type="month"
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           className="border px-3 py-2 rounded w-full sm:w-64"
//         />
//       </div>

//       {loading && <p className="text-center py-4">Loading...</p>}
//       {error && <p className="text-red-600 py-2">{error}</p>}
//       {blockError && <p className="text-red-600 py-2">{blockError}</p>}
//       {blockSuccess && <p className="text-green-600 py-2">{blockSuccess}</p>}

//       {!loading && month && (
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Paid Students */}
//           <div className="flex-1">
//             <h3 className="text-xl font-semibold mb-3 text-green-700">Paid Students</h3>
//             <div className="bg-white rounded shadow overflow-hidden">
//               {paidPayments.length === 0 ? (
//                 <p className="p-4 text-gray-500">No students have paid for this month yet.</p>
//               ) : (
//                 <table className="w-full">
//                   <thead className="bg-green-50">
//                     <tr>
//                       <th className="p-3 text-left">Student Name</th>
//                       <th className="p-3 text-left">Email</th>
//                       <th className="p-3 text-left">Amount</th>
//                       <th className="p-3 text-left">Payment Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paidPayments.map((payment) => (
//                       <tr key={payment.payment_id} className="border-t hover:bg-green-50">
//                         <td className="p-3">{payment.name}</td>
//                         <td className="p-3">{payment.email}</td>
//                         <td className="p-3">₹{payment.amount}</td>
//                         <td className="p-3">{new Date(payment.payment_date).toLocaleDateString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>

//           {/* Defaulters */}
//           <div className="flex-1">
//             <h3 className="text-xl font-semibold mb-3 text-red-700">Defaulters</h3>
//             <div className="bg-white rounded shadow overflow-hidden">
//               {pendingPayments.length === 0 ? (
//                 <p className="p-4 text-gray-500">No defaulters for this month.</p>
//               ) : (
//                 <table className="w-full">
//                   <thead className="bg-red-50">
//                     <tr>
//                       <th className="p-3 text-left">Student Name</th>
//                       <th className="p-3 text-left">Email</th>
//                       <th className="p-3 text-left">Amount</th>
//                       <th className="p-3 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {pendingPayments.map((payment) => (
//                       <tr key={payment.payment_id} className="border-t hover:bg-red-50">
//                         <td className="p-3">{payment.name}</td>
//                         <td className="p-3">{payment.email}</td>
//                         <td className="p-3">₹{payment.amount}</td>
//                         <td className="p-3">
//                           <button
//   onClick={() => handleBlockStudent(payment.student_id)}
//   disabled={!isPastDueDate() || blockingStudentId === payment.student_id}
//   className={`px-3 py-1 rounded text-white ${
//     isPastDueDate() 
//       ? 'bg-red-600 hover:bg-red-700' 
//       : 'bg-gray-400 cursor-not-allowed'
//   }`}
//   title={!isPastDueDate() ? "Cannot block until after the due date (10th)" : ""}
// >
//   {blockingStudentId === payment.student_id ? 'Blocking...' : 'Block Student'}
// </button>

//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {!loading && !month && (
//         <div className="text-center py-10 text-gray-500">
//           Please select a month to view payment status
//         </div>
//       )}
//     </div>
//   );
// };

// export default MonthlyPaymentStatus;



// import React, { useEffect, useState } from 'react';

// const MonthlyPaymentStatus = () => {
//   const [month, setMonth] = useState('');
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [blockingStudentId, setBlockingStudentId] = useState(null);
//   const [blockError, setBlockError] = useState(null);
//   const [blockSuccess, setBlockSuccess] = useState(null);

//   const fetchPayments = async () => {
//     if (!month) return;

//     setLoading(true);
//     setError(null);
//     try {
//       const formattedMonth = formatMonthForQuery(month);
//       const response = await fetch(`http://localhost:3000/admin/payments/month?month=${formattedMonth}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch payments');
//       }
//       const data = await response.json();
//       setPayments(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format month from YYYY-MM to MM-YYYY format expected by the API
//   const formatMonthForQuery = (input) => {
//     const [year, month] = input.split('-');
//     return `${month}-${year}`;
//   };

//   useEffect(() => {
//     fetchPayments();
//   }, [month]);

//   const handleBlockStudent = async (studentId) => {
//     setBlockingStudentId(studentId);
//     setBlockError(null);
//     setBlockSuccess(null);

//     try {
//       const response = await fetch(`http://localhost:3000/admin/block-student/${studentId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           reason: `Payment defaulted for ${month}`
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to block student');
//       }

//       setBlockSuccess(`Student blocked successfully`);
      
//       // Refresh the payments list
//       fetchPayments();
//     } catch (err) {
//       setBlockError(err.message);
//     } finally {
//       setBlockingStudentId(null);
//     }
//   };

//   // Check if today is past the due date (assuming due date is always 10th of the month)
//   const isPastDueDate = () => {
//     if (!month) return false;
    
//     const today = new Date();
//     const [year, monthNum] = month.split('-');
//     const dueDate = new Date(year, parseInt(monthNum) - 1, 10);
    
//     return today > dueDate;
//   };

//   // Group payments by status
//   const paidPayments = payments.filter(p => p.payment_status === 'paid');
//   const pendingPayments = payments.filter(p => p.payment_status === 'pending');

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Monthly Payment Status</h2>

//       <div className="mb-6 bg-white p-4 rounded shadow">
//         <label className="block text-sm font-medium mb-2">Select Month:</label>
//         <input
//           type="month"
//           value={month}
//           onChange={(e) => setMonth(e.target.value)}
//           className="border px-3 py-2 rounded w-full sm:w-64"
//         />
//       </div>

//       {loading && <p className="text-center py-4">Loading...</p>}
//       {error && <p className="text-red-600 py-2">{error}</p>}
//       {blockError && <p className="text-red-600 py-2">{blockError}</p>}
//       {blockSuccess && <p className="text-green-600 py-2">{blockSuccess}</p>}

//       {!loading && month && (
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Paid Students */}
//           <div className="flex-1">
//             <h3 className="text-xl font-semibold mb-3 text-green-700">Paid Students</h3>
//             <div className="bg-white rounded shadow overflow-hidden">
//               {paidPayments.length === 0 ? (
//                 <p className="p-4 text-gray-500">No students have paid for this month yet.</p>
//               ) : (
//                 <table className="w-full">
//                   <thead className="bg-green-50">
//                     <tr>
//                       <th className="p-3 text-left">Student Name</th>
//                       <th className="p-3 text-left">Email</th>
//                       <th className="p-3 text-left">Amount</th>
//                       <th className="p-3 text-left">Payment Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paidPayments.map((payment) => (
//                       <tr key={payment.payment_id} className="border-t hover:bg-green-50">
//                         <td className="p-3">{payment.name}</td>
//                         <td className="p-3">{payment.email}</td>
//                         <td className="p-3">₹{payment.amount}</td>
//                         <td className="p-3">{new Date(payment.payment_date).toLocaleDateString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>

//           {/* Defaulters */}
//           <div className="flex-1">
//             <h3 className="text-xl font-semibold mb-3 text-red-700">Defaulters</h3>
//             <div className="bg-white rounded shadow overflow-hidden">
//               {pendingPayments.length === 0 ? (
//                 <p className="p-4 text-gray-500">No defaulters for this month.</p>
//               ) : (
//                 <table className="w-full">
//                   <thead className="bg-red-50">
//                     <tr>
//                       <th className="p-3 text-left">Student Name</th>
//                       <th className="p-3 text-left">Email</th>
//                       <th className="p-3 text-left">Amount</th>
//                       <th className="p-3 text-left">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {pendingPayments.map((payment) => (
//                       <tr key={payment.payment_id} className="border-t hover:bg-red-50">
//                         <td className="p-3">{payment.name}</td>
//                         <td className="p-3">{payment.email}</td>
//                         <td className="p-3">₹{payment.amount}</td>
//                         <td className="p-3">
//                           <button
//                             onClick={() => handleBlockStudent(payment.payment_id)}
//                             disabled={!isPastDueDate() || blockingStudentId === payment.payment_id}
//                             className={`px-3 py-1 rounded text-white ${
//                               isPastDueDate() 
//                                 ? 'bg-red-600 hover:bg-red-700' 
//                                 : 'bg-gray-400 cursor-not-allowed'
//                             }`}
//                             title={!isPastDueDate() ? "Cannot block until after the due date (10th)" : ""}
//                           >
//                             {blockingStudentId === payment.payment_id ? 'Blocking...' : 'Block Student'}
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {!loading && !month && (
//         <div className="text-center py-10 text-gray-500">
//           Please select a month to view payment status
//         </div>
//       )}
//     </div>
//   );
// };

// export default MonthlyPaymentStatus;