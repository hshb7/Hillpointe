import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Plus, AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Table } from '../components/ui';
import type { MaintenanceRequest, Property } from '../types';
import { maintenanceApi, propertiesApi } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const Maintenance: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    propertyId: '',
    tenantId: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'other' as 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other',
  });
  const fetchData = async () => {
    try {
      const [maintRes, propRes] = await Promise.all([
        maintenanceApi.getAll(),
        propertiesApi.getAll(),
      ]);
      setRequests(maintRes.data);
      setProperties(propRes.data);
    } catch (err) {
      console.error('Failed to fetch maintenance data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async () => {
    if (!newRequest.title || !newRequest.propertyId || !newRequest.description) return;
    setCreating(true);
    try {
      await maintenanceApi.create({
        title: newRequest.title,
        description: newRequest.description,
        propertyId: newRequest.propertyId,
        tenantId: newRequest.tenantId || undefined,
        priority: newRequest.priority,
        category: newRequest.category,
        status: 'pending',
        images: [],
      });
      setShowCreateModal(false);
      setNewRequest({ title: '', description: '', propertyId: '', tenantId: '', priority: 'medium', category: 'other' });
      await fetchData();
    } catch (err) {
      console.error('Failed to create maintenance request:', err);
    } finally {
      setCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'assigned': return 'info';
      case 'in_progress': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPropertyName = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    return property?.name || 'Unknown Property';
  };

  const tableColumns = [
    {
      key: 'title',
      label: 'Request',
      sortable: true,
      render: (value: string, row: MaintenanceRequest) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{getPropertyName(row.propertyId)}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: string) => (
        <span className="capitalize text-gray-900">{value}</span>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (value: string) => (
        <Badge variant={getPriorityColor(value)} className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={getStatusColor(value)} className="capitalize">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'cost',
      label: 'Cost',
      render: (value: number | undefined) => (
        <span className="text-gray-900">
          {value ? formatCurrency(value) : 'TBD'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => (
        <span className="text-gray-900">{formatDate(value)}</span>
      ),
    },
  ];

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress' || r.status === 'assigned').length,
    completed: requests.filter(r => r.status === 'completed').length,
    urgent: requests.filter(r => r.priority === 'urgent').length,
  };

  return (
    <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600">Track and manage maintenance activities</p>
          </div>
          <Button iconLeft={<Plus size={20} />} onClick={() => setShowCreateModal(true)}>
            Create Request
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Wrench className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Urgent</p>
                    <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {stats.urgent > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <AlertTriangle size={20} />
                  <span>Urgent Requests Requiring Attention</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requests
                    .filter(r => r.priority === 'urgent')
                    .map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <h4 className="font-medium text-gray-900">{request.title}</h4>
                          <p className="text-sm text-gray-600">{getPropertyName(request.propertyId)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="error" size="sm">
                            {request.priority}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedRequest(request); setShowDetailModal(true); }}>
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Maintenance Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table
                data={requests}
                columns={tableColumns}
                searchable={true}
                searchPlaceholder="Search requests..."
                emptyMessage="No maintenance requests found"
              />
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'white', borderRadius: '12px', padding: '24px',
                  width: '90%', maxWidth: '550px', maxHeight: '80vh', overflowY: 'auto'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    Create Maintenance Request
                  </h3>
                  <button onClick={() => setShowCreateModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Title *</label>
                    <input
                      type="text"
                      value={newRequest.title}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief description of the issue"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Property *</label>
                    <select
                      value={newRequest.propertyId}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, propertyId: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                    >
                      <option value="">Select a property</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Priority</label>
                      <select
                        value={newRequest.priority}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value as any }))}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Category</label>
                      <select
                        value={newRequest.category}
                        onChange={(e) => setNewRequest(prev => ({ ...prev, category: e.target.value as any }))}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                      >
                        <option value="plumbing">Plumbing</option>
                        <option value="electrical">Electrical</option>
                        <option value="hvac">HVAC</option>
                        <option value="appliance">Appliance</option>
                        <option value="structural">Structural</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Description *</label>
                    <textarea
                      value={newRequest.description}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the maintenance issue..."
                      rows={4}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleCreateRequest}
                      disabled={creating || !newRequest.title || !newRequest.propertyId || !newRequest.description}
                    >
                      {creating ? 'Creating...' : 'Create Request'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDetailModal && selectedRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}
              onClick={() => { setShowDetailModal(false); setSelectedRequest(null); }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'white', borderRadius: '12px', padding: '24px',
                  width: '90%', maxWidth: '500px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    Maintenance Request Details
                  </h3>
                  <button onClick={() => { setShowDetailModal(false); setSelectedRequest(null); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{selectedRequest.title}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{selectedRequest.description}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Property</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{getPropertyName(selectedRequest.propertyId)}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Category</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '500', color: '#1f2937', textTransform: 'capitalize' }}>{selectedRequest.category}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Priority</span>
                      <div style={{ marginTop: '4px' }}>
                        <Badge variant={getPriorityColor(selectedRequest.priority)} className="capitalize">{selectedRequest.priority}</Badge>
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Status</span>
                      <div style={{ marginTop: '4px' }}>
                        <Badge variant={getStatusColor(selectedRequest.status)} className="capitalize">{selectedRequest.status.replace('_', ' ')}</Badge>
                      </div>
                    </div>
                    {selectedRequest.cost && (
                      <div>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>Cost</span>
                        <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{formatCurrency(selectedRequest.cost)}</p>
                      </div>
                    )}
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Created</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{formatDate(selectedRequest.createdAt)}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <Button variant="outline" onClick={() => { setShowDetailModal(false); setSelectedRequest(null); }}>
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
};

export default Maintenance;