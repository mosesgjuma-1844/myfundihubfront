// payments/Payments.tsx
import React, { useState } from 'react';
import './Payments.css';

const Payments: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['All', 'Successful', 'Pending', 'Processing', 'Failed'];

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1 className="page-title">Payment History</h1>
        <p className="page-subtitle">View all your payment transactions</p>
      </div>

      <div className="payment-stats">
        <div className="stat-card">
          <span className="stat-label">TOTAL PAID</span>
          <span className="stat-value-amount">KSh 0</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">SUCCESSFUL</span>
          <span className="stat-value-number">0</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">PENDING</span>
          <span className="stat-value-number">0</span>
        </div>
      </div>

      <div className="payment-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.toLowerCase())}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="payment-list">
        <div className="empty-state">
          <span className="empty-icon">💰</span>
          <p className="empty-text">No payments in this category</p>
        </div>
      </div>
    </div>
  );
};

export default Payments;