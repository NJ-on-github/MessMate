import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../common/sidebar.css'
import { useParams } from 'react-router-dom'

const navbar_basic = () => {
    const { studentId } = useParams();
    return (
        <div>
            <NavLink to={`/student/dashboard/${studentId}`}  className={({isActive}) => isActive ? "active-navbar-component": ""}>
            Dashboard
            </NavLink>
            <NavLink to={`/student/payments/${studentId}`} className={({isActive}) => isActive ? "active-navbar-component": ""}>
            Payments
            </NavLink>
            {/* <NavLink to="/student/payments" className={({ isActive }) => { isActive ? "active-navbar-component" : "" }}>Payments</NavLink> */}

        </div>
    )
}

export default navbar_basic

