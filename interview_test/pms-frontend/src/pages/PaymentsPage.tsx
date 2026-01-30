import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, TrendingUp, Search, Plus, Filter, Download } from 'lucide-react';
import { paymentsApi } from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';

const PaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const payments = [
    {
      id: 1,
      tenant: 'Sarah Johnson',
      property: 'Sunset Villa #101',
      amount: 1200,
      dueDate: '2026-01-15',
      paidDate: '2026-01-14',
      status: 'paid',
      method: 'Bank Transfer'
    },
    {
      id: 2,
      tenant: 'Mike Chen',
      property: 'Oak Manor #205',
      amount: 950,
      dueDate: '2026-01-15',
      paidDate: null,
      status: 'overdue',
      method: null
    },
    {
      id: 3,
      tenant: 'Emma Wilson',
      property: 'Pine Court #302',
      amount: 1100,
      dueDate: '2026-01-30',
      paidDate: null,
      status: 'pending',
      method: null
    },
    {
      id: 4,
      tenant: 'David Brown',
      property: 'Maple Heights #150',
      amount: 1350,
      dueDate: '2026-01-12',
      paidDate: '2026-01-10',
      status: 'paid',
      method: 'Credit Card'
    },
    {
      id: 5,
      tenant: 'Lisa Garcia',
      property: 'Birch Gardens #88',
      amount: 875,
      dueDate: '2026-01-20',
      paidDate: null,
      status: 'pending',
      method: null
    }
  ];

  const stats = {
    totalCollected: 67500,
    pendingPayments: 8250,
    overdueAmount: 3200,
    collectionRate: 92.5
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'paid': return '#dcfce7';
      case 'pending': return '#fef3c7';
      case 'overdue': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}
    >
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
          Payments Management
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Track rent payments, manage collection, and monitor financial performance
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '30px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', margin: 0, marginBottom: '8px' }}>Total Collected</p>
              <h3 style={{ color: '#1a1a1a', fontSize: '28px', fontWeight: '700', margin: 0 }}>
                ${stats.totalCollected.toLocaleString()}
              </h3>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} color="#10b981" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', margin: 0, marginBottom: '8px' }}>Pending</p>
              <h3 style={{ color: '#1a1a1a', fontSize: '28px', fontWeight: '700', margin: 0 }}>
                ${stats.pendingPayments.toLocaleString()}
              </h3>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CreditCard size={24} color="#f59e0b" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', margin: 0, marginBottom: '8px' }}>Overdue</p>
              <h3 style={{ color: '#1a1a1a', fontSize: '28px', fontWeight: '700', margin: 0 }}>
                ${stats.overdueAmount.toLocaleString()}
              </h3>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fee2e2',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={24} color="#ef4444" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', margin: 0, marginBottom: '8px' }}>Collection Rate</p>
              <h3 style={{ color: '#1a1a1a', fontSize: '28px', fontWeight: '700', margin: 0 }}>
                {stats.collectionRate}%
              </h3>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={24} color="#3b82f6" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: '24px',
          border: '1px solid #e5e5e5'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999'
                }}
              />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  width: '250px'
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              <Download size={16} />
              Export
            </button>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: '#2d5a41',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              <Plus size={16} />
              Record Payment
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #e5e5e5',
          overflow: 'hidden'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 120px 120px 120px 100px 140px',
          padding: '20px 24px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e5e5e5',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151'
        }}>
          <span>Tenant</span>
          <span>Property</span>
          <span>Amount</span>
          <span>Due Date</span>
          <span>Paid Date</span>
          <span>Status</span>
          <span>Method</span>
        </div>

        {filteredPayments.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.7 + index * 0.05 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 120px 120px 120px 100px 140px',
              padding: '20px 24px',
              borderBottom: '1px solid #f0f0f0',
              fontSize: '14px',
              alignItems: 'center'
            }}
          >
            <span style={{ fontWeight: '500', color: '#1a1a1a' }}>{payment.tenant}</span>
            <span style={{ color: '#666' }}>{payment.property}</span>
            <span style={{ fontWeight: '600', color: '#1a1a1a' }}>${payment.amount}</span>
            <span style={{ color: '#666' }}>{payment.dueDate}</span>
            <span style={{ color: '#666' }}>{payment.paidDate || '-'}</span>
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'capitalize',
                color: getStatusColor(payment.status),
                backgroundColor: getStatusBackground(payment.status)
              }}
            >
              {payment.status}
            </span>
            <span style={{ color: '#666' }}>{payment.method || '-'}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default PaymentsPage;