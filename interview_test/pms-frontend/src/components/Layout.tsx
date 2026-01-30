import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Building,
  Users,
  Tool,
  CreditCard,
  FileText,
  BarChart3,
  MessageSquare,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/properties', icon: Building, label: 'Properties' },
    { path: '/tenants', icon: Users, label: 'Tenants' },
    { path: '/maintenance', icon: Tool, label: 'Maintenance' },
    { path: '/payments', icon: CreditCard, label: 'Payments' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/map', icon: MapPin, label: 'Map View' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-neutral-200 z-40 lg:translate-x-0 lg:static`}
        style={{ transform: sidebarOpen ? 'translateX(0)' : '' }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold" style={{ color: '#2d5a41' }}>
            PropertyPro
          </h1>
        </div>

        <nav className="px-4">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                location.pathname === item.path
                  ? 'bg-neutral-100'
                  : 'hover:bg-neutral-50'
              }`}
              style={{
                color: location.pathname === item.path ? '#2d5a41' : '#525252'
              }}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-neutral-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export { Layout };
export default Layout;