// VerifyResetCode.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VerifyResetCode.css';
import { APIDomain } from '../../../utils/APIDomain';

const VerifyResetCode: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setStatusMessage('Please enter the 6-digit code.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const email = localStorage.getItem('resetEmail') || '';
      const response = await fetch(`${APIDomain}/auth/verify-reset-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setStatusMessage(data.message || 'Invalid or expired reset code.');
        return;
      }

      localStorage.setItem('resetCode', fullCode);
      navigate('/reset-password');
    } catch (error) {
      setStatusMessage('Unable to verify the code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/forgot-password');
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  return (
    <div className="verify-code-page">
      <div className="verify-code-container">
        <div className="verify-code-left">
          <div className="verify-code-header">
            <button className="back-btn" onClick={handleBack}>
              ← Back
            </button>
            <h1 className="verify-code-brand">
              myFundi <span className="brand-suffix">Hub</span>
            </h1>
            <h2 className="verify-code-title">Verify Reset Code</h2>
            <p className="verify-code-description">
              Enter the 6-digit verification code sent to your email address.
            </p>
          </div>

          <form className="verify-code-form" onSubmit={handleVerify}>
            <div className="code-input-group">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  className="code-input"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {statusMessage && <p className="form-hint" style={{ color: '#d33' }}>{statusMessage}</p>}

            <button type="submit" className="verify-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="verify-code-footer">
            <p className="resend-text">
              Didn't receive the code?{' '}
              <button type="button" className="resend-link">
                Resend
              </button>
            </p>
          </div>
        </div>

        <div className="verify-code-right">
          <div className="verify-info">
            <div className="verify-icon">📧</div>
            <h3 className="verify-title">Check Your Email</h3>
            <p className="verify-desc">
              We've sent a 6-digit verification code to your email address.
              The code will expire in 10 minutes.
            </p>
            <div className="verify-tips">
              <div className="tip-item">
                <span className="tip-icon">📩</span>
                <span className="tip-text">Check your spam folder if you don't see the email</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">⏱️</span>
                <span className="tip-text">The code expires in 10 minutes</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🔒</span>
                <span className="tip-text">For security, never share this code with anyone</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetCode;