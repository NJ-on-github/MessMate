import React, { useEffect, useState } from 'react';

const PendingPaymentsList = () => {
  const [monthYear, setMonthYear] = useState('2025-04'); // Default month
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const months = [
    '2025-01', '2025-02', '2025-03', '2025-04',
    '2025-05', '2025-06', '2025-07', '2025-08',
    '2025-09', '2025-10', '2025-11', '2025-12'
  ];

  const fetchPendingStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/admin/pending-payments/${monthYear}`);
      if (!res.ok) throw new Error('Failed to fetch pending payments');
      const data = await res.json();
      setPendingStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingStudents();
  }, [monthYear]);

  const blockStudent = async (studentId) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/block-student/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Payment pending for ' + monthYear })
      });
      if (!res.ok) throw new Error('Blocking failed');
      alert('Student blocked successfully!');
      fetchPendingStudents(); // Refresh list after blocking
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Students with Pending Payment - {monthYear}</h2>

      <div>
        <label>Select Month: </label>
        <select value={monthYear} onChange={(e) => setMonthYear(e.target.value)}>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {pendingStudents.length === 0 ? (
        <p>No pending payments for this month.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Hostel</th>
              <th style={thStyle}>Branch</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingStudents.map(student => (
              <tr key={student.student_id}>
                <td style={tdStyle}>{student.student_id}</td>
                <td style={tdStyle}>{student.name}</td>
                <td style={tdStyle}>{student.email}</td>
                <td style={tdStyle}>{student.hostel_name}</td>
                <td style={tdStyle}>{student.branch}</td>
                <td style={tdStyle}>
                  <button onClick={() => blockStudent(student.student_id)}>Block</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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

export default PendingPaymentsList;
