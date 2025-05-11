import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../common/sidebar.css'


const sidebar = () => {
  return (
    <div>
      <NavLink to={'/admin/dashboard'}>Dashboard</NavLink> <br />
      <h3>REGISTRATIONS</h3>
      <NavLink to={'/admin/registrations/pending-approvals'}>Pending Approvals</NavLink> <br />
      <NavLink to={'/admin/registrations/rejected-approvals'}>Rejected Approvals</NavLink> <br />
      <h3>PAYMENTS</h3>
      <NavLink to={'/admin/payments/pending-payments'}>Pending Payments</NavLink> <br />
      <NavLink to={'/admin/payments/update-payments'}>Update payment</NavLink> <br />
      <NavLink to={'/admin/payments/defaulters'}>defaulters</NavLink> <br />
      <h3> STUDENTS </h3>
      <NavLink to={'/admin/students/all-students'}>All Students</NavLink> <br />
      <NavLink to={'/admin/students/blocked-students'}>Blocked Students</NavLink> <br />
      <h3> Fees </h3>
      <NavLink to={'/admin/set-fees'}> FEES <br />
      </NavLink> <br />
      <h3> Menu </h3>
      <NavLink to={'/admin/Todays-menu'}>MENU</NavLink> <br />
    </div>
  )
}

export default sidebar
