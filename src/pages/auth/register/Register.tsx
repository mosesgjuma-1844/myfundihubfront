import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import CustomerImage from '../../../assets/images/CustomerImage.jpeg';
import TechnicianImage from '../../../assets/images/TechnicianImage.jpg';
import { APIDomain } from '../../../utils/APIDomain';

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

const Register: React.FC = () => {
  const [role, setRole] = useState<'customer' | 'technician' | 'admin'>('customer');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
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

  const onSubmit = async (data: RegisterFormData) => {
    setStatusMessage('');
    setStatusType('');

    try {
      const response = await fetch(`${APIDomain}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setStatusType('error');
        setStatusMessage(result.message || 'Account creation failed.');
        return;
      }

      setStatusType('success');
      setStatusMessage(result.message || 'Account created successfully.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setStatusType('error');
      setStatusMessage('Unable to reach the server. Please try again.');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleRoleSelect = (selectedRole: 'customer' | 'technician' | 'admin') => {
    setRole(selectedRole);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <div className="register-header">
            <h1 className="register-brand">
              myFundi <span className="brand-suffix">Hub</span>
            </h1>
            <h2 className="register-subtitle">Create account</h2>
            <p className="register-description">
              Choose your role to get started
            </p>
          </div>

          <div className="role-tabs">
            <button
              className={`role-btn ${role === 'customer' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('customer')}
            >
              <span className="role-icon">🏠</span>
              <span className="role-label">Customer</span>
              <span className="role-desc">Book home services</span>
            </button>
            <button
              className={`role-btn ${role === 'technician' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('technician')}
            >
              <span className="role-icon">🔧</span>
              <span className="role-label">Technician</span>
              <span className="role-desc">Accept jobs & earn</span>
            </button>
            <button
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => handleRoleSelect('admin')}
            >
              <span className="role-icon">👑</span>
              <span className="role-label">Admin</span>
              <span className="role-desc">Manage platform</span>
            </button>
          </div>

          <p className="role-hint">
            {role === 'customer'
              ? 'Need to book a service? Select Customer above.'
              : role === 'technician'
              ? 'Joining as a technician? Select Technician above.'
              : 'Managing the platform? Select Admin above.'}
          </p>

          <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Jane"
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
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Wanjiku"
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
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="jane@email.com"
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
              <label className="form-label">Confirm Email</label>
              <input
                type="email"
                className={`form-input ${errors.confirmEmail ? 'error' : ''}`}
                placeholder="Re-enter email"
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
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                placeholder="0782345678"
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
              <label className="form-label">Username</label>
              <input
                type="text"
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="jane_wanjiku"
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
                  <label className="form-label">Specialization</label>
                  <select
                    className={`form-input ${errors.specialization ? 'error' : ''}`}
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
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    className={`form-input ${errors.yearsOfExperience ? 'error' : ''}`}
                    placeholder="Enter years of experience"
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
                <label className="form-label">Admin Access Key</label>
                <input
                  type="password"
                  className={`form-input ${errors.adminKey ? 'error' : ''}`}
                  placeholder="Enter admin access key"
                  {...register('adminKey', {
                    required: 'Admin access key is required',
                    minLength: {
                      value: 6,
                      message: 'Admin key must be at least 6 characters',
                    },
                  })}
                />
                {errors.adminKey && (
                  <span className="error-message">{errors.adminKey.message}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Password must contain uppercase, lowercase, number, and special character',
                  },
                })}
              />
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm password"
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

            <button type="submit" className="register-btn">
              Create Account
            </button>
          </form>

          <div className="register-footer">
            <p className="signin-text">
              Already have an account?{' '}
              <button type="button" className="signin-link" onClick={handleSignIn}>
                Sign in →
              </button>
            </p>
          </div>
        </div>

        <div className="register-right">
          <div className="register-image-container">
            <img
              src={role === 'customer' ? CustomerImage : role === 'technician' ? TechnicianImage : CustomerImage}
              alt={role === 'customer' ? 'Customer' : role === 'technician' ? 'Technician' : 'Admin'}
              className="register-image"
            />
          </div>
          <div className="register-benefits">
            <h3 className="benefits-title">
              {role === 'customer'
                ? 'Home services, on demand'
                : role === 'technician'
                ? 'Turn your skills into income'
                : 'Manage your platform'}
            </h3>
            <p className="benefits-desc">
              {role === 'customer'
                ? 'Verified plumbers and electricians — booked in minutes.'
                : role === 'technician'
                ? 'Accept jobs near you, set your own hours, and get paid instantly via M-Pesa.'
                : 'Full control over users, bookings, payments, and platform settings.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;