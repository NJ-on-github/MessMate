// client/src/components/common/InfoBox.jsx
import React, { useState } from 'react';
import '../common/common.css';
import '../common/infoBox.css';

const InfoBox = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="info-box-wrapper">
      <div className={`info-box ${isOpen ? 'open' : 'closed'}`}>
        <button className="info-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? 'Hide Test Accounts' : 'Show Test Accounts'}
        </button>

        {isOpen && (
          <div className="info-content">
            <h3 className="info-title">
              For Recruiters — Sample Accounts to Test the App
            </h3>
            <p className="info-description">
              Feel free to use the accounts below to explore the app. The database automatically restores to a stable state every few hours, so you can test comfortably without worrying about permanent changes.
            </p>

            <div className="account-section">
              <h4>Admin Account</h4>
              <div className="account-details">
                <span>Email: admin@example.com</span> <br />
                <span>Password: admin123</span>
              </div>
            </div>

            <div className="account-section">
              <h4>Student Accounts</h4>

              <div className="account-item">
                <strong>Working Account:</strong>
                <div>amolika.student@example.com</div>
                <div>student123</div>
              </div>

              <div className="account-item">
                <strong>Pending Approval:</strong>
                <div>isaac.student@example.com</div>
                <div>student123</div>
              </div>

              <div className="account-item">
                <strong>Rejected Registration:</strong>
                <div>testStudent50@example.com</div>
                <div>abcd</div>
              </div>

              <div className="account-item">
                <strong>Blocked for Defaulter:</strong>
                <div>sona.student@example.com</div>
                <div>student123</div>
              </div>
            </div>

            <div className="github-link">
              <a
                href="https://github.com/NJ-on-github/MessMate"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Source Code — Click Here
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoBox;