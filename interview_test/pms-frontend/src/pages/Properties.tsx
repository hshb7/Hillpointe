import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { Card, CardContent, Button, Input, Badge, Modal, Table } from '../components/ui';
import type { Property } from '../types';
import { propertiesApi } from '../services/api';
import { formatCurrency, formatAddress } from '../utils/formatters';
import { sampleProperties } from '../data/sampleData';

const emptyForm = {
  name: '',
  type: 'apartment' as string,
  street: '',
  city: '',
  state: '',
  zipCode: '',
  description: '',
  bedrooms: 0,
  bathrooms: 0,
  sqft: 0,
  rent: 0,
};

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const fetchProperties = async () => {
    try {
      const res = await propertiesApi.getAll();
      setProperties(res.data);
      setFilteredProperties(res.data);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddProperty = async () => {
    if (!formData.name || !formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.description) return;
    setSaving(true);
    try {
      await propertiesApi.create({
        name: formData.name,
        type: formData.type as Property['type'],
        address: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        description: formData.description,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.sqft,
        rent: formData.rent,
      } as any);
      setShowAddModal(false);
      setFormData({ ...emptyForm });
      await fetchProperties();
    } catch (err) {
      console.error('Failed to add property:', err);
      alert('Failed to add property. Please check all required fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProperty = async () => {
    if (!selectedProperty) return;
    setSaving(true);
    try {
      await propertiesApi.update(selectedProperty.id, {
        name: formData.name,
        type: formData.type as Property['type'],
        description: formData.description,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        sqft: formData.sqft,
        rent: formData.rent,
      } as any);
      setShowEditModal(false);
      setFormData({ ...emptyForm });
      await fetchProperties();
    } catch (err) {
      console.error('Failed to update property:', err);
      alert('Failed to update property.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    if (!confirm(`Delete "${property.name}"? This action cannot be undone.`)) return;
    try {
      await propertiesApi.delete(property.id);
      await fetchProperties();
    } catch (err) {
      console.error('Failed to delete property:', err);
      alert('Failed to delete property.');
    }
  };

  const openEditModal = (property: Property) => {
    setSelectedProperty(property);
    setFormData({
      name: property.name,
      type: property.type,
      street: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      description: property.description || '',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      rent: property.rent,
    });
    setShowEditModal(true);
  };

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(property => property.type === typeFilter);
    }

    setFilteredProperties(filtered);
  }, [properties, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'info';
      case 'maintenance':
        return 'warning';
      case 'vacant':
        return 'default';
      default:
        return 'default';
    }
  };

  const tableColumns = [
    {
      key: 'name',
      label: 'Property',
      sortable: true,
      render: (value: string, row: Property, index: number) => {
        // Use image from property, or fallback to matching sample property, or cycle through samples
        const displayImage = row.images[0] ||
          sampleProperties.find(p => p.id === row.id)?.images[0] ||
          sampleProperties[index % sampleProperties.length].images[0];

        return (
          <div className="flex items-center space-x-3">
            <img
              src={displayImage}
              alt={row.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{row.type}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (value: string, row: Property) => (
        <div>
          <div className="text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.city}, {row.state}</div>
        </div>
      ),
    },
    {
      key: 'rent',
      label: 'Rent',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'bedrooms',
      label: 'Bed/Bath',
      render: (value: number, row: Property) => (
        <span className="text-gray-900">{value}bd / {row.bathrooms}ba</span>
      ),
    },
    {
      key: 'sqft',
      label: 'Sqft',
      sortable: true,
      render: (value: number) => (
        <span className="text-gray-900">{value.toLocaleString()} sq ft</span>
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
    {
      key: 'actions',
      label: 'Actions',
      render: (_value: any, row: Property) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedProperty(row);
              setShowPropertyModal(true);
            }}
          >
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteProperty(row)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div title="Properties">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600">Manage your property portfolio</p>
          </div>
          <Button iconLeft={<Plus size={20} />} onClick={() => { setFormData({ ...emptyForm }); setShowAddModal(true); }}>
            Add Property
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={16} />}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="vacant">Vacant</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="commercial">Commercial</option>
                  <option value="condo">Condo</option>
                </select>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-emerald-800 text-white' : 'text-gray-600'}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-emerald-800 text-white' : 'text-gray-600'}`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => {
              // Use image from property, or fallback to matching sample property, or cycle through samples
              const displayImage = property.images[0] ||
                sampleProperties.find(p => p.id === property.id)?.images[0] ||
                sampleProperties[index % sampleProperties.length].images[0];

              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card hover className="overflow-hidden">
                    <div className="relative">
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant={getStatusColor(property.status)}>{property.status}</Badge>
                      </div>
                      <img
                        src={displayImage}
                        alt={property.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-medium text-gray-900">
                          {formatCurrency(property.rent)}/mo
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {property.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {formatAddress(property.address, property.city, property.state, property.zipCode)}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Bed size={14} className="mr-1" />
                          {property.bedrooms} bed
                        </span>
                        <span className="flex items-center">
                          <Bath size={14} className="mr-1" />
                          {property.bathrooms} bath
                        </span>
                        <span className="flex items-center">
                          <Ruler size={14} className="mr-1" />
                          {property.sqft} sqft
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowPropertyModal(true);
                          }}
                        >
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(property)}>
                          <Edit size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Table
            data={filteredProperties}
            columns={tableColumns}
            searchable={false}
            emptyMessage="No properties found"
          />
        )}

        <Modal
          isOpen={showPropertyModal}
          onClose={() => setShowPropertyModal(false)}
          title="Property Details"
          size="lg"
        >
          {selectedProperty && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <img
                  src={selectedProperty.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80'}
                  alt={selectedProperty.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedProperty.name}
                  </h3>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {formatAddress(
                      selectedProperty.address,
                      selectedProperty.city,
                      selectedProperty.state,
                      selectedProperty.zipCode
                    )}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{selectedProperty.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rent:</span>
                      <span className="font-medium">{formatCurrency(selectedProperty.rent)}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{selectedProperty.sqft} sqft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{selectedProperty.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{selectedProperty.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant={getStatusColor(selectedProperty.status)} className="capitalize">
                        {selectedProperty.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {selectedProperty.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedProperty.description}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProperty.amenities.map((amenity, index) => (
                    <Badge key={index} variant="default">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="primary" fullWidth onClick={() => { setShowPropertyModal(false); openEditModal(selectedProperty); }}>
                  Edit Property
                </Button>
                <Button variant="outline" onClick={() => setShowPropertyModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add/Edit Property Modal */}
        <AnimatePresence>
          {(showAddModal || showEditModal) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}
              onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'white', borderRadius: '12px', padding: '24px',
                  width: '560px', maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {showEditModal ? 'Edit Property' : 'Add New Property'}
                  </h3>
                  <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="p-1">
                    <X size={20} color="#666" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="e.g. Sunset Apartments"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="commercial">Commercial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent ($)</label>
                      <input
                        type="number"
                        value={formData.rent}
                        onChange={(e) => setFormData(p => ({ ...p, rent: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {showAddModal && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                        <input
                          value={formData.street}
                          onChange={(e) => setFormData(p => ({ ...p, street: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="123 Main St"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <input
                            value={formData.city}
                            onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                          <input
                            value={formData.state}
                            onChange={(e) => setFormData(p => ({ ...p, state: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Zip *</label>
                          <input
                            value={formData.zipCode}
                            onChange={(e) => setFormData(p => ({ ...p, zipCode: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData(p => ({ ...p, bedrooms: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData(p => ({ ...p, bathrooms: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sqft</label>
                      <input
                        type="number"
                        value={formData.sqft}
                        onChange={(e) => setFormData(p => ({ ...p, sqft: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-vertical"
                      placeholder="Describe the property..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={showEditModal ? handleEditProperty : handleAddProperty}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : showEditModal ? 'Save Changes' : 'Add Property'}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Properties;