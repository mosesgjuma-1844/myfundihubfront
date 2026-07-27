// ForgotPassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { apiPost, APIError } from '../../../utils/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitRetryTime, setRateLimitRetryTime] = useState<number | null>(null);
  const navigate = useNavigate();

  // Handle rate limit countdown
  useEffect(() => {
    if (rateLimitRetryTime === null || rateLimitRetryTime <= 0) {
      setRateLimitRetryTime(null);
      return;
    }

    const timer = setTimeout(() => {
      setRateLimitRetryTime(rateLimitRetryTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [rateLimitRetryTime]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatusType('error');
      setStatusMessage('Please enter your email address.');
      return;
    }

    // Check if still rate limited
    if (rateLimitRetryTime !== null && rateLimitRetryTime > 0) {
      setStatusType('error');
      setStatusMessage(`Too many requests. Please try again in ${rateLimitRetryTime} seconds.`);
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');
    setStatusType('');

    try {
      const result = await apiPost<{ ok: boolean; message: string }>(
        '/auth/forgot-password/',
        { email: email.trim() },
        false // Don't include auth header
      );

      setStatusType('success');
      setStatusMessage(result.message || 'Reset code sent successfully.');
      
      localStorage.setItem('resetEmail', email.trim());
      setTimeout(() => navigate('/verify-reset-code'), 1500);
    } catch (error) {
      if (error instanceof APIError) {
        if (error.isRateLimit) {
          // Set retry timer to 1 hour (3600 seconds)
          setRateLimitRetryTime(3600);
          setStatusType('error');
          setStatusMessage('⏱️ Too many reset requests. Please try again in 1 hour.');
        } else {
          setStatusType('error');
          setStatusMessage(error.message || 'Unable to send reset code.');
        }
      } else {
        setStatusType('error');
        setStatusMessage('Unable to reach the server. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  const isFormDisabled = isSubmitting || (rateLimitRetryTime !== null && rateLimitRetryTime > 0);
  const submitButtonText = isSubmitting
    ? 'Sending...'
    : rateLimitRetryTime !== null && rateLimitRetryTime > 0
    ? `Try again in ${rateLimitRetryTime}s`
    : 'Send Code';

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-left">
          <div className="forgot-password-header">
            <button className="back-btn" onClick={handleBack} disabled={isFormDisabled}>
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
                disabled={isFormDisabled}
              />
            </div>

            {statusMessage && (
              <p className="form-hint" style={{ color: statusType === 'error' ? '#d33' : '#28a745' }}>
                {statusMessage}
              </p>
            )}

            <button 
              type="submit" 
              className="send-code-btn" 
              disabled={isFormDisabled}
            >
              {submitButtonText}
            </button>
          </form>

          <div className="forgot-password-footer">
            <p className="back-to-login">
              Remember your password?{' '}
              <button type="button" className="login-link" onClick={handleBack} disabled={isFormDisabled}>
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