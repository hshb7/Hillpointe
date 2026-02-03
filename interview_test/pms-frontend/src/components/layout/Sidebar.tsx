import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Building,
  Users,
  Wrench,
  CreditCard,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  MapPin,
  Calendar,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);

  const sidebarOpen = onToggle ? isOpen : internalOpen;
  const toggleSidebar = onToggle || (() => setInternalOpen(!internalOpen));

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { label: 'Properties', path: '/properties', icon: <Building size={20} /> },
    { label: 'Tenants', path: '/tenants', icon: <Users size={20} /> },
    { label: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} /> },
    { label: 'Payments', path: '/payments', icon: <CreditCard size={20} /> },
    { label: 'Documents', path: '/documents', icon: <FileText size={20} /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
    { label: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
    { label: 'Map View', path: '/map', icon: <MapPin size={20} /> },
    { label: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (!onToggle) setInternalOpen(false);
    else if (onToggle) onToggle();
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r z-40 overflow-y-auto transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:transform-none`}
        style={{ borderColor: '#e5e7eb' }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2d5a41',
            margin: 0
          }}>
            PropertyPro
          </h1>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '4px',
            margin: 0
          }}>
            Management System
          </p>
        </div>

        <nav style={{ padding: '16px 0' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: isActive ? '#2d5a41' : '#6b7280',
                  backgroundColor: isActive ? '#f0f7f4' : 'transparent',
                  borderLeft: isActive ? '3px solid #2d5a41' : '3px solid transparent',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    marginLeft: 'auto',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '18px',
                    textAlign: 'center'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: 'white'
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px',
              backgroundColor: '#fee2e2',
              border: 'none',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
