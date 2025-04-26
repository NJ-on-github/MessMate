import React, { useEffect, useState } from 'react';

const months = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

const monthly_fees = () => {
    const [fees, setFees] = useState({});
    const [newFees, setNewFees] = useState({});
    const [loading, setLoading] = useState(true);
  
    const currentYear = new Date().getFullYear();
  
    useEffect(() => {
      fetchFees();
    }, []);
  
    const fetchFees = async () => {
      try {
        const res = await fetch('http://localhost:3000/admin/fees');
        const data = await res.json();
  
        const feeMap = {};
        data.forEach(fee => {
          const month = fee.effective_from.split('-')[1]; // Extract month part
          feeMap[month] = fee.monthly_fee;
        });
  
        setFees(feeMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleFeeChange = (month, value) => {
      setNewFees(prev => ({
        ...prev,
        [month]: value
      }));
    };
  
    const saveFee = async (month) => {
      try {
        const payload = {
          monthly_fee: parseInt(newFees[month]),
          effective_from: `${currentYear}-${month}-01`
        };
  
        const res = await fetch('http://localhost:3000/admin/insert-fee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
  
        if (!res.ok) throw new Error('Failed to save fee');
  
        alert('Fee saved successfully!');
        fetchFees(); // Refresh after saving
      } catch (err) {
        alert(err.message);
      }
    };
  
    if (loading) return <p>Loading fees...</p>;
  
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Manage Monthly Fees ({currentYear})</h2>
  
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Month</th>
              <th style={thStyle}>Fees</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {months.map(({ label, value }) => (
              <tr key={value}>
                <td style={tdStyle}>{label}</td>
                <td style={tdStyle}>
                  {fees[value] ? (
                    `₹${fees[value]}`
                  ) : (
                    'Not set yet'
                  )}
                </td>
                <td style={tdStyle}>
                  {!fees[value] ? (
                    <>
                      <input
                        type="number"
                        placeholder="Enter fee"
                        value={newFees[value] || ''}
                        onChange={(e) => handleFeeChange(value, e.target.value)}
                        style={{ marginRight: '8px' }}
                      />
                      <button onClick={() => saveFee(value)} disabled={!newFees[value]}>
                        Save
                      </button>
                    </>
                  ) : (
                    'Already Set'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};

const thStyle = {
  border: '1px solid #ccc',
  backgroundColor: '#0a2540',
  color: '#fff',
  padding: '10px',
  textAlign: 'left'
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '10px',
};

export default monthly_fees;
