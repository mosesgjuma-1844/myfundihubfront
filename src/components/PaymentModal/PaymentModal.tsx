// components/PaymentModal/PaymentModal.tsx
import React, { useState } from 'react';
import './PaymentModal.css';
import { apiPost } from '../../utils/api';

interface PaymentModalProps {
  bookingId: number;
  calloutFee: number;
  onPaymentInitiated: (authorizationUrl: string) => void;
  onClose: () => void;
}

interface InitializePaymentResponse {
  ok: boolean;
  payment_id: number;
  authorization_url: string;
  reference: string;
  message: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  bookingId,
  calloutFee,
  onPaymentInitiated,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayNow = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiPost<InitializePaymentResponse>(
        '/payments/initialize/',
        { booking_id: bookingId }
      );

      if (response.ok && response.authorization_url) {
        // Redirect to Paystack
        onPaymentInitiated(response.authorization_url);
      } else {
        setError(response.message || 'Failed to initialize payment');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Payment initialization failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="modal-header">
          <h2>Complete Your Booking</h2>
          <p>Pay the callout fee to activate your booking</p>
        </div>

        <div className="modal-content">
          <div className="fee-card">
            <div className="fee-label">Callout Fee</div>
            <div className="fee-amount">KES {calloutFee.toLocaleString()}</div>
            <div className="fee-description">
              One-time fee to ensure technician dispatch
            </div>
          </div>

          <div className="payment-methods">
            <h3>Payment Methods</h3>
            <div className="method-option active">
              <input type="radio" id="mpesa" name="method" defaultChecked />
              <label htmlFor="mpesa">
                <span className="method-icon">📱</span>
                <span>M-Pesa (Recommended)</span>
              </label>
            </div>
            <div className="method-option">
              <input type="radio" id="card" name="method" disabled />
              <label htmlFor="card">
                <span className="method-icon">💳</span>
                <span>Card (Coming Soon)</span>
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            <button
              className="cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="pay-btn"
              onClick={handlePayNow}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
