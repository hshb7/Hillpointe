import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, TrendingUp, Search, Plus, Download, X } from 'lucide-react';
import { paymentsApi, tenantsApi, propertiesApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import type { Payment, Tenant, Property } from '../types';
import { Button } from '../components/ui';

interface DisplayPayment {
  id: string;
  tenant: string;
  property: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: 'paid' | 'pending' | 'overdue';
  method: string | null;
}

const PaymentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [payments, setPayments] = useState<DisplayPayment[]>([]);
  const [stats, setStats] = useState({ totalCollected: 0, pendingPayments: 0, overdueAmount: 0, collectionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recording, setRecording] = useState(false);
  const [tenantsList, setTenantsList] = useState<{ id: string; name: string }[]>([]);
  const [propertiesList, setPropertiesList] = useState<{ id: string; name: string }[]>([]);
  const [newPayment, setNewPayment] = useState({
    tenantId: '',
    propertyId: '',
    amount: '',
    type: 'rent' as string,
    method: 'online' as string,
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    try {
      const [payRes, tenantRes, propRes] = await Promise.all([
        paymentsApi.getAll(),
        tenantsApi.getAll(),
        propertiesApi.getAll(),
      ]);

      const rawPayments = payRes.data;
      const tenants = tenantRes.data;
      const users = tenantRes.populatedUsers as any[];
      const properties = propRes.data;

      const tenantNameMap = new Map<string, string>();
      const tenantOpts: { id: string; name: string }[] = [];
      tenants.forEach((t: Tenant) => {
        const user = users.find((u: any) => u._id === t.userId);
        const name = user?.fullName || 'Unknown Tenant';
        tenantNameMap.set(t.id, name);
        tenantOpts.push({ id: t.id, name });
      });
      setTenantsList(tenantOpts);

      const propertyNameMap = new Map<string, string>();
      const propOpts: { id: string; name: string }[] = [];
      properties.forEach((p: Property) => {
        propertyNameMap.set(p.id, p.name);
        propOpts.push({ id: p.id, name: p.name });
      });
      setPropertiesList(propOpts);

      const now = new Date();
      const displayPayments: DisplayPayment[] = rawPayments.map((p: Payment) => {
        let displayStatus: 'paid' | 'pending' | 'overdue' = 'pending';
        if (p.status === 'completed') {
          displayStatus = 'paid';
        } else if (p.status === 'pending' && new Date(p.dueDate) < now) {
          displayStatus = 'overdue';
        }

        return {
          id: p.id,
          tenant: tenantNameMap.get(p.tenantId) || 'Unknown Tenant',
          property: propertyNameMap.get(p.propertyId) || 'Unknown Property',
          amount: p.amount,
          dueDate: p.dueDate,
          paidDate: p.paidDate || null,
          status: displayStatus,
          method: p.paymentMethod || null,
        };
      });

      setPayments(displayPayments);

      const totalCollected = displayPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);
      const pendingAmount = displayPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
      const overdueAmount = displayPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);
      const total = displayPayments.length;
      const paidCount = displayPayments.filter(p => p.status === 'paid').length;

      setStats({
        totalCollected,
        pendingPayments: pendingAmount,
        overdueAmount,
        collectionRate: total > 0 ? Math.round((paidCount / total) * 1000) / 10 : 0,
      });
    } catch (err) {
      console.error('Failed to fetch payments data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordPayment = async () => {
    if (!newPayment.tenantId || !newPayment.propertyId || !newPayment.amount || !newPayment.description) return;
    setRecording(true);
    try {
      await paymentsApi.create({
        tenantId: newPayment.tenantId,
        propertyId: newPayment.propertyId,
        amount: parseFloat(newPayment.amount),
        type: newPayment.type,
        paymentMethod: newPayment.method,
        description: newPayment.description,
        dueDate: newPayment.dueDate,
        status: 'pending',
      } as any);
      setShowRecordModal(false);
      setNewPayment({ tenantId: '', propertyId: '', amount: '', type: 'rent', method: 'online', description: '', dueDate: new Date().toISOString().split('T')[0] });
      await fetchData();
    } catch (err) {
      console.error('Failed to record payment:', err);
    } finally {
      setRecording(false);
    }
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

  const exportCSV = () => {
    const headers = ['Tenant', 'Property', 'Amount', 'Due Date', 'Paid Date', 'Status', 'Method'];
    const rows = filteredPayments.map(p => [
      p.tenant,
      p.property,
      p.amount.toFixed(2),
      new Date(p.dueDate).toLocaleDateString(),
      p.paidDate ? new Date(p.paidDate).toLocaleDateString() : '-',
      p.status,
      p.method || '-'
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading) {
    return (
      <div style={{ padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: '#666', fontSize: '16px' }}>Loading payments...</p>
      </div>
    );
  }

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
                {formatCurrency(stats.totalCollected)}
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
                {formatCurrency(stats.pendingPayments)}
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
                {formatCurrency(stats.overdueAmount)}
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
            <button onClick={exportCSV} style={{
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
            <button onClick={() => setShowRecordModal(true)} style={{
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
          overflowX: 'auto'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 2fr) minmax(180px, 1.5fr) 120px 120px 120px 140px 160px',
          gap: '20px',
          padding: '20px 24px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e5e5e5',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          minWidth: '1100px' // Ensure minimum width to prevent squashing
        }}>
          <span>Tenant</span>
          <span>Property</span>
          <span>Amount</span>
          <span>Due Date</span>
          <span>Paid Date</span>
          <span>Status</span>
          <span>Method</span>
        </div>

        {filteredPayments.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: '#666' }}>
            No payments found
          </div>
        ) : (
          filteredPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.7 + index * 0.05 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 2fr) minmax(180px, 1.5fr) 120px 120px 120px 140px 160px',
                gap: '20px',
                padding: '20px 24px',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '14px',
                alignItems: 'center',
                minWidth: '1100px' // Match header width
              }}
            >
              <span style={{ fontWeight: '500', color: '#1a1a1a' }}>{payment.tenant}</span>
              <span style={{ color: '#666' }}>{payment.property}</span>
              <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{formatCurrency(payment.amount)}</span>
              <span style={{ color: '#666' }}>{new Date(payment.dueDate).toLocaleDateString()}</span>
              <span style={{ color: '#666' }}>{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}</span>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  color: getStatusColor(payment.status),
                  backgroundColor: getStatusBackground(payment.status),
                  width: 'fit-content' // Prevent stretching in grid
                }}
              >
                {payment.status}
              </span>
              <span style={{ color: '#666' }}>{payment.method || '-'}</span>
            </motion.div>
          ))
        )}
      </motion.div>

      <AnimatePresence>
        {showRecordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}
            onClick={() => setShowRecordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white', borderRadius: '12px', padding: '24px',
                width: '90%', maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                  Record Payment
                </h3>
                <button onClick={() => setShowRecordModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Tenant *</label>
                  <select
                    value={newPayment.tenantId}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, tenantId: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                  >
                    <option value="">Select a tenant</option>
                    {tenantsList.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Property *</label>
                  <select
                    value={newPayment.propertyId}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, propertyId: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                  >
                    <option value="">Select a property</option>
                    {propertiesList.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Amount *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Due Date *</label>
                    <input
                      type="date"
                      value={newPayment.dueDate}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, dueDate: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Type</label>
                    <select
                      value={newPayment.type}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, type: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                    >
                      <option value="rent">Rent</option>
                      <option value="deposit">Deposit</option>
                      <option value="late-fee">Late Fee</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="utility">Utility</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Payment Method</label>
                    <select
                      value={newPayment.method}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, method: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                    >
                      <option value="online">Online</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                      <option value="credit-card">Credit Card</option>
                      <option value="debit-card">Debit Card</option>
                      <option value="ach">ACH</option>
                      <option value="wire">Wire</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Description *</label>
                  <input
                    type="text"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g. January 2024 Rent"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <Button variant="outline" onClick={() => setShowRecordModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleRecordPayment}
                    disabled={recording || !newPayment.tenantId || !newPayment.propertyId || !newPayment.amount || !newPayment.description}
                  >
                    {recording ? 'Recording...' : 'Record Payment'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaymentsPage;
