import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'แดชบอร์ด (Dashboard)',
  '/products': 'จัดการสินค้า (Products)',
  '/categories': 'หมวดหมู่สินค้า (Categories)',
  '/categories/new': 'เพิ่มหมวดหมู่สินค้า (Add Category)',
  '/transactions': 'ประวัติการทำรายการ (Transactions)',
  '/low-stock': 'สินค้าใกล้หมด (Low Stock)'
};

const Layout = ({ children }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'ระบบจัดการคลังสินค้า';

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <header className="header">
          <h1 className="page-title">{title}</h1>
        </header>
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
