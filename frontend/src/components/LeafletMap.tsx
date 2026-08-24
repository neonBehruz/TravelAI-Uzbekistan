import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Place } from '../types';
import { Volume2, Navigation, Star } from 'lucide-react';
import { useAudioGuide } from '../context/AudioGuideContext';

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  places: Place[];
  selectedPlace?: Place | null;
  onSelectPlace?: (place: Place) => void;
  userLocation?: { latitude: number; longitude: number };
  routeCoordinates?: [number, number][];
}

// Custom Marker Icons
const createCustomIcon = (color: string, isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: ${isSelected ? '38px' : '30px'};
        height: ${isSelected ? '38px' : '30px'};
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #ffffff;
        box-shadow: 0 0 15px ${color};
        transition: all 0.3s ease;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #070D1E;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
  });
};

const userGpsIcon = L.divIcon({
  className: 'user-gps-marker',
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #05B2D2; opacity: 0.4; animation: pulse-radar 2s infinite;"></div>
      <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-radius: 50%; background: #00A896; border: 2px solid #ffffff; box-shadow: 0 0 10px #05B2D2;"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Map Controller for auto-centering
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 14,
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
  routeCoordinates
}) => {
  const { playAudio } = useAudioGuide();

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%', background: '#070D1E' }}
        zoomControl={true}
      >
        <ChangeView center={center} zoom={zoom} />

        {/* CartoDB Dark Matter tile layer for luxury dark theme */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* User GPS Marker */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userGpsIcon}>
            <Popup>
              <div style={{ color: '#070D1E', fontWeight: 700, padding: '4px' }}>
                🔵 Your Current Position
              </div>
            </Popup>
          </Marker>
        )}

        {/* Place Markers */}
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const icon = createCustomIcon(
            isSelected ? '#D4AF37' : '#00A896',
            isSelected
          );

          return (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectPlace && onSelectPlace(place)
              }}
            >
              <Popup>
                <div style={{ color: '#070D1E', width: '220px', fontFamily: 'sans-serif' }}>
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                  />
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>{place.name}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{place.categoryName}</div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#D4AF37' }}>
                      ★ {place.rating}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#00A896' }}>
                      {place.ticketPriceUzs > 0 ? `${place.ticketPriceUzs.toLocaleString()} UZS` : 'Free Entry'}
                    </span>
                  </div>

                  <button
                    onClick={() => playAudio(place.name, place.audioGuideScript, 'en')}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      padding: '6px',
                      background: '#00A896',
                      color: '#fff',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Volume2 size={14} /> Listen to AI Guide
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Polyline if route is active */}
        {routeCoordinates && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: '#00A896',
              weight: 5,
              opacity: 0.85,
              dashArray: '8, 8'
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};
