import React, { useState, useEffect, useContext } from 'react';
import { FiX } from 'react-icons/fi';
import { createProduct, updateProduct, getCategories } from '../services/api';
import { ToastContext } from '../App';

const ProductForm = ({ product, onClose, onSuccess }) => {
  const { addToast } = useContext(ToastContext);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    costPrice: '',
    stock: ''
  });

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        sku: product.sku || '',
        name: product.name || '',
        category: product.category_id || product.category?.id || '',
        costPrice: product.cost_price || '',
        stock: product.current_stock || 0
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        category_id: formData.category ? Number(formData.category) : null,
        cost_price: Number(formData.costPrice),
        current_stock: Number(formData.stock)
      };
      
      let res;
      if (product && (product.id || product._id)) {
        res = await updateProduct(product.id || product._id, payload);
      } else {
        res = await createProduct(payload);
      }

      if (res.data.success) {
        addToast(product ? 'แก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าสำเร็จ');
        onSuccess();
      } else {
        addToast(res.data.message || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (err) {
      addToast('เกิดข้อผิดพลาดในการบันทึก', 'error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>รหัสสินค้า (SKU)</label>
              <input type="text" name="sku" className="form-control" value={formData.sku} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>ชื่อสินค้า</label>
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>หมวดหมู่</label>
              <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
                <option value="">เลือกหมวดหมู่</option>
                {categories.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>ราคาสินค้า (฿)</label>
              <input type="number" step="0.01" name="costPrice" className="form-control" value={formData.costPrice} onChange={handleChange} required />
            </div>
            {!product && (
              <div className="form-group">
                <label>จำนวนเริ่มต้น</label>
                <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleChange} required />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
