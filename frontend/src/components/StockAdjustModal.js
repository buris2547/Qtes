import React, { useState, useContext } from 'react';
import { FiX } from 'react-icons/fi';
import { adjustStock } from '../services/api';
import { ToastContext } from '../App';

const StockAdjustModal = ({ product, onClose, onSuccess }) => {
  const { addToast } = useContext(ToastContext);
  const [type, setType] = useState('IN');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const numAmount = Number(amount) || 0;
  const currentStock = product.current_stock || 0;
  const newStock = type === 'IN' ? currentStock + numAmount : currentStock - numAmount;
  const isNegative = newStock < 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNegative) {
      addToast('จำนวนสต็อกหลังหักต้องไม่ติดลบ', 'error');
      return;
    }
    
    try {
      const payload = {
        product_id: product.id || product._id,
        adjustment: type === 'IN' ? numAmount : -numAmount,
        reason
      };
      
      const res = await adjustStock(payload);
      if (res.data.success) {
        addToast('ปรับสต็อกสำเร็จ');
        onSuccess();
      } else {
        addToast(res.data.message || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (err) {
      addToast('เกิดข้อผิดพลาดในการปรับสต็อก', 'error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>ปรับสต็อก: {product.name}</h2>
          <button className="close-btn" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ marginBottom: '15px' }}>สต็อกปัจจุบัน: <strong>{currentStock}</strong></p>
            
            <div className="form-group">
              <label>ประเภทรายการ</label>
              <select className="form-control" value={type} onChange={e => setType(e.target.value)}>
                <option value="IN">นำเข้า (+)</option>
                <option value="OUT">นำออก (-)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>จำนวน</label>
              <input type="number" min="1" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>เหตุผล</label>
              <input type="text" className="form-control" value={reason} onChange={e => setReason(e.target.value)} required />
            </div>

            <div className={`alert-banner ${isNegative ? '' : 'badge-primary'}`} style={{ backgroundColor: isNegative ? '' : '#F3F4F6', color: isNegative ? '' : '#111827', borderLeft: isNegative ? '' : '4px solid #4F46E5', fontSize: '0.9rem', marginTop: '15px', padding: '10px' }}>
              สต็อกจะเปลี่ยนจาก {currentStock} เป็น <strong style={{ color: isNegative ? 'red' : 'inherit' }}>{newStock}</strong>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>ยกเลิก</button>
            <button type="submit" className="btn btn-primary" disabled={!amount || isNegative}>ยืนยัน</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustModal;
