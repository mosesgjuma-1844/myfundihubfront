// ForgotPassword.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { APIDomain } from '../../../utils/APIDomain';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatusMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const response = await fetch(`${APIDomain}/auth/forgot-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setStatusMessage(data.message || 'Unable to send reset code.');
        return;
      }

      localStorage.setItem('resetEmail', email.trim());
      navigate('/verify-reset-code');
    } catch (error) {
      setStatusMessage('Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-left">
          <div className="forgot-password-header">
            <button className="back-btn" onClick={handleBack}>
              ← Back
            </button>
            <h1 className="forgot-password-brand">
              myFundi <span className="brand-suffix">Hub</span>
            </h1>
            <h2 className="forgot-password-title">Forgot Password</h2>
            <p className="forgot-password-description">
              Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </div>

          <form className="forgot-password-form" onSubmit={handleSendCode}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {statusMessage && <p className="form-hint" style={{ color: '#d33' }}>{statusMessage}</p>}

            <button type="submit" className="send-code-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Code'}
            </button>
          </form>

          <div className="forgot-password-footer">
            <p className="back-to-login">
              Remember your password?{' '}
              <button type="button" className="login-link" onClick={handleBack}>
                Sign in
              </button>
            </p>
          </div>
        </div>

        <div className="forgot-password-right">
          <div className="reset-info">
            <div className="reset-icon">🔐</div>
            <h3 className="reset-title">Password Reset</h3>
            <p className="reset-desc">
              We'll send a 6-digit verification code to your email address.
              Enter the code on the next page to reset your password.
            </p>
            <div className="reset-steps">
              <div className="step-item">
                <span className="step-number">1</span>
                <span className="step-text">Enter your email</span>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <span className="step-text">Receive verification code</span>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <span className="step-text">Create new password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;