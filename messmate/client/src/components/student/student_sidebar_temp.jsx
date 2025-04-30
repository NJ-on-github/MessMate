import React, { useState } from 'react';
import { FaTachometerAlt, FaMoneyBillAlt, FaInfoCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';

const student_sidebar_temp = ({ onMenuSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleSelect = (menu) => {
    setActiveItem(menu);
    onMenuSelect(menu);
  };

  return (
    <div 
      style={{
        width: isExpanded ? '200px' : '70px',
        backgroundColor: '#0a2540',
        color: 'white',
        height: '100vh',
        position: 'fixed',
        transition: 'width 0.3s',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div style={{ padding: '1rem', cursor: 'pointer' }}>
        <FaBars onClick={() => setIsExpanded(!isExpanded)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
        
        <SidebarButton 
          icon={<FaTachometerAlt />} 
          label="Dashboard" 
          isActive={activeItem === 'dashboard'}
          onClick={() => handleSelect('dashboard')}
          isExpanded={isExpanded}
        />

        <SidebarButton 
          icon={<FaMoneyBillAlt />} 
          label="Payments" 
          isActive={activeItem === 'payments'}
          onClick={() => handleSelect('payments')}
          isExpanded={isExpanded}
        />

        <SidebarButton 
          icon={<FaInfoCircle />} 
          label="Info" 
          isActive={activeItem === 'info'}
          onClick={() => handleSelect('info')}
          isExpanded={isExpanded}
        />

        <SidebarButton 
          icon={<FaSignOutAlt />} 
          label="Logout" 
          isActive={false}
          onClick={() => {
            // Clear localStorage/session and redirect (handled later)
            window.location.href = '/';
          }}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
};

const SidebarButton = ({ icon, label, isActive, onClick, isExpanded }) => {
  return (
    <div 
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        cursor: 'pointer',
        backgroundColor: isActive ? '#1d3b6c' : 'transparent',
        color: 'white',
        transition: 'background 0.3s',
      }}
    >
      <div style={{ fontSize: '1.5rem' }}>
        {icon}
      </div>
      {isExpanded && (
        <div style={{ marginLeft: '1rem', fontSize: '1rem' }}>
          {label}
        </div>
      )}
    </div>
  );
};

export default student_sidebar_temp;
