// cusdashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CusDashboard.css';
import { apiGet, type BookingSummary } from '../../../../utils/api';

interface ServiceCategory {
  key: string;
  label: string;
  name?: string;
  description: string;
  icon: string;
}

interface DashboardResponse {
  stats: Array<{ label: string; value: string }>;
  serviceCategories: ServiceCategory[];
}

interface StoredUser {
  id?: number;
  userId?: number;
  customerId?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  role?: string;
}

const CusDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeJobTab, setActiveJobTab] = useState<'active' | 'past'>('active');
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [stats, setStats] = useState<DashboardResponse['stats']>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('fundiUser');
    let parsedUser: StoredUser | null = null;

    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser) as StoredUser;
        const fullName = [parsedUser.firstName, parsedUser.lastName].filter(Boolean).join(' ').trim();
        setUserName(fullName || parsedUser.username || 'Customer');
      } catch {
        setUserName('Customer');
      }
    } else {
      setUserName('Customer');
    }

    const customerId = parsedUser?.id ?? parsedUser?.userId ?? parsedUser?.customerId ?? null;

    const fetchDashboard = async () => {
      try {
        const data = await apiGet<DashboardResponse>('/dashboard/customer/');
        setStats(data.stats || []);
        setServiceCategories(data.serviceCategories || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard data');
      }
    };

    const fetchBookings = async () => {
      try {
        const bookingsPath = customerId ? `/bookings/?customer_id=${customerId}` : '/bookings/';
        const data = await apiGet<{ bookings: BookingSummary[] }>(bookingsPath);
        const allBookings = data.bookings || [];
        const filteredBookings = customerId
          ? allBookings.filter((booking) => {
              const customer = booking.customer;
              const matchesCustomerId = customer?.id === customerId;
              const matchesCustomerName = !!parsedUser?.username && customer?.name?.toLowerCase() === parsedUser.username.toLowerCase();
              return matchesCustomerId || matchesCustomerName;
            })
          : [];

        setBookings(filteredBookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
    fetchBookings();
  }, []);

  const activeBookings = bookings.filter((booking) => booking.status !== 'completed' && booking.status !== 'cancelled');
  const pastBookings = bookings.filter((booking) => booking.status === 'completed' || booking.status === 'cancelled');

  const greetingText = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero-card">
        <div className="dashboard-greeting">
          <p className="greeting-kicker">Customer dashboard</p>
          <h1 className="greeting-title">{greetingText()}, {userName}</h1>
          <p className="greeting-subtitle">Here’s a quick view of your bookings and the services you can request today.</p>
        </div>
        <div className="hero-highlight">
          <span className="hero-badge">Live updates</span>
          <p className="hero-highlight-text">{bookings.length} service request{bookings.length === 1 ? '' : 's'} tracked so far.</p>
          <button type="button" className="hero-cta-btn" onClick={() => navigate('/customer-dashboard/book-service')}>
            Book Service
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="services-section">
        <div className="section-heading">
          <h2 className="section-title">What do you need fixed?</h2>
          <p className="section-subtitle">Choose a service and book it in minutes.</p>
        </div>
        <div className="services-grid">
          {serviceCategories.map((service, index) => (
            <button key={index} className="service-card">
              <span className="service-icon">{service.icon}</span>
              <span className="service-name">{service.name ?? service.label}</span>
              <span className="service-description">{service.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="jobs-section">
        <div className="jobs-tabs">
          <button 
            className={`tab-btn ${activeJobTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveJobTab('active')}
          >
            ACTIVE JOB
          </button>
          <button 
            className={`tab-btn ${activeJobTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveJobTab('past')}
          >
            PAST JOBS
          </button>
        </div>
        <div className="jobs-content">
          {loading && <p className="empty-state">Loading your bookings…</p>}
          {error && <p className="empty-state">{error}</p>}
          {!loading && !error && (activeJobTab === 'active' ? activeBookings : pastBookings).length === 0 && (
            <p className="empty-state">No jobs in this category</p>
          )}
          {!loading && !error && (activeJobTab === 'active' ? activeBookings : pastBookings).map((booking) => (
            <div key={booking.id} className="booking-card">
              <div>
                <p className="booking-title">{booking.serviceType}</p>
                <p className="booking-location">{booking.location}</p>
                <p className="booking-meta">{booking.description || 'No description provided'}</p>
              </div>
              <div className="booking-status-block">
                <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                <span className="booking-time">{booking.scheduledDate || 'Today'} • {booking.scheduledTime || 'Now'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-link">
        <span className="settings-text">SETTINGS</span>
      </div>
    </div>
  );
};

export default CusDashboard;