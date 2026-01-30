import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Mail, Phone, Home, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Table, Modal } from '../components/ui';
import type { Tenant, User, Property } from '../types';
import { sampleTenants, sampleUsers, sampleProperties } from '../data/sampleData';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const Tenants: React.FC = () => {
  const [tenants] = useState<Tenant[]>(sampleTenants);
  const [users] = useState<User[]>(sampleUsers);
  const [properties] = useState<Property[]>(sampleProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showTenantModal, setShowTenantModal] = useState(false);

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
    const user = users.find(u => u.id === tenant.userId);
    const property = properties.find(p => p.id === tenant.propertyId);
    return { user, property };
  };

  const tableColumns = [
    {
      key: 'name',
      label: 'Tenant',
      sortable: true,
      render: (value: any, row: Tenant) => {
        const { user } = getTenantData(row);
        return user ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-800 font-medium">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        ) : null;
      },
    },
    {
      key: 'property',
      label: 'Property',
      render: (value: any, row: Tenant) => {
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
    <Layout title="Tenants">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
            <p className="text-gray-600">Manage your tenant relationships</p>
          </div>
          <Button leftIcon={<Plus size={20} />}>
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
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
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
          data={tenants}
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
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                        <p className="text-gray-600">{user?.email}</p>
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
                            <span className="text-sm">{user?.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone size={16} className="text-gray-400" />
                            <span className="text-sm">{user?.phone || 'Not provided'}</span>
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
                      <Button variant="primary" fullWidth>
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
      </div>
    </Layout>
  );
};

export default Tenants;