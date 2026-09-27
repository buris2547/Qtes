import React from 'react';
import { FiX } from 'react-icons/fi';

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onCancel}><FiX /></button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCancel}>ยกเลิก</button>
          <button className="btn btn-danger" onClick={onConfirm}>ยืนยัน</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
