// pages/PaymentVerification/PaymentVerification.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './PaymentVerification.css';

const PaymentVerification: React.FC = () => {
  const { reference: routeReference } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Processing your payment...');
  const [details, setDetails] = useState<{ reference?: string | null } | null>(null);

  useEffect(() => {
    const reference = routeReference || searchParams.get('reference') || searchParams.get('trxref');

    if (!reference) {
      setStatus('failed');
      setMessage('Payment reference not found');
      return;
    }

    setDetails({ reference });
    setStatus('pending');
    setMessage('Your payment is being processed. We will update your booking automatically once Paystack confirms it.');

    const redirectTimer = window.setTimeout(() => {
      navigate('/customer-dashboard/my-bookings');
    }, 4000);

    return () => window.clearTimeout(redirectTimer);
  }, [navigate, routeReference, searchParams]);

  return (
    <div className="payment-verification-page">
      <div className="verification-container">
        {status === 'pending' && (
          <div className="verification-state verifying">
            <div className="spinner"></div>
            <h1>{message}</h1>
            <p>Please keep this page open while the payment is being confirmed.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verification-state success">
            <div className="success-icon">✓</div>
            <h1>{message}</h1>
            <p>Your booking is now active and visible to technicians</p>
            {details && (
              <div className="payment-details">
                <p>
                  <strong>Reference:</strong> {details.reference}
                </p>
              </div>
            )}
            <p className="redirect-text">
              Redirecting to your bookings in 3 seconds...
            </p>
            <button
              className="action-btn"
              onClick={() => navigate('/customer-dashboard/my-bookings')}
            >
              View My Bookings
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="verification-state failed">
            <div className="error-icon">✕</div>
            <h1>{message}</h1>
            <p>Your payment could not be verified</p>
            {details && (
              <div className="payment-details">
                <p>
                  <strong>Reference:</strong> {details.reference}
                </p>
              </div>
            )}
            <div className="action-buttons">
              <button
                className="action-btn primary"
                onClick={() => navigate('/customer-dashboard/my-bookings')}
              >
                Back to Bookings
              </button>
              <button
                className="action-btn secondary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;
