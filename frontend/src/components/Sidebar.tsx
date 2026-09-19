import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  Bot,
  Bookmark,
  User,
  ShieldCheck,
  LogOut,
  Navigation,
  Coins,
  Utensils,
  Train,
  ShieldAlert,
  Globe,
  Crown,
  Hotel,
  Wallet,
  CloudSun,
  Languages,
  Camera,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  badge?: string;
}

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isAdmin = user?.role === 'Admin';

  const handleItemClick = (tabId: string) => {
    onSelectTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t('dashboard'), icon: Compass },
    { id: 'plan-trip', label: t('planTrip'), icon: Sparkles },
    { id: 'map', label: t('smartMap'), icon: MapPin },
    { id: 'ai-guide', label: t('aiGuide'), icon: Bot },
    { id: 'translator', label: t('voiceTranslator') || 'Ovozli Tarjimon', icon: Languages },
    { id: 'scan-place', label: t('cameraScan') || 'AI Kamera Skaner', icon: Camera },
    { id: 'budget-tracker', label: t('budgetTracker') || 'Byudjet & Hamyon', icon: Wallet },
    { id: 'weather-seasons', label: t('weatherSeasons') || 'Ob-havo & Mavsum', icon: CloudSun },
    { id: 'gastronomy', label: t('gastronomy'), icon: Utensils },
    { id: 'hotels', label: t('hotels') || 'Mehmonxonalar', icon: Hotel },
    { id: 'bazaar-calculator', label: t('bazaarCalc'), icon: Coins },
    { id: 'transport', label: t('transport'), icon: Train },
    { id: 'sos', label: t('sosHelp'), icon: ShieldAlert },
    { id: 'destinations', label: t('destinations'), icon: Globe },
    { id: 'my-trips', label: t('myTrips'), icon: Bookmark }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="mobile-sidebar-backdrop"
        />
      )}

      <aside className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '0 4px 16px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div
              onClick={() => handleItemClick('landing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: isAdmin
                  ? 'linear-gradient(135deg, var(--accent-gold), #E11D48)'
                  : 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isAdmin ? '0 0 18px rgba(212, 175, 55, 0.5)' : '0 0 15px rgba(0, 168, 150, 0.4)',
                flexShrink: 0
              }}>
                {isAdmin ? <Crown size={22} color="#070D1E" /> : <Navigation size={22} color="#070D1E" />}
              </div>
              <div>
                <h2 style={{ fontSize: '19px', letterSpacing: '0.04em', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  SAFAR <span style={{ color: isAdmin ? 'var(--accent-gold)' : 'var(--accent-turquoise)' }}>AI</span>
                </h2>
                <p style={{ fontSize: '11px', color: isAdmin ? 'var(--text-gold)' : 'var(--text-turquoise)', fontWeight: 600, margin: 0 }}>
                  {isAdmin ? 'Management Console' : 'Uzbekistan Smart Travel'}
                </p>
              </div>
            </div>

            {/* Close Button on Mobile Drawer */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="mobile-close-sidebar-btn"
                title="Yopish"
              >
                <X size={20} color="var(--text-secondary)" />
              </button>
            )}
          </div>

          {/* Distinct Admin Badge in Brand Header */}
          {isAdmin && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.2), rgba(225, 29, 72, 0.15))',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              padding: '4px 10px',
              borderRadius: '8px',
              marginTop: '4px'
            }}>
              <ShieldCheck size={13} color="var(--accent-gold)" />
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--text-gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Admin Privilege Active
              </span>
            </div>
          )}
        </div>

        {/* Admin Special Quick Access Section if Admin */}
        {isAdmin && (
          <div style={{ marginTop: '12px', marginBottom: '2px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-gold)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 4px 6px' }}>
              👑 Administrator Hub
            </div>
            <button
              onClick={() => handleItemClick('admin')}
              className={`sidebar-admin-btn ${currentTab === 'admin' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={18} color="var(--accent-gold)" />
                <span>{currentLanguage === 'it' ? 'Pannello Admin' : currentLanguage === 'ru' ? 'Панель Администратора' : currentLanguage === 'uz' ? 'Admin Boshqaruv Paneli' : 'Admin Control Panel'}</span>
              </div>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 800,
                background: 'rgba(212, 175, 55, 0.3)',
                color: 'var(--accent-gold)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(212, 175, 55, 0.5)'
              }}>
                LIVE
              </span>
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav style={{ flex: 1, overflowY: 'auto', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 4px 4px' }}>
            {isAdmin 
              ? (currentLanguage === 'it' ? 'Viste Viaggiatore' : currentLanguage === 'ru' ? 'Разделы Туриста' : currentLanguage === 'uz' ? "Sayyoh Ko'rinishlari" : 'Traveler Views')
              : (currentLanguage === 'it' ? 'Navigazione' : currentLanguage === 'ru' ? 'Навигация' : currentLanguage === 'uz' ? 'Navigatsiya' : 'Navigation')}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? 'var(--accent-turquoise)' : 'var(--text-secondary)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    background: 'rgba(0, 168, 150, 0.25)',
                    color: 'var(--accent-turquoise)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 168, 150, 0.45)',
                    marginLeft: 'auto'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile / Auth Footer */}
        <div style={{
          paddingTop: '14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {isAuthenticated && user ? (
            <>
              <div
                onClick={() => handleItemClick('profile')}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: 0 }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isAdmin
                    ? 'linear-gradient(135deg, var(--accent-gold), #7F1D1D)'
                    : 'linear-gradient(135deg, var(--accent-turquoise), #0A1128)',
                  border: isAdmin ? '2px solid var(--accent-gold)' : '1px solid var(--accent-turquoise)',
                  boxShadow: isAdmin ? '0 0 12px rgba(212, 175, 55, 0.4)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#fff',
                  fontSize: '14px',
                  flexShrink: 0
                }}>
                  {isAdmin ? <Crown size={18} color="#FFD700" /> : user.name.charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: isAdmin ? 'var(--accent-gold)' : 'var(--accent-turquoise)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isAdmin ? '👑 ADMINISTRATOR' : `🎒 ${(t('travelerRole') || 'TRAVELER').toUpperCase()} (${user.country})`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                title={t('logout') || 'Chiqish'}
                aria-label="Akkauntdan chiqish"
                style={{
                  padding: '7px',
                  color: 'var(--text-muted)',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#F87171';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleItemClick('login')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {t('login')}
              </button>
              <button
                onClick={() => handleItemClick('register')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'var(--accent-turquoise)',
                  color: '#070D1E',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {t('register')}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="install-modal-overlay"
          onClick={() => setShowLogoutConfirm(false)}
          style={{ zIndex: 12000 }}
        >
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '24px',
              borderRadius: '16px',
              background: '#0D1630',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(239, 68, 68, 0.2)',
              position: 'relative',
              animation: 'fadeIn 0.2s ease',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#F87171'
              }}
            >
              <LogOut size={24} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>
              {t('logoutConfirmTitle') || 'Akkauntdan chiqish'}
            </h3>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              {t('logoutConfirmDesc') || 'Siz haqiqatdan ham chiqmoqchimisiz?'}
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#E2E8F0',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {t('cancelBtn') || t('cancel') || 'Bekor qilish'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                  if (onCloseMobile) onCloseMobile();
                  handleItemClick('landing');
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                  transition: 'transform 0.15s'
                }}
              >
                {t('confirmLogoutBtn') || 'Ha, chiqish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
