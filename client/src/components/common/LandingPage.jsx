import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../common/table.css";
import "../common/common.css";
import "../common/form.css";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-background">
      <div className="landing-container">
        <div className="landing-card">
          <h2 className="landing-heading">Let's Proceed</h2>
          <div className="landing-button-container">
            <button 
              className="landing-role-button" 
              onClick={() => navigate('/admin/login')}
            >
              <img 
                src="/admin.svg" 
                alt="Admin Icon" 
                className="landing-role-icon"
              />
              Admin
            </button>
            <button 
              className="landing-role-button" 
              onClick={() => navigate('/student/login')}
            >
              <img 
                src="/student.svg" 
                alt="Student Icon" 
                className="landing-role-icon"
              />
              Student
            </button>
          </div>
          <p className="landing-small-text">Choose how to proceed as</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;