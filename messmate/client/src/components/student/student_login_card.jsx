import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './student_login_card.css'
import '../common/form.css'
// import  '../common.css'


const student_login_card = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        // Save student ID and name locally (you can use context later)
        localStorage.setItem('studentId', data.studentId);
        localStorage.setItem('studentName', data.name);
        navigate(`/student/dashboard/${data.studentId}`);
      } else {
        setMessage(data.error || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Student Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div style={formGroup}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" style={buttonStyle}>Login</button>
        </form>

        {message && <p style={{ marginTop: '1rem', color: 'crimson' }}>{message}</p>}
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f5'
};

const cardStyle = {
  background: 'white',
  padding: '2rem 3rem',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  textAlign: 'center',
  width: '350px'
};

const formGroup = {
  marginBottom: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left'
};

const buttonStyle = {
  padding: '10px',
  fontSize: '16px',
  width: '100%',
  backgroundColor: '#0a2540',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default student_login_card;

      // const student_login_card = () => {
      //     const [formData, setFormData] = useState({ email: '', password: '' });
      //   const [message, setMessage] = useState('');
      //   const navigate = useNavigate();
      
      //     return (
      //         <div className='student_login_card'>
      //             <h2 className='student_login_card_heading'>Log In as Student</h2>
      //             <form className='student_login_card_form' action="/student_login" method="POST">
      //                 <div className="form-group">
      //                     <label htmlFor="username">Username</label>
      //                     <input type="text" name="username" id="username" required />
      //                 </div>
      //                 <div className="form-group">
      //                     <label htmlFor="password">Password</label>
      //                     <input type="password" name="password" id="password" required />
      //                 </div>
      //                 <button className='primary-btn' type="submit">Log In</button>
      //             </form>
      //             <p className='student_login_card_small_text'>Don't have an account? <a href="/student/register">Register here</a></p>
      //         </div>
      //     )
      // }
      
      // export default student_login_card