// Login.tsx
import React, { useState, useEffect } from 'react';
import './Login.css';
import LogoImg from '../../../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';
import { apiLogin, type LoginResponse, APIError } from '../../../utils/api';

const Login: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validate inputs
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Check if still rate limited
    if (rateLimitRetryTime !== null && rateLimitRetryTime > 0) {
      setErrorMessage(`Too many login attempts. Please try again in ${rateLimitRetryTime} seconds.`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiLogin<LoginResponse>('/auth/login/', {
        email: email.trim(),
        password: password.trim(),
      });

      if (response.user) {
        localStorage.setItem('fundiUser', JSON.stringify(response.user));
      }

      navigate(response.redirect || '/customer-dashboard');
    } catch (error) {
      if (error instanceof APIError) {
        if (error.isRateLimit) {
          // Set retry timer to 15 minutes (900 seconds)
          setRateLimitRetryTime(900);
          setErrorMessage(
            '⏱️ Too many login attempts. Please try again in 15 minutes.'
          );
        } else {
          setErrorMessage(error.message || 'Login failed. Please check your credentials.');
        }
      } else {
        setErrorMessage('Unable to reach the server. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || (rateLimitRetryTime !== null && rateLimitRetryTime > 0);
  const submitButtonText = isLoading
    ? 'Signing in...'
    : rateLimitRetryTime !== null && rateLimitRetryTime > 0
    ? `Try again in ${rateLimitRetryTime}s`
    : 'Sign in';

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <img src={LogoImg} alt="myFundi Hub" className="login-logo" />
            <h1 className="login-brand">
              myFundi <span className="brand-suffix">Hub</span>
            </h1>
            <h2 className="login-subtitle">
                SIGN IN
            </h2>
                <h3 className="login-title">Sign in to your account</h3>
          </div>
          

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input password-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Remember me</span>
              </label>
              <button 
                type="button" 
                className="forgot-link" 
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {errorMessage && (
              <p className="form-hint" style={{ color: '#d33' }}>
                {errorMessage}
              </p>
            )}
            <button 
              type="submit" 
              className="signin-btn"
              disabled={isSubmitDisabled}
            >
              {submitButtonText}
            </button>
          </form>

          <div className="login-footer">
            <p className="divider-text">or</p>
            <p className="create-account">
              Don't have an account? <button type="button" onClick={handleCreateAccount} className="create-link" disabled={isLoading}>Create one</button>
            </p>
            
          </div>
        </div>
        <div className="login-right">
          <div className="feature-grid">
            <div className="feature-item">
              <h4 className="feature-title">Quick sign in</h4>
              <p className="feature-desc">Use your email and password — we'll route you to the right dashboard.</p>
            </div>
            <div className="feature-item">
              <h4 className="feature-title">Secure</h4>
              <p className="feature-desc">Enhanced security with JWT tokens and rate limiting protection.</p>
            </div>
            <div className="feature-item">
              <h4 className="feature-title">Fast access</h4>
              <p className="feature-desc">One account — multiple entry points depending on your role.</p>
            </div>
          </div>

          <div className="login-right-footer">
            <p className="switch-hint">Sign in with your email and password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;