// mybookings/MyBookings.tsx
import React, { useEffect, useMemo, useState } from 'react';
import './MyBookings.css';
import { apiGet, type BookingSummary } from '../../../../utils/api';

interface StoredUser {
  id?: number;
  userId?: number;
  customerId?: number;
  username?: string;
  firstName?: string;
  lastName?: string;
}

const MyBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabs = ['All', 'Active', 'Completed', 'Cancelled'];

  useEffect(() => {
    const storedUser = localStorage.getItem('fundiUser');
    let parsedUser: StoredUser | null = null;

    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser) as StoredUser;
      } catch {
        parsedUser = null;
      }
    }

    const customerId = parsedUser?.id ?? parsedUser?.userId ?? parsedUser?.customerId ?? null;

    const fetchBookings = async () => {
      try {
        const bookingsPath = customerId ? `/bookings/?customer_id=${customerId}` : '/bookings/';
        const data = await apiGet<{ bookings: BookingSummary[] }>(bookingsPath);
        const allBookings = data.bookings || [];
        const filteredBookings = customerId
          ? allBookings.filter((booking) => booking.customer?.id === customerId)
          : allBookings;
        setBookings(filteredBookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load your bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const normalizedTab = activeTab.toLowerCase();
    return bookings.filter((booking) => {
      if (normalizedTab === 'active') {
        return booking.status !== 'completed' && booking.status !== 'cancelled';
      }
      if (normalizedTab === 'completed') {
        return booking.status === 'completed';
      }
      if (normalizedTab === 'cancelled') {
        return booking.status === 'cancelled';
      }
      return true;
    });
  }, [activeTab, bookings]);

  return (
    <div className="my-bookings-page">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">View and manage all your service bookings</p>
      </div>

      <div className="bookings-tabs">
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

      <div className="bookings-list">
        {loading && <div className="empty-state"><p className="empty-text">Loading your bookings…</p></div>}
        {error && <div className="empty-state"><p className="empty-text">{error}</p></div>}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p className="empty-text">No bookings in this category</p>
            <p className="empty-subtext">When you book a service, it will appear here</p>
          </div>
        )}
        {!loading && !error && filteredBookings.map((booking) => (
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
  );
};

export default MyBookings;