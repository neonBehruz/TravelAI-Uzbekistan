import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Volume2,
  Clock,
  Car,
  DollarSign,
  Star,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { LeafletMap } from '../components/LeafletMap';
import { Place, RouteCalculation } from '../types';
import { useLocation } from '../context/LocationContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { api } from '../services/api';

interface SmartMapPageProps {
  onNavigatePlace: (placeId: string) => void;
  initialRoutePlaces?: { latitude: number; longitude: number }[];
}

export const SmartMapPage: React.FC<SmartMapPageProps> = ({ onNavigatePlace, initialRoutePlaces }) => {
  const { location, recenterOnRealGps } = useLocation();
  const { playAudio } = useAudioGuide();

  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [routeInfo, setRouteInfo] = useState<RouteCalculation | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  useEffect(() => {
    async function fetchPlaces() {
      const data = await api.getPlaces(location.city);
      if (data && data.length > 0) {
        setPlaces(data);
        setSelectedPlace(data[0]);
      } else {
        const allData = await api.getPlaces();
        setPlaces(allData);
        if (allData.length > 0) setSelectedPlace(allData[0]);
      }
    }
    fetchPlaces();
  }, [location.city]);

  const filteredPlaces = places.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.categoryName.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCalculateRoute = async (targetPlace: Place) => {
    setLoadingRoute(true);
    try {
      const route = await api.calculateRoute(
        location.latitude,
        location.longitude,
        targetPlace.latitude,
        targetPlace.longitude
      );
      setRouteInfo(route);
    } catch (err) {
      console.error('Route error:', err);
    } finally {
      setLoadingRoute(false);
    }
  };

  const categories = ['All', 'Historical', 'Museum', 'Religious', 'Shopping', 'Nature'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>
      {/* Top Search & Filter Bar */}
      <div className="glass-panel" style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(255,255,255,0.05)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          minWidth: '260px'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search landmarks, bazaars, mosques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '13px' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: selectedCategory === cat ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat ? '#070D1E' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Sidebar Split View */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }} className="map-view-container">
        <style>{`
          @media (max-width: 900px) {
            .map-view-container { flex-direction: column !important; }
            .map-sidebar { width: 100% !important; max-height: 260px !important; }
          }
        `}</style>

        {/* Left Interactive Map Canvas */}
        <div style={{ flex: 1, position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', minHeight: '400px' }}>
          <LeafletMap
            center={[selectedPlace ? selectedPlace.latitude : location.latitude, selectedPlace ? selectedPlace.longitude : location.longitude]}
            zoom={14}
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={(p) => {
              setSelectedPlace(p);
              handleCalculateRoute(p);
            }}
            userLocation={{ latitude: location.latitude, longitude: location.longitude }}
            routeCoordinates={routeInfo ? routeInfo.waypoints.map(w => [w.latitude, w.longitude]) : undefined}
          />

          {/* Floating Live GPS Tracking Control on Map */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            display: 'flex',
            gap: '8px'
          }}>
            <button
              onClick={() => {
                recenterOnRealGps();
                setSelectedPlace(null);
              }}
              className="btn-secondary"
              style={{
                background: 'rgba(7, 13, 30, 0.9)',
                backdropFilter: 'blur(8px)',
                border: location.isGpsActive ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                color: location.isGpsActive ? 'var(--accent-turquoise)' : '#fff',
                fontSize: '12px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
              title="Real GPS orqali xaritani markazlashtirish"
            >
              <Navigation size={14} color={location.isGpsActive ? 'var(--accent-turquoise)' : '#fff'} />
              <span>{location.isGpsActive ? `Real GPS (±${location.accuracy}m)` : 'Real GPS ga O‘tish'}</span>
            </button>
          </div>
        </div>

        {/* Right Info & Route Details Panel */}
        <div className="glass-panel map-sidebar" style={{
          width: '380px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}>
          {selectedPlace ? (
            <div>
              <div style={{ position: 'relative', height: '150px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px' }}>
                <img src={selectedPlace.imageUrl} alt={selectedPlace.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(7,13,30,0.85)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-gold)'
                }}>
                  ★ {selectedPlace.rating}
                </span>
              </div>

              <span className="badge-gold" style={{ fontSize: '10px' }}>{selectedPlace.categoryName}</span>
              <h2 style={{ fontSize: '20px', color: '#fff', marginTop: '6px', fontWeight: 800 }}>{selectedPlace.name}</h2>
              <div style={{ fontSize: '12px', color: 'var(--text-gold)', marginBottom: '8px' }}>{selectedPlace.localName}</div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {selectedPlace.shortDescription}
              </p>

              {/* Navigation Options Breakdown */}
              {routeInfo && (
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                    Smart Transit from Current GPS
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {routeInfo.options.map((opt) => (
                      <div key={opt.mode} style={{ textAlign: 'center', padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{opt.mode}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-turquoise)' }}>{opt.formattedDuration}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          {opt.estimatedCostUzs > 0 ? `${(opt.estimatedCostUzs / 1000)}k UZS` : 'Free'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => playAudio(selectedPlace.name, selectedPlace.audioGuideScript, 'en')}
                  className="btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                >
                  <Volume2 size={16} /> Listen to AI Guide
                </button>

                <button
                  onClick={() => onNavigatePlace(selectedPlace.id)}
                  className="btn-secondary"
                  style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                >
                  Full Historical Details & Reviews
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
              Select a landmark pin on the map to view historical information and navigation routes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
