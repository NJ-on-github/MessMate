import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const getStatusColor = (status) => {
  if (status === 'paid') return 'green';
  if (status === 'pending') return 'red';
  return 'grey';
};

const StudentPayments = () => {
  const { studentId } = useParams();
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/student/payments/${studentId}`);
        if (!response.ok) throw new Error('Failed to fetch payments');
        const data = await response.json();
        setPayments(data);
      } catch (err) {
        console.error('Error fetching payments:', err.message);
      }
    };

    fetchPayments();
  }, [studentId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Payments</h2>

      <div className="grid gap-4">
        {payments.map((payment) => {
          const { payment_id, month_year, amount, payment_status } = payment;
          const statusColor = getStatusColor(payment_status);

          return (
            <div key={payment_id} className="flex items-center border p-4 rounded shadow-sm">
              <div className={`w-3 h-3 rounded-full mr-3 ${statusColor === 'green' ? 'bg-green-500' : statusColor === 'red' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
              <div>
                <h3 className="text-lg font-semibold">{month_year}</h3>
                <p>Amount: ₹{amount}</p>
                <p>Status: <span className={`font-semibold capitalize ${statusColor === 'green' ? 'text-green-600' : 'text-red-600'}`}>{payment_status}</span></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentPayments;




// import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import './StudentPayments.css'; // You can adjust or replace this with Tailwind or styled-components if preferred
// import { useParams } from 'react-router-dom';

// const getStatusColor = (total, paid) => {
//   if (total === 0 || total === null) return 'grey';
//   if (paid >= total) return 'green';
//   if (paid > 0 && paid < total) return 'red';
//   return 'red';
// };

// const student_payments = () => {
//   const { studentId } = useParams();
//   const [payments, setPayments] = useState([]);

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         console.log('studentId:'+ studentId);
//         const response = await fetch(`http://localhost:3000/student/payments/${studentId}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch payments');
//         }
//         const data = await response.json();
//         setPayments(data);
//         console.log(data);
//       } catch (error) {
//         console.error('Error fetching payments:', error);
//       }
//     };
//     fetchPayments();
//   }, [studentId]);

//   return (
//     <div className="payments-container">
//       <h2>Your Payments</h2>
//       <h5>student id = {studentId}</h5>
//       <div className="payments-list">
//         {payments.map((payment, index) => {
//           const { month_year, amount, amount_paid } = payment;
//           const remaining = amount ? amount - amount_paid : 0;
//           const statusColor = getStatusColor(amount, amount_paid);

//           return (
//             <div key={index} className="payment-card">
//               <div className={`status-dot ${statusColor}`}></div>
//               <div className="payment-info">
//                 <h3>{month_year}</h3>
//                 <p>Total Amount: ₹{amount ?? 'Not Set'}</p>
//                 <p>Amount Paid: ₹{amount_paid ?? 0}</p>
//                 <p>Remaining: ₹{remaining > 0 ? remaining : 0}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default student_payments;

// //initial code
// // import React, { useEffect, useState } from 'react';
// // // import axios from 'axios';
// // // import './StudentPayments.css'; // You can adjust or replace this with Tailwind or styled-components if preferred
// // import { useParams } from 'react-router-dom';

// // const getStatusColor = (total, paid) => {
// //   if (total === 0 || total === null) return 'grey';
// //   if (paid >= total) return 'green';
// //   if (paid > 0 && paid < total) return 'red';
// //   return 'red';
// // };

// // const student_payments = () => {
// //   const { studentId } = useParams();
// //   const [payments, setPayments] = useState([]);

// //   useEffect(() => {
// //     const fetchPayments = async () => {
// //       try {
// //         console.log('studentId:'+ studentId);
// //         const response = await fetch(`http://localhost:3000/student/payments/${studentId}`);
// //         if (!response.ok) {
// //           throw new Error('Failed to fetch payments');
// //         }
// //         const data = await response.json();
// //         setPayments(data);
// //         console.log(data);
// //       } catch (error) {
// //         console.error('Error fetching payments:', error);
// //       }
// //     };
// //     fetchPayments();
// //   }, [studentId]);

// //   return (
// //     <div className="payments-container">
// //       <h2>Your Payments</h2>
// //       <h5>student id = {studentId}</h5>
// //       <div className="payments-list">
// //         {payments.map((payment, index) => {
// //           const { month, amount, amount_paid } = payment;
// //           const remaining = amount ? amount - amount_paid : 0;
// //           const statusColor = getStatusColor(amount, amount_paid);

// //           return (
// //             <div key={index} className="payment-card">
// //               <div className={`status-dot ${statusColor}`}></div>
// //               <div className="payment-info">
// //                 <h3>{month}</h3>
// //                 <p>Total Amount: ₹{amount ?? 'Not Set'}</p>
// //                 <p>Amount Paid: ₹{amount_paid ?? 0}</p>
// //                 <p>Remaining: ₹{remaining > 0 ? remaining : 0}</p>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // };

// // export default student_payments;
