import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;

  return (
    <div className="pagination">
      <button 
        className="pagination-btn" 
        onClick={() => onPageChange(page - 1)} 
        disabled={page === 1}
      >
        <FiChevronLeft />
      </button>
      <span>หน้า {page} จาก {totalPages}</span>
      <button 
        className="pagination-btn" 
        onClick={() => onPageChange(page + 1)} 
        disabled={page === totalPages}
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
