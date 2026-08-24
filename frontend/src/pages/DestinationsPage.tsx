import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Sparkles, ArrowRight, Star } from 'lucide-react';
import { Destination } from '../types';
import { api } from '../services/api';
import { useLocation } from '../context/LocationContext';

interface DestinationsPageProps {
  onSelectCity: (cityName: string) => void;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({ onSelectCity }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const { setManualCity } = useLocation();

  useEffect(() => {
    async function load() {
      const data = await api.getDestinations();
      setDestinations(data);
    }
    load();
  }, []);

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(search.toLowerCase()) || dest.region.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'All') return true;
    if (filter === 'Historic') return ['Samarkand', 'Bukhara', 'Khiva', 'Tashkent', 'Kashkadarya'].includes(dest.name);
    if (filter === 'Nature') return ['Tashkent Region', 'Jizzakh', 'Syrdarya'].includes(dest.name);
    if (filter === 'Valley') return ['Fergana', 'Andijan', 'Namangan'].includes(dest.name);
    if (filter === 'Oasis') return ['Surkhandarya', 'Navoiy', 'Karakalpakstan'].includes(dest.name);
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '16px' }}>
        <div>
          <div className="badge-turquoise" style={{ marginBottom: '8px' }}>
            <Globe size={12} /> The 14 Regions & Jewel Cities of Uzbekistan
          </div>
          <h1 style={{ fontSize: '32px', color: '#fff' }}>Explore All 14 Regions</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '650px', marginTop: '6px' }}>
            From ancient Silk Road monuments to pristine Tian Shan alpine peaks, discover the breathtaking beauty across every province of Uzbekistan with Safar AI.
          </p>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: 'All 14 Regions' },
            { id: 'Historic', label: '🏛️ Historic Cities' },
            { id: 'Nature', label: '⛰️ Nature & Peaks' },
            { id: 'Valley', label: '🏺 Fergana Valley' },
            { id: 'Oasis', label: '🏜️ Southern & Oasis' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={filter === tab.id ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '8px 14px', fontSize: '12px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => {
              setManualCity(dest.name, dest.latitude, dest.longitude);
              onSelectCity(dest.name);
            }}
          >
            <div style={{ position: 'relative', height: '220px' }}>
              <img src={dest.imageUrl} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                background: dest.name === 'Samarkand' ? 'var(--accent-turquoise)' : 'rgba(7, 13, 30, 0.85)',
                color: dest.name === 'Samarkand' ? '#070D1E' : '#fff',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}>
                {dest.name === 'Samarkand' ? '✨ MVP LIVE' : 'EXPANDING'}
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '14px',
                right: '14px',
                background: 'linear-gradient(to top, rgba(7, 13, 30, 0.9), transparent)',
                padding: '12px',
                borderRadius: '10px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>{dest.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-gold)' }}>{dest.region}</div>
              </div>
            </div>

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px' }}>
                {dest.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '14px'
              }}>
                <span style={{ fontSize: '13px', color: 'var(--text-turquoise)', fontWeight: 700 }}>
                  {dest.placesCount} Featured Landmarks
                </span>

                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                  <span>Explore {dest.name}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
