import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import "../common/common.css";
import "../common/form.css";

const AdminLogin = () => {
  const [adminData, setAdminData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
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
        localStorage.setItem('adminId', data.adminId);
        localStorage.setItem('adminName', data.name);
        setMessage(data.message || 'Admin login successful!');
        setIsSuccess(true);
        navigate('/admin/dashboard');
      } else {
        setMessage(data.error || 'Login failed.');
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="page-background">
      <div className="center-all">
        <div className='form-container'>
          <div className="form-header">
            <h2>Admin Login</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className='formGroup'>
              <label>Email:</label>
              <input type="email" name="email" value={adminData.email} onChange={handleChange} required />
            </div>

            <div className='formGroup'>
              <label>Password:</label>
              <input type="password" name="password" value={adminData.password} onChange={handleChange} required />
            </div>

            <button className="login-btn" type="submit">Login</button>
          </form>

          {message && (
            <p className={`login-message ${isSuccess ? 'success' : 'error'}`}>
              {message}
            </p>
          )}

          <NavLink to="/" className="form-nav-link">
            Go back to Homepage
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;