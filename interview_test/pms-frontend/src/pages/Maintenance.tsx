import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Table } from '../components/ui';
import type { MaintenanceRequest } from '../types';
import { sampleMaintenanceRequests, sampleProperties } from '../data/sampleData';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const Maintenance: React.FC = () => {
  const [requests] = useState<MaintenanceRequest[]>(sampleMaintenanceRequests);

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
    const property = sampleProperties.find(p => p.id === propertyId);
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
    <div style={{ padding: '30px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
          Maintenance Requests
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Track and manage maintenance activities
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600">Track and manage maintenance activities</p>
          </div>
          <Button leftIcon={<Plus size={20} />}>
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
                          <Button size="sm" variant="outline">
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
      </div>
    </div>
  );
};

export default Maintenance;