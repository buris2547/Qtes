import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiGrid, FiList, FiAlertTriangle } from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'แดชบอร์ด', icon: <FiHome /> },
    { path: '/products', label: 'จัดการสินค้า', icon: <FiBox /> },
    { path: '/categories', label: 'หมวดหมู่', icon: <FiGrid /> },
    { path: '/transactions', label: 'ประวัติ', icon: <FiList /> },
    { path: '/low-stock', label: 'แจ้งเตือนสินค้าใกล้หมด', icon: <FiAlertTriangle /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        📦 Inventory
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
