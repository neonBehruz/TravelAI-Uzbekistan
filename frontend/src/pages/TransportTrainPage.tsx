import React, { useState } from 'react';
import {
  Train,
  Clock,
  MapPin,
  Ticket,
  Car,
  TrainTrack,
  ArrowRight,
  Info,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { UzbekFlag } from '../components/UzbekFlag';

interface TrainRoute {
  id: string;
  from: string;
  to: string;
  trainName: string;
  duration: string;
  departureTimes: string[];
  economyPriceUZS: string;
  businessPriceUZS: string;
  vipPriceUZS: string;
}

const TRAIN_ROUTES: TrainRoute[] = [
  {
    id: 'tashkent-samarkand',
    from: 'Toshkent (Shimoliy/Janubiy)',
    to: 'Samarqand',
    trainName: 'Afrosiyob (Tezyurar)',
    duration: '2 soat 15 daqiqa',
    departureTimes: ['07:30', '08:30', '18:50', '19:40'],
    economyPriceUZS: '175,000 UZS',
    businessPriceUZS: '245,000 UZS',
    vipPriceUZS: '360,000 UZS'
  },
  {
    id: 'samarkand-bukhara',
    from: 'Samarqand',
    to: 'Buxoro (Kogon)',
    trainName: 'Afrosiyob (Tezyurar)',
    duration: '1 soat 30 daqiqa',
    departureTimes: ['09:50', '10:45', '21:05'],
    economyPriceUZS: '130,000 UZS',
    businessPriceUZS: '185,000 UZS',
    vipPriceUZS: '275,000 UZS'
  },
  {
    id: 'tashkent-bukhara',
    from: 'Toshkent',
    to: 'Buxoro',
    trainName: 'Afrosiyob (To\'g\'ridan-to\'g\'ri)',
    duration: '3 soat 45 daqiqa',
    departureTimes: ['07:30', '08:30', '18:50'],
    economyPriceUZS: '240,000 UZS',
    businessPriceUZS: '345,000 UZS',
    vipPriceUZS: '520,000 UZS'
  },
  {
    id: 'bukhara-khiva',
    from: 'Buxoro',
    to: 'Xiva',
    trainName: 'Sharq / Qizilqum Express',
    duration: '6 soat 10 daqiqa',
    departureTimes: ['12:20', '15:40'],
    economyPriceUZS: '115,000 UZS',
    businessPriceUZS: '175,000 UZS',
    vipPriceUZS: '290,000 UZS'
  }
];

export const TransportTrainPage: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<TrainRoute>(TRAIN_ROUTES[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(5, 178, 210, 0.15), rgba(7, 13, 30, 0.9))',
        border: '1px solid rgba(5, 178, 210, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(5, 178, 210, 0.2)', color: '#2EE6D6', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 800 }}>
            <Train size={14} /> Tezyurar Afrosiyob & Metropoliten
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>O'zbekiston Temir Yo'llari</span>
        </div>
        <h1 style={{ fontSize: '26px', color: '#fff', marginBottom: '6px' }}>
          🚆 Afrosiyob Poyezd & Transport Bələdchisi
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
          Toshkent, Samarqand va Buxoro o'rtasidagi tezyurar poyezd jadvali, vagon turlari va taksi narxlari.
        </p>
      </div>

      {/* Train Routes Selector */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Train size={18} color="var(--accent-turquoise)" /> Asosiy Tezyurar Yo'nalishlar
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {TRAIN_ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: selectedRoute.id === route.id ? 'rgba(0, 168, 150, 0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedRoute.id === route.id ? 'var(--accent-turquoise)' : 'var(--border-subtle)'}`,
                textAlign: 'left',
                color: '#fff',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, color: selectedRoute.id === route.id ? 'var(--text-turquoise)' : '#fff' }}>
                {route.from} ➔ {route.to}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                ⏱️ {route.duration}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Route Detail */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-gold)', fontWeight: 700 }}>{selectedRoute.trainName}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                {selectedRoute.from} — {selectedRoute.to}
              </h3>
            </div>
            <div style={{ background: 'rgba(0, 168, 150, 0.15)', padding: '6px 14px', borderRadius: 'var(--radius-full)', color: 'var(--text-turquoise)', fontWeight: 700, fontSize: '13px' }}>
              Safarga sarflanadigan vaqt: {selectedRoute.duration}
            </div>
          </div>

          {/* Departure Times */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Kunlik jo'nash vaqtlari:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedRoute.departureTimes.map((time, idx) => (
                <span key={idx} style={{ background: '#0D1630', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                  🕒 {time}
                </span>
              ))}
            </div>
          </div>

          {/* Ticket Classes */}
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>Vagon toifalari & narxlar:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ekonom Vagon</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{selectedRoute.economyPriceUZS}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Qulay o'rindiq, choy & non</div>
              </div>
              <div style={{ background: 'rgba(0, 168, 150, 0.1)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-turquoise)' }}>Biznes Vagon</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--accent-turquoise)', marginTop: '2px' }}>{selectedRoute.businessPriceUZS}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Keng o'rindiq, issiq yegulik</div>
              </div>
              <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-gold)' }}>VIP / Lyuks Vagon</div>
                <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '2px' }}>{selectedRoute.vipPriceUZS}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Alohida bo'lma, premium xizmat</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City Taxi & Metro Tips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car size={18} color="var(--accent-gold)" /> Shahar Taksi Qo'llanmasi
          </h3>
          <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
            <li><strong>Yandex Go ilovasi:</strong> Toshkent va Samarqandda eng ishonchli va arzon taksi xizmati (Karta orqali avtomatik to'lov).</li>
            <li><strong>Aeroport & Vokzal taksilari:</strong> Stansiya chiqishidagi noqonuniy haydovchilar 3-4 barobar qimmat aytishadi. Rasmiy Yandex Go chaqiring.</li>
            <li><strong>O'rtacha shahar narxi:</strong> 15,000 — 30,000 UZS ($1.2 - $2.5).</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrainTrack size={18} color="var(--accent-turquoise)" /> Toshkent Metropoliteni
          </h3>
          <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
            <li><strong>Eng go'zal bekatlar:</strong> Alisher Navoiy (ertakmonand mozaikalar), Kosmonavtlar (kosmik moviy dizayn).</li>
            <li><strong>Yo'l haqi:</strong> Bir martalik to'lov 2,000 UZS ($0.15). Humo, UzCard, Visa, Mastercard qabul qilinadi.</li>
            <li><strong>Rasmga olish:</strong> 2018-yildan buyon metroda fotosuratga tushirishga rasman ruxsat berilgan.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
