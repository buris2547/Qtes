import React, { useState, useEffect } from 'react';
import { getTransactions, getProducts } from '../services/api';
import Pagination from '../components/Pagination';

const StockTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [productId, setProductId] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [productId, type, page]);

  const fetchProducts = async () => {
    try {
      // Fetch all products for filter dropdown (simplification, may need search for large db)
      const res = await getProducts({ limit: 1000 });
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactions({ product_id: productId, type, page, limit: 15 });
      if (res.data.success) {
        setTransactions(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="card">
      <div className="toolbar">
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="form-control" style={{ width: '250px' }} value={productId} onChange={e => { setProductId(e.target.value); setPage(1); }}>
            <option value="">ทุกสินค้า</option>
            {products.map(p => (
              <option key={p._id || p.id} value={p._id || p.id}>{p.sku} - {p.name}</option>
            ))}
          </select>
          <select className="form-control" style={{ width: '150px' }} value={type} onChange={e => { setType(e.target.value); setPage(1); }}>
            <option value="">ทุกประเภท</option>
            <option value="IN">นำเข้า (IN)</option>
            <option value="OUT">นำออก (OUT)</option>
          </select>
        </div>
      </div>

      {loading ? <div className="spinner"></div> : (
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
              {transactions.map(t => (
                <tr key={t._id || t.id}>
                  <td>{formatDate(t.created_at)}</td>
                  <td>{t.product?.name || '-'} ({t.product?.sku || '-'})</td>
                  <td>
                    <span className={`badge ${t.type === 'IN' ? 'badge-success' : 'badge-danger'}`}>
                      {t.type === 'IN' ? 'นำเข้า (+)' : 'นำออก (-)'}
                    </span>
                  </td>
                  <td>{t.quantity}</td>
                  <td>{t.reason}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>ไม่พบประวัติการทำรายการ</td></tr>
              )}
            </tbody>
          </table>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default StockTransactions;
