import React from 'react';
import { useNavigate } from 'react-router-dom';

const landing_page = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Let's Proceed</h2>

        <div style={buttonContainerStyle}>
          <button 
            style={buttonStyle} 
            onClick={() => navigate('/admin/login')}
          >
            Admin
          </button>

          <button 
            style={buttonStyle} 
            onClick={() => navigate('/student/login')}
          >
            Student
          </button>
        </div>

        <p style={smallTextStyle}>Choose how to proceed as</p>
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

const headingStyle = {
  marginBottom: '2rem',
  fontSize: '1.8rem',
  color: '#333'
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '1.5rem'
};

const buttonStyle = {
  flex: 1,
  margin: '0 0.5rem',
  padding: '1rem',
  fontSize: '1.2rem',
  backgroundColor: '#0a2540',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.3s'
};

const smallTextStyle = {
  fontSize: '0.9rem',
  color: '#777'
};

export default landing_page;
