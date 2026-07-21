// aside/CustomerDrawer.tsx
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './CustomerDrawer.css';
import { AiOutlineMenu, AiOutlineClose, AiOutlineFileText } from 'react-icons/ai';
import { apiGet, type MenuItem, type UserProfile } from '../../../../utils/api';
import { iconMap, type IconKey } from '../../../../utils/iconMap';

type CustomerDrawerProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
  theme: 'dark' | 'light';
};

const CustomerDrawer = ({ 
  isSidebarOpen, 
  onToggle, 
  isMobile,
  theme,
}: CustomerDrawerProps) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('fundiUser');
    const role = storedUser ? JSON.parse(storedUser).role : 'customer';
    const userId = storedUser ? JSON.parse(storedUser).id : null;

    const loadMenu = async () => {
      try {
        const data = await apiGet<{ ok: boolean; menuItems: MenuItem[] }>(`/menu/?role=${role}`);
        setMenuItems(data.menuItems || []);
      } catch {
        setMenuItems([]);
      }
    };

    const loadProfile = async (id: number) => {
      try {
        const data = await apiGet<{ ok: boolean; user: UserProfile }>(`/user/?id=${id}`);
        setProfile(data.user);
      } catch {
        setProfile(null);
      }
    };

    loadMenu();
    if (userId) {
      loadProfile(userId);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fundiUser');
    navigate('/login');
  };

  return (
    <>
      {isMobile && (
        <button 
          className={`mobile-menu-btn ${isSidebarOpen ? 'hidden' : ''}`}
          onClick={onToggle}
          aria-label="Toggle Menu"
        >
          <AiOutlineMenu size={24} />
        </button>
      )}

      <aside className={`customer-drawer ${isSidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''} ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <span className="brand-text">myFundi</span>
            <span className="brand-suffix">Hub</span>
          </div>
          <button onClick={onToggle} className="drawer-toggle">
            {isSidebarOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
          </button>
        </div>

        <div className="drawer-role">
          <span className="role-label">CUSTOMER</span>
          <span className="role-portal">CUSTOMER PORTAL</span>
        </div>

        <nav className="drawer-nav">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon as IconKey] ?? AiOutlineFileText;
            return (
              <NavLink
                key={item.id}
                to={item.link}
                className={({ isActive }) =>
                  `drawer-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="drawer-icon">
                  <Icon size={isSidebarOpen ? 20 : 22} />
                </span>
                {isSidebarOpen && <span className="drawer-label">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="drawer-footer">
          <div className="drawer-user">
            <div className="user-avatar">{profile ? [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim().slice(0, 2).toUpperCase() : 'GU'}</div>
            {isSidebarOpen && (
              <div className="user-info">
                <span className="user-name">{profile ? [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim() || profile.username : 'Guest'}</span>
                <span className="user-role">{profile?.role ? `${profile.role} account` : 'Account & settings'}</span>
              </div>
            )}
          </div>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">↪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default CustomerDrawer;