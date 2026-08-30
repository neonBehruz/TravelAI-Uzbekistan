import React from 'react';
import {
  Compass,
  Sparkles,
  Bot,
  MapPin,
  Wallet,
  Menu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onToggleMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onToggleMenu
}) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: 'Bosh sahifa', icon: Compass },
    { id: 'plan-trip', label: 'Reja', icon: Sparkles },
    { id: 'ai-guide', label: 'AI Gid', icon: Bot, badge: 'AI' },
    { id: 'map', label: 'Xarita', icon: MapPin },
    { id: 'budget-tracker', label: 'Byudjet', icon: Wallet }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={isActive ? 'var(--accent-turquoise)' : 'var(--text-secondary)'} />
              {item.badge && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  background: 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
                  color: '#070D1E',
                  fontSize: '8px',
                  fontWeight: 900,
                  padding: '1px 3px',
                  borderRadius: '4px'
                }}>
                  {item.badge}
                </span>
              )}
            </div>
            <span style={{
              fontSize: '10.5px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--accent-turquoise)' : 'var(--text-secondary)',
              marginTop: '2px',
              whiteSpace: 'nowrap'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Menu / Drawer button */}
      <button
        onClick={onToggleMenu}
        className="mobile-nav-btn"
        title="Barcha xizmatlar"
      >
        <Menu size={20} color="var(--text-secondary)" />
        <span style={{ fontSize: '10.5px', fontWeight: 500, color: 'var(--text-secondary)', marginTop: '2px' }}>
          Menyu
        </span>
      </button>
    </nav>
  );
};
