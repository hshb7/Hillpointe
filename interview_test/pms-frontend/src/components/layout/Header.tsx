import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, MessageSquare, Settings, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: null
  };

  const notifications = [];
  const unreadNotifications = notifications.length;

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

        <button
          onClick={() => setShowNotifications(!showNotifications)}
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
          <Bell size={20} />
          {unreadNotifications > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              backgroundColor: '#ef4444',
              borderRadius: '50%'
            }} />
          )}
        </button>

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
              {mockUser.avatar ? (
                <img src={mockUser.avatar} alt={mockUser.name} style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }} />
              ) : (
                mockUser.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                {mockUser.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280'
              }}>
                Administrator
              </div>
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;