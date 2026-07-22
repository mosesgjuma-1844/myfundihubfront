// Login.tsx
import React, { useState } from 'react';
import './Login.css';
import LogoImg from '../../../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';
import { APIDomain } from '../../../utils/APIDomain';

const Login: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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
              <p className="feature-desc">We authenticate and send you to the correct role-based area.</p>
            </div>
            <div className="feature-item">
              <h4 className="feature-title">Fast access</h4>
              <p className="feature-desc">One account — multiple entry points depending on backend rules.</p>
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