// settings/Settings.tsx
import React, { useState } from 'react';
import './Settings.css';

const Settings: React.FC = () => {
  const [profileData, setProfileData] = useState({
    name: 'Emmanuel M.',
    email: 'emmanuel@email.com',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    specialization: 'Plumbing',
    experience: '5 years',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

            <div className="form-group">
              <label className="form-label">Specialization</label>
              <select
                name="specialization"
                className="form-input"
                value={profileData.specialization}
                onChange={handleChange}
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Painting">Painting</option>
                <option value="Masonry">Masonry</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="text"
                name="experience"
                className="form-input"
                value={profileData.experience}
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
                <span className="option-title">Change Password</span>
                <span className="option-desc">Update your password to keep your account secure</span>
              </div>
              <button className="option-btn">Update</button>
            </div>

            <div className="settings-option">
              <div className="option-info">
                <span className="option-title">Availability</span>
                <span className="option-desc">Set your availability hours and schedule</span>
              </div>
              <button className="option-btn">Manage</button>
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
                <span className="option-title">Service Radius</span>
                <span className="option-desc">Set how far you're willing to travel for jobs</span>
              </div>
              <button className="option-btn">Update</button>
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