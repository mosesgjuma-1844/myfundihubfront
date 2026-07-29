// users/Users.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPut, type UserProfile } from '../../../../utils/api';
import './Users.css';

type AdminUser = UserProfile & {
  status?: string;
  joined?: string;
};

type UserEditForm = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  specialization: string;
  yearsOfExperience: number | '';
};

const Users: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [editForm, setEditForm] = useState<UserEditForm>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    phoneNumber: '',
    specialization: '',
    yearsOfExperience: '',
  });

  const filters = ['All', 'Active', 'Inactive', 'Suspended'];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await apiGet<{ users: AdminUser[] }>('/users/');
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(normalizedSearch) ||
        user.username.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        filter === 'all' ||
        (user.status && user.status.toLowerCase() === filter);

      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filter]);

  const openUserModal = async (mode: 'view' | 'edit', user: AdminUser) => {
    setModalLoading(true);
    setModalError('');

    try {
      const data = await apiGet<{ ok: boolean; user: UserProfile }>(`/user/?id=${user.id}`);
      const loadedUser: AdminUser = {
        ...data.user,
        status: user.status,
        joined: user.joined,
      };
      setSelectedUser(loadedUser);
      setModalMode(mode);

      if (mode === 'edit') {
        setEditForm({
          firstName: loadedUser.firstName || '',
          lastName: loadedUser.lastName || '',
          email: loadedUser.email || '',
          role: loadedUser.role || '',
          phoneNumber: loadedUser.phoneNumber || '',
          specialization: loadedUser.specialization || '',
          yearsOfExperience: loadedUser.yearsOfExperience || '',
        });
      }
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Unable to load user details.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewDetails = (user: AdminUser) => {
    openUserModal('view', user);
  };

  const handleEditUser = (user: AdminUser) => {
    openUserModal('edit', user);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalMode(null);
    setModalError('');
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    setModalLoading(true);
    setModalError('');

    try {
      const data = await apiPut<{ ok: boolean; user: UserProfile }>(
        `/user/?id=${selectedUser.id}`,
        {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email,
          role: editForm.role,
          phoneNumber: editForm.phoneNumber,
          specialization: editForm.specialization,
          yearsOfExperience: editForm.yearsOfExperience,
        }
      );

      const updatedUser: AdminUser = {
        ...data.user,
        status: selectedUser.status,
        joined: selectedUser.joined,
      };
      setUsers((current) => current.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setSelectedUser(updatedUser);
      setModalMode('view');
      setActionMessage(`Saved changes for ${updatedUser.username}.`);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Unable to save user changes.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleActive = async (userId: number) => {
    const existingUser = users.find((user) => user.id === userId);
    if (!existingUser) return;

    const nextStatus = existingUser.status?.toLowerCase() === 'inactive' ? 'active' : 'inactive';
    setActionMessage('');

    try {
      const data = await apiPut<{ ok: boolean; user: UserProfile }>(`/user/?id=${userId}`, {
        status: nextStatus,
      });

      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? {
                ...user,
                ...data.user,
                status: nextStatus,
              }
            : user
        )
      );

      setActionMessage(`User ${existingUser.username} has been ${nextStatus === 'active' ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update user status.');
    }
  };

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

      {actionMessage && <div className="action-message">{actionMessage}</div>}

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
            {loading ? (
              <div className="empty-state">
                <span className="empty-icon">⏳</span>
                <p className="empty-text">Loading users...</p>
              </div>
            ) : error ? (
              <div className="empty-state">
                <span className="empty-icon">⚠️</span>
                <p className="empty-text">{error}</p>
                <p className="empty-subtext">Refresh the page or try again later.</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">👤</span>
                <p className="empty-text">No users found</p>
                <p className="empty-subtext">Users will appear here when they register.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="table-row">
                  <span className="user-info">
                    <strong>{`${user.firstName} ${user.lastName}`.trim() || user.username}</strong>
                    <small className="user-username">{user.username}</small>
                  </span>
                  <span>{user.email}</span>
                  <span>{user.role}</span>
                  <span>{user.status || 'Unknown'}</span>
                  <span>{user.joined || 'N/A'}</span>
                  <span className="user-actions">
                    <button type="button" className="user-action-btn view" onClick={() => handleViewDetails(user)}>
                      View
                    </button>
                    <button type="button" className="user-action-btn edit" onClick={() => handleEditUser(user)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="user-action-btn deactivate"
                      onClick={() => handleToggleActive(user.id)}
                    >
                      {user.status?.toLowerCase() === 'inactive' ? 'Activate' : 'Deactivate'}
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedUser && modalMode && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-shell">
            <div className="modal-header">
              <div>
                <h2>{modalMode === 'view' ? 'User details' : 'Edit user'}</h2>
                <p className="modal-subtitle">{selectedUser.username}</p>
              </div>
              <button type="button" className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            {modalLoading ? (
              <div className="modal-loading">Loading user data…</div>
            ) : (
              <div className="modal-body">
                {modalError && <div className="modal-error">{modalError}</div>}

                {(modalMode === 'view' || modalMode === 'edit') && (
                  <div className="modal-grid">
                    <div className="modal-row">
                      <span className="modal-label">Full name</span>
                      <span className="modal-value">{`${selectedUser.firstName} ${selectedUser.lastName}`.trim() || 'N/A'}</span>
                    </div>
                    <div className="modal-row">
                      <span className="modal-label">Email</span>
                      {modalMode === 'view' ? (
                        <span className="modal-value">{selectedUser.email}</span>
                      ) : (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      )}
                    </div>
                    <div className="modal-row">
                      <span className="modal-label">Role</span>
                      {modalMode === 'view' ? (
                        <span className="modal-value">{selectedUser.role}</span>
                      ) : (
                        <input
                          type="text"
                          value={editForm.role}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                        />
                      )}
                    </div>
                    <div className="modal-row">
                      <span className="modal-label">Phone</span>
                      {modalMode === 'view' ? (
                        <span className="modal-value">{selectedUser.phoneNumber || 'N/A'}</span>
                      ) : (
                        <input
                          type="text"
                          value={editForm.phoneNumber}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                        />
                      )}
                    </div>
                    <div className="modal-row">
                      <span className="modal-label">Specialization</span>
                      {modalMode === 'view' ? (
                        <span className="modal-value">{selectedUser.specialization || 'N/A'}</span>
                      ) : (
                        <input
                          type="text"
                          value={editForm.specialization}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, specialization: e.target.value }))}
                        />
                      )}
                    </div>
                    <div className="modal-row">
                      <span className="modal-label">Experience</span>
                      {modalMode === 'view' ? (
                        <span className="modal-value">{selectedUser.yearsOfExperience}</span>
                      ) : (
                        <input
                          type="number"
                          value={editForm.yearsOfExperience}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              yearsOfExperience: e.target.value === '' ? '' : Number(e.target.value),
                            }))
                          }
                        />
                      )}
                    </div>
                    <div className="modal-row">
                      <span className="modal-label">Status</span>
                      <span className="modal-value">{selectedUser.status || 'Unknown'}</span>
                    </div>
                    <div className="modal-row">
                      <span className="modal-label">Joined</span>
                      <span className="modal-value">{selectedUser.joined || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="modal-btn secondary" onClick={closeModal}>
                Close
              </button>
              {modalMode === 'edit' && (
                <button type="button" className="modal-btn primary" onClick={handleSaveUser}>
                  Save changes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;