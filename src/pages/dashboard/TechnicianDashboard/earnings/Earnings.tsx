// earnings/Earnings.tsx
import React, { useState } from 'react';
import './Earnings.css';

const Earnings: React.FC = () => {
  const [period, setPeriod] = useState('today');

  const periods = ['Today', 'This Week', 'This Month', 'All Time'];

  return (
    <div className="earnings-page">
      <div className="page-header">
        <h1 className="page-title">Earnings</h1>
        <p className="page-subtitle">Track your earnings and payouts</p>
      </div>

      <div className="earnings-summary">
        <div className="summary-card">
          <span className="summary-label">Total Earnings</span>
          <span className="summary-value">KSh 0</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Pending Payout</span>
          <span className="summary-value">KSh 0</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Completed Jobs</span>
          <span className="summary-value">0</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Rating</span>
          <span className="summary-value">0.0 ★</span>
        </div>
      </div>

      <div className="period-tabs">
        {periods.map((p) => (
          <button
            key={p}
            className={`period-btn ${period === p.toLowerCase().replace(' ', '-') ? 'active' : ''}`}
            onClick={() => setPeriod(p.toLowerCase().replace(' ', '-'))}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="earnings-list">
        <div className="empty-state">
          <span className="empty-icon">💰</span>
          <p className="empty-text">No earnings records</p>
          <p className="empty-subtext">Your earnings will appear here as you complete jobs</p>
        </div>
      </div>
    </div>
  );
};

export default Earnings;