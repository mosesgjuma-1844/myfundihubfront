import { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost, type BookingSummary } from '../../../../utils/api';
import './Bookings.css';

type TechnicianSummary = {
  id: number;
  name: string;
  specialization: string;
};

const statusOptions = ['pending', 'assigned', 'completed', 'cancelled'];
const serviceOptions = ['electrical', 'plumbing', 'carpentry', 'installation', 'appliance-repair'];

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianSummary[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [assignment, setAssignment] = useState<Record<number, string>>({});

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const aHas = Boolean(a.scheduledDate);
      const bHas = Boolean(b.scheduledDate);
      if (!aHas && !bHas) return b.id - a.id;
      if (!aHas) return 1;
      if (!bHas) return -1;

      const aTime = `${a.scheduledDate}T${a.scheduledTime ?? '00:00:00'}`;
      const bTime = `${b.scheduledDate}T${b.scheduledTime ?? '00:00:00'}`;
      const at = new Date(aTime).getTime();
      const bt = new Date(bTime).getTime();
      if (at === bt) return b.id - a.id;
      return at - bt; // earliest first
    });
  }, [bookings]);

  const filters = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (serviceFilter) params.set('serviceType', serviceFilter);
    if (technicianFilter) params.set('technicianId', technicianFilter);
    if (searchTerm) params.set('search', searchTerm);
    return params.toString();
  }, [statusFilter, serviceFilter, technicianFilter, searchTerm]);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await apiGet<{ technicians: TechnicianSummary[] }>('/technicians/');
        setTechnicians(data.technicians || []);
      } catch {
        setTechnicians([]);
      }
    };

    fetchTechnicians();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      try {
        const path = `/bookings/${filters ? `?${filters}` : ''}`;
        const data = await apiGet<{ bookings: BookingSummary[] }>(path);
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filters]);

  const handleAssign = async (bookingId: number) => {
    const selectedTechnicianId = assignment[bookingId];
    if (!selectedTechnicianId) return;

    try {
      const data = await apiPost<{ booking: BookingSummary }>('/bookings/assign/', {
        bookingId,
        technicianId: Number(selectedTechnicianId),
      });
      setBookings((current) =>
        current.map((booking) => (booking.id === data.booking.id ? data.booking : booking))
      );
      setSuccessMessage('Booking assigned successfully.');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to assign booking.');
      setSuccessMessage('');
    }
  };

  const handleSelectionChange = (bookingId: number, value: string) => {
    setAssignment((current) => ({ ...current, [bookingId]: value }));
  };

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">View, filter and assign bookings to technicians.</p>
        </div>
        <div className="status-summary">
          {successMessage && <span className="status success">{successMessage}</span>}
          {error && <span className="status error">{error}</span>}
        </div>
      </div>

      <div className="bookings-filters">
        <div className="filter-group">
          <label htmlFor="statusFilter">Status</label>
          <select id="statusFilter" name="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="serviceFilter">Service</label>
          <select id="serviceFilter" name="serviceFilter" value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
            <option value="">All services</option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'appliance-repair' ? 'Appliance Repair' : option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="technicianFilter">Technician</label>
          <select id="technicianFilter" name="technicianFilter" value={technicianFilter} onChange={(e) => setTechnicianFilter(e.target.value)}>
            <option value="">All technicians</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id.toString()}>{tech.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group search-group">
          <label htmlFor="searchTerm">Search</label>
          <input
            id="searchTerm"
            name="searchTerm"
            type="search"
            placeholder="Search by customer, location or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bookings-table-wrapper">
        <div className="bookings-table-scroll">
          {loading ? (
            <div className="empty-state">
              <span className="empty-icon">⏳</span>
              <p className="empty-text">Loading bookings…</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p className="empty-text">No bookings match your filters.</p>
              <p className="empty-subtext">Try clearing filters or updating your search.</p>
            </div>
          ) : (
            <table className="bookings-table" role="table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-customer">Customer</th>
                  <th className="col-phone">Phone</th>
                  <th className="col-service">Service</th>
                  <th className="col-location">Town / Estate</th>
                  <th className="col-landmark">Nearest Landmark</th>
                  <th className="col-status">Status</th>
                  <th className="col-assign">Assign To</th>
                  <th className="col-fundi">Fundi</th>
                  <th className="col-amount">Amount</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking) => {
                  const canAssign = booking.canAssignTechnician !== false;
                  const currentSelection =
                    assignment[booking.id]?.toString() ??
                    booking.assignedTechnicianId?.toString() ??
                    booking.assignedTechnician?.id?.toString() ??
                    '';
                  const customerName = booking.customerName || booking.customer?.name || 'Unknown customer';
                  const customerPhone = booking.customerPhoneNumber || 'Not provided';
                  const serviceLabel = booking.serviceType || booking.serviceTypeKey || 'Unknown';
                  const locationLabel = booking.townOrEstate || booking.location || 'Not provided';
                  const landmarkLabel = booking.landmark || 'Not provided';
                  const technicianLabel = booking.assignedTechnician?.name || 'Unassigned';

                  return (
                    <tr key={booking.id}>
                      <td className="col-id">#{booking.id}</td>
                      <td className="col-customer">{customerName}</td>
                      <td className="col-phone">{customerPhone}</td>
                      <td className="col-service">{serviceLabel}</td>
                      <td className="col-location">{locationLabel}</td>
                      <td className="col-landmark">{landmarkLabel}</td>
                      <td className="col-status"><span className={`status-pill ${booking.status}`}>{booking.status}</span></td>
                      <td className="col-assign">
                        <select
                          value={currentSelection}
                          onChange={(e) => handleSelectionChange(booking.id, e.target.value)}
                          disabled={!canAssign}
                        >
                          <option value="">{canAssign ? 'Select technician' : 'Not available'}</option>
                          {technicians.map((tech) => (
                            <option key={tech.id} value={tech.id.toString()}>{tech.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="col-fundi">{technicianLabel}</td>
                      <td className="col-amount">KSh {booking.estimatedCost?.toLocaleString() || '0'}</td>
                      <td className="col-actions">
                        <button
                          className="assign-btn"
                          onClick={() => handleAssign(booking.id)}
                          disabled={!canAssign || !currentSelection || String(booking.assignedTechnician?.id) === currentSelection}
                        >
                          {booking.assignedTechnician ? 'Reassign' : 'Assign'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
