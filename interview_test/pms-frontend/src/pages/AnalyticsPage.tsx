import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';
import { analyticsApi } from '../services/api';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12m');

  const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 38000 },
    { month: 'Mar', revenue: 48000, expenses: 35000 },
    { month: 'Apr', revenue: 61000, expenses: 42000 },
    { month: 'May', revenue: 55000, expenses: 39000 },
    { month: 'Jun', revenue: 67000, expenses: 45000 },
    { month: 'Jul', revenue: 59000, expenses: 41000 },
    { month: 'Aug', revenue: 63000, expenses: 44000 },
    { month: 'Sep', revenue: 58000, expenses: 40000 },
    { month: 'Oct', revenue: 71000, expenses: 48000 },
    { month: 'Nov', revenue: 66000, expenses: 46000 },
    { month: 'Dec', revenue: 73000, expenses: 50000 }
  ];

  const occupancyData = [
    { month: 'Jan', occupancy: 85 },
    { month: 'Feb', occupancy: 88 },
    { month: 'Mar', occupancy: 82 },
    { month: 'Apr', occupancy: 90 },
    { month: 'May', occupancy: 87 },
    { month: 'Jun', occupancy: 93 },
    { month: 'Jul', occupancy: 89 },
    { month: 'Aug', occupancy: 91 },
    { month: 'Sep', occupancy: 86 },
    { month: 'Oct', occupancy: 94 },
    { month: 'Nov', occupancy: 92 },
    { month: 'Dec', occupancy: 96 }
  ];

  const propertyTypeData = [
    { name: 'Apartments', value: 45, fill: '#2d5a41' },
    { name: 'Houses', value: 30, fill: '#b89a7e' },
    { name: 'Condos', value: 20, fill: '#6b7280' },
    { name: 'Commercial', value: 5, fill: '#374151' }
  ];

  const maintenanceData = [
    { category: 'Plumbing', count: 24, cost: 12500 },
    { category: 'Electrical', count: 18, cost: 9800 },
    { category: 'HVAC', count: 15, cost: 18500 },
    { category: 'Appliances', count: 12, cost: 7200 },
    { category: 'Structural', count: 8, cost: 15600 },
    { category: 'Other', count: 14, cost: 5800 }
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '$728K',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      description: 'This year'
    },
    {
      title: 'Average Occupancy',
      value: '89.2%',
      change: '+3.8%',
      changeType: 'positive',
      icon: Users,
      description: 'This year'
    },
    {
      title: 'Total Properties',
      value: '248',
      change: '+5',
      changeType: 'positive',
      icon: Building,
      description: 'This month'
    },
    {
      title: 'Maintenance Cost',
      value: '$69.4K',
      change: '-8.2%',
      changeType: 'positive',
      icon: TrendingDown,
      description: 'This year'
    }
  ];

  const COLORS = ['#2d5a41', '#b89a7e', '#6b7280', '#374151'];

  return (
    <div style={{ padding: '30px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
            Analytics Dashboard
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #e5e5e5',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: 'white',
                outline: 'none'
              }}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#2d5a41',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
          Comprehensive analytics and insights for your property portfolio
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
              backgroundColor: '#fff',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e5e5'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f0f7f4',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={24} color="#2d5a41" />
              </div>
              <div style={{
                fontSize: '12px',
                fontWeight: '500',
                color: stat.changeType === 'positive' ? '#10b981' : '#ef4444',
                backgroundColor: stat.changeType === 'positive' ? '#dcfce7' : '#fee2e2',
                padding: '4px 8px',
                borderRadius: '6px'
              }}>
                {stat.change}
              </div>
            </div>
            <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 4px 0' }}>
              {stat.value}
            </h3>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              {stat.title} • {stat.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '20px' }}>
            Revenue vs Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
              <Bar dataKey="revenue" fill="#2d5a41" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#b89a7e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '20px' }}>
            Property Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={propertyTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {propertyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '20px' }}>
            Occupancy Rate Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[75, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
              <Area
                type="monotone"
                dataKey="occupancy"
                stroke="#2d5a41"
                fill="#2d5a41"
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '20px' }}>
            Maintenance Costs by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={maintenanceData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={80} />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Cost']} />
              <Bar dataKey="cost" fill="#b89a7e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e5e5e5',
          overflow: 'hidden'
        }}
      >
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e5e5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
            Performance Summary
          </h3>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e5e5e5',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            <Filter size={16} />
            Filter
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Metric
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Current
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Previous
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Change
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Monthly Revenue', current: '$73,000', previous: '$66,000', change: '+10.6%', trend: 'up' },
                { metric: 'Operating Expenses', current: '$50,000', previous: '$46,000', change: '+8.7%', trend: 'up' },
                { metric: 'Net Income', current: '$23,000', previous: '$20,000', change: '+15.0%', trend: 'up' },
                { metric: 'Occupancy Rate', current: '96%', previous: '92%', change: '+4.3%', trend: 'up' },
                { metric: 'Average Rent', current: '$1,450', previous: '$1,380', change: '+5.1%', trend: 'up' },
                { metric: 'Maintenance Requests', current: '23', previous: '31', change: '-25.8%', trend: 'down' }
              ].map((row, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                    {row.metric}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a1a1a' }}>
                    {row.current}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#666' }}>
                    {row.previous}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: row.trend === 'up' ? '#10b981' : '#ef4444' }}>
                    {row.change}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {row.trend === 'up' ? (
                      <TrendingUp size={16} color="#10b981" />
                    ) : (
                      <TrendingDown size={16} color="#ef4444" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;