// techniciandashboard/Dashboard.tsx
import React, { useState } from 'react';
import './TechDashboard.css';

const TechDashboard: React.FC = () => {
  const [activeStatusTab, setActiveStatusTab] = useState('active');

  const stats = [
    { label: 'Total Jobs', value: '0' },
    { label: 'Active Jobs', value: '0' },
    { label: 'Completed', value: '0' },
    { label: 'Earnings', value: 'KSh 0' },
  ];

  const quickActions = [
    { name: 'Find Jobs' },
    { name: 'My Schedule' },
    { name: 'Earnings' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h1 className="greeting-title">GOOD MORNING, EMMANUEL</h1>
          <p className="greeting-subtitle">Ready to earn today?</p>
        </div>
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button key={index} className="action-btn">
            <span className="action-name">{action.name}</span>
          </button>
        ))}
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="jobs-section">
        <div className="jobs-header">
          <h2 className="section-title">My Jobs</h2>
          <div className="jobs-tabs">
            <button 
              className={`tab-btn ${activeStatusTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveStatusTab('active')}
            >
              Active
            </button>
            <button 
              className={`tab-btn ${activeStatusTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveStatusTab('completed')}
            >
              Completed
            </button>
            <button 
              className={`tab-btn ${activeStatusTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveStatusTab('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>
        <div className="jobs-content">
          <div className="empty-state">
            <p className="empty-text">No jobs in this category</p>
            <p className="empty-subtext">Jobs you accept will appear here</p>
          </div>
        </div>
      </div>

      <div className="availability-section">
        <div className="availability-status">
          <span className="status-dot online"></span>
          <span className="status-label">You are online</span>
        </div>
        <button className="toggle-status-btn">Go Offline</button>
      </div>
    </div>
  );
};

export default TechDashboard;