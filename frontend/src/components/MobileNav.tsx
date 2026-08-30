import React from 'react';
import { Compass, MapPin, Bot, Bookmark, User, Camera, Sparkles, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const tabs = [
    { id: 'dashboard', label: t('dashboard'), icon: Compass },
    { id: 'map', label: t('smartMap'), icon: MapPin },
    { id: 'plan-trip', label: t('planTrip'), icon: Sparkles, isCenter: true },
    { id: 'ai-guide', label: t('aiGuide'), icon: Bot, hasPulse: true },
    ...(isAdmin
      ? [{ id: 'admin', label: 'Admin', icon: ShieldCheck }]
      : [{ id: 'my-trips', label: t('myTrips'), icon: Bookmark }]),
    { id: 'profile', label: t('profile'), icon: User }
  ];

  const handleTabClick = (tabId: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(12);
      } catch {
        // Safe fallback
      }
    }
    onSelectTab(tabId);
  };

  return (
    <nav className="mobile-nav-bar native-apk-tabbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        if (tab.isCenter) {
          return (
            <div key={tab.id} className="mobile-nav-center-wrapper">
              <button
                className={`mobile-nav-center-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                aria-label="AI Camera Scanner"
              >
                <div className="center-btn-glow"></div>
                <Icon size={24} color="#070D1E" strokeWidth={2.5} />
                <Sparkles size={12} color="#070D1E" className="sparkle-badge" />
              </button>
              <span className="center-btn-label">{tab.label}</span>
            </div>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="nav-icon-container">
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {tab.hasPulse && !isActive && <span className="active-dot-badge"></span>}
            </div>
            <span className="nav-label">{tab.label}</span>
            {isActive && <div className="nav-active-pill"></div>}
          </button>
        );
      })}
    </nav>
  );
};
