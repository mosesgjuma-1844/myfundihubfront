// TechnicianDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './TechnicianDashboard.css';
import TechnicianDrawer from './aside/TechnicianDrawer';
import { useRoleBasedAccess } from '../../../hooks/useRoleBasedAccess';

const TechnicianDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [theme] = useState<'dark' | 'light'>(() => {
    const savedTheme = typeof window !== 'undefined' ? window.localStorage.getItem('fundiTheme') : null;
    return savedTheme === 'light' ? 'light' : 'dark';
  });

  const navigate = useNavigate();
  const { isAuthorized, isLoading, error } = useRoleBasedAccess({
    requiredRole: 'technician',
    onUnauthorized: () => {
      navigate('/customer-dashboard', { replace: true });
    },
    onUnauthenticated: () => {
      navigate('/login', { replace: true });
    },
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('fundiTheme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="technician-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Loading...</div>
          <div style={{ color: '#999' }}>Checking permissions</div>
        </div>
      </div>
    );
  }

  // Show error if not authorized
  if (!isAuthorized) {
    return (
      <div className="technician-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#d33' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🚫 Access Denied</div>
          <div>{error || 'You do not have permission to access this resource.'}</div>
          <button 
            onClick={() => navigate('/customer-dashboard')}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="technician-dashboard">
      <TechnicianDrawer 
        isSidebarOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
        isMobile={isMobile}
      />
      <div className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet />
      </div>
      {isMobile && isSidebarOpen && (
        <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default TechnicianDashboard;