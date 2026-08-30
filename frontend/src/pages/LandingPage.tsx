import React from 'react';
import {
  Sparkles,
  MapPin,
  Bot,
  Utensils,
  Coins,
  Radio,
  ArrowRight,
  Star,
  Navigation,
  Zap,
  UserPlus
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SilkRoadShader } from '../components/SilkRoadShader';

interface LandingPageProps {
  onStartPlanning: () => void;
  onExploreMap: () => void;
  onOpenLogin: () => void;
  onOpenRegister?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreMap,
  onOpenLogin,
  onOpenRegister
}) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();

  const isUzbek = currentLanguage === 'uz';
  const isRussian = currentLanguage === 'ru';
  const isTurkish = currentLanguage === 'tr';

  const features = [
    {
      icon: Sparkles,
      color: 'var(--accent-turquoise)',
      bg: 'rgba(0, 168, 150, 0.15)',
      border: 'rgba(0, 168, 150, 0.35)',
      title: isUzbek ? 'Shaxsiy AI Sayohat Rejasi' : isRussian ? 'Персональный ИИ-Планировщик' : isTurkish ? 'Kişiselleştirilmiş AI Seyahat Planı' : 'Personalized AI Trip Planner',
      desc: isUzbek
        ? 'Byudjetingiz (UZS/USD), muddat va sayohat uslubingizga moslashtirilgan xarajatlar tahlili bilan kunlik marshrutlar yaratadi.'
        : isRussian
        ? 'Генерирует посуточные маршруты под ваш бюджет (UZS/USD), дни и стиль поездки с детализацией расходов.'
        : 'Generates day-by-day itineraries tailored to your budget (UZS/USD), duration, and travel style with itemized expense breakdown.',
      action: t('planTrip'),
      onClick: onStartPlanning
    },
    {
      icon: Bot,
      color: 'var(--accent-gold)',
      bg: 'rgba(212, 175, 55, 0.15)',
      border: 'rgba(212, 175, 55, 0.35)',
      title: isUzbek ? '24/7 AI Ovozli Audiogid' : isRussian ? '24/7 ИИ Аудиогид' : isTurkish ? '24/7 Yapay Zeka Sesli Rehber' : '24/7 AI Audio Tour Guide',
      desc: isUzbek
        ? 'Temuriylar meʼmorchiligi, sirli mozaikalar, afsonalar va milliy taomlar haqidagi savollarga javob beruvchi jonli ovozli suhbatdosh.'
        : isRussian
        ? 'Голосовой историк, отвечающий на любые вопросы об архитектуре Тимуридов, мозаиках и легендах.'
        : 'Conversational voice historian answering questions about Timurid architecture, tile mosaics, legends, and traditional dining.',
      action: t('aiGuide'),
      onClick: onStartPlanning
    },
    {
      icon: Utensils,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.35)',
      title: isUzbek ? 'O‘zbek Milliy Gastronomiyasi' : isRussian ? 'Узбекская Гастрономия' : isTurkish ? 'Özbek Ulusal Gastronomisi' : 'Uzbek National Gastronomy',
      desc: isUzbek
        ? 'Samarqand, Toshkent va Buxoro oshi (osh vaqtlari 11:30–14:00), somsa, shashlik va shirinliklar bo‘yicha maxsus qo‘llanma.'
        : isRussian
        ? 'Гид по плову (11:30–14:00), самсе и шашлыкам в Самарканде, Бухаре и Ташкенте с аутентичными локациями.'
        : 'Dedicated guide to regional plov (11:30–14:00), authentic tandoor samsa, and traditional teahouses in Uzbekistan.',
      action: t('gastronomy'),
      onClick: onStartPlanning
    },
    {
      icon: Coins,
      color: 'var(--accent-gold)',
      bg: 'rgba(212, 175, 55, 0.15)',
      border: 'rgba(212, 175, 55, 0.35)',
      title: isUzbek ? 'Bozor & Valyuta AI Kalkulyatori' : isRussian ? 'ИИ Базарный Калькулятор' : isTurkish ? 'Pazar Pazarlık ve Döviz AI' : 'Bazaar Bargain & Currency AI',
      desc: isUzbek
        ? 'Siypb, Chorsu bozorlarida adolatli narxlarni bilish, savdolashish bo‘yicha AI maslahatlari va jonli valyuta konvertori.'
        : isRussian
        ? 'Справедливые цены на базарах Чорсу и Сиаб, подсказки для торга от ИИ и точный конвертер валют UZS/USD.'
        : 'Fair prices at Chorsu & Siab bazaars, interactive AI bargaining phrasebook, and live UZS currency converter.',
      action: t('bazaarCalc'),
      onClick: onStartPlanning
    },
    {
      icon: Radio,
      color: 'var(--accent-gold)',
      bg: 'rgba(212, 175, 55, 0.15)',
      border: 'rgba(212, 175, 55, 0.35)',
      title: isUzbek ? 'GPS Yaqin Atrofdagi Radar' : isRussian ? 'Умный GPS Радар Поблизости' : isTurkish ? 'Akıllı GPS Yakınlık Radarı' : 'Smart GPS Nearby Radar',
      desc: isUzbek
        ? 'Yaqin atrofdagi yashirin choyxonalar, qadimiy madrasalar va hunarmandchilik rastalari haqida avtomatik masofa bilan xabar beradi.'
        : isRussian
        ? 'Радар, который автоматически уведомляет о скрытых чайханах, медресе и мастерских с расстоянием пешком.'
        : 'Geofenced radar that automatically alerts you to nearby hidden courtyards, tea houses, and ancient madrasahs with walking distance.',
      action: t('nearbyRadar'),
      onClick: onExploreMap
    },
    {
      icon: MapPin,
      color: 'var(--accent-turquoise)',
      bg: 'rgba(0, 168, 150, 0.15)',
      border: 'rgba(0, 168, 150, 0.35)',
      title: isUzbek ? 'Aqlli Navigatsiya & Yo‘l Narxi' : isRussian ? 'Навигация и Расчёт Стоимости' : isTurkish ? 'Akıllı Navigasyon & Rota Maliyeti' : 'Smart Navigation & Route Cost',
      desc: isUzbek
        ? 'Piyoda yo‘llar, mahalliy taksi tariflari va Afrosiyob tezyurar poyezdlar marshrutini so‘mda hisoblab beruvchi xarita.'
        : isRussian
        ? 'Точная навигация с пешеходными тропами и реальным расчётом стоимости такси в узбекских сумах (UZS).'
        : 'Precision map navigation with accurate walking paths and realistic local taxi fare calculations in Uzbek Som (UZS).',
      action: t('exploreMap'),
      onClick: onExploreMap
    }
  ];

  const samarkandLandmarks = [
    {
      name: isUzbek ? 'Registon Maydoni' : isRussian ? 'Площадь Регистан' : 'Registan Square',
      desc: isUzbek
        ? 'Ulug‘bek, Sherdor va Tilla-Kori madrasalari joylashgan Temuriylar Renessansining yuragi va oltin zarhalli gumbazlar.'
        : isRussian
        ? 'Сердце Самарканда с медресе Улугбека, Шердор и Тилля-Кари с куполами, покрытыми сусальным золотом.'
        : 'The iconic heart of the Timurid Renaissance featuring Ulugbek, Sher-Dor, and Tilla-Kori Madrasahs with pure gold leaf ceilings.',
      tag: 'UNESCO World Heritage',
      price: '50,000 UZS',
      img: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: isUzbek ? 'Go‘ri Amir Maqbarasi' : isRussian ? 'Мавзолей Гур-Эмир' : 'Gur-e-Amir Mausoleum',
      desc: isUzbek
        ? 'Sohibqiron Amir Temurning mangu maskani — 64 qovurg‘ali moviy gumbaz va to‘q yashil nefrit toshi.'
        : isRussian
        ? 'Усыпальница Амира Тимура с 64-ребристым лазурным куполом и темно-зелёным нефритовым надгробием.'
        : 'The resting place of Amir Timur crowned by a 64-ribbed azure fluted dome and exquisite dark green jade cenotaph.',
      tag: 'Imperial Tomb',
      price: '40,000 UZS',
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: isUzbek ? 'Shohi Zinda Majmuasi' : isRussian ? 'Некрополь Шахи-Зинда' : 'Shah-i-Zinda Necropolis',
      desc: isUzbek
        ? '11-15-asrlarga oid firuza va lojuvard koshinlar bilan bezatilgan qirolicha va sarkardalar maqbaralari xiyoboni.'
        : isRussian
        ? 'Уникальный ансамбль мавзолеев с изысканнейшей кобальтовой и бирюзовой глазурованной мозаикой.'
        : 'A breathtaking royal avenue of mausoleums boasting the finest sapphire, turquoise, and cobalt glazed majolica tilework.',
      tag: 'Avenue of Royal Tombs',
      price: '40,000 UZS',
      img: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="landing-page-root" style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Full-Page Interactive WebGL Silk Road Shader Background */}
      <SilkRoadShader
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          opacity: 0.85,
          pointerEvents: 'none'
        }}
      />

      {/* Standalone Landing Navbar */}
      <nav className="landing-navbar" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(7, 13, 30, 0.75)', backdropFilter: 'blur(20px)' }}>
        {/* Brand */}
        <div className="landing-brand" onClick={onStartPlanning}>
          <div className="landing-brand-icon">
            <Navigation size={20} color="#070D1E" />
          </div>
          <div>
            <div className="landing-brand-title">
              SAFAR <span style={{ color: 'var(--accent-turquoise)' }}>AI</span>
            </div>
            <div className="landing-brand-subtitle">{t('brandSubtitle')}</div>
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
              <option key={l.code} value={l.code} style={{ background: '#0D1630', color: '#fff' }}>
                {l.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenLogin}
            className="btn-primary landing-sign-btn"
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            {t('signIn')}
          </button>
        </div>
      </nav>

      {/* Main Landing Content Container */}
      <main className="landing-main-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero Section with Glassmorphism */}
        <section className="landing-hero-section">
          {/* Ambient Glows */}
          <div className="landing-hero-glow-1" />
          <div className="landing-hero-glow-2" />

          <div className="landing-hero-content">
            <div className="badge-gold landing-hero-badge">
              <Sparkles size={12} />
              <span>{t('aiPoweredSmartTourism')}</span>
            </div>

            <h1 className="landing-hero-title">
              {t('exploreUzbekistanTitle')} <br />
              <span className="text-gradient-silk">
                {t('withIntelligentAi')}
              </span>
            </h1>

            <p className="landing-hero-desc">
              {t('heroSubtitle')}
            </p>

            <div className="landing-hero-actions">
              <button onClick={onStartPlanning} className="btn-primary landing-cta-primary">
                <Sparkles size={18} />
                <span>{t('planMyTripWithAi')}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="landing-metrics-grid">
              <div className="landing-metric-item">
                <div className="landing-metric-val val-turquoise">2,750+</div>
                <div className="landing-metric-label">{t('yearsOfHistory')}</div>
              </div>
              <div className="landing-metric-item">
                <div className="landing-metric-val val-gold">14</div>
                <div className="landing-metric-label">{t('provincesCovered')}</div>
              </div>
              <div className="landing-metric-item">
                <div className="landing-metric-val val-white">10</div>
                <div className="landing-metric-label">{t('aiLanguages')}</div>
              </div>
              <div className="landing-metric-item">
                <div className="landing-metric-val val-azure">24/7</div>
                <div className="landing-metric-label">{t('aiTourGuide')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Matrix Section */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="badge-turquoise" style={{ marginBottom: '12px', display: 'inline-flex' }}>
              <Zap size={13} /> {t('comprehensiveSuite')}
            </div>
            <h2 className="landing-section-title">{t('everythingTouristNeeds')}</h2>
            <p className="landing-section-subtitle">
              {t('noFragmentedApps')}
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
                <Star size={12} /> {t('silkRoadTreasures')}
              </div>
              <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: 800 }}>{t('exploreIconicDestinations')}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                {t('exploreRegionsSubtitle')}
              </p>
            </div>

            <button onClick={onExploreMap} className="btn-gold" style={{ padding: '10px 20px', fontSize: '13px' }}>
              <MapPin size={15} /> {t('exploreMap')}
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
                      {t('planTrip')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Magic Call to Action */}
        <section className="glass-panel" style={{
          padding: '40px 32px',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.12), rgba(212, 175, 55, 0.08))',
          border: '1px solid var(--border-active)'
        }}>
          <h2 style={{ fontSize: '28px', color: '#fff', fontWeight: 800, marginBottom: '12px' }}>
            {t('experienceMagic')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 24px' }}>
            {t('experienceMagicDesc')}
          </p>
          <button
            onClick={onStartPlanning}
            className="btn-primary"
            style={{ padding: '12px 32px', fontSize: '15px', fontWeight: 700, margin: '0 auto' }}
          >
            <Sparkles size={18} />
            <span>{t('startFreeJourney')}</span>
            <ArrowRight size={18} />
          </button>
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
