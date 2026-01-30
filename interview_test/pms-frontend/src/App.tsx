import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  Search
} from 'lucide-react';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
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
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e5e5',
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
          borderBottom: '1px solid #e5e5e5',
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2d5a41',
            margin: 0,
          }}>
            PropertyPro
          </h1>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
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
                  backgroundColor: isActive ? '#f0f7f4' : 'transparent',
                  borderLeft: isActive ? '3px solid #2d5a41' : '3px solid transparent',
                  color: isActive ? '#2d5a41' : '#666666',
                  transition: 'all 0.2s ease',
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '400',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
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
          borderTop: '1px solid #e5e5e5',
        }}>
          <button
            onClick={() => navigate('/')}
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
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
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
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
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
                color: '#666',
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
                  color: '#999',
                }}
              />
              <input
                type="text"
                placeholder="Search properties, tenants, or documents..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              style={{
                position: 'relative',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              <Bell size={22} />
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
              }} />
            </button>

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
                JD
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                  John Doe
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  Administrator
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          minHeight: 'calc(100vh - 70px)',
          backgroundColor: '#f8f9fa',
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