import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../common/sidebar.css'


const sidebar = () => {
  return (
    <div>
      <NavLink to={'/admin/pending-payments'}>Pending Payments</NavLink> <br />
      <NavLink to={'/admin/pending-approvals'}>Admin Approvals</NavLink> <br />
      <NavLink to={'/admin/monthly-fees'}>Monthly_fees</NavLink> <br />
      <NavLink to={'/admin/defaulters'}>Defaulters</NavLink> <br /> 
      <NavLink to={'/admin/Todays-menu'}>Today's menu</NavLink> <br />
      <NavLink to={'/admin/payments'}>Payments</NavLink> <br />
      
    </div>
  )
}

export default sidebar
