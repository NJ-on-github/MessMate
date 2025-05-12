import { useState, useEffect } from 'react';
import React from 'react';
import "../common/table.css";
import "../common/common.css";

export default function FeeStructureManagement() {
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFee, setNewFee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Generate months for the current year
  const months = [
    { value: `${currentYear}-01-01`, label: 'January' },
    { value: `${currentYear}-02-01`, label: 'February' },
    { value: `${currentYear}-03-01`, label: 'March' },
    { value: `${currentYear}-04-01`, label: 'April' },
    { value: `${currentYear}-05-01`, label: 'May' },
    { value: `${currentYear}-06-01`, label: 'June' },
    { value: `${currentYear}-07-01`, label: 'July' },
    { value: `${currentYear}-08-01`, label: 'August' },
    { value: `${currentYear}-09-01`, label: 'September' },
    { value: `${currentYear}-10-01`, label: 'October' },
    { value: `${currentYear}-11-01`, label: 'November' },
    { value: `${currentYear}-12-01`, label: 'December' }
  ];

  // Fetch fee structures when component mounts
  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/admin/fees');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFeeStructures(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch fee structures');
      setLoading(false);
      console.error('Error fetching fee structures:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedMonth || !newFee || isNaN(parseFloat(newFee))) {
      setError('Please select a month and enter a valid fee amount');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/admin/insert-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthly_fee: parseFloat(newFee),
          effective_from: selectedMonth
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add fee structure');
      }
      
      // Clear form
      setNewFee('');
      setSelectedMonth('');
      
      // Show success message
      setSuccessMessage('Fee structure added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh fee structures
      fetchFeeStructures();
    } catch (err) {
      setError(err.message || 'Failed to add fee structure');
      console.error('Error adding fee structure:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter out months that already have fees set
  const getAvailableMonths = () => {
    const setMonths = feeStructures.map(fee => {
      const date = new Date(fee.effective_from);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    });
    
    return months.filter(month => !setMonths.includes(month.value));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className='table-heading'>Fee Structure Management</h1>
      
      {/* Add New Fee Structure Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Fee Structure</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3 border"
            >
              <option value="">Select Month</option>
              {getAvailableMonths().map(month => (
                <option key={month.value} value={month.value}>
                  {month.label} {currentYear}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount (₹)</label>
            <input
              type="number"
              value={newFee}
              onChange={(e) => setNewFee(e.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3 border"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="self-end">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Set Fee'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Display Existing Fee Structures */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing Fee Structures</h2>
        
        {loading && <p className="text-gray-500">Loading fee structures...</p>}
        
        {!loading && feeStructures.length === 0 && (
          <p className="text-gray-500">No fee structures have been set yet.</p>
        )}
        
        {!loading && feeStructures.length > 0 && (
          <div className="overflow-x-auto">
            <div className="table-container"> 
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Fee</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeStructures
                  .sort((a, b) => new Date(a.effective_from) - new Date(b.effective_from))
                  .map(fee => (
                    <tr key={fee.fee_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.fee_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(fee.effective_from)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(fee.monthly_fee)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}





// import React, { useEffect, useState } from 'react';

// const months = [
//   { label: 'January', value: '01' },
//   { label: 'February', value: '02' },
//   { label: 'March', value: '03' },
//   { label: 'April', value: '04' },
//   { label: 'May', value: '05' },
//   { label: 'June', value: '06' },
//   { label: 'July', value: '07' },
//   { label: 'August', value: '08' },
//   { label: 'September', value: '09' },
//   { label: 'October', value: '10' },
//   { label: 'November', value: '11' },
//   { label: 'December', value: '12' },
// ];

// const monthly_fees = () => {
//     const [fees, setFees] = useState({});
//     const [newFees, setNewFees] = useState({});
//     const [loading, setLoading] = useState(true);
  
//     const currentYear = new Date().getFullYear();
  
//     useEffect(() => {
//       fetchFees();
//     }, []);
  
//     const fetchFees = async () => {
//       try {
//         const res = await fetch('http://localhost:3000/admin/fees');
//         const data = await res.json();
  
//         const feeMap = {};
//         data.forEach(fee => {
//           const month = fee.effective_from.split('-')[1]; // Extract month part
//           feeMap[month] = fee.monthly_fee;
//         });
  
//         setFees(feeMap);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     const handleFeeChange = (month, value) => {
//       setNewFees(prev => ({
//         ...prev,
//         [month]: value
//       }));
//     };
  
//     const saveFee = async (month) => {
//       try {
//         const payload = {
//           monthly_fee: parseInt(newFees[month]),
//           effective_from: `${currentYear}-${month}-01`
//         };
  
//         const res = await fetch('http://localhost:3000/admin/insert-fee', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload)
//         });
  
//         if (!res.ok) throw new Error('Failed to save fee');
  
//         alert('Fee saved successfully!');
//         fetchFees(); // Refresh after saving
//       } catch (err) {
//         alert(err.message);
//       }
//     };
  
//     if (loading) return <p>Loading fees...</p>;
  
//     return (
//       <div style={{ padding: '2rem' }}>
//         <h2>Manage Monthly Fees ({currentYear})</h2>
  
//         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               <th style={thStyle}>Month</th>
//               <th style={thStyle}>Fees</th>
//               <th style={thStyle}>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {months.map(({ label, value }) => (
//               <tr key={value}>
//                 <td style={tdStyle}>{label}</td>
//                 <td style={tdStyle}>
//                   {fees[value] ? (
//                     `₹${fees[value]}`
//                   ) : (
//                     'Not set yet'
//                   )}
//                 </td>
//                 <td style={tdStyle}>
//                   {!fees[value] ? (
//                     <>
//                       <input
//                         type="number"
//                         placeholder="Enter fee"
//                         value={newFees[value] || ''}
//                         onChange={(e) => handleFeeChange(value, e.target.value)}
//                         style={{ marginRight: '8px' }}
//                       />
//                       <button onClick={() => saveFee(value)} disabled={!newFees[value]}>
//                         Save
//                       </button>
//                     </>
//                   ) : (
//                     'Already Set'
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
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

// export default monthly_fees;
