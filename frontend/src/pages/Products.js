import React, { useState, useEffect, useContext } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiSliders } from 'react-icons/fi';
import { getProducts, getCategories, deleteProduct } from '../services/api';
import ProductForm from '../components/ProductForm';
import StockAdjustModal from '../components/StockAdjustModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { ToastContext } from '../App';

const Products = () => {
  const { addToast } = useContext(ToastContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  // Modals state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, category, page]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.data.success) setCategories(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts({ search, category_id: category, page, limit: 10 });
      if (res.data.success) {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteProduct(deletingId);
      if (res.data.success) {
        addToast('ลบสินค้าสำเร็จ');
        fetchProducts();
      } else {
        addToast(res.data.message, 'error');
      }
    } catch (err) {
      addToast('เกิดข้อผิดพลาดในการลบ', 'error');
    } finally {
      setShowConfirm(false);
      setDeletingId(null);
    }
  };

  const getStockBadgeClass = (stock) => {
    if (stock < 5) return 'badge-danger';
    if (stock < 10) return 'badge-warning';
    return 'badge-success';
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(Number(val) || 0);
  };

  return (
    <div className="card">
      <div className="toolbar">
        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="search-box">
            <FiSearch />
            <input 
              type="text" 
              placeholder="ค้นหา SKU หรือชื่อสินค้า..." 
              value={search} 
              onChange={e => { setSearch(e.target.value); setPage(1); }} 
            />
          </div>
          <select className="form-control" style={{ width: '200px' }} value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">ทุกหมวดหมู่</option>
            {categories.map(c => (
              <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          <FiPlus /> เพิ่มสินค้า
        </button>
      </div>

      {loading ? <div className="spinner"></div> : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>SKU</th>
                <th>ชื่อสินค้า</th>
                <th>หมวดหมู่</th>
                <th>ราคาสินค้า</th>
                <th>สต็อก</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={p._id || p.id}>
                  <td>{((page - 1) * 10) + idx + 1}</td>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.category?.name || '-'}</td>
                  <td>{formatCurrency(p.cost_price)}</td>
                  <td>
                    <span className={`badge ${getStockBadgeClass(p.current_stock)}`}>{p.current_stock}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => { setAdjustingProduct(p); setShowAdjust(true); }}>
                        <FiSliders /> ปรับสต็อก
                      </button>
                      <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => { setEditingProduct(p); setShowForm(true); }}>
                        <FiEdit2 />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => { setDeletingId(p._id || p.id); setShowConfirm(true); }}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="7" style={{textAlign: 'center'}}>ไม่พบข้อมูลสินค้า</td></tr>
              )}
            </tbody>
          </table>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      )}

      {showForm && (
        <ProductForm 
          product={editingProduct} 
          onClose={() => setShowForm(false)} 
          onSuccess={() => { setShowForm(false); fetchProducts(); }} 
        />
      )}

      {showAdjust && (
        <StockAdjustModal 
          product={adjustingProduct} 
          onClose={() => setShowAdjust(false)} 
          onSuccess={() => { setShowAdjust(false); fetchProducts(); }} 
        />
      )}

      {showConfirm && (
        <ConfirmDialog 
          title="ยืนยันการลบ" 
          message="คุณต้องการลบสินค้านี้ใช่หรือไม่? ข้อมูลจะถูกลบอย่างถาวร" 
          onConfirm={handleDelete} 
          onCancel={() => setShowConfirm(false)} 
        />
      )}
    </div>
  );
};

export default Products;
