import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Trash2,
  Share2,
  ArrowRight,
  Download
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { AiTripPlan } from '../types';

interface MyTripsPageProps {
  onPlanNew: () => void;
  onViewPlan: (plan: AiTripPlan) => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ onPlanNew, onViewPlan }) => {
  const { t, currentLanguage } = useLanguage();
  const isUzbek = currentLanguage === 'uz';
  const isRussian = currentLanguage === 'ru';

  const [savedTrips, setSavedTrips] = useState<any[]>([
    {
      id: 'trip-1',
      title: isUzbek
        ? 'Samarqand Temuriylar Renessansi 2 Kunlik Sayohati'
        : isRussian
        ? '2-Дневный Тур по Шедеврам Тимуридов в Самарканде'
        : '2-Day Samarkand Timurid Renaissance Highlights',
      destination: 'Samarkand',
      days: 2,
      budget: '1,000,000 UZS',
      distance: '11.8 km',
      date: isUzbek ? '2026-yil 22-avgustda saqlangan' : isRussian ? 'Сохранено 22 авг, 2026' : 'Saved on Aug 22, 2026',
      activitiesCount: 7,
      img: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'trip-2',
      title: isUzbek
        ? '1 Kunlik Ipak Yo‘li Milliy Taomlar & Bozorlar Gastro-Turi'
        : isRussian
        ? '1-Дневный Гастрономический Тур по Базарам Шёлкового Пути'
        : '1-Day Express Silk Road Gastronomy & Bazaars',
      destination: 'Samarkand',
      days: 1,
      budget: '600,000 UZS',
      distance: '6.4 km',
      date: isUzbek ? '2026-yil 19-avgustda saqlangan' : isRussian ? 'Сохранено 19 авг, 2026' : 'Saved on Aug 19, 2026',
      activitiesCount: 4,
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  const handleDelete = (id: string) => {
    setSavedTrips(savedTrips.filter((t) => t.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge-turquoise" style={{ marginBottom: '8px' }}>
            <Bookmark size={12} /> {t('savedItineraries')}
          </div>
          <h1 style={{ fontSize: '32px', color: '#fff' }}>{t('myTravelItineraries')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            {t('itinerariesSubtitle')}
          </p>
        </div>

        <button onClick={onPlanNew} className="btn-primary">
          <Sparkles size={16} /> {t('planNewJourney')}
        </button>
      </div>

      {/* Trips Grid */}
      {savedTrips.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
          <Bookmark size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>{t('noSavedTrips')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 24px' }}>
            {t('noSavedTripsDesc')}
          </p>
          <button onClick={onPlanNew} className="btn-primary">
            <Sparkles size={16} /> {t('planTrip')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {savedTrips.map((trip) => (
            <div
              key={trip.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={trip.img} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(7, 13, 30, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--accent-turquoise)'
                }}>
                  {trip.days} {t('daysItinerary')}
                </div>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 800 }}>{trip.title}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{trip.date}</div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginTop: '16px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('budget')}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-gold)' }}>{trip.budget}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('activities')}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{trip.activitiesCount} {t('stops')}</div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    style={{ color: 'var(--text-muted)', padding: '8px' }}
                    title="Delete Trip"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={onPlanNew}
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '13px' }}
                  >
                    <span>{t('openJourney')}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
