import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  CloudRain,
  Wind,
  Compass,
  Calendar,
  Thermometer,
  Umbrella,
  Shirt,
  Sparkles,
  MapPin,
  CheckCircle2,
  Droplets
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RegionWeather {
  id: string;
  name: string;
  tempC: number;
  condition: string;
  humidity: number;
  windKmH: number;
  uvIndex: number;
  bestMonths: string;
  icon: any;
  recommendation: string;
  clothingTip: string;
  weeklyForecast: { day: string; temp: number; icon: any; cond: string }[];
}

const REGION_WEATHERS: RegionWeather[] = [
  {
    id: 'samarkand',
    name: 'Samarqand',
    tempC: 29,
    condition: 'Quyoshli va musaffo',
    humidity: 24,
    windKmH: 12,
    uvIndex: 7,
    bestMonths: 'Aprel – Iyun, Sentabr – Noyabr',
    icon: Sun,
    recommendation: "Registon va Shohi Zindani ziyorat qilish uchun ajoyib iliq ob-havo. Kechki Registon yorug'lik shousi paytida havo juda mayin.",
    clothingTip: "Yengil paxtali kiyimlar, quyoshdan saqlovchi ko'zoynak va bosh kiyim kiyish tavsiya etiladi.",
    weeklyForecast: [
      { day: 'Dush', temp: 29, icon: Sun, cond: 'Quyoshli' },
      { day: 'Sesh', temp: 30, icon: Sun, cond: 'Ochiq havo' },
      { day: 'Chor', temp: 28, icon: CloudSun, cond: 'Biroz bulutli' },
      { day: 'Pay', temp: 27, icon: Sun, cond: 'Musaffo' },
      { day: 'Jum', temp: 29, icon: Sun, cond: 'Quyoshli' },
      { day: 'Shan', temp: 31, icon: Sun, cond: 'Issiq' },
      { day: 'Yak', temp: 30, icon: CloudSun, cond: 'Ochiq' }
    ]
  },
  {
    id: 'bukhara',
    name: 'Buxoro',
    tempC: 32,
    condition: 'Issiq va quruq',
    humidity: 18,
    windKmH: 15,
    uvIndex: 8,
    bestMonths: 'Mart – May, Sentabr – Oktabr',
    icon: Sun,
    recommendation: "Eski Buxoro ko'chalari va Labi Hovuzda piyoda yurish uchun ertalab 09:00 gacha yoki 17:00 dan keyin eng qulay vaqt.",
    clothingTip: "Quyosh nurlaridan himoyalovchi krem (SPF 50+) va salqin ko'k choy ichish tavsiya etiladi.",
    weeklyForecast: [
      { day: 'Dush', temp: 32, icon: Sun, cond: 'Ochiq' },
      { day: 'Sesh', temp: 33, icon: Sun, cond: 'Quyoshli' },
      { day: 'Chor', temp: 31, icon: Sun, cond: 'Ochiq' },
      { day: 'Pay', temp: 30, icon: CloudSun, cond: 'Biroz bulutli' },
      { day: 'Jum', temp: 32, icon: Sun, cond: 'Musaffo' },
      { day: 'Shan', temp: 34, icon: Sun, cond: 'Issiq' },
      { day: 'Yak', temp: 33, icon: Sun, cond: 'Ochiq' }
    ]
  },
  {
    id: 'khiva',
    name: 'Xiva (Xorazm)',
    tempC: 31,
    condition: 'Musaffo quyoshli',
    humidity: 20,
    windKmH: 14,
    uvIndex: 8,
    bestMonths: 'Aprel – May, Sentabr – Noyabr',
    icon: Sun,
    recommendation: "Quyosh botishi arafasida Oqshayx bobo minorasiga chiqish va Ichan Qal'ani tungi chiroqlar ostida tomosha qilish tavsiya etiladi.",
    clothingTip: "Qulay poyabzal va quyoshdan saqlovchi yengil kiyimlar.",
    weeklyForecast: [
      { day: 'Dush', temp: 31, icon: Sun, cond: 'Ochiq' },
      { day: 'Sesh', temp: 32, icon: Sun, cond: 'Quyoshli' },
      { day: 'Chor', temp: 30, icon: CloudSun, cond: 'Ochiq' },
      { day: 'Pay', temp: 29, icon: Sun, cond: 'Musaffo' },
      { day: 'Jum', temp: 31, icon: Sun, cond: 'Ochiq' },
      { day: 'Shan', temp: 33, icon: Sun, cond: 'Issiq' },
      { day: 'Yak', temp: 32, icon: Sun, cond: 'Quyoshli' }
    ]
  },
  {
    id: 'tashkent',
    name: 'Toshkent',
    tempC: 28,
    condition: 'Iliq va yoqimli',
    humidity: 30,
    windKmH: 10,
    uvIndex: 6,
    bestMonths: 'Yil bo‘yi sayohat qilish qulay',
    icon: CloudSun,
    recommendation: "Toshkent City bog'i, Chorsu bozori va Chilonzor xiyobonlarida sayr qilish uchun ob-havo a'lo darajada.",
    clothingTip: "Kunduzgi oddiy shahar kiyimlari, kechki salqinlik uchun yupqa nimcha.",
    weeklyForecast: [
      { day: 'Dush', temp: 28, icon: CloudSun, cond: 'Biroz bulutli' },
      { day: 'Sesh', temp: 29, icon: Sun, cond: 'Ochiq' },
      { day: 'Chor', temp: 27, icon: CloudSun, cond: 'Iliq' },
      { day: 'Pay', temp: 26, icon: CloudRain, cond: 'Kichik yomg‘ir' },
      { day: 'Jum', temp: 28, icon: Sun, cond: 'Musaffo' },
      { day: 'Shan', temp: 30, icon: Sun, cond: 'Quyoshli' },
      { day: 'Yak', temp: 29, icon: Sun, cond: 'Ochiq' }
    ]
  },
  {
    id: 'zaamin',
    name: 'Zomin (Jizzax tog‘lari)',
    tempC: 21,
    condition: 'Tog‘ havosi, salqin',
    humidity: 45,
    windKmH: 18,
    uvIndex: 5,
    bestMonths: 'May – Sentabr (Ekoturizm va shifobaxsh havo)',
    icon: Wind,
    recommendation: "O'zbekiston Shveytsariyasi deb ataluvchi archazor tog' kanyonlari, osma ko'prik va toza tog' buloqlari.",
    clothingTip: "Kechqurun havo sezilarli salqinlashadi (14-16°C), issiq kurtka va qalin poyabzal oling.",
    weeklyForecast: [
      { day: 'Dush', temp: 21, icon: Wind, cond: 'Salqin tog‘ havosi' },
      { day: 'Sesh', temp: 22, icon: Sun, cond: 'Musaffo' },
      { day: 'Chor', temp: 20, icon: CloudSun, cond: 'Bulutli' },
      { day: 'Pay', temp: 19, icon: CloudRain, cond: 'Tog‘ yomg‘iri' },
      { day: 'Jum', temp: 21, icon: Sun, cond: 'Ochiq' },
      { day: 'Shan', temp: 23, icon: Sun, cond: 'Iliq' },
      { day: 'Yak', temp: 22, icon: CloudSun, cond: 'Musaffo' }
    ]
  },
  {
    id: 'fergana',
    name: 'Farg‘ona Vodiysi (Marg‘ilon / Rishton)',
    tempC: 27,
    condition: 'Iliq va mo‘’tadil',
    humidity: 35,
    windKmH: 9,
    uvIndex: 6,
    bestMonths: 'Aprel – Noyabr',
    icon: Sun,
    recommendation: "Rishton kulolchilik ustaxonalari va Yodgorlik ipak fabrikasida atlas to'qilishini tomosha qilish uchun ideal ob-havo.",
    clothingTip: "Yengil tabiiy paxta va ipak kiyimlar.",
    weeklyForecast: [
      { day: 'Dush', temp: 27, icon: Sun, cond: 'Quyoshli' },
      { day: 'Sesh', temp: 28, icon: Sun, cond: 'Ochiq' },
      { day: 'Chor', temp: 26, icon: CloudSun, cond: 'Mo‘’tadil' },
      { day: 'Pay', temp: 25, icon: Sun, cond: 'Musaffo' },
      { day: 'Jum', temp: 27, icon: Sun, cond: 'Iliq' },
      { day: 'Shan', temp: 29, icon: Sun, cond: 'Quyoshli' },
      { day: 'Yak', temp: 28, icon: Sun, cond: 'Ochiq' }
    ]
  }
];

