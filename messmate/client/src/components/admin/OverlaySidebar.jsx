import React, { useState } from 'react';
import './Sidebar.css'; // We'll create this CSS file separately

const OverlaySidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="layout">
      {/* Sidebar */}
      <div 
        className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Sidebar content */}
        <div className="sidebar-content">
          <div className="menu-header">
            <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`menu-title ${isExpanded ? 'visible' : 'hidden'}`}>
              Menu
            </span>
          </div>
          
          {/* Menu items */}
          <nav className="menu-items">
            <ul>
              <li className="menu-item">
                <svg className="menu-item-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`menu-item-text ${isExpanded ? 'visible' : 'hidden'}`}>Home</span>
              </li>
              <li className="menu-item">
                <svg className="menu-item-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`menu-item-text ${isExpanded ? 'visible' : 'hidden'}`}>Tasks</span>
              </li>
              <li className="menu-item">
                <svg className="menu-item-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`menu-item-text ${isExpanded ? 'visible' : 'hidden'}`}>Profile</span>
              </li>
              <li className="menu-item">
                <svg className="menu-item-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98478 18.3924 8.24712 18.3715 8.51776C18.3506 8.78839 18.3938 9.06058 18.4975 9.31134C18.6013 9.5621 18.7627 9.78486 18.9687 9.96088C19.1747 10.1369 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4963 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0152 18.4769 15.7528 18.3924 15.4822 18.3715C15.2116 18.3506 14.9394 18.3938 14.6886 18.4975C14.4379 18.6013 14.2151 18.7627 14.0391 18.9687C13.8631 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78641 18.3491 8.51577 18.3701C8.24514 18.3911 7.98339 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0152 5.60755 15.7528 5.62848 15.4822C5.64942 15.2116 5.60624 14.9394 5.50247 14.6886C5.3987 14.4379 5.23726 14.2151 5.03127 14.0391C4.82529 13.8631 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78641 5.62987 8.51577C5.60889 8.24514 5.5243 7.98339 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C8.753 5.99 10.049 5.452 10.325 4.317Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`menu-item-text ${isExpanded ? 'visible' : 'hidden'}`}>Settings</span>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <h1 className="content-title">Main Content</h1>
        <p>This is the main content area. The sidebar on the left will expand on hover without pushing this content.</p>
        <div className="content-box">
          <h2>Sample Content Section</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>
        </div>
      </div>
    </div>
  );
};

export default OverlaySidebar;