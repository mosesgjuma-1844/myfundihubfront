// settings/Settings.tsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './Settings.css';

type ThemeMode = 'dark' | 'light';

type DashboardOutletContext = {
  theme: ThemeMode;
  setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>;
};

const Settings: React.FC = () => {
  const { theme, setTheme } = useOutletContext<DashboardOutletContext>();
  const [profileData, setProfileData] = useState({
    name: 'Guest',
    email: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('fundiUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const fullName = [parsedUser.firstName, parsedUser.lastName].filter(Boolean).join(' ').trim();
        setProfileData({
          name: fullName || parsedUser.username || 'Guest',
          email: parsedUser.email || '',
          phone: '',
          location: '',
        });
      } catch {
        setProfileData((prev) => prev);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h2 className="section-title">Profile Information</h2>
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={profileData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={profileData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={profileData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={profileData.location}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </form>
        </div>

        <div className="settings-section">
          <h2 className="section-title">Account Settings</h2>
          <div className="settings-options">
            <div className="settings-option">
              <div className="option-info">
                <span className="option-title">App theme</span>
                <span className="option-desc">Switch between dark and bright appearance for the dashboard</span>
              </div>
              <div className="theme-toggle-group">
                <button
                  type="button"
                  className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  Dark
                </button>
                <button
                  type="button"
                  className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  Bright
                </button>
              </div>
            </div>

            <div className="settings-option">
              <div className="option-info">
                <span className="option-title">Change Password</span>
                <span className="option-desc">Update your password to keep your account secure</span>
              </div>
              <button className="option-btn">Update</button>
            </div>

            <div className="settings-option">
              <div className="option-info">
                <span className="option-title">Notifications</span>
                <span className="option-desc">Manage your notification preferences</span>
              </div>
              <button className="option-btn">Manage</button>
            </div>

            <div className="settings-option">
              <div className="option-info">
                <span className="option-title">Privacy</span>
                <span className="option-desc">Control your privacy settings</span>
              </div>
              <button className="option-btn">Manage</button>
            </div>

            <div className="settings-option danger">
              <div className="option-info">
                <span className="option-title">Delete Account</span>
                <span className="option-desc">Permanently delete your account and all data</span>
              </div>
              <button className="option-btn danger-btn">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;