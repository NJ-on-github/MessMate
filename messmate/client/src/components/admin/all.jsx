import React, { useEffect, useState } from 'react';
import "../common/table.css";
import "../common/common.css";

const tablesToShow = [
  'users',
  'students',
  'account_status',
  'payments',
  'fees_structure',
  'todays_menu'
];

const all = () => {
  const [tablesData, setTablesData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTables = async () => {
      const newTablesData = {};

      for (const table of tablesToShow) {
        try {
          const res = await fetch(`http://localhost:3000/admin/view-table/${table}`);
          const data = await res.json();
          newTablesData[table] = data;
        } catch (err) {
          console.error(`Failed to fetch ${table}`, err);
          newTablesData[table] = { error: 'Failed to load' };
        }
      }

      setTablesData(newTablesData);
      setLoading(false);
    };

    fetchAllTables();
  }, []);

  if (loading) return <p>Loading database tables...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Database Viewer</h1>

      {tablesToShow.map((table) => (
        <div key={table} style={{ marginBottom: '3rem' }}>
          <h2>{table.toUpperCase()}</h2>
          {tablesData[table]?.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {Object.keys(tablesData[table][0]).map((col) => (
                    <th key={col} style={thStyle}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tablesData[table].map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((cell, i) => (
                      <td key={i} style={tdStyle}>{cell !== null ? cell.toString() : '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data found in {table}.</p>
          )}
        </div>
      ))}
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
  padding: '8px',
};

export default all;
