// reports/Reports.tsx
import React, { useState } from 'react';
import './Reports.css';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('overview');

  const reportTypes = ['Overview', 'Users', 'Fundis', 'Bookings', 'Payments', 'Revenue'];

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">View platform analytics and reports</p>
      </div>

      <div className="report-tabs">
        {reportTypes.map((type) => (
          <button
            key={type}
            className={`report-btn ${reportType === type.toLowerCase() ? 'active' : ''}`}
            onClick={() => setReportType(type.toLowerCase())}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <div className="report-header">
            <span className="report-icon">👥</span>
            <span className="report-title">Total Users</span>
          </div>
          <span className="report-value">0</span>
          <span className="report-change">+0% this month</span>
        </div>

        <div className="report-card">
          <div className="report-header">
            <span className="report-icon">🔧</span>
            <span className="report-title">Total Fundis</span>
          </div>
          <span className="report-value">0</span>
          <span className="report-change">+0% this month</span>
        </div>

        <div className="report-card">
          <div className="report-header">
            <span className="report-icon">📋</span>
            <span className="report-title">Total Bookings</span>
          </div>
          <span className="report-value">0</span>
          <span className="report-change">+0% this month</span>
        </div>

        <div className="report-card">
          <div className="report-header">
            <span className="report-icon">💰</span>
            <span className="report-title">Revenue</span>
          </div>
          <span className="report-value">KSh 0</span>
          <span className="report-change">+0% this month</span>
        </div>
      </div>

      <div className="report-details">
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p className="empty-text">No report data available</p>
          <p className="empty-subtext">Reports will appear here when data is available</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;