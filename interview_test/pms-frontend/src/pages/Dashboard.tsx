import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building,
  Users,
  Wrench,
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../components/ui';
import { propertiesApi, tenantsApi, maintenanceApi, paymentsApi } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import type { MaintenanceRequest, Payment, AnalyticsData } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProperties: 0,
    totalTenants: 0,
    occupancyRate: 0,
    monthlyRevenue: 0,
    maintenanceRequests: { total: 0, pending: 0, completed: 0 },
    paymentStatus: { onTime: 0, late: 0, overdue: 0 },
    propertyTypes: {},
    revenueByMonth: [],
    maintenanceByCategory: [],
  });
  const [recentMaintenance, setRecentMaintenance] = useState<MaintenanceRequest[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, tenantRes, maintRes, payRes] = await Promise.all([
          propertiesApi.getAll(),
          tenantsApi.getAll(),
          maintenanceApi.getAll(),
          paymentsApi.getAll(),
        ]);

        const properties = propRes.data;
        const tenants = tenantRes.data;
        const maintenance = maintRes.data;
        const payments = payRes.data;

        const occupied = properties.filter(p => p.status === 'occupied').length;
        const typeCount: Record<string, number> = {};
        properties.forEach(p => { typeCount[p.type] = (typeCount[p.type] || 0) + 1; });

        const totalRent = tenants.reduce((sum, t) => sum + t.rentAmount, 0);
        const pendingMaint = maintenance.filter(m => m.status === 'pending').length;
        const completedMaint = maintenance.filter(m => m.status === 'completed').length;
        const completedPay = payments.filter(p => p.status === 'completed').length;
        const pendingPay = payments.filter(p => p.status === 'pending').length;

        const categoryCount: Record<string, number> = {};
        maintenance.forEach(m => { categoryCount[m.category] = (categoryCount[m.category] || 0) + 1; });

        setAnalytics({
          totalProperties: properties.length,
          totalTenants: tenants.length,
          occupancyRate: properties.length > 0 ? (occupied / properties.length) * 100 : 0,
          monthlyRevenue: totalRent,
          maintenanceRequests: { total: maintenance.length, pending: pendingMaint, completed: completedMaint },
          paymentStatus: { onTime: completedPay, late: 0, overdue: pendingPay },
          propertyTypes: typeCount,
          revenueByMonth: [{ month: 'Jan', revenue: totalRent }],
          maintenanceByCategory: Object.entries(categoryCount).map(([category, count]) => ({ category, count })),
        });

        setRecentMaintenance(maintenance.slice(0, 3));
        setRecentPayments(payments.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };
    fetchData();
  }, []);

  const dashboardStats = [
    {
      title: 'Total Properties',
      value: analytics.totalProperties,
      icon: <Building size={24} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2.5%',
      changeType: 'positive',
    },
    {
      title: 'Active Tenants',
      value: analytics.totalTenants,
      icon: <Users size={24} />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(analytics.monthlyRevenue),
      icon: <DollarSign size={24} />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      change: '+8.2%',
      changeType: 'positive',
    },
    {
      title: 'Occupancy Rate',
      value: formatPercentage(analytics.occupancyRate),
      icon: <TrendingUp size={24} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '-2.1%',
      changeType: 'negative',
    },
  ];

  const COLORS = ['#2d5a41', '#b89a7e', '#6b7280', '#374151'];

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    urgent: 'error',
  } as const;

  const statusColors = {
    pending: 'warning',
    completed: 'success',
    failed: 'error',
    refunded: 'info',
  } as const;

  return (
    <div style={{ padding: '30px', minHeight: '100vh', backgroundColor: isDark ? '#0f172a' : '#f8f9fa' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: isDark ? '#f1f5f9' : '#1a1a1a', marginBottom: '8px' }}>
          Dashboard
        </h1>
        <p style={{ color: isDark ? '#94a3b8' : '#666', fontSize: '16px' }}>
          Welcome to your property management dashboard
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card hover padding="lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2d5a41"
                      strokeWidth={3}
                      dot={{ fill: '#2d5a41' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Property Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(analytics.propertyTypes).map(([type, count]) => ({
                        name: type,
                        value: count,
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(analytics.propertyTypes).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench size={20} className="text-emerald-800" />
                    <span>Recent Maintenance</span>
                  </CardTitle>
                  <Badge variant="warning">{analytics.maintenanceRequests.pending} pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMaintenance.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {request.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Property ID: {request.propertyId}
                        </p>
                      </div>
                      <Badge
                        variant={priorityColors[request.priority]}
                        size="sm"
                      >
                        {request.priority}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" fullWidth className="mt-3" onClick={() => navigate('/maintenance')}>
                    View All Requests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard size={20} className="text-emerald-800" />
                    <span>Recent Payments</span>
                  </CardTitle>
                  <Badge variant="info">{recentPayments.length} recent</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {payment.type} - Due: {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={statusColors[payment.status] || 'default'}
                        size="sm"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" fullWidth className="mt-3" onClick={() => navigate('/payments')}>
                    View All Payments
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="primary" size="sm" fullWidth iconLeft={<Building size={16} />} onClick={() => navigate('/properties')}>
                    Add New Property
                  </Button>
                  <Button variant="outline" size="sm" fullWidth iconLeft={<Users size={16} />} onClick={() => navigate('/tenants')}>
                    Add New Tenant
                  </Button>
                  <Button variant="outline" size="sm" fullWidth iconLeft={<Calendar size={16} />} onClick={() => navigate('/calendar')}>
                    Schedule Inspection
                  </Button>
                  <Button variant="outline" size="sm" fullWidth iconLeft={<CreditCard size={16} />} onClick={() => navigate('/payments')}>
                    Generate Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.maintenanceByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2d5a41" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;