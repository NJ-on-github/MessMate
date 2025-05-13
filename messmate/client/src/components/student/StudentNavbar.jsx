import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import '../common/sidebar.css'
import { useParams } from 'react-router-dom'

const Navbar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { studentId } = useParams();
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
            <NavLink className={'nav-link'} to={`/student/dashboard/${studentId}`} >
                Dashboard
            </NavLink>
            <NavLink className={'nav-link'}to={`/student/payments/${studentId}`} >
                Payments
            </NavLink>
            {/* <NavLink to="/student/payments" className={({ isActive }) => { isActive ? "active-navbar-component" : "" }}>Payments</NavLink> */}
</div>
        </div>
    )
}

export default Navbar

