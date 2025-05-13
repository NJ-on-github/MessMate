import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import "../common/table.css";
import "../common/common.css";
import "../common/sidebar.css";

const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <img
            src={isExpanded ? '/logo_horizontal_2.svg' : '/logo_mark.svg'}
            alt="Logo"
            className={`logo ${isExpanded ? 'logo-expanded' : 'logo-collapsed'}`}
          />
        </div>
        <NavLink className={'nav-link'} to={'/admin/dashboard'}>Dashboard</NavLink>
        <h3>REGISTRATIONS</h3>
        <NavLink className={'nav-link'} to={'/admin/registrations/pending-approvals'}>Pending Approvals</NavLink>
        <NavLink className={'nav-link'} to={'/admin/registrations/rejected-approvals'}>Rejected Approvals</NavLink>
        <h3>PAYMENTS</h3>
        <NavLink className={'nav-link'} to={'/admin/payments/payments-by-month'}>Payments by Month</NavLink>
        <NavLink className={'nav-link'} to={'/admin/payments/update-payments'}>Update payment</NavLink>
        <NavLink className={'nav-link'} to={'/admin/payments/defaulters'}>defaulters</NavLink>
        <h3> STUDENTS </h3>
        <NavLink className={'nav-link'} to={'/admin/students/all-students'}>All Students</NavLink>
        <NavLink className={'nav-link'} to={'/admin/students/blocked-students'}>Blocked Students</NavLink>
        <h3> FEES </h3>
        <NavLink className={'nav-link'} to={'/admin/set-fees'}> Monthly Fees Management
        </NavLink>
        <h3> MENU </h3>
        <NavLink className={'nav-link'} to={'/admin/Todays-menu'}>Menu</NavLink>
      </div>
    </div>
  )
}

export default AdminSidebar
