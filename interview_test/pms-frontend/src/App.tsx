import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home,
  Building,
  Users,
  Wrench,
  CreditCard,
  FileText,
  BarChart3,
  MessageSquare,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Maintenance from './pages/Maintenance';
import MapView from './pages/MapView';
import PaymentsPage from './pages/PaymentsPage';
import DocumentsPage from './pages/DocumentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MessagesPage from './pages/MessagesPage';
import CalendarPage from './pages/CalendarPage';
import SettingsPage from './pages/SettingsPage';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { logout, user } = useAuth();

  const [notifications, setNotifications] = useState([
    { id: '1', type: 'maintenance', title: 'New Maintenance Request', message: 'Leaking faucet reported at Hillpointe Manor #12A', time: '5 min ago', read: false },
    { id: '2', type: 'payment', title: 'Payment Received', message: 'Sarah Johnson paid $1,500.00 for January rent', time: '1 hour ago', read: false },
    { id: '3', type: 'lease', title: 'Lease Expiring Soon', message: 'Lease for Unit 5C expires in 30 days', time: '3 hours ago', read: true },
    { id: '4', type: 'inspection', title: 'Inspection Scheduled', message: 'Property inspection for Garden View tomorrow at 10 AM', time: '5 hours ago', read: true },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Wrench size={16} color="#f59e0b" />;
      case 'payment': return <DollarSign size={16} color="#10b981" />;
      case 'lease': return <AlertTriangle size={16} color="#ef4444" />;
      case 'inspection': return <Calendar size={16} color="#3b82f6" />;
      default: return <Bell size={16} color="#6b7280" />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/properties', icon: Building, label: 'Properties' },
    { path: '/tenants', icon: Users, label: 'Tenants' },
    { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/map', icon: MapPin, label: 'Map View' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        transition: 'width 0.3s ease',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        borderRight: `1px solid ${isDark ? '#334155' : '#e5e5e5'}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 10,
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '25px 20px',
          borderBottom: `1px solid ${isDark ? '#334155' : '#e5e5e5'}`,
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: isDark ? '#6ee7b7' : '#2d5a41',
            margin: 0,
          }}>
            PropertyPro
          </h1>
          <p style={{ fontSize: '12px', color: isDark ? '#64748b' : '#888', marginTop: '4px' }}>
            Management System
          </p>
        </div>

        <div style={{ flex: 1, paddingTop: '20px', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? (isDark ? '#1a3a2c' : '#f0f7f4') : 'transparent',
                  borderLeft: isActive ? `3px solid ${isDark ? '#6ee7b7' : '#2d5a41'}` : '3px solid transparent',
                  color: isActive ? (isDark ? '#6ee7b7' : '#2d5a41') : (isDark ? '#94a3b8' : '#666666'),
                  transition: 'all 0.2s ease',
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '400',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{
          padding: '20px',
          borderTop: `1px solid ${isDark ? '#334155' : '#e5e5e5'}`,
        }}>
          <button
            onClick={() => { logout(); navigate('/'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px',
              backgroundColor: isDark ? '#3b1c1c' : '#fee2e2',
              border: 'none',
              borderRadius: '8px',
              color: isDark ? '#fca5a5' : '#dc2626',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#4c2020' : '#fecaca'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDark ? '#3b1c1c' : '#fee2e2'}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div style={{
        marginLeft: sidebarOpen ? '280px' : '0',
        flex: 1,
        transition: 'margin-left 0.3s ease'
      }}>
        <div style={{
          height: '70px',
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderBottom: `1px solid ${isDark ? '#334155' : '#e5e5e5'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isDark ? '#94a3b8' : '#666',
              }}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div style={{
              position: 'relative',
              width: '400px',
            }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: isDark ? '#64748b' : '#999',
                }}
              />
              <input
                type="text"
                placeholder="Search properties, tenants, or documents..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: `1px solid ${isDark ? '#334155' : '#e5e5e5'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: isDark ? '#334155' : '#ffffff',
                  color: isDark ? '#f1f5f9' : '#1a1a1a',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  padding: '8px',
                  backgroundColor: showNotifications ? (isDark ? '#334155' : '#f3f4f6') : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: isDark ? '#94a3b8' : '#666',
                }}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    minWidth: '16px',
                    height: '16px',
                    backgroundColor: '#ef4444',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }} />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      width: '380px',
                      backgroundColor: isDark ? '#1e293b' : 'white',
                      borderRadius: '12px',
                      boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.4)' : '0 10px 40px rgba(0,0,0,0.15)',
                      border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                      overflow: 'hidden',
                      zIndex: 50,
                    }}
                  >
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: isDark ? '#f1f5f9' : '#1f2937' }}>
                          Notifications
                        </h3>
                        {unreadCount > 0 && (
                          <span style={{
                            padding: '2px 8px',
                            backgroundColor: '#fee2e2',
                            color: '#ef4444',
                            fontSize: '12px',
                            fontWeight: '600',
                            borderRadius: '10px',
                          }}>
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                          style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#2d5a41',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer',
                          }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                            setShowNotifications(false);
                            if (notif.type === 'maintenance') navigate('/maintenance');
                            else if (notif.type === 'payment') navigate('/payments');
                            else if (notif.type === 'inspection') navigate('/calendar');
                            else if (notif.type === 'lease') navigate('/tenants');
                          }}
                          style={{
                            padding: '14px 20px',
                            borderBottom: `1px solid ${isDark ? '#1e293b' : '#f9fafb'}`,
                            cursor: 'pointer',
                            backgroundColor: notif.read ? 'transparent' : (isDark ? '#1a3a2c' : '#f0fdf4'),
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = notif.read ? (isDark ? '#334155' : '#f9fafb') : (isDark ? '#1a4a34' : '#ecfdf5')}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : (isDark ? '#1a3a2c' : '#f0fdf4')}
                        >
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: isDark ? '#334155' : '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {getNotifIcon(notif.type)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                              <span style={{
                                fontSize: '14px',
                                fontWeight: notif.read ? '400' : '600',
                                color: isDark ? '#f1f5f9' : '#1f2937',
                              }}>
                                {notif.title}
                              </span>
                              {!notif.read && (
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2d5a41', flexShrink: 0 }} />
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#94a3b8' : '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {notif.message}
                            </p>
                            <span style={{ fontSize: '12px', color: isDark ? '#64748b' : '#9ca3af', marginTop: '4px', display: 'block' }}>
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      padding: '12px 20px',
                      borderTop: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`,
                      textAlign: 'center',
                    }}>
                      <button
                        onClick={() => { setShowNotifications(false); navigate('/settings'); }}
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#2d5a41',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                        }}
                      >
                        View notification settings
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#2d5a41',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
              }}>
                {user ? `${(user as any).firstName?.[0] || ''}${(user as any).lastName?.[0] || ''}` : '?'}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: isDark ? '#f1f5f9' : '#333' }}>
                  {user ? `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() || user.fullName || 'User' : 'Guest'}
                </div>
                <div style={{ fontSize: '12px', color: isDark ? '#64748b' : '#888', textTransform: 'capitalize' }}>
                  {(user as any)?.role || user?.userRole || 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          minHeight: 'calc(100vh - 70px)',
          backgroundColor: isDark ? '#0f172a' : '#f8f9fa',
          padding: '24px',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />
        <Route path="/properties" element={
          <MainLayout>
            <Properties />
          </MainLayout>
        } />
        <Route path="/tenants" element={
          <MainLayout>
            <Tenants />
          </MainLayout>
        } />
        <Route path="/maintenance" element={
          <MainLayout>
            <Maintenance />
          </MainLayout>
        } />
        <Route path="/payments" element={
          <MainLayout>
            <PaymentsPage />
          </MainLayout>
        } />
        <Route path="/documents" element={
          <MainLayout>
            <DocumentsPage />
          </MainLayout>
        } />
        <Route path="/analytics" element={
          <MainLayout>
            <AnalyticsPage />
          </MainLayout>
        } />
        <Route path="/messages" element={
          <MainLayout>
            <MessagesPage />
          </MainLayout>
        } />
        <Route path="/map" element={
          <MainLayout>
            <MapView />
          </MainLayout>
        } />
        <Route path="/calendar" element={
          <MainLayout>
            <CalendarPage />
          </MainLayout>
        } />
        <Route path="/settings" element={
          <MainLayout>
            <SettingsPage />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;