import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Building, Wrench, Calendar, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui';
import PropertyMap from '../components/PropertyMap';
import type { Property, MaintenanceRequest, Appointment, MapMarker } from '../types';
import { propertiesApi, maintenanceApi } from '../services/api';

const MapView: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [appointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, maintRes] = await Promise.all([
          propertiesApi.getAll(),
          maintenanceApi.getAll(),
        ]);
        setProperties(propRes.data);
        setMaintenanceRequests(maintRes.data);
      } catch (err) {
        console.error('Failed to fetch map data:', err);
      }
    };
    fetchData();
  }, []);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [showProperties, setShowProperties] = useState(true);
  const [showMaintenance, setShowMaintenance] = useState(true);
  const [showAppointments, setShowAppointments] = useState(true);

  const filteredProperties = showProperties ? properties : [];
  const filteredMaintenance = showMaintenance ? maintenanceRequests : [];
  const filteredAppointments = showAppointments ? appointments : [];

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const getMarkerTypeIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Building size={16} className="text-emerald-600" />;
      case 'maintenance':
        return <Wrench size={16} className="text-yellow-600" />;
      case 'appointment':
        return <Calendar size={16} className="text-blue-600" />;
      default:
        return <Map size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'info';
      case 'maintenance':
        return 'warning';
      case 'urgent':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div title="Map View">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Map</h1>
            <p className="text-gray-600">Interactive map view of your properties and activities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Map size={20} className="text-emerald-800" />
                      <span>Property Locations</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={showProperties ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setShowProperties(!showProperties)}
                      >
                        <Building size={14} className="mr-1" />
                        Properties
                      </Button>
                      <Button
                        variant={showMaintenance ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setShowMaintenance(!showMaintenance)}
                      >
                        <Wrench size={14} className="mr-1" />
                        Maintenance
                      </Button>
                      <Button
                        variant={showAppointments ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setShowAppointments(!showAppointments)}
                      >
                        <Calendar size={14} className="mr-1" />
                        Appointments
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <PropertyMap
                    properties={filteredProperties}
                    maintenanceRequests={filteredMaintenance}
                    appointments={filteredAppointments}
                    height="500px"
                    onMarkerClick={handleMarkerClick}
                    center={[39.8283, -98.5795]}
                    zoom={4}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-800 rounded-full flex items-center justify-center text-white text-xs">
                      🏢
                    </div>
                    <span className="text-sm text-gray-700">Properties</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">
                      🔧
                    </div>
                    <span className="text-sm text-gray-700">Maintenance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                      📅
                    </div>
                    <span className="text-sm text-gray-700">Appointments</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Properties</span>
                    <Badge variant="info">{properties.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Maintenance</span>
                    <Badge variant="warning">{maintenanceRequests.filter(r => r.status === 'pending').length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Upcoming Appointments</span>
                    <Badge variant="info">{appointments.filter(a => a.status === 'scheduled').length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Urgent Issues</span>
                    <Badge variant="error">{maintenanceRequests.filter(r => r.priority === 'urgent').length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {selectedMarker && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {getMarkerTypeIcon(selectedMarker.type)}
                      <span>Selected Item</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">{selectedMarker.title}</h3>

                      {selectedMarker.type === 'property' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium capitalize">{selectedMarker.data.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge variant={getStatusColor(selectedMarker.data.status)} size="sm" className="capitalize">
                              {selectedMarker.data.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rent:</span>
                            <span className="font-medium">${selectedMarker.data.rent.toLocaleString()}/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Size:</span>
                            <span className="font-medium">{selectedMarker.data.sqft} sqft</span>
                          </div>
                        </div>
                      )}

                      {selectedMarker.type === 'maintenance' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Priority:</span>
                            <Badge variant={getStatusColor(selectedMarker.data.priority)} size="sm" className="capitalize">
                              {selectedMarker.data.priority}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium capitalize">{selectedMarker.data.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge variant={getStatusColor(selectedMarker.data.status)} size="sm" className="capitalize">
                              {selectedMarker.data.status}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-600">{selectedMarker.data.description}</p>
                          </div>
                        </div>
                      )}

                      {selectedMarker.type === 'appointment' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium capitalize">{selectedMarker.data.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{new Date(selectedMarker.data.startTime).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium">{new Date(selectedMarker.data.startTime).toLocaleTimeString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge variant={getStatusColor(selectedMarker.data.status)} size="sm" className="capitalize">
                              {selectedMarker.data.status}
                            </Badge>
                          </div>
                        </div>
                      )}

                      <Button variant="outline" size="sm" fullWidth className="mt-3" onClick={() => alert(`${selectedMarker.title}\nType: ${selectedMarker.type}\nStatus: ${selectedMarker.data.status}`)}>
                        <Eye size={14} className="mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;