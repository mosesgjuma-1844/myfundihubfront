// pages/PaymentVerification/PaymentVerification.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './PaymentVerification.css';
import { apiPost } from '../../utils/api';

interface VerifyPaymentResponse {
  ok: boolean;
  payment_id: number;
  status: string;
  reference: string;
  message: string;
}

const PaymentVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get('reference');

        if (!reference) {
          setStatus('failed');
          setMessage('Payment reference not found');
          return;
        }

        const response = await apiPost<VerifyPaymentResponse>(
          `/payments/verify/${reference}/`,
          {}
        );

        if (response.ok && response.status === 'completed') {
          setStatus('success');
          setMessage('Payment verified successfully!');
          setDetails(response);

          // Redirect to bookings after 3 seconds
          setTimeout(() => {
            navigate('/customer-dashboard?tab=my-bookings');
          }, 3000);
        } else {
          setStatus('failed');
          setMessage(response.message || 'Payment verification failed');
          setDetails(response);
        }
      } catch (error) {
        setStatus('failed');
        setMessage(
          error instanceof Error ? error.message : 'Payment verification error'
        );
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div className="payment-verification-page">
      <div className="verification-container">
        {status === 'verifying' && (
          <div className="verification-state verifying">
            <div className="spinner"></div>
            <h1>{message}</h1>
            <p>Please don't close this window</p>
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
                  <strong>Payment ID:</strong> {details.payment_id}
                </p>
                <p>
                  <strong>Reference:</strong> {details.reference}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="status-badge completed">
                    {details.status}
                  </span>
                </p>
              </div>
            )}
            <p className="redirect-text">
              Redirecting to your bookings in 3 seconds...
            </p>
            <button
              className="action-btn"
              onClick={() => navigate('/customer-dashboard?tab=my-bookings')}
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
                  <strong>Status:</strong>{' '}
                  <span className="status-badge failed">
                    {details.status || 'Failed'}
                  </span>
                </p>
              </div>
            )}
            <div className="action-buttons">
              <button
                className="action-btn primary"
                onClick={() => navigate('/customer-dashboard?tab=my-bookings')}
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
