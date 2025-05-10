import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../common/sidebar.css'


const sidebar = () => {
  return (
    <div>
      <NavLink to={'/admin/dashboard'}>Dashboard</NavLink> <br />
      <NavLink to={'/admin/registrations'}>
        REGISTRATIONS <br />
        <NavLink to={'/admin/registrations/pending-approvals'}>Pending Approvals</NavLink> <br />
        <NavLink to={'/admin/registrations/rejected-approvals'}>Rejected Approvals</NavLink> <br />
      </NavLink> <br />
      <NavLink to={'/admin/payments'}>
        PAYMENTS <br />
        <NavLink to={'/admin/payments/pending-payments'}>Pending Payments</NavLink> <br />
        <NavLink to={'/admin/payments/update-payments'}>Update payment</NavLink> <br />
        <NavLink to={'/admin/payments/defaulters'}>defaulters</NavLink> <br />
      </NavLink>
        <NavLink to={'/admin/students'}> STUDENTS <br />
          <NavLink to={'/admin/students/all-students'}>All Students</NavLink> <br />
          <NavLink to={'/admin/students/blocked-students'}>Blocked Students</NavLink> <br />
        </NavLink> <br />
        <NavLink to={'/admin/set-fees'}> FEES <br />
        </NavLink> <br />
        <NavLink to={'/admin/menu'}>MENU</NavLink> <br />


    </div>
  )
}

export default sidebar
