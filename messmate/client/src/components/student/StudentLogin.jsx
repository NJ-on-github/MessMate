import React from 'react'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles/StudentLogin.css'
import "../common/table.css";
import "../common/common.css";
import "../common/form.css";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState({ message: '', subMessage: '', showForm: true });
  const navigate = useNavigate();

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:3000/student/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      // Store student data in localStorage
      localStorage.setItem('studentId', data.studentId);
      localStorage.setItem('studentName', data.name);
      localStorage.setItem('studentEmail', data.email);
      localStorage.setItem('isStudentLoggedIn', 'true');

      // Redirect to dashboard
      navigate(`/student/dashboard/${data.studentId}`);
    } else {
      // Handle specific error cases
      switch (data.error) {
        case 'pending':
          setError({
            message: 'Account Pending Approval',
            subMessage: 'Your registration is pending admin approval. Please check back later.',
            showForm: false
          });
          break;

        case 'blocked':
          setError({
            message: 'Account Blocked',
            subMessage: data.message || 'Your account has been blocked. Please contact the admin.',
            showForm: false
          });
          break;

        case 'invalid_credentials':
          setError({
            message: 'Invalid email or password',
            subMessage: '',
            showForm: true
          });
          break;

        default:
          setError({
            message: data.error || 'Login failed',
            subMessage: 'Please try again',
            showForm: true
          });
      }
    }
  } catch (err) {
    console.error('Login error:', err);
    setError({
      message: 'Connection error',
      subMessage: 'Please check your internet connection and try again',
      showForm: true
    });
  }
};

  // If we have a major error that should replace the form
  if (!error.showForm) {
    return (
      <div className="center-all">
        <div className="form-container">
          <div className="form-header">
            <h2>{error.message}</h2>
            <p>{error.subMessage}</p>
            <Link to="/" className="form-nav-link">Go back to home page</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="center-all">
      <div className="form-container">
        <div className="form-header">
          <h2>Student Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="formGroup">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className="login-btn" type="submit">Login</button>

          
          <div className="register-prompt">
            <p>Haven't Registered yet?</p>
            <Link to="/student/register" className="register-link">Register Here</Link>
          </div>
        </form>

        {error.message && (
          <p style={{ marginTop: '1rem', color: 'crimson' }}>{error.message}</p>
        )}

        <Link to="/" className="form-nav-link">
          Go back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default StudentLogin;