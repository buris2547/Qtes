import React, { useContext, useState } from 'react';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../services/api';
import { ToastContext } from '../App';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const categoryName = name.trim();
    if (!categoryName) return;

    try {
      setSaving(true);
      const response = await createCategory({ name: categoryName });
      if (!response.data.success) {
        addToast(response.data.message || 'ไม่สามารถเพิ่มหมวดหมู่ได้', 'error');
        return;
      }

      addToast('เพิ่มหมวดหมู่สำเร็จ');
      navigate('/categories');
    } catch (error) {
      const message = error.response?.data?.message || 'ไม่สามารถเพิ่มหมวดหมู่ได้';
      addToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px' }}>
      <div className="modal-header" style={{ marginBottom: '20px' }}>
        <h2>เพิ่มหมวดหมู่สินค้า</h2>
        <button type="button" className="btn btn-outline" onClick={() => navigate('/categories')}>
          <FiArrowLeft /> กลับ
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category-name">ชื่อหมวดหมู่</label>
          <input
            id="category-name"
            type="text"
            className="form-control"
            placeholder="เช่น อุปกรณ์สำนักงาน"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            autoFocus
            required
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/categories')}>
            ยกเลิก
          </button>
          <button type="submit" className="btn btn-success" disabled={saving || !name.trim()}>
            <FiSave /> {saving ? 'กำลังบันทึก...' : 'บันทึกหมวดหมู่'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
