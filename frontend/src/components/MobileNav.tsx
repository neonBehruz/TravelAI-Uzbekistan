import React from 'react';
import { Compass, MapPin, Bot, Bookmark, User, Camera, Sparkles } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Bosh sahifa', icon: Compass },
    { id: 'map', label: 'Xarita', icon: MapPin },
    { id: 'scan-place', label: 'AI Skaner', icon: Camera, isCenter: true },
    { id: 'ai-guide', label: 'AI Gid', icon: Bot, hasPulse: true },
    { id: 'my-trips', label: 'Rejalarim', icon: Bookmark },
    { id: 'profile', label: 'Profil', icon: User }
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

