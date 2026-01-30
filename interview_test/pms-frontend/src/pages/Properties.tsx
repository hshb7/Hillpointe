import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, Modal, Table } from '../components/ui';
import type { Property } from '../types';
import { sampleProperties } from '../data/sampleData';
import { formatCurrency, formatAddress } from '../utils/formatters';

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  useEffect(() => {
    setProperties(sampleProperties);
    setFilteredProperties(sampleProperties);
  }, []);

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
      render: (value: string, row: Property) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.images[0]}
            alt={row.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.type}</div>
          </div>
        </div>
      ),
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
      render: (value: any, row: Property) => (
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
          <Button variant="ghost" size="sm">
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600">
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout title="Properties">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600">Manage your property portfolio</p>
          </div>
          <Button leftIcon={<Plus size={20} />}>
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
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant={getStatusColor(property.status)} className="capitalize">
                        {property.status}
                      </Badge>
                    </div>
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
                        <Square size={14} className="mr-1" />
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
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
                  src={selectedProperty.images[0]}
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
                <Button variant="primary" fullWidth>
                  Edit Property
                </Button>
                <Button variant="outline" onClick={() => setShowPropertyModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default Properties;