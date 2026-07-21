// fundis/Fundis.tsx
import React, { useState } from 'react';
import './Fundis.css';

const Fundis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filters = ['All', 'Pending', 'Verified', 'Rejected', 'Suspended'];

  return (
    <div className="fundis-page">
      <div className="page-header">
        <h1 className="page-title">Fundis</h1>
        <p className="page-subtitle">Manage all technicians on the platform</p>
      </div>

      <div className="fundis-controls">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search fundis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
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
      </div>

      <div className="fundis-table-wrapper">
        <div className="fundis-table">
          <div className="table-header">
            <span>Fundi</span>
            <span>Specialization</span>
            <span>Rating</span>
            <span>Status</span>
            <span>Jobs</span>
            <span>Actions</span>
          </div>
          <div className="table-body">
            <div className="empty-state">
              <span className="empty-icon">🔧</span>
              <p className="empty-text">No fundis found</p>
              <p className="empty-subtext">Fundis will appear here when they register</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fundis;