import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, MessageSquare, Menu, Wrench, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

interface HeaderNotification {
  id: string;
  type: 'maintenance' | 'payment' | 'lease' | 'inspection' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const raw = user as any;
  const userName = raw?.fullName || raw?.firstName ? `${raw.firstName} ${raw.lastName || ''}`.trim() : 'John Doe';
  const userRole = raw?.role || 'Administrator';

  const [notifications, setNotifications] = useState<HeaderNotification[]>([
    {
      id: '1',
      type: 'maintenance',
      title: 'New Maintenance Request',
      message: 'Leaking faucet reported at Hillpointe Manor #12A',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Sarah Johnson paid $1,500.00 for January rent',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'lease',
      title: 'Lease Expiring Soon',
      message: 'Lease for Unit 5C expires in 30 days',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '4',
      type: 'inspection',
      title: 'Inspection Scheduled',
      message: 'Property inspection for Garden View Apartments tomorrow at 10 AM',
      time: '5 hours ago',
      read: true,
    },
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        height: '72px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Menu size={20} />
          </button>
        )}

        <div>
          {title && (
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0
            }}>
              {title}
            </h1>
          )}
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: '500px', margin: '0 20px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}
          />
          <input
            type="text"
            placeholder="Search properties, tenants, or documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f9fafb',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#2d5a41';
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => navigate('/messages')}
          style={{
            position: 'relative',
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: '#6b7280',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <MessageSquare size={20} />
        </button>

        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              padding: '8px',
              backgroundColor: showNotifications ? '#f3f4f6' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => { if (!showNotifications) e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
            onMouseLeave={(e) => { if (!showNotifications) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
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
                padding: '0 4px'
              }}>
                {unreadNotifications}
              </span>
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
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  zIndex: 50
                }}
              >
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                      Notifications
                    </h3>
                    {unreadNotifications > 0 && (
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#fee2e2',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '10px'
                      }}>
                        {unreadNotifications} new
                      </span>
                    )}
                  </div>
                  {unreadNotifications > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#2d5a41',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
                      <Bell size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                      <p style={{ margin: 0, fontSize: '14px' }}>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
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
                          borderBottom: '1px solid #f9fafb',
                          cursor: 'pointer',
                          backgroundColor: notif.read ? 'transparent' : '#f0fdf4',
                          transition: 'background-color 0.15s ease',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = notif.read ? '#f9fafb' : '#ecfdf5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : '#f0fdf4'}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {getNotifIcon(notif.type)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '2px'
                          }}>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: notif.read ? '400' : '600',
                              color: '#1f2937'
                            }}>
                              {notif.title}
                            </span>
                            {!notif.read && (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#2d5a41',
                                flexShrink: 0
                              }} />
                            )}
                          </div>
                          <p style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#6b7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {notif.message}
                          </p>
                          <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', display: 'block' }}>
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{
                  padding: '12px 20px',
                  borderTop: '1px solid #f3f4f6',
                  textAlign: 'center'
                }}>
                  <button
                    onClick={() => { setShowNotifications(false); navigate('/settings'); }}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#2d5a41',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    View notification settings
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#2d5a41',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {userName.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {userName}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280'
              }}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </div>
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;