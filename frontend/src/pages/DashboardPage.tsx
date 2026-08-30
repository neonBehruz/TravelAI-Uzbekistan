import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Bot,
  Hotel,
  Globe,
  Radio,
  Volume2,
  ArrowRight,
  Star,
  Clock,
  Compass,
  Navigation,
  Bookmark,
  TrendingUp,
  TrendingDown,
  Utensils,
  Coins,
  Train,
  ShieldAlert,
  ShieldCheck,
  Crown,
  Wallet,
  CloudSun,
  Smartphone,
  Eye,
  Award,
  Newspaper,
  ChevronLeft,
  ChevronRight,
  Flame,
  Calendar,
  Layers,
  ArrowUpRight,
  CheckCircle,
  Share2,
  X,
  ExternalLink,
  Tag,
  Zap,
  Activity
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation, CITIES, CITY_WEATHER_DATA } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { Place, NearbyPlace } from '../types';
import { api } from '../services/api';
import { UzbekFlag } from '../components/UzbekFlag';

interface DashboardPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

interface NewsItem {
  id: string;
  category: 'monuments' | 'festivals' | 'transport' | 'food' | 'tips' | 'hot';
  categoryLabel: string;
  badgeColor: string;
  title: string;
  excerpt: string;
  fullContent: string;
  imageUrl: string;
  publishedTime: string;
  viewsCount: number;
  featured?: boolean;
  actionTab?: string;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: 'n1',
    category: 'hot',
    categoryLabel: '🔥 Tezkor Yangilik',
    badgeColor: '#EF4444',
    title: 'Registon maydonida 3D Lazer va Yorug‘lik Musiqa Shousi boshlandi!',
    excerpt: 'Har oqshom soat 20:30 da Samarqand Registon maydonida Amir Temur davri tarixini aks ettiruvchi multimedia spektakli namoyish qilinmoqda.',
    fullContent: 'Samarqandning mashhur Registon maydonidagi Sherdor, Tillakori va Ulug‘bek madrasalari fasadlarida har oqshom soat 20:30 dan boshlab zamonaviy 3D proyeksiyali multimedia lazer shousi o‘tkazilmoqda. Shou davomida Buyuk Ipak Yo‘li karvonlari, Temuriylar renessansi va qadimiy Sharq yulduzlari musiqiy ohanglar ostida jonlanadi. Sayyohlar uchun kirish chiptalari madrasa kassalarida va onlayn mavjud.',
    imageUrl: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=900&q=80',
    publishedTime: '15 daqiqa oldin',
    viewsCount: 2430,
    featured: true,
    actionTab: 'map'
  },
  {
    id: 'n2',
    category: 'festivals',
    categoryLabel: '🎭 Festival & Madaniyat',
    badgeColor: '#A855F7',
    title: 'Ichan Qal‘ada "Sharq Taomlari & Hunarmandlar" Xalqaro Forumi',
    excerpt: 'Xiva shahrida dunyoning 40 dan ortiq mamlakatidan kelgan hunarmand va oshpazlar ishtirokida katta gastronomiya haftaligi ochildi.',
    fullContent: 'Xorazmning qadimiy Ichan Qal‘a muzey-qo‘riqxonasida xalqaro hunarmandchilik va ipak mahsulotlari yarmarkasi o‘tkazilmoqda. Mehmonlar mashhur Xorazm tuxumbaragi, shivit oshi va tandir non tayyorlash bo‘yicha bepul master-klasslarda qatnashishlari mumkin.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
    publishedTime: '45 daqiqa oldin',
    viewsCount: 1870,
    featured: true,
    actionTab: 'artisan-crafts'
  },
  {
    id: 'n3',
    category: 'transport',
    categoryLabel: '🚆 Transport & Poyezdlar',
    badgeColor: '#05B2D2',
    title: 'Afrosiyob poyezdlariga qo‘shimcha reyslar va vagonlar qo‘shildi',
    excerpt: 'Toshkent – Samarqand – Buxoro yo‘nalishida sayyohlar oqimi ortishi sababli kunlik reyslar soni 6 taga yetkazildi.',
    fullContent: 'O‘zbekiston Temir Yo‘llari sayyohlik mavsumi qizg‘in pallasida qatnovlarni yengillashtirish maqsadida yangi tezyurar tarkiblarni liniyaga chiqardi. Endi chiptalarni elektron platforma orqali 45 kun oldindan xarid qilish va Safar AI orqali harakat jadvalini tekshirish mumkin.',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=900&q=80',
    publishedTime: '2 soat oldin',
    viewsCount: 3120,
    actionTab: 'transport'
  },
  {
    id: 'n4',
    category: 'food',
    categoryLabel: '🍽️ Gastronomiya',
    badgeColor: '#F59E0B',
    title: 'Samarqand Oshi Markazida 1 tonnalik Ziyofat Oshi damlandi!',
    excerpt: 'Beshburchak sariq sabzi, Samarqand maxsus guruchi va mayiz bilan tayyorlangan afsonaviy to‘y oshi barcha mehmonlarga ulashildi.',
    fullContent: 'Samarqanddagi Markaziy Osh Markazida an‘anaviy to‘y palovi tayyorlanishi jarayoni ochiq osmon ostida namoyish etildi. Mahoratli oshpazlar qat-qat damlangan go‘sht, no‘xat va zira sirlarini xorijiy sayyohlarga so‘zlab berdilar.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=900&q=80',
    publishedTime: '3 soat oldin',
    viewsCount: 4210,
    actionTab: 'gastronomy'
  },
  {
    id: 'n5',
    category: 'monuments',
    categoryLabel: '🏛️ Tarixiy Obidalar',
    badgeColor: '#10B981',
    title: 'Shohi Zinda majmuasida yangi tungi yoritish tizimi ishga tushdi',
    excerpt: 'Moviy gumbazlar va mozaika naqshlari endi kechasi ham o‘zgacha jilo kasb etmoqda.',
    fullContent: 'Shohi Zinda ansamblining barcha xonaqoh va maqbaralarida Italiya texnologiyasi asosida yumshoq issiq yoritgichlar o‘rnatildi. Ushbu yangilik orqali kechki fotosessiyalar va audio sayohatlar yanada jozibali bo‘ldi.',
    imageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=900&q=80',
    publishedTime: '5 soat oldin',
    viewsCount: 1540,
    actionTab: 'virtual-tour'
  },
  {
    id: 'n6',
    category: 'tips',
    categoryLabel: '💡 Sayyoh Maslahati',
    badgeColor: '#3B82F6',
    title: 'Siyob va Chorsu bozorlarida savdolashish (Bargaining) qoidalari',
    excerpt: 'Sharq bozorlarida xushmuomalalik bilan narxni 15-20% gacha tushirish mumkin.',
    fullContent: 'O‘zbekiston bozorlarida savdolashish faqatgina chegirma olish emas, balki samimiy muloqot madaniyatidir. Sotuvchiga tabassum bilan "Assalomu alaykum, yaxshimisiz" deb boshlash va Safar AI Bozor Kalkulyatoridan foydalanish eng yaxshi narxga erishishga yordam beradi.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
    publishedTime: 'Bugun 09:15',
    viewsCount: 2980,
    actionTab: 'bazaar-calculator'
  }
];

