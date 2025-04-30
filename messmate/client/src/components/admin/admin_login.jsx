import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const admin_login = () => {
  const [adminData, setAdminData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Admin login successful!');
        localStorage.setItem('adminId', data.adminId); // Save adminId if you return it
        navigate('/admin/dashboard'); // Redirect to admin dashboard or another page
      } else {
        setMessage(data.error || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div style={formGroup}>
          <label>Email:</label>
          <input type="email" name="email" value={adminData.email} onChange={handleChange} required />
        </div>

        <div style={formGroup}>
          <label>Password:</label>
          <input type="password" name="password" value={adminData.password} onChange={handleChange} required />
        </div>

        <button type="submit" style={buttonStyle}>Login</button>
      </form>

      {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
    </div>
  );
};

const formGroup = {
  marginBottom: '1rem',
  display: 'flex',
  flexDirection: 'column',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  marginTop: '10px',
  cursor: 'pointer',
};

export default admin_login;
