import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Property, MaintenanceRequest, Appointment, MapMarker } from '../types';

const DefaultIcon = L.divIcon({
  html: `<div class="custom-marker">📍</div>`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'custom-div-icon'
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyMapProps {
  properties?: Property[];
  maintenanceRequests?: MaintenanceRequest[];
  appointments?: Appointment[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties = [],
  maintenanceRequests = [],
  appointments = [],
  center = [39.8283, -98.5795],
  zoom = 4,
  height = '400px',
  className = '',
  onMarkerClick,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    markersRef.current = L.layerGroup().addTo(mapRef.current);

    const style = document.createElement('style');
    style.textContent = `
      .custom-div-icon {
        background: transparent;
        border: none;
      }
      .custom-marker {
        font-size: 24px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
      }
      .property-marker {
        background: #2d5a41;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .maintenance-marker {
        background: #f59e0b;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .appointment-marker {
        background: #3b82f6;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    const map = mapRef.current;
    const markersGroup = markersRef.current;

    const markers: MapMarker[] = [];

    properties.forEach((property) => {
      const marker: MapMarker = {
        id: property.id,
        position: [property.latitude, property.longitude],
        title: property.name,
        type: 'property',
        data: property,
      };
      markers.push(marker);

      const customIcon = L.divIcon({
        html: `<div class="property-marker">🏢</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
        className: 'custom-div-icon'
      });

      const leafletMarker = L.marker([property.latitude, property.longitude], { icon: customIcon })
        .bindPopup(`
          <div class="p-3">
            <h3 class="font-semibold text-gray-900 mb-1">${property.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${property.address}, ${property.city}</p>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium capitalize">${property.type}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Rent:</span>
                <span class="font-medium">$${property.rent.toLocaleString()}/mo</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium capitalize">${property.status}</span>
              </div>
            </div>
          </div>
        `)
        .addTo(markersGroup);

      leafletMarker.on('click', () => {
        onMarkerClick?.(marker);
      });
    });

    maintenanceRequests.forEach((request) => {
      const property = properties.find(p => p.id === request.propertyId);
      if (!property) return;

      const marker: MapMarker = {
        id: request.id,
        position: [property.latitude, property.longitude],
        title: request.title,
        type: 'maintenance',
        data: request,
      };
      markers.push(marker);

      const customIcon = L.divIcon({
        html: `<div class="maintenance-marker">🔧</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
        className: 'custom-div-icon'
      });

      const leafletMarker = L.marker([property.latitude, property.longitude], { icon: customIcon })
        .bindPopup(`
          <div class="p-3">
            <h3 class="font-semibold text-gray-900 mb-1">${request.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${property.name}</p>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Priority:</span>
                <span class="font-medium capitalize">${request.priority}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Category:</span>
                <span class="font-medium capitalize">${request.category}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium capitalize">${request.status}</span>
              </div>
            </div>
          </div>
        `)
        .addTo(markersGroup);

      leafletMarker.on('click', () => {
        onMarkerClick?.(marker);
      });
    });

    appointments.forEach((appointment) => {
      if (!appointment.propertyId) return;

      const property = properties.find(p => p.id === appointment.propertyId);
      if (!property) return;

      const marker: MapMarker = {
        id: appointment.id,
        position: [property.latitude, property.longitude],
        title: appointment.title,
        type: 'appointment',
        data: appointment,
      };
      markers.push(marker);

      const customIcon = L.divIcon({
        html: `<div class="appointment-marker">📅</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
        className: 'custom-div-icon'
      });

      const leafletMarker = L.marker([property.latitude, property.longitude], { icon: customIcon })
        .bindPopup(`
          <div class="p-3">
            <h3 class="font-semibold text-gray-900 mb-1">${appointment.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${property.name}</p>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium capitalize">${appointment.type}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Date:</span>
                <span class="font-medium">${new Date(appointment.startTime).toLocaleDateString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Status:</span>
                <span class="font-medium capitalize">${appointment.status}</span>
              </div>
            </div>
          </div>
        `)
        .addTo(markersGroup);

      leafletMarker.on('click', () => {
        onMarkerClick?.(marker);
      });
    });

    if (markers.length > 0) {
      const group = L.featureGroup(markersGroup.getLayers());
      map.fitBounds(group.getBounds().pad(0.1));
    }

  }, [properties, maintenanceRequests, appointments, onMarkerClick]);

  return (
    <div className={`${className}`}>
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%' }}
        className="rounded-lg border border-gray-200"
      />
    </div>
  );
};

export default PropertyMap;