const LIVE_TICKER_ITEMS = [
  "🔴 JONLI: Samarqand Registon maydonida yangilangan 3D Lazer shousi soat 20:30 da boshlanadi.",
  "🚆 Afrosiyob tezyurar poyezdlariga Toshkent - Samarqand - Buxoro reyslari uchun qo'shimcha vagonlar ulandi.",
  "✨ Bugun O'zbekistonga 28,450 nafar xalqaro sayyoh tashrif buyurdi va Safar AI xizmatlaridan foydalanmoqda.",
  "🍲 Samarqand Markaziy Osh Markazida bugun maxsus Ziyofat Oshi damlandi — soat 11:30 dan 15:00 gacha!",
  "🎭 Ichan Qal'ada Xalqaro Ipak Yo'li Hunarmandlar Festivali 2026 qizg'in davom etmoqda.",
  "💵 Jonli Valyuta: 1 USD = 12,700 UZS • 1 EUR = 13,800 UZS • 1 RUB = 138 UZS."
];

const CURRENCY_RATES = [
  { code: 'USD', name: 'AQSH Dollari', buy: '12,680', sell: '12,740', change: '+15 UZS', percent: '+0.12%', trend: 'up' },
  { code: 'EUR', name: 'Yevro', buy: '13,760', sell: '13,850', change: '+25 UZS', percent: '+0.18%', trend: 'up' },
  { code: 'RUB', name: 'Rossiya Rubli', buy: '136.5', sell: '139.0', change: '-0.5 UZS', percent: '-0.36%', trend: 'down' },
  { code: 'CNY', name: 'Xitoy Yuani', buy: '1,750', sell: '1,780', change: '+4 UZS', percent: '+0.22%', trend: 'up' },
  { code: 'TRY', name: 'Turk Lirasi', buy: '380', sell: '395', change: '+2 UZS', percent: '+0.51%', trend: 'up' }
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { location } = useLocation();
  const { user } = useAuth();
  const { playAudio } = useAudioGuide();
  const isAdmin = user?.role === 'Admin';

  const [places, setPlaces] = useState<Place[]>([]);
  const [nearby, setNearby] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic Live Ticker State
  const [tickerIndex, setTickerIndex] = useState(0);

  // News Filtering & Modal
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Dynamic Rotating Weather/City Index
  const [cityTickerIndex, setCityTickerIndex] = useState(0);
  const cityList = Object.keys(CITIES);

  // Auto-rotate ticker headlines every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate city weather/spotlight every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCityTickerIndex((prev) => (prev + 1) % cityList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [cityList.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [placesData, nearbyData] = await Promise.all([
          api.getPlaces(location.city),
          api.getNearbyPlaces(location.latitude, location.longitude, 5)
        ]);
        setPlaces(placesData);
        setNearby(nearbyData);
      } catch (err) {
        console.error('Error fetching dashboard info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [location.latitude, location.longitude]);

  const currentCityName = cityList[cityTickerIndex] || 'Samarkand';
  const currentCityInfo = CITIES[currentCityName] || CITIES.Samarkand;

  const filteredNews = selectedCategory === 'all'
    ? NEWS_DATA
    : NEWS_DATA.filter((n) => n.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* 🔴 LIVE REAL-TIME DYNAMIC NEWS TICKER */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(7, 13, 30, 0.95), rgba(0, 168, 150, 0.15))',
        border: '1px solid rgba(245, 184, 56, 0.3)',
        borderRadius: 'var(--radius-full)',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#EF4444',
            color: '#fff',
            fontSize: '10.5px',
            fontWeight: 900,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.5px',
            flexShrink: 0
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }} />
            JONLI YANGILIK
          </span>

          <div style={{
            fontSize: '13px',
            color: '#fff',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            transition: 'all 0.4s ease'
          }}>
            {LIVE_TICKER_ITEMS[tickerIndex]}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={() => setTickerIndex((prev) => (prev - 1 + LIVE_TICKER_ITEMS.length) % LIVE_TICKER_ITEMS.length)}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', padding: '4px', borderRadius: '50%', cursor: 'pointer' }}
            title="Oldingi yangilik"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length)}
            style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', padding: '4px', borderRadius: '50%', cursor: 'pointer' }}
            title="Keyingi yangilik"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Exclusive Administrator Executive Strip */}
      {isAdmin && (
        <div className="admin-dash-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-gold), #991B1B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)',
              flexShrink: 0
            }}>
              <Crown size={22} color="#FFD700" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge-admin-crown">
                  <ShieldCheck size={12} /> Administrator Active
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Full System & Database Authority
                </span>
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px', marginTop: '2px' }}>
                Safar AI Tizim Boshqaruv Markazi
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onNavigate('admin')}
              className="btn-gold"
              style={{ padding: '10px 18px', fontSize: '13px' }}
            >
              <ShieldCheck size={16} />
              <span>Admin Paneliga O'tish</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.15), rgba(13, 22, 48, 0.9))',
        border: '1px solid var(--border-active)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div className="badge-turquoise" style={{ marginBottom: '10px', display: 'inline-flex', gap: '6px' }}>
            <Sparkles size={12} /> {t('appName')} • Jonli Smart Sayyohlik Platformasi
          </div>
          <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontWeight: 800 }}>
            {t('greeting')}, {user ? user.name.split(' ')[0] : 'Traveler'}! <UzbekFlag size={26} />
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: 1.6 }}>
            {t('heroSubtitle')}
          </p>
        </div>

        <div className="banner-action-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('plan-trip')} className="btn-primary" style={{ padding: '12px 22px' }}>
            <Sparkles size={18} />
            <span>{t('generateItinerary')}</span>
          </button>
          <button onClick={() => onNavigate('map')} className="btn-secondary" style={{ padding: '12px 18px' }}>
            <MapPin size={18} color="var(--accent-turquoise)" />
            <span>{t('openMap')}</span>
          </button>
        </div>
      </div>

      {/* 🔄 DYNAMIC ROTATING HIGHLIGHTS & LIVE WIDGETS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* Widget 1: Auto-Rotating City Spotlight */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.12), rgba(13, 22, 48, 0.85))',
          border: '1px solid rgba(0, 168, 150, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-turquoise)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Activity size={13} /> Hududiy Jonli Radar
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Har 6s almashadi</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={18} color="var(--accent-gold)" /> {currentCityName}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {currentCityInfo.region} • {(CITY_WEATHER_DATA[currentCityName] || { tempC: 30, condition: 'Musaffo quyoshli' }).tempC}°C {(CITY_WEATHER_DATA[currentCityName] || { condition: 'Quyoshli' }).condition}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GPS: {currentCityInfo.lat.toFixed(2)}, {currentCityInfo.lng.toFixed(2)}</span>
            <button
              onClick={() => onNavigate('destinations')}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-turquoise)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Ko'rish <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Widget 2: Live Currency Rates (Oshish va Pasayish) */}
        <div className="glass-panel" style={{
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(245, 184, 56, 0.1), rgba(13, 22, 48, 0.9))',
          border: '1px solid var(--border-gold)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Coins size={13} /> Jonli Valyuta Kurslari
              </span>
              <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                MB Dinamikasi
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {CURRENCY_RATES.slice(0, 3).map((cr) => {
                const isUp = cr.trend === 'up';
                return (
                  <div key={cr.code} style={{
                    padding: '8px 6px',
                    borderRadius: '10px',
                    background: isUp ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: isUp ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>1 {cr.code}</span>
                      {isUp ? (
                        <TrendingUp size={13} color="#10B981" />
                      ) : (
                        <TrendingDown size={13} color="#EF4444" />
                      )}
                    </div>
                    
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFD700' }}>
                      {cr.sell}
                    </div>

                    <div style={{
                      fontSize: '9.5px',
                      fontWeight: 700,
                      color: isUp ? '#10B981' : '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px'
                    }}>
                      <span>{cr.change}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '10.5px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
              Oshish / Pasayish jonli
            </span>
            <button
              onClick={() => onNavigate('bazaar-calculator')}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Kalkulyator <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Widget 3: Live Quick Travel Tips */}
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(13, 22, 48, 0.85))',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Zap size={13} /> Kunlik AI Tavsiyasi
              </span>
              <span className="badge-turquoise" style={{ fontSize: '10px', padding: '2px 8px' }}>Smart AI</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
              Samarqandda tushlik vaqtida (12:00 - 13:30) mashhur Osh markazlariga erta borish tavsiya etiladi.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI Maslahatchi</span>
            <button
              onClick={() => onNavigate('ai-guide')}
              style={{ background: 'transparent', border: 'none', color: '#c084fc', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              AI Gidga Savol Berish <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 📰 YANGILIKLAR VA E'LONLAR MARKAZI (DIVERSE NEWS HUB) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', color: '#fff', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Newspaper size={22} color="var(--accent-turquoise)" /> Sayyohlik Yangiliklari & Jonli Xabarlar
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              O'zbekiston bo'ylab eng so'nggi madaniy tadbirlar, transport reyslari va muhim e'lonlar
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: '🌟 Barchasi' },
              { id: 'hot', label: '🔥 Tezkor' },
              { id: 'monuments', label: '🏛️ Obidalar' },
              { id: 'festivals', label: '🎭 Festivallar' },
              { id: 'transport', label: '🚆 Transport' },
              { id: 'food', label: '🍽️ Taomlar' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  background: selectedCategory === cat.id ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.04)',
                  color: selectedCategory === cat.id ? '#070D1E' : 'var(--text-secondary)',
                  border: selectedCategory === cat.id ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredNews.map((news) => (
            <div
              key={news.id}
              onClick={() => setSelectedNews(news)}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: news.featured ? '1px solid rgba(245, 184, 56, 0.4)' : '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  
                  {/* Category Pill Tag */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(7, 13, 30, 0.85)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: news.badgeColor,
                    border: `1px solid ${news.badgeColor}60`
                  }}>
                    {news.categoryLabel}
                  </div>

                  {/* Published Time */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(6px)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={10} /> {news.publishedTime}
                  </div>
                </div>

                <div style={{ padding: '18px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', lineHeight: 1.4, marginBottom: '8px' }}>
                    {news.title}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {news.excerpt}
                  </p>
                </div>
              </div>

              <div style={{
                padding: '12px 18px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.01)'
              }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={12} /> {news.viewsCount.toLocaleString()} ko'rildi
                </span>

                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--accent-turquoise)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  Batafsil <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEWS DETAIL MODAL */}
      {selectedNews && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '650px',
            width: '100%',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, rgba(13, 22, 48, 0.98), rgba(7, 13, 30, 0.99))',
            border: '1px solid var(--border-gold)',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedNews(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.6)',
                border: 'none',
                color: '#fff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              <X size={18} />
            </button>

            <div style={{ height: '240px', position: 'relative' }}>
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: 'rgba(7, 13, 30, 0.85)',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 800,
                color: selectedNews.badgeColor
              }}>
                {selectedNews.categoryLabel}
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> {selectedNews.publishedTime}</span>
                <span>•</span>
                <span><Eye size={12} style={{ display: 'inline', marginRight: '4px' }} /> {selectedNews.viewsCount.toLocaleString()} ko'rildi</span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '14px', lineHeight: 1.3 }}>
                {selectedNews.title}
              </h2>

              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                {selectedNews.fullContent}
              </p>

              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
                {selectedNews.actionTab && (
                  <button
                    onClick={() => {
                      const tab = selectedNews.actionTab!;
                      setSelectedNews(null);
                      onNavigate(tab);
                    }}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', gap: '8px' }}
                  >
                    <span>Tegishli Bo'limga O'tish</span>
                    <ArrowRight size={16} />
                  </button>
                )}

                <button
                  onClick={() => setSelectedNews(null)}
                  className="btn-secondary"
                  style={{ flex: selectedNews.actionTab ? '0 0 auto' : 1, padding: '12px 20px', justifyContent: 'center' }}
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Special Silk Road Discovery Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div
          onClick={() => onNavigate('gastronomy')}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(13, 22, 48, 0.8))',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FCA5A5', flexShrink: 0 }}>
            <Utensils size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: 800 }}>{t('plovTime')}</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{t('gastronomy')}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{location.city}</div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('bazaar-calculator')}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12), rgba(13, 22, 48, 0.8))',
            border: '1px solid var(--border-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gold)', flexShrink: 0 }}>
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 800 }}>{t('bazaarBargain')}</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{t('bazaarCalc')}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('currency')}</div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('transport')}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(5, 178, 210, 0.12), rgba(13, 22, 48, 0.8))',
            border: '1px solid rgba(5, 178, 210, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(5, 178, 210, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2EE6D6', flexShrink: 0 }}>
            <Train size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#2EE6D6', fontWeight: 800 }}>{t('fastTrainMetro')}</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{t('transport')}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Afrosiyob Speed Train</div>
          </div>
        </div>

        <div
          onClick={() => onNavigate('sos')}
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(13, 22, 48, 0.8))',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FCA5A5', flexShrink: 0 }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: 800 }}>{t('emergencyPolice')}</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{t('sosHelp')}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1173 & 112</div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', color: '#fff', fontWeight: 800 }}>{t('quickAiActions')}</h2>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('tapToLaunch')}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px'
        }}>
          {[
            { id: 'plan-trip', label: t('planTrip'), icon: Sparkles, color: 'var(--accent-turquoise)', desc: t('planMyTrip') },
            { id: 'map', label: t('smartMap'), icon: MapPin, color: 'var(--accent-gold)', desc: t('exploreMap') },
            { id: 'ai-guide', label: t('aiGuide'), icon: Bot, color: '#05B2D2', desc: t('audioGuide') },
            { id: 'budget-tracker', label: 'Byudjet & Hamyon', icon: Wallet, color: '#10B981', desc: 'Kartalar & Xarajat' },
            { id: 'weather-seasons', label: 'Ob-havo & Mavsum', icon: CloudSun, color: '#38BDF8', desc: '7 Kunlik Iqlim Gidi' },
            { id: 'gastronomy', label: t('gastronomy'), icon: Utensils, color: '#EF4444', desc: t('plovTime') },
            { id: 'hotels', label: t('hotels') || 'Mehmonxonalar', icon: Hotel, color: '#818CF8', desc: 'Top Mehmonxonalar' },
            { id: 'bazaar-calculator', label: t('bazaarCalc'), icon: Coins, color: 'var(--accent-gold)', desc: t('bazaarBargain') },
            { id: 'transport', label: t('transport'), icon: Train, color: '#05B2D2', desc: t('fastTrainMetro') },
            { id: 'sos', label: t('sosHelp'), icon: ShieldAlert, color: '#F87171', desc: t('emergencyPolice') },
            { id: 'destinations', label: t('destinations'), icon: Globe, color: 'var(--accent-turquoise)', desc: '14 Hududlar' }
          ].map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => onNavigate(act.id)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  border: `1px solid ${act.color}40`
                }}>
                  <Icon size={22} color={act.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>{act.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{act.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Must-Visit Monuments */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', color: '#fff', fontWeight: 800 }}>{t('mustVisit')} ({location.city})</h2>
          <button
            onClick={() => onNavigate('destinations')}
            style={{ color: 'var(--accent-gold)', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {t('destinations')} <ArrowRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {places.slice(0, 3).map((place) => (
            <div
              key={place.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => onNavigate('place-detail', { id: place.id })}
            >
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={place.imageUrl} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(7, 13, 30, 0.8)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  {place.openingHours}
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="badge-gold" style={{ fontSize: '10px' }}>{place.categoryName}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-gold)' }}>★ {place.rating}</span>
                </div>

                <h3 style={{ fontSize: '18px', color: '#fff', marginTop: '6px' }}>{place.name}</h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginTop: '8px',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {place.shortDescription}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-turquoise)' }}>
                    {place.ticketPriceUzs > 0 ? `${place.ticketPriceUzs.toLocaleString()} UZS` : 'Free Entry'}
                  </span>

                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {place.recommendedVisitDurationMinutes} mins
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
