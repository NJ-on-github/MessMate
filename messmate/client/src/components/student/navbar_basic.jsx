import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../common/sidebar.css'

const navbar_basic = () => {
    return (
        <div>
            <NavLink to='/' className={({isActive}) => isActive ? "active-navbar-component": ""}>
            Dashboard
            </NavLink>
            <NavLink to='/student/payments/:student_id' className={({isActive}) => isActive ? "active-navbar-component": ""}>
            Dashboard
            </NavLink>
            {/* <NavLink to="/student/payments" className={({ isActive }) => { isActive ? "active-navbar-component" : "" }}>Payments</NavLink> */}

        </div>
    )
}

export default navbar_basic

