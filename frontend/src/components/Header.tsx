import React from 'react';
import {
  MapPin,
  Sparkles,
  Camera,
  Languages,
  SunMedium,
  Globe
} from 'lucide-react';
import { useLocation, CITIES } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { UzbekFlag } from './UzbekFlag';

interface HeaderProps {
  onOpenScan: () => void;
  onOpenPlanner: () => void;
  onOpenTranslator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenScan, onOpenPlanner, onOpenTranslator }) => {
  const { location, setManualCity } = useLocation();
  const { currentLanguage, setLanguage, languages } = useLanguage();

  return (
    <header className="app-header">
      {/* City Switcher & GPS Status */}
      <div className="header-left-bar">
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
            {Object.entries(CITIES).map(([cityName, info]) => (
              <option key={cityName} value={cityName}>
                {cityName} {cityName === 'Samarkand' ? '(MVP)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Live Weather Badge */}
        <div className="weather-badge">
          <SunMedium size={14} color="var(--accent-gold)" />
          <span>28°C • {location.city}</span>
        </div>
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
              <option key={l.code} value={l.code}>
                {l.code.toUpperCase()} - {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Quick Actions (hidden on mobile / phone frame) */}
        <div className="header-desktop-actions">
          <button
            onClick={onOpenScan}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            <Camera size={15} color="var(--accent-turquoise)" />
            <span>Scan Landmark</span>
          </button>

          <button
            onClick={onOpenTranslator}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            <Languages size={15} color="var(--accent-gold)" />
            <span>Voice Translator</span>
          </button>

          <button
            onClick={onOpenPlanner}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            <Sparkles size={15} />
            <span>Plan My Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
