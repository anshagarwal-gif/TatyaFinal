import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

const ClusterMap = ({ farms = [], clusters = [], onLocationSelect, selectedLocation, className, style }) => {
  const defaultCenter = [18.1507, 74.5760]; // Baramati

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      className={className}
      style={{ height: '100%', width: '100%', borderRadius: '0px', ...style }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Click Listener for adding farms */}
      {onLocationSelect && <LocationMarker onLocationSelect={onLocationSelect} />}

      {/* Selected Location Marker (New Farm) */}
      {selectedLocation && (
        <Marker position={selectedLocation}>
          <Popup>New Farm Location</Popup>
        </Marker>
      )}

      {/* Existing Farms */}
      {farms.map((farm) => (
        <Marker key={farm.id} position={[farm.latitude, farm.longitude]}>
          <Popup>
            <b>{farm.name}</b><br />
            {farm.areaAcres} Acres
          </Popup>
        </Marker>
      ))}

      {/* Clusters (Circles) */}
      {clusters.map((cluster) =>
        // Visualizing cluster as circles around its farms is complex, 
        // for now we draw a circle around the first farm or centroid if calculated.
        // Or if backend sends a centroid. We'll iterate farms in cluster.
        cluster.farms && cluster.farms.map((farm) => (
          <Circle
            key={`c-${cluster.id}-f-${farm.id}`}
            center={[farm.latitude, farm.longitude]}
            radius={2000} // Visual radius, slightly smaller than service radius
            pathOptions={{ color: cluster.status === 'ACTIVE' ? 'green' : 'blue', fillColor: cluster.status === 'ACTIVE' ? 'green' : 'blue' }}
          />
        ))
      )}
    </MapContainer>
  );
};

export default ClusterMap;
