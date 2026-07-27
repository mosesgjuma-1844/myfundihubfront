// CustomerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import CustomerDrawer from './aside/CustomerDrawer';
import { useRoleBasedAccess } from '../../../hooks/useRoleBasedAccess';

type ThemeMode = 'dark' | 'light';

type DashboardOutletContext = {
  theme: ThemeMode;
  setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>;
};

const CustomerDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = window.localStorage.getItem('fundiTheme');
      return savedTheme === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  const navigate = useNavigate();
  const { isLoading } = useRoleBasedAccess({
    onUnauthenticated: () => {
      navigate('/login', { replace: true });
    },
  });

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

  useEffect(() => {
    window.localStorage.setItem('fundiTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const dashboardContent = document.querySelector('.dashboard-content') as HTMLElement | null;
    if (dashboardContent) {
      dashboardContent.scrollTop = 0;
    }
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className={`customer-dashboard ${theme === 'light' ? 'theme-light' : 'theme-dark'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Loading...</div>
          <div style={{ color: '#999' }}>Checking permissions</div>
        </div>
      </div>
    );
  }

  // Note: Customer dashboard allows any authenticated user
  // Admin and technician can also access customer dashboard
  // Not showing access denied page for customer dashboard

  return (
    <div className={`customer-dashboard ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
      <CustomerDrawer 
        isSidebarOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
        isMobile={isMobile}
        theme={theme}
      />
      <div className={`dashboard-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet context={{ theme, setTheme } satisfies DashboardOutletContext} />
      </div>
      {isMobile && isSidebarOpen && (
        <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  );
};

export default CustomerDashboard;