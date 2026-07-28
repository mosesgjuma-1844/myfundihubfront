// pages/PaymentVerification/PaymentVerification.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiGet } from '../../utils/api';
import './PaymentVerification.css';

const PaymentVerification: React.FC = () => {
  const { reference: routeReference } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [message, setMessage] = useState('Processing your payment...');
  const [details, setDetails] = useState<{ reference?: string | null } | null>(null);

  useEffect(() => {
    const paystackReference = searchParams.get('reference') || searchParams.get('trxref') || routeReference;

    if (!paystackReference) {
      setStatus('failed');
      setMessage('Payment reference not found. Please try again or contact support.');
      return;
    }

    setDetails({ reference: paystackReference });
    setStatus('pending');
    setMessage('Verifying your payment with Paystack. Please keep this page open.');

    const verifyPayment = async () => {
      try {
        const response = await apiGet<{ ok: boolean; status: string; message: string }>(
          `/payments/verify/${encodeURIComponent(paystackReference)}/`
        );

        if (response.ok) {
          setStatus('success');
          setMessage('Payment verified successfully. Your booking is now active.');
        } else {
          setStatus('failed');
          setMessage(response.message || 'Payment could not be verified yet.');
        }
      } catch (error) {
        setStatus('failed');
        setMessage(
          error instanceof Error
            ? error.message
            : 'Payment verification failed. Please refresh or check your bookings later.'
        );
      }
    };

    verifyPayment();

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
