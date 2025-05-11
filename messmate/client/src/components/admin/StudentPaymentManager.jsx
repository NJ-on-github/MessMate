import React, { useState } from 'react';

const StudentPaymentManager = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/admin/payments/update-payments/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data); // Assume backend returns an array of payment records
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

      // Update UI after successful payment
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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Search Student Payments</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border px-3 py-1 rounded w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={searchPayments} 
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map(payment => (
            <div key={payment.payment_id} className="border p-3 rounded shadow">
              <p><strong>Name:</strong> {payment.name}</p>
              <p><strong>Email:</strong> {payment.email}</p>
              <p><strong>Month:</strong> {payment.month_year}</p>
              <p><strong>Amount:</strong> ₹{payment.amount}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`ml-1 font-semibold ${payment.payment_status === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
                  {payment.payment_status}
                </span>
              </p>
              {payment.payment_status !== 'paid' && (
                <button
                  onClick={() => markAsPaid(payment.payment_id)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No results found.</p>
      )}
    </div>
  );
};

export default StudentPaymentManager;






// import React from 'react';import { useState, useEffect } from 'react';
// import { Search, Calendar, CheckCircle, XCircle } from 'lucide-react';

// export default function StudentPaymentManager() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchType, setSearchType] = useState('name');
//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Function to search for students
//   const searchStudents = async () => {
//     if (!searchTerm.trim()) {
//       setError('Please enter a search term');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     try {
//       // Log the URL we're fetching from
//       const url = `http://localhost:3000/admin/student-search/search?type=${searchType}&query=${encodeURIComponent(searchTerm)}`;
//       console.log('Fetching from:', url);
      
//       const response = await fetch(url);
      
//       if (!response.ok) {
//         // Get the response text for debugging
//         const errorText = await response.text();
//         console.error('Error response:', errorText);
//         throw new Error(`Failed to fetch students: ${response.status} ${response.statusText}`);
//       }
      
//       // Try to parse the response as JSON with error handling
//       let data;
//       try {
//         const responseText = await response.text();
//         console.log('Response text:', responseText);
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         console.error('JSON parse error:', parseError);
//         throw new Error('The server response was not valid JSON');
//       }
      
//       setStudents(data);
      
//       if (data.length === 0) {
//         setError('No students found');
//       }
//     } catch (err) {
//       console.error('Search error:', err);
//       setError(`Error: ${err.message}`);
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to get student payments
//   const getStudentPayments = async (studentId) => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`http://localhost:3000/admin/student-get_payment/${studentId}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch student payments');
//       }
      
//       const data = await response.json();
//       setPayments(data);
//     } catch (err) {
//       setError(`Error: ${err.message}`);
//       setPayments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to update payment date
//   const updatePaymentDate = async (paymentId, paymentDate) => {
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');
    
//     try {
//       const response = await fetch(`http://localhost:3000/admin/student-get_payment/${paymentId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           payment_date: paymentDate,
//           payment_status: 'paid'
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to update payment');
//       }
      
//       // Update the local payments state
//       setPayments(payments.map(payment => 
//         payment.payment_id === paymentId 
//           ? { ...payment, payment_date: paymentDate, payment_status: 'paid' } 
//           : payment
//       ));
      
//       setSuccessMessage('Payment updated successfully');
      
//       // Clear success message after 3 seconds
//       setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000);
//     } catch (err) {
//       setError(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle student selection
//   const handleStudentSelect = (student) => {
//     setSelectedStudent(student);
//     getStudentPayments(student.student_id);
//   };

//   // Handle payment update
//   const handlePaymentUpdate = (paymentId) => {
//     const today = new Date().toISOString().split('T')[0];
//     updatePaymentDate(paymentId, today);
//   };

//   return (
//     <div className="flex flex-col p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Student Payment Manager</h1>
      
//       {/* Search Section */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Search by
//             </label>
//             <select
//               value={searchType}
//               onChange={(e) => setSearchType(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
//             >
//               <option value="name">Name</option>
//               <option value="email">Email</option>
//             </select>
//           </div>
          
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Search term
//             </label>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder={`Enter student ${searchType}`}
//               className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
//             />
//           </div>
          
//           <div className="flex items-end">
//             <button
//               onClick={searchStudents}
//               disabled={loading}
//               className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
//             >
//               <Search size={18} className="mr-2" />
//               {loading ? 'Searching...' : 'Search'}
//             </button>
//           </div>
//         </div>
        
//         {error && (
//           <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}
//       </div>
      
//       {/* Search Results */}
//       {students.length > 0 && !selectedStudent && (
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <h2 className="text-xl font-semibold mb-4">Search Results</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Hostel & Branch
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Registration Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {students.map((student) => (
//                   <tr key={student.student_id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {student.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {student.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {student.hostel_name} | {student.branch}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                         ${student.registration_status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                         {student.registration_status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => handleStudentSelect(student)}
//                         className="text-blue-600 hover:text-blue-900"
//                       >
//                         View Payments
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
      
//       {/* Student Payments */}
//       {selectedStudent && (
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold">
//               Payments for {selectedStudent.name}
//             </h2>
//             <button
//               onClick={() => setSelectedStudent(null)}
//               className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
//             >
//               Back to Results
//             </button>
//           </div>
          
//           {successMessage && (
//             <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">
//               {successMessage}
//             </div>
//           )}
          
//           {loading ? (
//             <div className="flex justify-center py-8">Loading payments...</div>
//           ) : payments.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Month/Year
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Due Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Payment Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {payments.map((payment) => (
//                     <tr key={payment.payment_id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {payment.month_year}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         ₹{payment.amount.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {new Date(payment.due_date).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {payment.payment_date 
//                           ? new Date(payment.payment_date).toLocaleDateString() 
//                           : '-'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                           ${payment.payment_status === 'paid' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'}`}>
//                           {payment.payment_status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {payment.payment_status === 'pending' ? (
//                           <button
//                             onClick={() => handlePaymentUpdate(payment.payment_id)}
//                             className="flex items-center text-blue-600 hover:text-blue-900"
//                           >
//                             <Calendar size={16} className="mr-1" />
//                             Mark as Paid Today
//                           </button>
//                         ) : (
//                           <span className="flex items-center text-gray-500">
//                             <CheckCircle size={16} className="mr-1 text-green-500" />
//                             Paid
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="py-4 text-center text-gray-500">
//               No payment records found for this student
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }