// availablejobs/AvailableJobs.tsx
import React, { useState } from 'react';
import './AvailableJobs.css';

const AvailableJobs: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const filters = ['All', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Masonry'];

  return (
    <div className="available-jobs-page">
      <div className="page-header">
        <h1 className="page-title">Available Jobs</h1>
        <p className="page-subtitle">Browse and accept jobs near your location</p>
      </div>

      <div className="filter-section">
        <div className="filter-tabs">
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f.toLowerCase() ? 'active' : ''}`}
              onClick={() => setFilter(f.toLowerCase())}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="location-badge">
          <span className="location-icon">📍</span>
          <span className="location-text">Nairobi, 5km radius</span>
        </div>
      </div>

      <div className="jobs-list">
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <p className="empty-text">No available jobs</p>
          <p className="empty-subtext">Check back later for new job requests</p>
        </div>
      </div>
    </div>
  );
};

export default AvailableJobs;