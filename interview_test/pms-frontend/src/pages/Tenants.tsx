import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Mail, Phone, Home, Calendar, X } from 'lucide-react';
import { Card, CardContent, Button, Input, Badge, Table, Modal } from '../components/ui';
import type { Tenant, User, Property } from '../types';
import { tenantsApi, propertiesApi } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const Tenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    monthlyRent: 0,
    securityDeposit: 0,
    leaseStart: '',
    leaseEnd: '',
    status: 'active' as string,
  });
  const [addForm, setAddForm] = useState({
    user: '',
    property: '',
    leaseStart: '',
    leaseEnd: '',
    monthlyRent: 0,
    securityDeposit: 0,
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
  });

  const fetchData = async () => {
    try {
      const [tenantRes, propRes] = await Promise.all([
        tenantsApi.getAll(),
        propertiesApi.getAll(),
      ]);
      setTenants(tenantRes.data);
      setProperties(propRes.data);
      setUsers(tenantRes.populatedUsers as unknown as User[]);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setEditForm({
      monthlyRent: tenant.rentAmount,
      securityDeposit: tenant.securityDeposit,
      leaseStart: tenant.leaseStart ? tenant.leaseStart.split('T')[0] : '',
      leaseEnd: tenant.leaseEnd ? tenant.leaseEnd.split('T')[0] : '',
      status: tenant.status,
    });
    setShowEditModal(true);
  };

  const handleEditTenant = async () => {
    if (!selectedTenant) return;
    setSaving(true);
    try {
      await tenantsApi.update(selectedTenant.id, {
        monthlyRent: editForm.monthlyRent,
        securityDeposit: editForm.securityDeposit,
        leaseStart: editForm.leaseStart,
        leaseEnd: editForm.leaseEnd,
        status: editForm.status,
      } as any);
      setShowEditModal(false);
      await fetchData();
    } catch (err) {
      console.error('Failed to update tenant:', err);
      alert('Failed to update tenant.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTenant = async () => {
    if (!addForm.user || !addForm.property || !addForm.leaseStart || !addForm.leaseEnd || !addForm.emergencyName || !addForm.emergencyPhone || !addForm.emergencyRelationship) {
      alert('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      await tenantsApi.create({
        user: addForm.user,
        property: addForm.property,
        leaseStart: addForm.leaseStart,
        leaseEnd: addForm.leaseEnd,
        monthlyRent: addForm.monthlyRent,
        securityDeposit: addForm.securityDeposit,
        emergencyContact: {
          name: addForm.emergencyName,
          phone: addForm.emergencyPhone,
          relationship: addForm.emergencyRelationship,
        },
      } as any);
      setShowAddModal(false);
      setAddForm({ user: '', property: '', leaseStart: '', leaseEnd: '', monthlyRent: 0, securityDeposit: 0, emergencyName: '', emergencyPhone: '', emergencyRelationship: '' });
      await fetchData();
    } catch (err) {
      console.error('Failed to add tenant:', err);
      alert('Failed to add tenant. Make sure user and property IDs are valid.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'pending':
        return 'warning';
      case 'terminated':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTenantData = (tenant: Tenant) => {
    const user = users.find(u => u._id === tenant.userId);
    const property = properties.find(p => p.id === tenant.propertyId);
    return { user, property };
  };

  const tableColumns = [
    {
      key: 'name',
      label: 'Tenant',
      sortable: true,
      render: (_value: any, row: Tenant) => {
        const { user } = getTenantData(row);
        return user ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-800 font-medium">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{user.fullName}</div>
              <div className="text-sm text-gray-500">{user.emailAddress}</div>
            </div>
          </div>
        ) : null;
      },
    },
    {
      key: 'property',
      label: 'Property',
      render: (_value: any, row: Tenant) => {
        const { property } = getTenantData(row);
        return property ? (
          <div>
            <div className="font-medium text-gray-900">{property.name}</div>
            <div className="text-sm text-gray-500">{property.address}</div>
          </div>
        ) : null;
      },
    },
    {
      key: 'rentAmount',
      label: 'Rent',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'leaseStart',
      label: 'Lease Period',
      render: (value: string, row: Tenant) => (
        <div>
          <div className="text-gray-900">{formatDate(value)}</div>
          <div className="text-sm text-gray-500">to {formatDate(row.leaseEnd)}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge variant={getStatusColor(value)} className="capitalize">
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <div title="Tenants">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
            <p className="text-gray-600">Manage your tenant relationships</p>
          </div>
          <Button iconLeft={<Plus size={20} />} onClick={() => setShowAddModal(true)}>
            Add Tenant
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Tenants</p>
                    <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Leases</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tenants.filter(t => t.status === 'active').length}
                    </p>
                  </div>
                  <Home className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Applications</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tenants.filter(t => t.status === 'pending').length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(tenants.reduce((sum, t) => sum + t.rentAmount, 0))}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-800 text-lg">$</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={16} />}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Table
          data={tenants.filter(t => statusFilter === 'all' || t.status === statusFilter)}
          columns={tableColumns}
          searchable={false}
          emptyMessage="No tenants found"
          onRowClick={(tenant) => {
            setSelectedTenant(tenant);
            setShowTenantModal(true);
          }}
        />

        <Modal
          isOpen={showTenantModal}
          onClose={() => setShowTenantModal(false)}
          title="Tenant Details"
          size="lg"
        >
          {selectedTenant && (
            <div className="space-y-6">
              {(() => {
                const { user, property } = getTenantData(selectedTenant);
                return (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-800 font-medium text-xl">
                          {user?.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{user?.fullName}</h3>
                        <p className="text-gray-600">{user?.emailAddress}</p>
                        <Badge variant={getStatusColor(selectedTenant.status)} className="capitalize mt-1">
                          {selectedTenant.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Mail size={16} className="text-gray-400" />
                            <span className="text-sm">{user?.emailAddress}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone size={16} className="text-gray-400" />
                            <span className="text-sm">{user?.phoneNumber || 'Not provided'}</span>
                          </div>
                        </div>

                        {selectedTenant.emergencyContact && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-2">Emergency Contact</h5>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div>{selectedTenant.emergencyContact.name}</div>
                              <div>{selectedTenant.emergencyContact.phone}</div>
                              <div className="capitalize">{selectedTenant.emergencyContact.relationship}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Lease Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Property:</span>
                            <span className="font-medium">{property?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rent Amount:</span>
                            <span className="font-medium">{formatCurrency(selectedTenant.rentAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Security Deposit:</span>
                            <span className="font-medium">{formatCurrency(selectedTenant.securityDeposit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lease Start:</span>
                            <span className="font-medium">{formatDate(selectedTenant.leaseStart)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lease End:</span>
                            <span className="font-medium">{formatDate(selectedTenant.leaseEnd)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                      <Button variant="primary" fullWidth onClick={() => { setShowTenantModal(false); openEditModal(selectedTenant); }}>
                        Edit Tenant
                      </Button>
                      <Button variant="outline" onClick={() => setShowTenantModal(false)}>
                        Close
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </Modal>

        {/* Edit Tenant Modal */}
        <AnimatePresence>
          {showEditModal && selectedTenant && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
              onClick={() => setShowEditModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '480px', maxWidth: '90vw' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Edit Tenant Lease</h3>
                  <button onClick={() => setShowEditModal(false)} className="p-1"><X size={20} color="#666" /></button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
                      <input type="number" value={editForm.monthlyRent} onChange={(e) => setEditForm(p => ({ ...p, monthlyRent: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit ($)</label>
                      <input type="number" value={editForm.securityDeposit} onChange={(e) => setEditForm(p => ({ ...p, securityDeposit: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start</label>
                      <input type="date" value={editForm.leaseStart} onChange={(e) => setEditForm(p => ({ ...p, leaseStart: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lease End</label>
                      <input type="date" value={editForm.leaseEnd} onChange={(e) => setEditForm(p => ({ ...p, leaseEnd: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={editForm.status} onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="primary" fullWidth onClick={handleEditTenant} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Tenant Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', width: '520px', maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add New Tenant</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-1"><X size={20} color="#666" /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User *</label>
                    <select value={addForm.user} onChange={(e) => setAddForm(p => ({ ...p, user: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Select a user...</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.fullName} ({u.emailAddress})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                    <select value={addForm.property} onChange={(e) => setAddForm(p => ({ ...p, property: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="">Select a property...</option>
                      {properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — {p.address}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lease Start *</label>
                      <input type="date" value={addForm.leaseStart} onChange={(e) => setAddForm(p => ({ ...p, leaseStart: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lease End *</label>
                      <input type="date" value={addForm.leaseEnd} onChange={(e) => setAddForm(p => ({ ...p, leaseEnd: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
                      <input type="number" value={addForm.monthlyRent} onChange={(e) => setAddForm(p => ({ ...p, monthlyRent: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit ($)</label>
                      <input type="number" value={addForm.securityDeposit} onChange={(e) => setAddForm(p => ({ ...p, securityDeposit: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                  <hr className="my-2" />
                  <p className="text-sm font-medium text-gray-700">Emergency Contact *</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Name</label>
                      <input value={addForm.emergencyName} onChange={(e) => setAddForm(p => ({ ...p, emergencyName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Phone</label>
                      <input value={addForm.emergencyPhone} onChange={(e) => setAddForm(p => ({ ...p, emergencyPhone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Relationship</label>
                      <input value={addForm.emergencyRelationship} onChange={(e) => setAddForm(p => ({ ...p, emergencyRelationship: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="primary" fullWidth onClick={handleAddTenant} disabled={saving}>
                    {saving ? 'Adding...' : 'Add Tenant'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tenants;