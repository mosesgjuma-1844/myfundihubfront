// CustomerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './CustomerDashboard.css';
import CustomerDrawer from './aside/CustomerDrawer';

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

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

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