import React, { useState, useEffect, useContext } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getCategories, updateCategory, deleteCategory } from '../services/api';
import { ToastContext } from '../App';
import ConfirmDialog from '../components/ConfirmDialog';

const Categories = () => {
  const navigate = useNavigate();
  const { addToast } = useContext(ToastContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;
    try {
      const res = await updateCategory(id, { name: editName });
      if (res.data.success) {
        addToast('แก้ไขหมวดหมู่สำเร็จ');
        setEditingId(null);
        fetchCategories();
      } else {
        addToast(res.data.message, 'error');
      }
    } catch (err) {
      addToast('เกิดข้อผิดพลาด', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteCategory(deletingId);
      if (res.data.success) {
        addToast('ลบหมวดหมู่สำเร็จ');
        fetchCategories();
      } else {
        addToast(res.data.message, 'error');
      }
    } catch (err) {
      addToast('เกิดข้อผิดพลาด', 'error');
    } finally {
      setShowConfirm(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button type="button" className="btn btn-success" onClick={() => navigate('/categories/new')}>
          <FiPlus /> เพิ่มหมวดหมู่
        </button>
      </div>

      {loading ? <div className="spinner"></div> : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th>ชื่อหมวดหมู่</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, idx) => {
                const id = c._id || c.id;
                const isEditing = editingId === id;
                return (
                  <tr key={id}>
                    <td>{idx + 1}</td>
                    <td>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="form-control" 
                          value={editName} 
                          onChange={e => setEditName(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        c.name
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="btn btn-success" style={{ padding: '4px 8px' }} onClick={() => handleUpdate(id)}><FiSave /></button>
                          <button className="btn btn-outline" style={{ padding: '4px 8px' }} onClick={() => setEditingId(null)}><FiX /></button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="btn btn-primary" style={{ padding: '4px 8px' }} onClick={() => { setEditingId(id); setEditName(c.name); }}><FiEdit2 /></button>
                          <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => { setDeletingId(id); setShowConfirm(true); }}><FiTrash2 /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {categories.length === 0 && (
                <tr><td colSpan="3" style={{textAlign: 'center'}}>ไม่มีข้อมูลหมวดหมู่</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog 
          title="ยืนยันการลบ" 
          message="คุณต้องการลบหมวดหมู่นี้ใช่หรือไม่? (อาจมีสินค้าที่ใช้งานอยู่)" 
          onConfirm={handleDelete} 
          onCancel={() => setShowConfirm(false)} 
        />
      )}
    </div>
  );
};

export default Categories;
