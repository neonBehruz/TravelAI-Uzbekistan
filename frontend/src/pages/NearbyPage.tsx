import React, { useState, useEffect } from 'react';
import {
  Radio,
  MapPin,
  Clock,
  Star,
  DollarSign,
  Volume2,
  Navigation,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { NearbyPlace, Place } from '../types';
import { api } from '../services/api';

interface NearbyPageProps {
  onNavigatePlace: (placeId: string) => void;
  onOpenMap: () => void;
}

export const NearbyPage: React.FC<NearbyPageProps> = ({ onNavigatePlace, onOpenMap }) => {
  const { location } = useLocation();
  const { playAudio } = useAudioGuide();

  const [nearbyList, setNearbyList] = useState<NearbyPlace[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [nearbyData, placesData] = await Promise.all([
        api.getNearbyPlaces(location.latitude, location.longitude, 10.0),
        api.getPlaces('Samarkand')
      ]);
      setNearbyList(nearbyData);
      setPlaces(placesData);
      setLoading(false);
    }
    load();
  }, [location.latitude, location.longitude]);

  const categories = ['All', 'Historical Landmark', 'Museum', 'Religious Site', 'Bazaar & Shopping', 'Craft Village & Nature'];

  const filtered = nearbyList.filter((item) =>
    activeCategory === 'All' ? true : item.category.toLowerCase().includes(activeCategory.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.15), rgba(13, 22, 48, 0.9))',
        border: '1px solid var(--border-active)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div className="badge-turquoise" style={{ marginBottom: '8px' }}>
            <Radio size={12} /> Live GPS Geofence Radar
          </div>
          <h1 style={{ fontSize: '28px', color: '#fff' }}>Nearby Attractions & Hidden Gems</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Showing places calculated from your current coordinates in {location.city} ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
          </p>
        </div>

        <button onClick={onOpenMap} className="btn-primary">
          <MapPin size={16} /> View on Map
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: activeCategory === cat ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.04)',
              color: activeCategory === cat ? '#070D1E' : '#fff',
              fontSize: '13px',
              fontWeight: 700,
              border: activeCategory === cat ? 'none' : '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Nearby Places Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ position: 'relative', height: '170px' }}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(7, 13, 30, 0.9)',
                backdropFilter: 'blur(10px)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--accent-turquoise)',
                border: '1px solid var(--border-active)'
              }}>
                📍 {item.formattedDistance}
              </div>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge-gold" style={{ fontSize: '10px' }}>{item.category}</span>
                <h3 style={{ fontSize: '18px', color: '#fff', marginTop: '6px', fontWeight: 800 }}>{item.name}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-gold)', fontWeight: 700 }}>★ {item.rating}</span>
                  <span>•</span>
                  <span>{item.estimatedWalkTime}</span>
                  <span>•</span>
                  <span style={{ color: 'var(--text-turquoise)', fontWeight: 600 }}>
                    {item.ticketPriceUzs > 0 ? `${item.ticketPriceUzs.toLocaleString()} UZS` : 'Free'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={() => onNavigatePlace(item.id)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '13px', justifyContent: 'center' }}
                >
                  Details
                </button>

                <button
                  onClick={() => {
                    const pl = places.find(p => p.id === item.id);
                    if (pl) playAudio(pl.name, pl.audioGuideScript, 'en');
                  }}
                  className="btn-primary"
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  <Volume2 size={16} /> Guide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
