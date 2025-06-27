import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../common/common.css";
import "../common/sidebar.css";

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    navigate("/");
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
        className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}
        onMouseEnter={() => !isMobile() && setIsExpanded(true)}
        onMouseLeave={() => !isMobile() && setIsExpanded(false)}
      >
        <div className="sidebar-content">
          <div className="sidebar-header">
            <img
              src={isExpanded ? "/logo_horizontal_2.svg" : "/logo_mark.svg"}
              alt="Logo"
              className={`logo ${isExpanded ? "logo-expanded" : "logo-collapsed"}`}
            />
          </div>

          {!isExpanded && (
            <button className="sidebar-toggle-btn" onClick={toggleSidebar} aria-label="Expand Sidebar">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M360-120v-720h80v720h-80Zm160-160v-400l200 200-200 200Z" /></svg>
            </button>
          )}

          {isExpanded && (
            <>
              <NavLink className={"nav-link"} to={"/admin/dashboard"} onClick={handleNavClick}>
                Dashboard
              </NavLink>
              <h3>REGISTRATIONS</h3>
              <NavLink className={"nav-link"} to={"/admin/registrations/pending-approvals"} onClick={handleNavClick}>Pending Approvals</NavLink>
              <NavLink className={"nav-link"} to={"/admin/registrations/rejected-approvals"} onClick={handleNavClick}>Rejected Registrationss</NavLink>
              <h3>PAYMENTS</h3>
              <NavLink className={"nav-link"} to={"/admin/payments/defaulters"} onClick={handleNavClick}>Defaulters</NavLink>
              <NavLink className={"nav-link"} to={"/admin/payments/payments-by-month"} onClick={handleNavClick}>Payments by Month</NavLink>
              <NavLink className={"nav-link"} to={"/admin/payments/update-payments"} onClick={handleNavClick}>Update payment</NavLink>
              <h3> STUDENTS AND REGISTRATIONS</h3>
              <NavLink className={"nav-link"} to={"/admin/students/all-students"} onClick={handleNavClick}>All Registrations</NavLink>
              <NavLink className={"nav-link"} to={"/admin/students/blocked-students"} onClick={handleNavClick}>Blocked Students</NavLink>
              <h3> FEES </h3>
              <NavLink className={"nav-link"} to={"/admin/set-fees"} onClick={handleNavClick}>Monthly Fees Management</NavLink>
              <h3> MENU </h3>
              <NavLink className={"nav-link"} to={"/admin/Todays-menu"} onClick={handleNavClick}>Menu</NavLink>
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

const isMobile = () => window.innerWidth <= 768;

export default AdminSidebar;
