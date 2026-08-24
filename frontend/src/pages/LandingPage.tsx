import React from 'react';
import {
  Sparkles,
  MapPin,
  Bot,
  Camera,
  Languages,
  Radio,
  ArrowRight,
  CheckCircle2,
  Star,
  Globe2,
  Navigation,
  ShieldCheck,
  Zap,
  Volume2,
  DollarSign,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SilkRoadShader } from '../components/SilkRoadShader';

interface LandingPageProps {
  onStartPlanning: () => void;
  onExploreMap: () => void;
  onOpenScan: () => void;
  onOpenTranslator: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreMap,
  onOpenScan,
  onOpenTranslator,
  onOpenLogin
}) => {
  const { currentLanguage, setLanguage, languages } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      color: 'var(--accent-turquoise)',
      bg: 'rgba(0, 168, 150, 0.15)',
      border: 'rgba(0, 168, 150, 0.35)',
      title: 'Personalized AI Trip Planner',
      desc: 'Generates day-by-day itineraries tailored to your budget (UZS/USD), duration, and travel style with itemized expense breakdown.',
      action: 'Plan Trip',
      onClick: onStartPlanning
    },
    {
      icon: Bot,
      color: 'var(--accent-gold)',
      bg: 'rgba(212, 175, 55, 0.15)',
      border: 'rgba(212, 175, 55, 0.35)',
      title: '24/7 AI Audio Tour Guide',
      desc: 'Conversational voice historian answering questions about Timurid architecture, tile mosaics, legends, and traditional dining.',
      action: 'Ask AI Guide',
      onClick: onStartPlanning
    },
    {
      icon: Camera,
      color: 'var(--accent-azure)',
      bg: 'rgba(5, 178, 210, 0.15)',
      border: 'rgba(5, 178, 210, 0.35)',
      title: 'AI Landmark Vision Scanner',
      desc: 'Point your camera at any monument (Registan, Gur-e-Amir) to instantly identify its history, architect, and trigger narrated audio.',
      action: 'Try Scanner',
      onClick: onOpenScan
    },
    {
      icon: Languages,
      color: 'var(--text-turquoise)',
      bg: 'rgba(46, 230, 214, 0.15)',
      border: 'rgba(46, 230, 214, 0.35)',
      title: '10-Language Voice Translator',
      desc: '2-way speech translation between English, Uzbek, Russian, Turkish, German, French, Spanish, Chinese, Japanese, and Korean.',
      action: 'Translate Voice',
      onClick: onOpenTranslator
    },
    {
      icon: Radio,
      color: 'var(--accent-gold)',
      bg: 'rgba(212, 175, 55, 0.15)',
      border: 'rgba(212, 175, 55, 0.35)',
      title: 'Smart GPS Nearby Radar',
      desc: 'Geofenced radar that automatically alerts you to nearby hidden courtyards, tea houses, and ancient madrasahs with walking distance.',
      action: 'View Nearby',
      onClick: onExploreMap
    },
    {
      icon: MapPin,
      color: 'var(--accent-turquoise)',
      bg: 'rgba(0, 168, 150, 0.15)',
      border: 'rgba(0, 168, 150, 0.35)',
      title: 'Smart Navigation & Route Cost',
      desc: 'Precision map navigation with accurate walking paths and realistic local taxi fare calculations in Uzbek Som (UZS).',
      action: 'Open Smart Map',
      onClick: onExploreMap
    }
  ];

  const samarkandLandmarks = [
    {
      name: 'Registan Square',
      desc: 'The iconic heart of the Timurid Renaissance featuring Ulugbek, Sher-Dor, and Tilla-Kori Madrasahs with pure gold leaf ceilings.',
      tag: 'UNESCO World Heritage',
      price: '50,000 UZS',
      img: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Gur-e-Amir Mausoleum',
      desc: 'The resting place of Amir Timur crowned by a 64-ribbed azure fluted dome and exquisite dark green jade cenotaph.',
      tag: 'Imperial Tomb',
      price: '40,000 UZS',
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Shah-i-Zinda Necropolis',
      desc: 'A breathtaking royal avenue of mausoleums boasting the finest sapphire, turquoise, and cobalt glazed majolica tilework.',
      tag: 'Avenue of Royal Tombs',
      price: '40,000 UZS',
      img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="landing-page-root">
      {/* Standalone Landing Navbar */}
      <nav className="landing-navbar">
        {/* Brand */}
        <div className="landing-brand" onClick={onStartPlanning}>
          <div className="landing-brand-icon">
            <Navigation size={20} color="#070D1E" />
          </div>
          <div>
            <div className="landing-brand-title">
              SAFAR <span style={{ color: 'var(--accent-turquoise)' }}>AI</span>
            </div>
            <div className="landing-brand-subtitle">Uzbekistan Smart Travel</div>
          </div>
        </div>

        {/* Right Menu */}
        <div className="landing-nav-actions">
          {/* Language Selector */}
          <select
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="landing-lang-select"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code} style={{ background: '#0D1630' }}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenLogin}
            className="btn-secondary landing-sign-btn"
          >
            Sign In
          </button>

          <button
            onClick={onStartPlanning}
            className="btn-primary landing-app-btn"
          >
            <Sparkles size={14} />
            <span>Open App</span>
          </button>
        </div>
      </nav>

      {/* Main Landing Content Container */}
      <main className="landing-main-container">
        {/* Hero Section with WebGL Silk Road Shader */}
        <section className="landing-hero-section">
          {/* Interactive WebGL Shader Canvas Background */}
          <SilkRoadShader style={{ opacity: 0.65, borderRadius: 'inherit' }} />

          {/* Ambient Glows */}
          <div className="landing-hero-glow-1" />
          <div className="landing-hero-glow-2" />

          <div className="landing-hero-content">
            <div className="badge-gold landing-hero-badge">
              <Sparkles size={12} />
              <span>AI-POWERED SMART TOURISM</span>
            </div>

            <h1 className="landing-hero-title">
              Explore Uzbekistan <br />
              <span className="text-gradient-silk">
                with Intelligent AI.
              </span>
            </h1>

            <p className="landing-hero-desc">
              <strong>“Your AI Guide. Your Language. Your Journey.”</strong> Instant personalized itineraries, conversational audio guides, landmark camera vision, and real-time voice translation across all 14 regions of Uzbekistan.
            </p>

            <div className="landing-hero-actions">
              <button onClick={onStartPlanning} className="btn-primary landing-cta-primary">
                <Sparkles size={18} />
                <span>Plan My Trip with AI</span>
                <ArrowRight size={16} />
              </button>

              <button onClick={onExploreMap} className="btn-secondary landing-cta-secondary">
                <MapPin size={18} color="var(--accent-turquoise)" />
                <span>Explore Smart Map</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="landing-metrics-grid">
              <div className="landing-metric-item">
                <div className="landing-metric-val val-turquoise">2,750+</div>
                <div className="landing-metric-label">Years of History</div>
              </div>
              <div className="landing-metric-item">
                <div className="landing-metric-val val-gold">14</div>
                <div className="landing-metric-label">Provinces Covered</div>
              </div>
              <div className="landing-metric-item">
                <div className="landing-metric-val val-white">10</div>
                <div className="landing-metric-label">AI Languages</div>
              </div>
              <div className="landing-metric-item">
                <div className="landing-metric-val val-azure">24/7</div>
                <div className="landing-metric-label">AI Tour Guide</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Matrix Section */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="badge-turquoise" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              <Zap size={13} /> Comprehensive Tourism Suite
            </div>
            <h2 className="landing-section-title">Everything a Tourist Needs in Uzbekistan</h2>
            <p className="landing-section-subtitle">
              No fragmented apps. SAFAR AI integrates smart planning, live navigation, natural audio narration, and camera vision into one seamless platform.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="glass-panel landing-feature-card"
                  style={{ border: `1px solid ${f.border}` }}
                >
                  <div>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: f.bg,
                      border: `1px solid ${f.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: f.color,
                      marginBottom: '16px'
                    }}>
                      <Icon size={22} />
                    </div>

                    <h3 style={{ fontSize: '17px', color: '#fff', marginBottom: '8px', fontWeight: 700 }}>{f.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.5 }}>{f.desc}</p>
                  </div>

                  <button
                    onClick={f.onClick}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: f.color,
                      fontWeight: 700,
                      fontSize: '13px',
                      padding: 0,
                      marginTop: '12px',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <span>{f.action}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Samarkand MVP Showcase */}
        <section className="glass-panel landing-showcase-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div className="badge-gold" style={{ marginBottom: '8px', display: 'inline-flex' }}>
                <Star size={12} /> Highlights Showcase
              </div>
              <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>Samarkand: Jewel of the Silk Road</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                Complete AI models, coordinates, 3D audio guides, and ticketing data loaded for all major Timurid monuments.
              </p>
            </div>

            <button onClick={onExploreMap} className="btn-gold" style={{ padding: '10px 20px', fontSize: '13px' }}>
              <MapPin size={15} /> Explore on Map
            </button>
          </div>

          <div className="landing-landmarks-grid">
            {samarkandLandmarks.map((lm) => (
              <div
                key={lm.name}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '170px', position: 'relative' }}>
                  <img src={lm.img} alt={lm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(7, 13, 30, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'var(--text-gold)',
                    border: '1px solid var(--border-gold)'
                  }}>
                    {lm.tag}
                  </div>
                </div>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 800 }}>{lm.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', lineHeight: 1.5, marginTop: '6px' }}>
                      {lm.desc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '14px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-gold)', fontWeight: 700 }}>
                      🎟️ {lm.price}
                    </span>
                    <button
                      onClick={onStartPlanning}
                      className="btn-primary"
                      style={{ padding: '5px 12px', fontSize: '11px', fontWeight: 700 }}
                    >
                      Plan Route
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          paddingBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
            SAFAR <span style={{ color: 'var(--accent-turquoise)' }}>AI</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            © 2026 SAFAR AI. The Supreme AI Travel Companion for Uzbekistan.
          </p>
        </footer>
      </main>
    </div>
  );
};
