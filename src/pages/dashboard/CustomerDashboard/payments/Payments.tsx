// payments/Payments.tsx
import React, { useEffect, useState, useMemo } from 'react';
import './Payments.css';
import { apiGet } from '../../../../utils/api';

interface Payment {
  id: number;
  payment_id?: number;
  amount: number;
  status: string;
  payment_type: string;
  reference: string;
  booking_id: number;
  created_at: string;
  completed_at?: string;
}

interface PaymentsResponse {
  ok: boolean;
  count: number;
  page: number;
  page_size: number;
  payments: Payment[];
}

const Payments: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPaid, setTotalPaid] = useState(0);

  const filters = ['All', 'Successful', 'Pending', 'Processing', 'Failed'];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await apiGet<PaymentsResponse>('/payments/list/');
        if (response.ok) {
          setPayments(response.payments || []);
          const completed = (response.payments || []).filter(
            (p) => p.status === 'completed'
          );
          const total = completed.reduce((sum, p) => sum + p.amount, 0);
          setTotalPaid(total);
        } else {
          setError(response.ok ? 'Failed to load payments' : 'Error loading payments');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load payment history'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const normalizedFilter = activeFilter.toLowerCase();
      if (normalizedFilter === 'all') {
        return true;
      }
      return payment.status.toLowerCase() === normalizedFilter;
    });
  }, [activeFilter, payments]);

  const stats = {
    totalPaid,
    successful: payments.filter((p) => p.status === 'completed').length,
    pending: payments.filter((p) => p.status === 'pending').length,
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'failed':
        return 'failed';
      default:
        return 'default';
    }
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1 className="page-title">Payment History</h1>
        <p className="page-subtitle">View all your payment transactions</p>
      </div>

      <div className="payment-stats">
        <div className="stat-card">
          <span className="stat-label">TOTAL PAID</span>
          <span className="stat-value-amount">KES {totalPaid.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">SUCCESSFUL</span>
          <span className="stat-value-number">{stats.successful}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">PENDING</span>
          <span className="stat-value-number">{stats.pending}</span>
        </div>
      </div>

      <div className="payment-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter.toLowerCase() ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.toLowerCase())}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="payment-list">
        {loading && (
          <div className="empty-state">
            <p className="empty-text">Loading payments...</p>
          </div>
        )}
        {error && (
          <div className="empty-state">
            <p className="empty-text">{error}</p>
          </div>
        )}
        {!loading && !error && filteredPayments.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">💰</span>
            <p className="empty-text">No payments in this category</p>
          </div>
        )}
        {!loading && !error && filteredPayments.map((payment) => (
          <div key={payment.id} className="payment-item">
            <div className="payment-info">
              <p className="payment-type">
                {payment.payment_type === 'callout_fee' ? 'Callout Fee' : 'Service Payment'}
              </p>
              <p className="payment-reference">Ref: {payment.reference}</p>
              <p className="payment-date">{formatDate(payment.created_at)}</p>
            </div>
            <div className="payment-amount">
              <p className="amount">KES {payment.amount.toLocaleString()}</p>
              <span className={`payment-status ${getStatusColor(payment.status)}`}>
                {payment.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments;