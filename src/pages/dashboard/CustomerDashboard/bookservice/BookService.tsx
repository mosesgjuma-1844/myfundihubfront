// bookservice/BookService.tsx
import React, { useEffect, useState } from 'react';
import './BookService.css';
import { APIDomain } from '../../../../utils/APIDomain';

const BookService: React.FC = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [county, setCounty] = useState('');
  const [townOrEstate, setTownOrEstate] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [description, setDescription] = useState('');
  const [serviceWindow] = useState<'immediate' | 'scheduled'>('immediate');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [bookingSummary, setBookingSummary] = useState<any>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        const parsedUser = JSON.parse(rawUser);
        if (parsedUser?.id) {
          setCustomerId(Number(parsedUser.id));
        }
      }
    } catch {
      setCustomerId(null);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const estimateCost = (selectedService: string) => {
    switch (selectedService) {
      case 'electrical':
        return 2500;
      case 'plumbing':
        return 3000;
      case 'carpentry':
        return 2200;
      case 'installation':
        return 2800;
      case 'appliance-repair':
        return 2600;
      default:
        return 0;
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatusType('error');
      setStatusMessage('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setLocation(`Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}`);
      },
      () => {
        setStatusType('error');
        setStatusMessage('Unable to access your location. Please enter it manually.');
      }
    );
  };

  const today = new Date();
  const todayDate = today.toISOString().split('T')[0];
  const currentTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

  const isPastDateTime = (selectedDate: string, selectedTime: string) => {
    if (!selectedDate) return true;

    if (selectedDate < todayDate) {
      return true;
    }

    if (selectedDate === todayDate && selectedTime && selectedTime < currentTime) {
      return true;
    }

    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (isPastDateTime(scheduledDate, scheduledTime)) {
      setStatusType('error');
      setStatusMessage('Please select a valid date and time in the present or future.');
      return;
    }

    setStatusMessage('');
    setStatusType('');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${APIDomain}/bookings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerId ?? undefined,
          serviceType,
          location,
          county,
          townOrEstate,
          landmark,
          latitude,
          longitude,
          description,
          scheduledDate,
          scheduledTime,
          serviceWindow,
          estimatedCost: estimateCost(serviceType),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setStatusType('error');
        setStatusMessage(result.message || 'Booking failed.');
        return;
      }

      setStatusType('success');
      setStatusMessage(result.message || 'Booking created successfully.');
      setBookingSummary(result.booking);
    } catch (error) {
      setStatusType('error');
      setStatusMessage('Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-service-page">
      <div
        className="page-header"
        style={isMobile ? { marginTop: '52px' } : undefined}
      >
        <h1 className="page-title">Book a Service</h1>
        <p className="page-subtitle">Fill in the details below to request a service</p>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Service Type</label>
          <select 
            className="form-select" 
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
          >
            <option value="">Select a service</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="carpentry">Carpentry</option>
            <option value="appliance-repair">Appliance Repair</option>
            <option value="installation">Installation</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Service Location</label>
          <div className="location-input-wrapper">
            <input
              type="text"
              className="form-input"
              placeholder="Enter your street/building address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <button type="button" className="location-btn" onClick={handleUseCurrentLocation}>
              📍 Detect
            </button>
          </div>

          <div className="address-grid">
            <div className="form-group">
              <label>County *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Nairobi"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Town / Estate *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Kilimani"
                value={townOrEstate}
                onChange={(e) => setTownOrEstate(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Nearest Landmark</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Opposite Yaya Centre"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>
          </div>

          {latitude !== null && longitude !== null && (
            <div className="gps-card">
              <h4>📍 GPS Location</h4>

              <p>
                <strong>Latitude:</strong> {latitude.toFixed(6)}
              </p>

              <p>
                <strong>Longitude:</strong> {longitude.toFixed(6)}
              </p>
            </div>
          )}

          <small className="location-note">
            The more accurate your location, the easier it is for us to assign the
            nearest verified fundi.
          </small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={scheduledDate}
              min={todayDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input
              type="time"
              className="form-input"
              value={scheduledTime}
              min={scheduledDate === todayDate ? currentTime : undefined}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="Describe what you need fixed..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {statusMessage && (
          <div className={`status-message ${statusType}`}>
            {statusMessage}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Find Technician →'}
        </button>
      </form>

      {bookingSummary && (
        <div className="booking-summary-card">
          <h2 className="summary-title">Booking Summary</h2>
          <p><strong>Service:</strong> {bookingSummary.serviceType}</p>
          <p><strong>Location:</strong> {bookingSummary.location}</p>
          <p><strong>Window:</strong> {bookingSummary.serviceWindow}</p>
          <p><strong>Date:</strong> {bookingSummary.scheduledDate || 'Today'}</p>
          <p><strong>Time:</strong> {bookingSummary.scheduledTime || 'Now'}</p>
          <p><strong>Estimated Cost:</strong> KES {bookingSummary.estimatedCost}</p>
        </div>
      )}
    </div>
  );
};

export default BookService;