import React from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  Bot,
  Camera,
  Languages,
  Radio,
  Bookmark,
  User,
  ShieldCheck,
  LogOut,
  Navigation,
  Coins,
  Utensils,
  Train,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { location } = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass, badge: null },
    { id: 'plan-trip', label: 'AI Trip Planner', icon: Sparkles, badge: 'Smart' },
    { id: 'map', label: 'Smart Map', icon: MapPin, badge: null },
    { id: 'ai-guide', label: 'AI Tour Guide', icon: Bot, badge: 'Voice' },
    { id: 'scan-place', label: 'AI Camera Scan', icon: Camera, badge: 'Vision' },
    { id: 'translator', label: 'Voice Translator', icon: Languages, badge: '10 Langs' },
    { id: 'gastronomy', label: 'Milliy Taomlar & Osh', icon: Utensils, badge: 'Osh Radar' },
    { id: 'bazaar-calculator', label: 'Bozor & Valyuta AI', icon: Coins, badge: 'Savdolash' },
    { id: 'transport', label: 'Afrosiyob & Transport', icon: Train, badge: 'Tezyurar' },
    { id: 'sos', label: 'Sayyoh SOS Yordam', icon: ShieldAlert, badge: '24/7' },
    { id: 'nearby', label: 'Nearby Radar', icon: Radio, badge: 'GPS' },
    { id: 'destinations', label: 'Destinations', icon: Globe, badge: 'Samarkand' },
    { id: 'my-trips', label: 'My Trips', icon: Bookmark, badge: null }
  ];

  if (user?.role === 'Admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: ShieldCheck, badge: 'Live' });
  }

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div
        onClick={() => onSelectTab('landing')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 4px 20px',
          cursor: 'pointer',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 168, 150, 0.4)',
          flexShrink: 0
        }}>
          <Navigation size={22} color="#070D1E" />
        </div>
        <div>
          <h2 style={{ fontSize: '19px', letterSpacing: '0.04em', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
            SAFAR <span style={{ color: 'var(--accent-turquoise)' }}>AI</span>
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 600 }}>Uzbekistan Smart Travel</p>
        </div>
      </div>

      {/* GPS Status Indicator */}
      <div style={{
        marginTop: '14px',
        padding: '10px 12px',
        borderRadius: '10px',
        background: 'rgba(0, 168, 150, 0.08)',
        border: '1px solid rgba(0, 168, 150, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ position: 'relative', width: '10px', height: '10px', flexShrink: 0 }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-turquoise)' }} />
          <div className="radar-ping" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Location</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {location.city} • Registan
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, overflowY: 'auto', marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color={isActive ? 'var(--accent-turquoise)' : 'var(--text-secondary)'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: isActive ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
                  color: isActive ? '#070D1E' : 'var(--text-muted)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Language Selector Dropdown */}
      <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <Globe size={15} color="var(--accent-turquoise)" />
          <span>Language:</span>
        </div>
        <select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value as any)}
          style={{
            background: 'var(--bg-secondary)',
            color: '#fff',
            border: '1px solid var(--border-subtle)',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.nativeName}
            </option>
          ))}
        </select>
      </div>

      {/* User Profile / Auth Footer */}
      <div style={{
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {isAuthenticated && user ? (
          <>
            <div
              onClick={() => onSelectTab('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: 0 }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-turquoise), #0A1128)',
                border: '1px solid var(--accent-turquoise)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: '#fff',
                fontSize: '13px',
                flexShrink: 0
              }}>
                {user.name.charAt(0)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-gold)' }}>{user.country} • {user.role}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{ padding: '6px', color: 'var(--text-muted)', borderRadius: '6px' }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onSelectTab('login')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              Log In
            </button>
            <button
              onClick={() => onSelectTab('register')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                background: 'var(--accent-turquoise)',
                color: '#070D1E',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
