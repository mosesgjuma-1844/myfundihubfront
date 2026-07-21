// payments/Payments.tsx
import React, { useState } from 'react';
import './Payments.css';

const Payments: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['All', 'Successful', 'Pending', 'Failed'];

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1 className="page-title">Payments</h1>
        <p className="page-subtitle">Manage all platform payments</p>
      </div>

      <div className="payment-summary">
        <div className="summary-card">
          <span className="summary-label">Total Revenue</span>
          <span className="summary-value">KSh 0</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Pending Payouts</span>
          <span className="summary-value">KSh 0</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Transactions</span>
          <span className="summary-value">0</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Success Rate</span>
          <span className="summary-value">0%</span>
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

      <div className="payments-table-wrapper">
        <div className="payments-table">
          <div className="table-header">
            <span>Transaction ID</span>
            <span>Customer</span>
            <span>Fundi</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          <div className="table-body">
            <div className="empty-state">
              <span className="empty-icon">💰</span>
              <p className="empty-text">No payments found</p>
              <p className="empty-subtext">Payments will appear here when transactions occur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;