export const WeatherSeasonsPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('samarkand');

  const selectedRegion = REGION_WEATHERS.find((r) => r.id === selectedRegionId) || REGION_WEATHERS[0];
  const IconMain = selectedRegion.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(7, 13, 30, 0.95))',
        border: '1px solid rgba(14, 165, 233, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(14, 165, 233, 0.2)', color: '#38BDF8', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 800 }}>
            <Sun size={14} /> Jonli Ob-Havo & Mavsum Gidi
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>O'zgidromet & AI Iqlim Tahlili</span>
        </div>
        <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '6px' }}>
          🌤️ O'zbekiston Hududlari Ob-Havosi & Eng Yaxshi Sayohat Mavsumlari
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '750px' }}>
          Sayohat oldidan viloyatlardagi harorat, kiyinish bo'yicha amaliy maslahatlar va tashrif buyurish uchun eng go'zal oylarni bilib oling.
        </p>

        {/* Region Selector Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
          {REGION_WEATHERS.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRegionId(r.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: selectedRegionId === r.id ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                background: selectedRegionId === r.id ? 'rgba(0, 168, 150, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedRegionId === r.id ? '#2EE6D6' : '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {r.name} ({r.tempC}°C)
            </button>
          ))}
        </div>
      </div>

      {/* Main Selected Weather Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left: Current Weather & 7-Day Forecast */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="var(--accent-turquoise)" /> {selectedRegion.name} viloyati
              </div>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                {selectedRegion.tempC}°<span style={{ fontSize: '24px', color: 'var(--text-gold)' }}>C</span>
              </div>
              <div style={{ fontSize: '16px', color: '#38BDF8', fontWeight: 600 }}>
                {selectedRegion.condition}
              </div>
            </div>

            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'rgba(245, 184, 56, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F59E0B'
            }}>
              <IconMain size={40} />
            </div>
          </div>

          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <Droplets size={16} color="#38BDF8" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Namlik</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{selectedRegion.humidity}%</div>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <Wind size={16} color="#10B981" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Shamol</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{selectedRegion.windKmH} km/soat</div>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <Sun size={16} color="#F59E0B" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>UV Indeksi</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{selectedRegion.uvIndex} / 10</div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '12px' }}>7 Kunlik Prognoz</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {selectedRegion.weeklyForecast.map((item, idx) => {
              const DayIcon = item.icon;
              return (
                <div key={idx} style={{
                  padding: '10px 4px',
                  borderRadius: '10px',
                  background: idx === 0 ? 'rgba(0, 168, 150, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: idx === 0 ? '1px solid var(--border-active)' : '1px solid var(--border-subtle)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.day}</div>
                  <DayIcon size={18} color={idx === 0 ? 'var(--accent-turquoise)' : '#F59E0B'} style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{item.temp}°</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Travel Season & Clothing Advice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Best Months */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Calendar size={18} color="var(--accent-gold)" />
              <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700 }}>Eng Yaxshi Sayohat Oylari</h3>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-gold)', marginBottom: '8px' }}>
              {selectedRegion.bestMonths}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedRegion.recommendation}
            </p>
          </div>

          {/* Clothing & Packing Advice */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Shirt size={18} color="var(--accent-turquoise)" />
              <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700 }}>Kiyinish & Tayyorgarlik Tavsiyasi</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedRegion.clothingTip}
            </p>
          </div>

          {/* Travel Pro-Tip */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-xl)', background: 'rgba(0, 168, 150, 0.08)', border: '1px solid var(--border-active)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="var(--accent-turquoise)" />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Ipak Yo'li Fasllari:</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              • 🌸 **Bahor (Aprel-May):** Lolalar, gilos va o'rik gullagan eng xushmanzara fasl.<br />
              • 🍇 **Kuz (Sentabr-Oktabr):** Mashhur Samarqand mayizlari, qovun-tarvuzlar va mevalar pishgan oltin mavsum.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
