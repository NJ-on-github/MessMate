import React, { useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import '../common/sidebar.css';
import '../common/common.css';

const StudentSidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const { studentId } = useParams();

    const handleLogout = () => {
        localStorage.removeItem('studentId');
        localStorage.removeItem('studentName');
        localStorage.removeItem('studentEmail');
        localStorage.removeItem('isStudentLoggedIn');
        navigate('/');
    };

    const toggleSidebar = () => setIsExpanded((prev) => !prev);

    const handleNavClick = () => {
        if (window.innerWidth <= 768) {
            setIsExpanded(false);
        }
    };

    return (
        <>
            {isExpanded && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsExpanded(false)}
                ></div>
            )}

            <div
                className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
                onMouseEnter={() => !isMobile() && setIsExpanded(true)}
                onMouseLeave={() => !isMobile() && setIsExpanded(false)}
            >
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <img
                            src={isExpanded ? '/logo_horizontal_2.svg' : '/logo_mark.svg'}
                            alt="Logo"
                            className={`logo ${isExpanded ? 'logo-expanded' : 'logo-collapsed'}`}
                        />
                    </div>

                    {!isExpanded && (
                        <button className="sidebar-toggle-btn" onClick={toggleSidebar} aria-label="Expand Sidebar">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                <path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z" />
                            </svg>
                        </button>
                    )}

                    {isExpanded && (
                        <>
                            <NavLink className="nav-link" to={`/student/dashboard/${studentId}`} onClick={handleNavClick}>
                                Dashboard
                            </NavLink>
                            <NavLink className="nav-link" to={`/student/payments/${studentId}`} onClick={handleNavClick}>
                                Payments
                            </NavLink>
                            <div className="logout-section">
                                <button onClick={handleLogout} className="logout-link">
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

const isMobile = () =>
    window.innerWidth <= 768;

export default StudentSidebar;

