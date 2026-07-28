// settings/Settings.tsx
import React, { useState } from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  const [settingsData, setSettingsData] = useState({
    siteName: 'myFundi Hub',
    supportEmail: 'support@myfundi.com',
    commissionRate: '20',
    minPayout: '100',
    maxRadius: '20',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettingsData({
      ...settingsData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Settings updated:', settingsData);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage platform settings and configurations</p>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h2 className="section-title">General Settings</h2>
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="siteName">Site Name</label>
              <input
                id="siteName"
                type="text"
                name="siteName"
                className="form-input"
                value={settingsData.siteName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="supportEmail">Support Email</label>
              <input
                id="supportEmail"
                type="email"
                name="supportEmail"
                className="form-input"
                value={settingsData.supportEmail}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="save-btn">
              Save General Settings
            </button>
          </form>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Commission & Payout Settings</h2>
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="commissionRate">Commission Rate (%)</label>
              <input
                id="commissionRate"
                type="number"
                name="commissionRate"
                className="form-input"
                value={settingsData.commissionRate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="minPayout">Minimum Payout (KSh)</label>
              <input
                id="minPayout"
                type="number"
                name="minPayout"
                className="form-input"
                value={settingsData.minPayout}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="maxRadius">Maximum Service Radius (km)</label>
              <input
                id="maxRadius"
                type="number"
                name="maxRadius"
                className="form-input"
                value={settingsData.maxRadius}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="save-btn">
              Save Commission Settings
            </button>
          </form>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Platform Settings</h2>
          <div className="settings-options">
            <div className="settings-option">
              <div className="option-info">
                <span className="option-title">Maintenance Mode</span>
                <span className="option-desc">Put the platform in maintenance mode</span>
              </div>
              <button className="option-btn">Enable</button>
            </div>

            <div className="settings-option">
              <div className="option-info">
                <span className="option-title">Backup Data</span>
                <span className="option-desc">Create a backup of all platform data</span>
              </div>
              <button className="option-btn">Backup</button>
            </div>

            <div className="settings-option">
              <div className="option-info">
                <span className="option-title">Clear Cache</span>
                <span className="option-desc">Clear all cached data</span>
              </div>
              <button className="option-btn">Clear</button>
            </div>

            <div className="settings-option danger">
              <div className="option-info">
                <span className="option-title">Export Data</span>
                <span className="option-desc">Export all platform data as CSV</span>
              </div>
              <button className="option-btn">Export</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;