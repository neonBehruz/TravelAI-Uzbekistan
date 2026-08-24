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
      desc: 'The resting place of Amir Timur (Tamerlane) crowned by a 64-ribbed azure fluted dome and exquisite dark green jade cenotaph.',
      tag: 'Imperial Tomb',
      price: '40,000 UZS',
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Shah-i-Zinda Necropolis',
      desc: 'A breathtaking royal avenue of mausoleums boasting the finest sapphire, turquoise, and cobalt glazed majolica tilework on Earth.',
      tag: 'Avenue of Royal Tombs',
      price: '40,000 UZS',
      img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Standalone Landing Navbar */}
      <nav style={{
        height: '80px',
        padding: '0 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 13, 30, 0.9)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 168, 150, 0.4)'
          }}>
            <Navigation size={24} color="#070D1E" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.04em', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
              SAFAR <span style={{ color: 'var(--accent-turquoise)' }}>AI</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 600 }}>Uzbekistan Smart Travel</div>
          </div>
        </div>

        {/* Right Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Language Selector */}
          <select
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value as any)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: '#fff',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code} style={{ background: '#0D1630' }}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenLogin}
            className="btn-secondary"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Sign In
          </button>

          <button
            onClick={onStartPlanning}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            <Sparkles size={15} />
            <span>Open Web App</span>
          </button>
        </div>
      </nav>

      {/* Main Landing Content Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: '80px' }}>
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(13, 22, 48, 0.95), rgba(7, 13, 30, 0.98))',
          border: '1px solid var(--border-active)',
          padding: '80px 56px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
        }}>
          {/* Ambient Glows */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 168, 150, 0.3) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
            <div className="badge-gold" style={{ marginBottom: '20px' }}>
              <Sparkles size={14} /> AI-Powered Smart Tourism
            </div>

            <h1 style={{
              fontSize: '56px',
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: '20px',
              fontWeight: 800
            }}>
              Explore Uzbekistan <br />
              <span style={{
                background: 'linear-gradient(90deg, var(--accent-turquoise), #2EE6D6, var(--accent-gold))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                with Intelligent AI.
              </span>
            </h1>

            <p style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              marginBottom: '36px',
              lineHeight: 1.6,
              maxWidth: '660px'
            }}>
              <strong>“Your AI Guide. Your Language. Your Journey.”</strong> Instant personalized itineraries, conversational audio guides, landmark camera vision, and real-time voice translation across Uzbekistan.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <button onClick={onStartPlanning} className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>
                <Sparkles size={20} />
                <span>Plan My Trip with AI</span>
                <ArrowRight size={18} />
              </button>

              <button onClick={onExploreMap} className="btn-secondary" style={{ padding: '16px 28px', fontSize: '16px' }}>
                <MapPin size={20} color="var(--accent-turquoise)" />
                <span>Explore Smart Map</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{
              marginTop: '48px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '24px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '28px'
            }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-turquoise)' }}>2,750+</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Years of Silk Road History</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-gold)' }}>10</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI Translation Languages</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff' }}>100%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time GPS Precision</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--accent-azure)' }}>24/7</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Interactive AI Tour Guide</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Matrix Section */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="badge-turquoise" style={{ marginBottom: '12px' }}>
              <Zap size={14} /> Comprehensive Tourism Suite
            </div>
            <h2 style={{ fontSize: '36px', color: '#fff' }}>Everything a Tourist Needs in Uzbekistan</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '620px', margin: '8px auto 0' }}>
              No fragmented apps. SAFAR AI integrates smart planning, live navigation, natural audio narration, and camera vision into one seamless platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="glass-panel"
                  style={{
                    padding: '32px',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '20px',
                    border: `1px solid ${f.border}`
                  }}
                >
                  <div>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: f.bg,
                      border: `1px solid ${f.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: f.color,
                      marginBottom: '20px'
                    }}>
                      <Icon size={26} />
                    </div>

                    <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '10px', fontWeight: 700 }}>{f.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>

                  <button
                    onClick={f.onClick}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: f.color,
                      fontWeight: 700,
                      fontSize: '14px',
                      padding: 0,
                      alignSelf: 'flex-start'
                    }}
                  >
                    <span>{f.action}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Samarkand MVP Showcase */}
        <section className="glass-panel" style={{
          padding: '48px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-gold)',
          background: 'linear-gradient(135deg, rgba(16, 28, 60, 0.9), rgba(10, 17, 40, 0.95))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <div className="badge-gold" style={{ marginBottom: '8px' }}>
                <Star size={12} /> MVP Launch Showcase
              </div>
              <h2 style={{ fontSize: '32px', color: '#fff' }}>Samarkand: The Jewel of the Silk Road</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
                Complete AI models, coordinates, 3D audio guides, and ticketing data loaded for all major Timurid monuments.
              </p>
            </div>

            <button onClick={onExploreMap} className="btn-gold" style={{ padding: '12px 24px' }}>
              <MapPin size={16} /> Explore on Smart Map
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
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
                <div style={{ height: '200px', position: 'relative' }}>
                  <img src={lm.img} alt={lm.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(7, 13, 30, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--text-gold)',
                    border: '1px solid var(--border-gold)'
                  }}>
                    {lm.tag}
                  </div>
                </div>

                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 800 }}>{lm.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginTop: '8px' }}>
                      {lm.desc}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-turquoise)', fontWeight: 700 }}>
                      Ticket: {lm.price}
                    </span>
                    <button
                      onClick={onStartPlanning}
                      style={{ color: '#fff', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Visit with AI <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section style={{
          textAlign: 'center',
          padding: '64px 32px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.2), rgba(13, 22, 48, 0.95))',
          border: '1px solid var(--border-active)'
        }}>
          <h2 style={{ fontSize: '36px', color: '#fff', fontWeight: 800 }}>Ready for your journey along the Silk Road?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '550px', margin: '12px auto 32px' }}>
            Join international travelers using SAFAR AI for effortless discovery, voice translation, and smart budgeting.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={onStartPlanning} className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
              <Sparkles size={18} /> Create My Free Itinerary
            </button>
            <button onClick={onOpenLogin} className="btn-secondary" style={{ padding: '16px 28px', fontSize: '16px' }}>
              Sign In to Account
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 48px',
        background: 'rgba(7, 13, 30, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginTop: 'auto'
      }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          © 2026 SAFAR AI. “Your AI Guide. Your Language. Your Journey.” • Republic of Uzbekistan
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <span style={{ cursor: 'pointer' }} onClick={onStartPlanning}>AI Planner</span>
          <span style={{ cursor: 'pointer' }} onClick={onExploreMap}>Smart Map</span>
          <span style={{ cursor: 'pointer' }} onClick={onOpenScan}>Vision Scan</span>
          <span style={{ cursor: 'pointer' }} onClick={onOpenTranslator}>Voice Translator</span>
        </div>
      </footer>
    </div>
  );
};
