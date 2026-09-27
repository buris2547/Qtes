import React from 'react';

const StatsCard = ({ title, value, icon, type = 'primary' }) => {
  return (
    <div className="card stat-card">
      <div className={`stat-icon ${type}`}>
        {icon}
      </div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
