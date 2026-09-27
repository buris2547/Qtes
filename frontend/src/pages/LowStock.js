import React, { useState, useEffect } from 'react';
import { getLowStockProducts } from '../services/api';
import StockAdjustModal from '../components/StockAdjustModal';
import { FiSliders, FiAlertTriangle } from 'react-icons/fi';

const LowStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState(null);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const res = await getLowStockProducts();
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="alert-banner">
        <FiAlertTriangle size={24} />
        <span>พบสินค้าใกล้หมดจำนวน {products.length} รายการ (สต็อกน้อยกว่า 5)</span>
      </div>

      <div className="card">
        {loading ? <div className="spinner"></div> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>ชื่อสินค้า</th>
                  <th>หมวดหมู่</th>
                  <th>สต็อกคงเหลือ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id || p.id}>
                    <td>{p.sku}</td>
                    <td>{p.name}</td>
                    <td>{p.category?.name || '-'}</td>
                    <td>
                      <span className="badge badge-danger" style={{ fontSize: '1rem', padding: '4px 10px' }}>{p.current_stock}</span>
                    </td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => { setAdjustingProduct(p); setShowAdjust(true); }}>
                        <FiSliders /> ปรับสต็อก
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>ไม่มีสินค้าใกล้หมด</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdjust && (
        <StockAdjustModal 
          product={adjustingProduct} 
          onClose={() => setShowAdjust(false)} 
          onSuccess={() => { setShowAdjust(false); fetchLowStock(); }} 
        />
      )}
    </div>
  );
};

export default LowStock;
