// notifications/Notifications.tsx
import React, { useState } from 'react';
import './Notifications.css';

const Notifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = ['All', 'Unread', 'Read'];

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <p className="page-subtitle">Stay updated with your job notifications</p>
      </div>

      <div className="notifications-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="notifications-list">
        <div className="empty-state">
          <span className="empty-icon">🔔</span>
          <p className="empty-text">No notifications</p>
          <p className="empty-subtext">When you receive notifications, they will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;