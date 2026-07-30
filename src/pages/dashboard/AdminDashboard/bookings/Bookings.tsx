import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [assignment, setAssignment] = useState<Record<number, string>>({});
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const columnOptions = useMemo(
    () => [
      { key: 'customer', label: 'Customer' },
      { key: 'phone', label: 'Phone' },
      { key: 'service', label: 'Service' },
      { key: 'location', label: 'Town / Estate' },
      { key: 'landmark', label: 'Nearest Landmark' },
      { key: 'status', label: 'Status' },
      { key: 'assign', label: 'Assign To' },
      { key: 'fundi', label: 'Fundi' },
      { key: 'amount', label: 'Amount' },
      { key: 'actions', label: 'Actions' },
    ],
    []
  );

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const getTimestamp = (booking: BookingSummary) => {
        if (booking.createdAt) {
          return new Date(booking.createdAt).getTime();
        }

        const datePart = booking.createdAtDate || booking.scheduledDate;
        if (!datePart) {
          return Number.NEGATIVE_INFINITY;
        }

        const timePart = booking.createdAtTime || booking.scheduledTime || '00:00:00';
        return new Date(`${datePart}T${timePart}`).getTime();
      };

      const aTime = getTimestamp(a);
      const bTime = getTimestamp(b);
      if (aTime === bTime) return b.id - a.id;
      return aTime - bTime;
    });
  }, [bookings]);

  const filters = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (serviceFilter) params.set('serviceType', serviceFilter);
    if (technicianFilter) params.set('technicianId', technicianFilter);
    if (dateFilter) params.set('date', dateFilter);
    if (searchTerm) params.set('search', searchTerm);
    return params.toString();
  }, [statusFilter, serviceFilter, technicianFilter, dateFilter, searchTerm]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [bookings, hiddenColumns]);

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

  const toggleColumn = (columnKey: string) => {
    setHiddenColumns((current) =>
      current.includes(columnKey) ? current.filter((key) => key !== columnKey) : [...current, columnKey]
    );
  };

  const isColumnHidden = (columnKey: string) => hiddenColumns.includes(columnKey);

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

        <div className="filter-group">
          <label htmlFor="dateFilter">Application Date</label>
          <input
            id="dateFilter"
            name="dateFilter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
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

      <div className="column-toggle-bar" role="toolbar" aria-label="Show or hide columns">
        {columnOptions.map((column) => (
          <label key={column.key} className="column-toggle-option">
            <input
              type="checkbox"
              checked={!hiddenColumns.includes(column.key)}
              onChange={() => toggleColumn(column.key)}
            />
            <span>{column.label}</span>
          </label>
        ))}
      </div>

      <div className="bookings-table-wrapper">
        <div className="bookings-table-scroll" ref={scrollContainerRef}>
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
                  {!isColumnHidden('customer') && <th className="col-customer">Customer</th>}
                  {!isColumnHidden('phone') && <th className="col-phone">Phone</th>}
                  {!isColumnHidden('service') && <th className="col-service">Service</th>}
                  {!isColumnHidden('location') && <th className="col-location">Town / Estate</th>}
                  {!isColumnHidden('application') && <th className="col-application">Applied On</th>}
                  {!isColumnHidden('landmark') && <th className="col-landmark">Nearest Landmark</th>}
                  {!isColumnHidden('status') && <th className="col-status">Status</th>}
                  {!isColumnHidden('assign') && <th className="col-assign">Assign To</th>}
                  {!isColumnHidden('fundi') && <th className="col-fundi">Fundi</th>}
                  {!isColumnHidden('amount') && <th className="col-amount">Amount</th>}
                  {!isColumnHidden('actions') && <th className="col-actions">Actions</th>}
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
                  const customerPhone = booking.customerPhoneNumber || booking.customer?.phoneNumber || 'Not provided';
                  const serviceLabel = booking.serviceType || booking.serviceTypeKey || 'Unknown';
                  const locationLabel = booking.townOrEstate || booking.location || 'Not provided';
                  const applicationDate = booking.createdAtDate || booking.createdAt?.split('T')[0] || booking.scheduledDate || 'Not set';
                  const applicationTime = booking.createdAtTime || booking.createdAt?.split('T')[1]?.slice(0, 5) || booking.scheduledTime || 'Not set';
                  const landmarkLabel = booking.landmark || 'Not provided';
                  const technicianLabel = booking.assignedTechnician?.name || 'Unassigned';

                  return (
                    <tr key={booking.id}>
                      <td className="col-id">#{booking.id}</td>
                      {!isColumnHidden('customer') && <td className="col-customer">{customerName}</td>}
                      {!isColumnHidden('phone') && <td className="col-phone">{customerPhone}</td>}
                      {!isColumnHidden('service') && <td className="col-service">{serviceLabel}</td>}
                      {!isColumnHidden('location') && <td className="col-location">{locationLabel}</td>}
                      {!isColumnHidden('application') && <td className="col-application"><div>{applicationDate}</div><div className="application-time">{applicationTime}</div></td>}
                      {!isColumnHidden('landmark') && <td className="col-landmark">{landmarkLabel}</td>}
                      {!isColumnHidden('status') && <td className="col-status"><span className="status-text">{booking.status}</span></td>}
                      {!isColumnHidden('assign') && <td className="col-assign">
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
                      </td>}
                      {!isColumnHidden('fundi') && <td className="col-fundi">{technicianLabel}</td>}
                      {!isColumnHidden('amount') && <td className="col-amount">KSh {booking.estimatedCost?.toLocaleString() || '0'}</td>}
                      {!isColumnHidden('actions') && <td className="col-actions">
                        <button
                          className="assign-btn"
                          onClick={() => handleAssign(booking.id)}
                          disabled={!canAssign || !currentSelection || String(booking.assignedTechnician?.id) === currentSelection}
                        >
                          {booking.assignedTechnician ? 'Reassign' : 'Assign'}
                        </button>
                      </td>}
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
