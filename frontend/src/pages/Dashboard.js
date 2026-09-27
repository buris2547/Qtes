import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import { getDashboardSummary, getTransactions } from '../services/api';
import { FiBox, FiGrid, FiAlertTriangle, FiDollarSign } from 'react-icons/fi';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockCount: 0,
    totalStockValue: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, transRes] = await Promise.all([
        getDashboardSummary(),
        getTransactions({ limit: 10, page: 1 })
      ]);
      
      if (sumRes.data.success) setSummary(sumRes.data.data);
      if (transRes.data.success) setRecentTransactions(transRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  if (loading) return <div className="spinner" style={{marginTop: '50px'}}></div>;

  return (
    <div>
      <div className="stats-grid">
        <StatsCard 
          title="จำนวนสินค้าทั้งหมด" 
          value={summary.totalProducts.toLocaleString()} 
          icon={<FiBox />} 
          type="primary" 
        />
        <StatsCard 
          title="จำนวนหมวดหมู่" 
          value={summary.totalCategories.toLocaleString()} 
          icon={<FiGrid />} 
          type="success" 
        />
        <StatsCard 
          title="สินค้าใกล้หมด" 
          value={summary.lowStockCount.toLocaleString()} 
          icon={<FiAlertTriangle />} 
          type={summary.lowStockCount > 0 ? "danger" : "primary"} 
        />
        <StatsCard 
          title="มูลค่าคลังสินค้า" 
          value={formatCurrency(summary.totalStockValue)} 
          icon={<FiDollarSign />} 
          type="warning" 
        />
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>ประวัติทำรายการล่าสุด (10 รายการ)</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>วัน-เวลา</th>
                <th>สินค้า</th>
                <th>ประเภท</th>
                <th>จำนวน</th>
                <th>เหตุผล</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(t => (
                <tr key={t._id || t.id}>
                  <td>{formatDate(t.created_at)}</td>
                  <td>{t.product?.name || '-'}</td>
                  <td>
                    <span className={`badge ${t.type === 'IN' ? 'badge-success' : 'badge-danger'}`}>
                      {t.type === 'IN' ? 'นำเข้า' : 'นำออก'}
                    </span>
                  </td>
                  <td>{t.quantity}</td>
                  <td>{t.reason}</td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>ไม่มีประวัติการทำรายการ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
