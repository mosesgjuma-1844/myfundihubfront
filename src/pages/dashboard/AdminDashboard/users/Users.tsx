// users/Users.tsx
import React, { useState } from 'react';
import './Users.css';

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filters = ['All', 'Active', 'Inactive', 'Suspended'];

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">Manage all platform users</p>
      </div>

      <div className="users-controls">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
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

      <div className="users-table-wrapper">
        <div className="users-table">
          <div className="table-header">
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
          <div className="table-body">
            <div className="empty-state">
              <span className="empty-icon">👤</span>
              <p className="empty-text">No users found</p>
              <p className="empty-subtext">Users will appear here when they register</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;