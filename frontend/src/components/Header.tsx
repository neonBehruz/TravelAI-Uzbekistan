import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Sparkles,
  SunMedium,
  Globe,
  Crown,
  Menu
} from 'lucide-react';
import { useLocation, CITIES, CITY_WEATHER_DATA } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UzbekFlag } from './UzbekFlag';
import { signalRService } from '../services/signalr';
import { LiveTouristSignal } from '../types';

interface HeaderProps {
  onOpenPlanner: () => void;
  onOpenTranslator?: () => void;
  onOpenAdmin?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPlanner,
  onOpenTranslator,
  onOpenAdmin,
  onToggleMobileMenu
}) => {
  const { location, setManualCity } = useLocation();
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [liveStats, setLiveStats] = useState<LiveTouristSignal | null>(null);

  const activeWeather = CITY_WEATHER_DATA[location.city] || { tempC: 30, condition: 'Musaffo quyoshli' };

  useEffect(() => {
    signalRService.startConnection();
    const unsub = signalRService.onLiveStats((signal) => {
      setLiveStats(signal);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <header className="app-header">
      {/* City Switcher & GPS Status */}
      <div className="header-left-bar">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="mobile-menu-toggle-btn"
            title="Menyuni ochish"
          >
            <Menu size={20} color="var(--accent-turquoise)" />
          </button>
        )}

        <div className="city-selector-pill">
          <UzbekFlag size={18} />
          <MapPin size={14} color="var(--accent-turquoise)" />
          <select
            value={location.city}
            onChange={(e) => {
              const val = e.target.value;
              const found = CITIES[val];
              if (found) {
                setManualCity(val, found.lat, found.lng);
              }
            }}
            className="city-select-dropdown"
          >
            {Object.entries(CITIES).map(([cityName]) => (
              <option key={cityName} value={cityName}>
                {cityName} {cityName === 'Samarkand' ? '(MVP)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Live Weather Badge */}
        <div className="weather-badge" title={`Ob-havo: ${activeWeather.tempC}°C • ${activeWeather.condition} • ${location.city}`}>
          <SunMedium size={14} color="var(--accent-gold)" />
          <span>{activeWeather.tempC}°C</span>
        </div>

        {/* Live WebSocket SignalR Pulse Badge */}
        <div
          className="badge-live-pulse"
          title={liveStats ? `Oxirgi harakat: ${liveStats.action} (${liveStats.activeTouristsCount} sayyoh faol)` : 'SignalR Real-time Hub ulangan'}
        >
          <span className="live-dot"></span>
          <span className="live-pulse-text">{liveStats ? `${liveStats.activeTouristsCount}` : 'Live'}</span>
        </div>

        {/* Exclusive Header Badge if Admin */}
        {isAdmin && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="admin-portal-header-pill"
            title="Admin Boshqaruv Paneliga o'tish"
          >
            <Crown size={14} color="#FFD700" />
            <span className="admin-pill-text">ADMIN</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="header-right-controls">
        {/* Language selector chip */}
        <div className="language-selector-chip">
          <Globe size={14} color="var(--accent-gold)" />
          <select
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="language-select-dropdown"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code} style={{ background: '#0D1630', color: '#fff' }}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Quick Actions (hidden on mobile / phone frame) */}
        <div className="header-desktop-actions">
          <button
            onClick={onOpenPlanner}
            className="btn-primary header-action-btn-primary"
            title={t('planMyTrip')}
          >
            <Sparkles size={15} />
            <span className="action-btn-label">{t('planMyTrip')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
