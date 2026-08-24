import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Bot,
  Camera,
  Languages,
  Radio,
  Volume2,
  ArrowRight,
  Star,
  Clock,
  Compass,
  Navigation,
  Bookmark,
  TrendingUp,
  Utensils,
  Coins,
  Train,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { Place, NearbyPlace } from '../types';
import { api } from '../services/api';
import { UzbekFlag } from '../components/UzbekFlag';

interface DashboardPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { location } = useLocation();
  const { user } = useAuth();
  const { playAudio } = useAudioGuide();

  const [places, setPlaces] = useState<Place[]>([]);
  const [nearby, setNearby] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [placesData, nearbyData] = await Promise.all([
          api.getPlaces(location.city),
          api.getNearbyPlaces(location.latitude, location.longitude, 5)
        ]);
        setPlaces(placesData);
        setNearby(nearbyData);
      } catch (err) {
        console.error('Error fetching dashboard info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.latitude, location.longitude]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '36px 32px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.15), rgba(13, 22, 48, 0.85))',
        border: '1px solid var(--border-active)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div className="badge-turquoise" style={{ marginBottom: '10px', display: 'inline-flex' }}>
            <Sparkles size={12} /> Personalized Dashboard
          </div>
          <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            Assalomu Alaykum, {user ? user.name.split(' ')[0] : 'Traveler'}! <UzbekFlag size={26} />
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: 1.6 }}>
            You are centered in <strong style={{ color: '#fff' }}>{location.city}</strong> near Registan Square. What would you like SAFAR AI to assist you with today?
          </p>
        </div>

        <div className="banner-action-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('plan-trip')} className="btn-primary" style={{ padding: '12px 22px' }}>
            <Sparkles size={18} />
            <span>Generate Itinerary</span>
          </button>
          <button onClick={() => onNavigate('map')} className="btn-secondary" style={{ padding: '12px 18px' }}>
            <MapPin size={18} color="var(--accent-turquoise)" />
            <span>Open Map</span>
          </button>
        </div>
      </div>

      {/* Special Silk Road Discovery Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div
          onClick={() => onNavigate('gastronomy')}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(13, 22, 48, 0.8))',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FCA5A5', flexShrink: 0 }}>
            <Utensils size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: 800 }}>Osh Vaqti (11:30 - 14:00)</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Milliy Taomlar & Osh</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Samarqand & Toshkent palovlari</div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('bazaar-calculator')}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(13, 22, 48, 0.8))',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gold)', flexShrink: 0 }}>
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 800 }}>Valyuta & Savdolashuv</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Bozor Savdolashuvchi AI</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Jonli kurs & audio iboralar</div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('transport')}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(5, 178, 210, 0.12), rgba(13, 22, 48, 0.8))',
            border: '1px solid rgba(5, 178, 210, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(5, 178, 210, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2EE6D6', flexShrink: 0 }}>
            <Train size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#2EE6D6', fontWeight: 800 }}>Tezyurar Jadval</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Afrosiyob & Metropoliten</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Poyezd chiptasi & taksi narxlari</div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('sos')}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(13, 22, 48, 0.8))',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FCA5A5', flexShrink: 0 }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: 800 }}>24/7 Favqulodda</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Sayyoh SOS Yordam</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Politsiya 1173 & Elchixonalar</div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid (10 Startup Features) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', color: '#fff' }}>Quick AI Actions</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tap to launch instantly</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px'
        }}>
          {[
            { id: 'plan-trip', label: 'Plan Trip', icon: Sparkles, color: 'var(--accent-turquoise)', desc: 'Smart Itinerary' },
            { id: 'map', label: 'Smart Map', icon: MapPin, color: 'var(--accent-gold)', desc: 'GPS & Routes' },
            { id: 'ai-guide', label: 'AI Tour Guide', icon: Bot, color: '#05B2D2', desc: 'Ask Anything 24/7' },
            { id: 'scan-place', label: 'Scan Place', icon: Camera, color: '#F4B942', desc: 'AI Vision Camera' },
            { id: 'translator', label: 'Translator', icon: Languages, color: 'var(--accent-turquoise)', desc: 'Voice to Speech' },
            { id: 'gastronomy', label: 'Milliy Taomlar', icon: Utensils, color: '#EF4444', desc: 'Osh & Choyxonalar' },
            { id: 'bazaar-calculator', label: 'Bozor & Valyuta', icon: Coins, color: 'var(--accent-gold)', desc: 'Savdolashuv AI' },
            { id: 'transport', label: 'Afrosiyob', icon: Train, color: '#05B2D2', desc: 'Tezyurar Poyezd' },
            { id: 'sos', label: 'Sayyoh SOS', icon: ShieldAlert, color: '#F87171', desc: '1173 & Elchixona' },
            { id: 'nearby', label: 'Nearby Radar', icon: Radio, color: '#E59866', desc: 'Places Near You' }
          ].map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => onNavigate(act.id)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  border: `1px solid ${act.color}40`
                }}>
                  <Icon size={22} color={act.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>{act.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{act.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GPS Radar: Nearby Highlights */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={18} color="var(--accent-turquoise)" /> Live Nearby Radar (Samarkand)
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Calculated in real-time from your coordinates</p>
          </div>
          <button
            onClick={() => onNavigate('nearby')}
            style={{ color: 'var(--accent-turquoise)', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View All Nearby <ArrowRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {nearby.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: '140px' }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(7, 13, 30, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--accent-turquoise)',
                  border: '1px solid var(--border-active)'
                }}>
                  {p.formattedDistance}
                </div>
              </div>

              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gold)', fontWeight: 600 }}>{p.category}</div>
                  <h3 style={{ fontSize: '16px', color: '#fff', marginTop: '2px', fontWeight: 700 }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>★ {p.rating}</span>
                    <span>•</span>
                    <span>{p.estimatedWalkTime}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  <button
                    onClick={() => onNavigate('place-detail', { id: p.id })}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '8px', fontSize: '12px', justifyContent: 'center' }}
                  >
                    View Info
                  </button>
                  <button
                    onClick={() => {
                      const found = places.find(pl => pl.id === p.id);
                      if (found) playAudio(found.name, found.audioGuideScript, 'en');
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 12px', fontSize: '12px' }}
                    title="Play Audio Guide"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Must-Visit Monuments in Samarkand */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', color: '#fff' }}>Timurid Heritage Masterpieces</h2>
          <button
            onClick={() => onNavigate('destinations')}
            style={{ color: 'var(--accent-gold)', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Explore Cities <ArrowRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {places.slice(0, 3).map((place) => (
            <div
              key={place.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => onNavigate('place-detail', { id: place.id })}
            >
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={place.imageUrl} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(7, 13, 30, 0.8)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  {place.openingHours}
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="badge-gold" style={{ fontSize: '10px' }}>{place.categoryName}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-gold)' }}>★ {place.rating}</span>
                </div>

                <h3 style={{ fontSize: '18px', color: '#fff', marginTop: '6px' }}>{place.name}</h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginTop: '8px',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {place.shortDescription}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-turquoise)' }}>
                    {place.ticketPriceUzs > 0 ? `${place.ticketPriceUzs.toLocaleString()} UZS` : 'Free Entry'}
                  </span>

                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {place.recommendedVisitDurationMinutes} mins
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
