// Login.tsx
import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { APIDomain } from '../../../utils/APIDomain';

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'customer' | 'technician' | 'admin'>('customer');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'customer' | 'technician' | 'admin') => {
    setSelectedRole(role);
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch(`${APIDomain}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrorMessage(data.message || 'Login failed.');
        return;
      }

      if (data.user) {
        localStorage.setItem('fundiUser', JSON.stringify(data.user));
      }

      navigate(data.redirect || '/customer-dashboard');
    } catch (error) {
      setErrorMessage('Unable to reach the backend server.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-header">
            <h1 className="login-brand">
              myFundi <span className="brand-suffix">Hub</span>
            </h1>
            <h2 className="login-subtitle">
              {selectedRole === 'customer' ? 'CUSTOMER PORTAL' : 
               selectedRole === 'technician' ? 'TECHNICIAN PORTAL' : 'ADMIN PORTAL'}
            </h2>
            <h3 className="login-title">
              {selectedRole === 'customer' ? 'Sign in' : 
               selectedRole === 'technician' ? 'Built to earn your trust' : 'Admin access'}
            </h3>
          </div>

          <div className="login-tabs">
            <button 
              className={`tab-btn ${selectedRole === 'customer' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('customer')}
            >
              Customer
            </button>
            <button 
              className={`tab-btn ${selectedRole === 'technician' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('technician')}
            >
              Technician
            </button>
            <button 
              className={`tab-btn ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('admin')}
            >
              Admin
            </button>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">
                {selectedRole === 'customer' ? 'Username or Email' : 
                 selectedRole === 'technician' ? 'Technician account' : 'Admin Email'}
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'customer' ? 'you@email.com' : 
                           selectedRole === 'technician' ? 'Verified on the platform' : 'admin@myfundi.com'}
              />
              {selectedRole === 'technician' && (
                <p className="form-hint">
                  Identity-checked and admin-approved - customers know you're the real deal.
                </p>
              )}
              {selectedRole === 'admin' && (
                <p className="form-hint">
                  Admin access - Full control over users, bookings, and payments.
                </p>
              )}
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
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
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
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="forgot-link" onClick={handleForgotPassword}>
                Forgot password?
              </button>
            </div>

            {errorMessage && <p className="form-hint" style={{ color: '#d33' }}>{errorMessage}</p>}
            <button type="submit" className="signin-btn">Sign in</button>
          </form>

          <div className="login-footer">
            <p className="divider-text">or</p>
            <p className="create-account">
              Don't have an account? <button type="button" onClick={handleCreateAccount} className="create-link">Create one</button>
            </p>
            <div className="switch-buttons">
              <button 
                className={`switch-btn ${selectedRole === 'customer' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('customer')}
              >
                Customer login
              </button>
              <button 
                className={`switch-btn ${selectedRole === 'technician' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('technician')}
              >
                Technician login
              </button>
              <button 
                className={`switch-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('admin')}
              >
                Admin login
              </button>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="feature-grid">
            {selectedRole === 'customer' && (
              <>
                <div className="feature-item">
                  <h4 className="feature-title">Post your request</h4>
                  <p className="feature-desc">
                    Describe what you need and drop your location - takes under 60 seconds
                  </p>
                </div>
                <div className="feature-item">
                  <h4 className="feature-title">Get matched instantly</h4>
                  <p className="feature-desc">
                    Your job is broadcast to verified technicians near you in real time.
                  </p>
                </div>
                <div className="feature-item">
                  <h4 className="feature-title">Pay securely</h4>
                  <p className="feature-desc">
                    Once the job is done to your satisfaction, pay directly from your phone.
                  </p>
                </div>
              </>
            )}
            {selectedRole === 'technician' && (
              <>
                <div className="feature-item">
                  <h4 className="feature-title">Verified on the platform</h4>
                  <p className="feature-desc">
                    Identity-checked and admin-approved - customers know you're the real deal.
                  </p>
                </div>
                <div className="feature-item">
                  <h4 className="feature-title">GPS-matched to nearby jobs</h4>
                  <p className="feature-desc">
                    Only receive jobs near your location - no wasted trips, no cold calls.
                  </p>
                </div>
                <div className="feature-item">
                  <h4 className="feature-title">Instant M-Pesa payouts</h4>
                  <p className="feature-desc">
                    Get paid straight to your phone the moment a job is marked complete.
                  </p>
                </div>
              </>
            )}
            {selectedRole === 'admin' && (
              <>
                <div className="feature-item">
                  <h4 className="feature-title">Full platform control</h4>
                  <p className="feature-desc">
                    Manage users, fundis, bookings, and payments from one dashboard.
                  </p>
                </div>
                <div className="feature-item">
                  <h4 className="feature-title">Real-time analytics</h4>
                  <p className="feature-desc">
                    View platform performance metrics and generate detailed reports.
                  </p>
                </div>
                <div className="feature-item">
                  <h4 className="feature-title">Commission management</h4>
                  <p className="feature-desc">
                    Configure commission rates, payout schedules, and platform settings.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="login-right-footer">
            <p className="switch-hint">
              Switch to {selectedRole === 'customer' ? 'Technician' : 
                        selectedRole === 'technician' ? 'Admin' : 'Customer'} login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;