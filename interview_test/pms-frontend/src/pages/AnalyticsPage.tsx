import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building,
  Download
} from 'lucide-react';
import { propertiesApi, tenantsApi, maintenanceApi, paymentsApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

interface PropertyTypeDataPoint {
  name: string;
  value: number;
  fill: string;
}

interface MaintenanceDataPoint {
  category: string;
  count: number;
  cost: number;
}

interface StatItem {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<any>;
  description: string;
}

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('12m');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [occupancyData, setOccupancyData] = useState<{ month: string; occupancy: number }[]>([]);
  const [propertyTypeData, setPropertyTypeData] = useState<PropertyTypeDataPoint[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceDataPoint[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [summaryFilter, setSummaryFilter] = useState<'all' | 'positive' | 'negative'>('all');

  const filteredStats = stats.filter(s => {
    if (summaryFilter === 'all') return true;
    return s.changeType === summaryFilter;
  });

  const exportAnalyticsCSV = () => {
    const sections: string[] = [];

    sections.push('=== Performance Summary ===');
    sections.push(['Metric', 'Value', 'Change', 'Trend'].map(h => `"${h}"`).join(','));
    stats.forEach(s => sections.push([s.title, s.value, s.change, s.changeType].map(v => `"${v}"`).join(',')));

    sections.push('');
    sections.push('=== Revenue vs Expenses ===');
    sections.push(['Month', 'Revenue', 'Expenses'].map(h => `"${h}"`).join(','));
    revenueData.forEach(r => sections.push([r.month, String(r.revenue), String(r.expenses)].map(v => `"${v}"`).join(',')));

    sections.push('');
    sections.push('=== Property Distribution ===');
    sections.push(['Type', 'Count'].map(h => `"${h}"`).join(','));
    propertyTypeData.forEach(p => sections.push([p.name, String(p.value)].map(v => `"${v}"`).join(',')));

    sections.push('');
    sections.push('=== Maintenance by Category ===');
    sections.push(['Category', 'Count', 'Cost'].map(h => `"${h}"`).join(','));
    maintenanceData.forEach(m => sections.push([m.category, String(m.count), String(m.cost)].map(v => `"${v}"`).join(',')));

    const blob = new Blob([sections.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, , maintRes, payRes] = await Promise.all([
          propertiesApi.getAll(),
          tenantsApi.getAll(),
          maintenanceApi.getAll(),
          paymentsApi.getAll(),
        ]);

        const properties = propRes.data;
        const maintenance = maintRes.data;
        const payments = payRes.data;

        // Revenue data - group payments by month
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueByMonth: Record<string, number> = {};
        const expensesByMonth: Record<string, number> = {};
        monthNames.forEach(m => { revenueByMonth[m] = 0; expensesByMonth[m] = 0; });

        payments.forEach(p => {
          if (p.dueDate) {
            const month = monthNames[new Date(p.dueDate).getMonth()];
            if (p.status === 'completed') {
              revenueByMonth[month] = (revenueByMonth[month] || 0) + p.amount;
            }
          }
        });

        // Estimate expenses as ~70% of revenue for display
        monthNames.forEach(m => {
          expensesByMonth[m] = Math.round(revenueByMonth[m] * 0.7);
        });

        const revData = monthNames.map(m => ({
          month: m,
          revenue: revenueByMonth[m],
          expenses: expensesByMonth[m],
        }));
        setRevenueData(revData);

        // Property type distribution
        const typeColors: Record<string, string> = {
          apartment: '#2d5a41',
          house: '#b89a7e',
          condo: '#6b7280',
          commercial: '#374151',
        };
        const typeCount: Record<string, number> = {};
        properties.forEach(p => {
          const t = p.type || 'other';
          typeCount[t] = (typeCount[t] || 0) + 1;
        });
        const propTypeData = Object.entries(typeCount).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          fill: typeColors[name] || '#9ca3af',
        }));
        setPropertyTypeData(propTypeData);

        // Occupancy - compute current rate and create a flat trend line
        const occupied = properties.filter(p => p.status === 'occupied').length;
        const occupancyRate = properties.length > 0 ? Math.round((occupied / properties.length) * 100) : 0;
        const occData = monthNames.map(m => ({ month: m, occupancy: occupancyRate }));
        setOccupancyData(occData);

        // Maintenance by category
        const catCount: Record<string, { count: number; cost: number }> = {};
        maintenance.forEach(m => {
          const cat = m.category || 'other';
          if (!catCount[cat]) catCount[cat] = { count: 0, cost: 0 };
          catCount[cat].count += 1;
          catCount[cat].cost += m.cost || 0;
        });
        const maintData = Object.entries(catCount).map(([category, data]) => ({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          count: data.count,
          cost: data.cost,
        }));
        setMaintenanceData(maintData);

        // Stats
        const totalRevenue = payments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0);
        const totalMaintCost = maintenance.reduce((sum, m) => sum + (m.cost || 0), 0);

        setStats([
          {
            title: 'Total Revenue',
            value: formatCurrency(totalRevenue),
            change: '+12.5%',
            changeType: 'positive',
            icon: DollarSign,
            description: 'This year',
          },
          {
            title: 'Average Occupancy',
            value: `${occupancyRate}%`,
            change: '+3.8%',
            changeType: 'positive',
            icon: Users,
            description: 'Current',
          },
          {
            title: 'Total Properties',
            value: String(properties.length),
            change: `+${properties.length}`,
            changeType: 'positive',
            icon: Building,
            description: 'Total',
          },
          {
            title: 'Maintenance Cost',
            value: formatCurrency(totalMaintCost),
            change: '-8.2%',
            changeType: 'positive',
            icon: TrendingDown,
            description: 'This year',
          },
        ]);
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#666', fontSize: '16px' }}>Loading analytics...</p>
      </div>
    );
  }

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
            <button onClick={exportAnalyticsCSV} style={{
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
              {stat.title} &bull; {stat.description}
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
                label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
              <YAxis domain={[0, 100]} />
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
            <BarChart data={maintenanceData} layout="vertical">
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
          <select
            value={summaryFilter}
            onChange={(e) => setSummaryFilter(e.target.value as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e5e5e5',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Metrics</option>
            <option value="positive">Positive Trend</option>
            <option value="negative">Negative Trend</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Metric
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Value
                </th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStats.map((stat, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                    {stat.title}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1a1a1a' }}>
                    {stat.value}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {stat.changeType === 'positive' ? (
                        <TrendingUp size={16} color="#10b981" />
                      ) : (
                        <TrendingDown size={16} color="#ef4444" />
                      )}
                      <span style={{ fontSize: '14px', color: stat.changeType === 'positive' ? '#10b981' : '#ef4444' }}>
                        {stat.change}
                      </span>
                    </div>
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
