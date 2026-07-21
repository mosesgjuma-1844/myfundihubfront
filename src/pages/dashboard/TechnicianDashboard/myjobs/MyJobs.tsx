// myjobs/MyJobs.tsx
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { apiGet } from '../../../../utils/api';
import 'leaflet/dist/leaflet.css';
import './MyJobs.css';

const LeafletMapContainer = MapContainer as unknown as React.ComponentType<{
  center: LatLngExpression;
  zoom: number;
  scrollWheelZoom: boolean;
  className: string;
  children: React.ReactNode;
}>;

const LeafletTileLayer = TileLayer as unknown as React.ComponentType<{
  attribution?: string;
  url: string;
}>;

const LeafletMarker = Marker as unknown as React.ComponentType<{
  position: LatLngExpression;
}>;

type BookingSummary = {
  id: number;
  serviceType: string;
  location: string;
  county: string;
  townOrEstate: string;
  landmark: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  scheduledDate: string | null;
  scheduledTime: string | null;
  estimatedCost: number;
  customer: {
    id: number;
    name: string;
  } | null;
};

const MyJobs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [jobs, setJobs] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tabs = ['Active', 'In Progress', 'Completed', 'Cancelled'];

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiGet<{ bookings: BookingSummary[] }>('/bookings/');
        setJobs(data.bookings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load your jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const visibleJobs = jobs.filter((job) => {
    const status = job.status.toLowerCase();
    if (activeTab === 'active') return status !== 'completed' && status !== 'cancelled';
    if (activeTab === 'in progress') return status === 'assigned';
    if (activeTab === 'completed') return status === 'completed';
    if (activeTab === 'cancelled') return status === 'cancelled';
    return true;
  });

  return (
    <div className="my-jobs-page">
      <div className="page-header">
        <h1 className="page-title">My Jobs</h1>
        <p className="page-subtitle">View and manage all your accepted jobs</p>
      </div>

      <div className="jobs-tabs">
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

      <div className="jobs-list">
        {loading ? (
          <div className="empty-state">
            <span className="empty-icon">⏳</span>
            <p className="empty-text">Loading your jobs…</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <span className="empty-icon">⚠️</span>
            <p className="empty-text">{error}</p>
          </div>
        ) : visibleJobs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <p className="empty-text">No jobs in this category</p>
            <p className="empty-subtext">Assigned jobs will appear here</p>
          </div>
        ) : (
          visibleJobs.map((job) => {
            const hasCoordinates = typeof job.latitude === 'number' && typeof job.longitude === 'number';
            const position: LatLngExpression = hasCoordinates
              ? [job.latitude as number, job.longitude as number]
              : [0.3476, 32.5825];

            return (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3>#{job.id} {job.serviceType}</h3>
                    <p className="job-customer">{job.customer?.name || 'Unknown customer'}</p>
                  </div>
                  <span className={`status-pill ${job.status}`}>{job.status}</span>
                </div>

                <div className="job-card-body">
                  <div className="job-details">
                    <div className="detail-row">
                      <span className="detail-label">County</span>
                      <span>{job.county || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Town</span>
                      <span>{job.townOrEstate || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Estate</span>
                      <span>{job.location || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Landmark</span>
                      <span>{job.landmark || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Scheduled</span>
                      <span>{job.scheduledDate || 'Not set'} {job.scheduledTime ? `at ${job.scheduledTime}` : ''}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Amount</span>
                      <span>KSh {job.estimatedCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="job-map-card">
                    <div className="job-map-header">Location map</div>
                    <LeafletMapContainer center={position} zoom={13} scrollWheelZoom={false} className="job-map">
                      <LeafletTileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LeafletMarker position={position} />
                    </LeafletMapContainer>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyJobs;