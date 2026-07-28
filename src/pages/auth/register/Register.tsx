import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Register.css';
import CustomerImage from '../../../assets/images/CustomerImage.jpeg';
import TechnicianImage from '../../../assets/images/TechnicianImage.jpg';
import { apiPost, APIError } from '../../../utils/api';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phoneNumber: string;
  username: string;
  password: string;
  confirmPassword: string;
  specialization?: string;
  yearsOfExperience?: number;
  adminKey?: string;
}

interface RegisterProps {
  defaultRole?: 'customer' | 'technician' | 'admin';
}

const Register: React.FC<RegisterProps> = ({ defaultRole }) => {
  const location = useLocation();
  const adminMode = new URLSearchParams(location.search).get('admin') === 'true';
  const [role, setRole] = useState<'customer' | 'technician' | 'admin'>(
    defaultRole || (adminMode ? 'admin' : 'customer')
  );
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitRetryTime, setRateLimitRetryTime] = useState<number | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
  });

  const password = watch('password');

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

  const onSubmit = async (data: RegisterFormData) => {
    setStatusMessage('');
    setStatusType('');

    // Check if still rate limited
    if (rateLimitRetryTime !== null && rateLimitRetryTime > 0) {
      setStatusType('error');
      setStatusMessage(`Too many registration attempts. Please try again in ${rateLimitRetryTime} seconds.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: RegisterFormData & { role: string } = {
        ...data,
        role,
      };

      const endpoint = role === 'admin' ? '/auth/admin-register/' : '/auth/register/';

      const result = await apiPost<{ ok: boolean; message: string; role: string }>(
        endpoint,
        payload,
        false // Don't include auth header for registration
      );

      setStatusType('success');
      setStatusMessage(result.message || 'Account created successfully.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      if (error instanceof APIError) {
        if (error.isRateLimit) {
          // Set retry timer to 1 hour (3600 seconds)
          setRateLimitRetryTime(3600);
          setStatusType('error');
          setStatusMessage('⏱️ Too many registration attempts. Please try again in 1 hour.');
        } else {
          setStatusType('error');
          setStatusMessage(error.message || 'Account creation failed.');
        }
      } else {
        setStatusType('error');
        setStatusMessage('Unable to reach the server. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleRoleSelect = (selectedRole: 'customer' | 'technician' | 'admin') => {
    setRole(selectedRole);
  };

  const isFormDisabled = isSubmitting || (rateLimitRetryTime !== null && rateLimitRetryTime > 0);

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <div className="register-header">
            <Link to="/" className="register-brand-link">
              <h1 className="register-brand">
                myFundi <span className="brand-suffix">Hub</span>
              </h1>
            </Link>
            <h2 className="register-subtitle">Create account</h2>
            <p className="register-description">
              Choose your role to get started
            </p>
          </div>

          <div className="role-tabs">
            <button
              className={`role-btn ${role === 'customer' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('customer')}
              disabled={isFormDisabled || adminMode}
            >
              <span className="role-icon">🏠</span>
              <span className="role-label">Customer</span>
              <span className="role-desc">Book home services</span>
            </button>
            <button
              className={`role-btn ${role === 'technician' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('technician')}
              disabled={isFormDisabled || adminMode}
            >
              <span className="role-icon">🔧</span>
              <span className="role-label">Technician</span>
              <span className="role-desc">Accept jobs & earn</span>
            </button>
            {!adminMode && (
              <span className="register-note">
                Admin registration is hidden. Use the secret URL if you have access.
              </span>
            )}
          </div>
          {defaultRole === 'admin' && (
            <div className="admin-notice">
              <p>Admin registration is enabled on this hidden URL.</p>
            </div>
          )}

          <p className="role-hint">
            {role === 'admin'
              ? 'Registering as an admin account. This page is hidden and should not be shared publicly.'
              : role === 'customer'
              ? 'Need to book a service? Select Customer above.'
              : 'Joining as a technician? Select Technician above.'}
          </p>

          <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Jane"
                  autoComplete="given-name"
                  disabled={isFormDisabled}
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Wanjiku"
                  autoComplete="family-name"
                  disabled={isFormDisabled}
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="jane@email.com"
                autoComplete="email"
                disabled={isFormDisabled}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmEmail">Confirm Email</label>
              <input
                id="confirmEmail"
                type="email"
                className={`form-input ${errors.confirmEmail ? 'error' : ''}`}
                placeholder="Re-enter email"
                autoComplete="email"
                disabled={isFormDisabled}
                {...register('confirmEmail', {
                  required: 'Please confirm your email',
                  validate: (value: any) =>
                    value === watch('email') || 'Emails do not match',
                })}
              />
              {errors.confirmEmail && (
                <span className="error-message">{errors.confirmEmail.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                placeholder="0782345678"
                autoComplete="tel"
                disabled={isFormDisabled}
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10,12}$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
              />
              {errors.phoneNumber && (
                <span className="error-message">{errors.phoneNumber.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="jane_wanjiku"
                autoComplete="username"
                disabled={isFormDisabled}
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                })}
              />
              {errors.username && (
                <span className="error-message">{errors.username.message}</span>
              )}
            </div>

            {role === 'technician' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="specialization">Specialization</label>
                  <select
                    id="specialization"
                    className={`form-input ${errors.specialization ? 'error' : ''}`}
                    disabled={isFormDisabled}
                    {...register('specialization', {
                      required: 'Specialization is required',
                    })}
                  >
                    <option value="">Select your specialization</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="masonry">Masonry</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.specialization && (
                    <span className="error-message">{errors.specialization.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="yearsOfExperience">Years of Experience</label>
                  <input
                    id="yearsOfExperience"
                    type="number"
                    className={`form-input ${errors.yearsOfExperience ? 'error' : ''}`}
                    placeholder="Enter years of experience"
                    disabled={isFormDisabled}
                    {...register('yearsOfExperience', {
                      required: 'Years of experience is required',
                      min: {
                        value: 0,
                        message: 'Please enter a valid number',
                      },
                      max: {
                        value: 50,
                        message: 'Please enter a valid number',
                      },
                    })}
                  />
                  {errors.yearsOfExperience && (
                    <span className="error-message">{errors.yearsOfExperience.message}</span>
                  )}
                </div>
              </>
            )}

            {role === 'admin' && (
              <div className="form-group">
                <label className="form-label" htmlFor="adminKey">Admin Registration Key</label>
                <input
                  id="adminKey"
                  type="password"
                  className={`form-input ${errors.adminKey ? 'error' : ''}`}
                  placeholder="Enter the admin registration key"
                  autoComplete="off"
                  disabled={isFormDisabled}
                  {...register('adminKey', {
                    required: 'Admin registration key is required',
                  })}
                />
                {errors.adminKey && (
                  <span className="error-message">{errors.adminKey.message}</span>
                )}
                <p className="field-hint">
                  Use the secret admin key provided for hidden admin registration.
                </p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter password"
                autoComplete="new-password"
                disabled={isFormDisabled}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm password"
                autoComplete="new-password"
                disabled={isFormDisabled}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value: any) =>
                    value === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword.message}</span>
              )}
            </div>

            {statusMessage && (
              <div className={`status-message ${statusType}`}>
                {statusMessage}
              </div>
            )}

            <button type="submit" className="register-btn" disabled={isFormDisabled}>
              {isSubmitting ? 'Creating Account...' : rateLimitRetryTime !== null && rateLimitRetryTime > 0 ? `Try again in ${rateLimitRetryTime}s` : 'Create Account'}
            </button>
          </form>

          <div className="register-footer">
            <p className="signin-text">
              Already have an account?{' '}
              <button type="button" className="signin-link" onClick={handleSignIn} disabled={isFormDisabled}>
                Sign in →
              </button>
            </p>
          </div>
        </div>

        <div className="register-right">
          <div className="register-image-container">
            <img
              src={role === 'customer' ? CustomerImage : TechnicianImage}
              alt={role === 'customer' ? 'Customer' : 'Technician'}
              className="register-image"
            />
          </div>
          <div className="register-benefits">
            <h3 className="benefits-title">
              {role === 'customer' ? 'Home services, on demand' : 'Turn your skills into income'}
            </h3>
            <p className="benefits-desc">
              {role === 'customer'
                ? 'Verified plumbers and electricians — booked in minutes.'
                : 'Accept jobs near you, set your own hours, and get paid instantly via M-Pesa.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;