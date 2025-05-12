import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import "../common/table.css";
import "../common/common.css";


const sidebar = () => {
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
        <NavLink className={'nav-link'} to={'/admin/dashboard'}>Dashboard</NavLink> <br />
        <h3>REGISTRATIONS</h3>
        <NavLink className={'nav-link'} to={'/admin/registrations/pending-approvals'}>Pending Approvals</NavLink> <br />
        <NavLink className={'nav-link'} to={'/admin/registrations/rejected-approvals'}>Rejected Approvals</NavLink> <br />
        <h3>PAYMENTS</h3>
        <NavLink className={'nav-link'} to={'/admin/payments/pending-payments'}>Pending Payments</NavLink> <br />
        <NavLink className={'nav-link'} to={'/admin/payments/update-payments'}>Update payment</NavLink> <br />
        <NavLink className={'nav-link'} to={'/admin/payments/defaulters'}>defaulters</NavLink> <br />
        <h3> STUDENTS </h3>
        <NavLink className={'nav-link'} to={'/admin/students/all-students'}>All Students</NavLink> <br />
        <NavLink className={'nav-link'} to={'/admin/students/blocked-students'}>Blocked Students</NavLink> <br />
        <h3> Fees </h3>
        <NavLink className={'nav-link'} to={'/admin/set-fees'}> FEES <br />
        </NavLink> <br />
        <h3> Menu </h3>
        <NavLink className={'nav-link'} to={'/admin/Todays-menu'}>MENU</NavLink> <br />
      </div>
    </div>
  )
}

export default sidebar
