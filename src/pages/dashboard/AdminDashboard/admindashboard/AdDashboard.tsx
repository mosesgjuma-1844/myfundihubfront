// admindashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { apiGet } from '../../../../utils/api';
import './AdDashboard.css';

type AdminStat = {
  label: string;
  value: string;
};

type RecentActivity = {
  id: number;
  action: string;
  time: string;
  status: string;
};

type QuickAction = {
  name: string;
};

type AdminDashboardPayload = {
  stats: AdminStat[];
  recentActivities: RecentActivity[];
  quickActions: QuickAction[];
};

const AdDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStat[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiGet<AdminDashboardPayload>('/dashboard/admin/');
        setStats(data.stats || []);
        setRecentActivities(data.recentActivities || []);
        setQuickActions(data.quickActions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-greeting">
          <h1 className="greeting-title">GOOD MORNING, ADMIN</h1>
          <p className="greeting-subtitle">Welcome to your admin dashboard</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading dashboard data…</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="stat-card">
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="recent-section">
              <h2 className="section-title">Recent Activity</h2>
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-dot ${activity.status}`}></div>
                    <div className="activity-content">
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-actions-section">
              <h2 className="section-title">Quick Actions</h2>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <button key={`${action.name}-${index}`} className="quick-action-btn">
                    <span className="action-name">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdDashboard;