import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Building2,
  HeartPulse,
  Volume2,
  AlertTriangle,
  MapPin,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { UzbekFlag } from '../components/UzbekFlag';

interface Embassy {
  country: string;
  flag: string;
  phone: string;
  emergency: string;
  address: string;
}

const EMBASSIES: Embassy[] = [
  { country: "AQSH (USA)", flag: "🇺🇸", phone: "+998 78 120 54 50", emergency: "+998 78 120 54 50", address: "Toshkent sh., Mayqo'rg'on ko'chasi 3" },
  { country: "Rossiya (Russia)", flag: "🇷🇺", phone: "+998 78 120 35 04", emergency: "+998 78 120 35 04", address: "Toshkent sh., Nukus ko'chasi 83" },
  { country: "Turkiya (Turkey)", flag: "🇹🇷", phone: "+998 78 113 03 00", emergency: "+998 78 113 03 00", address: "Toshkent sh., G'ulomov ko'chasi 87" },
  { country: "Germaniya (Germany)", flag: "🇩🇪", phone: "+998 78 120 84 40", emergency: "+998 78 120 84 40", address: "Toshkent sh., Sharaf Rashidov ko'chasi 15" },
  { country: "Xitoy (China)", flag: "🇨🇳", phone: "+998 71 233 80 88", emergency: "+998 71 233 80 88", address: "Toshkent sh., G'ulomov ko'chasi 79" },
  { country: "Buyuk Britaniya (UK)", flag: "🇬🇧", phone: "+998 78 120 15 00", emergency: "+998 78 120 15 00", address: "Toshkent sh., Gulyamov ko'chasi 67" },
  { country: "Janubiy Koreya (South Korea)", flag: "🇰🇷", phone: "+998 71 252 31 51", emergency: "+998 71 252 31 51", address: "Toshkent sh., Afrosiyob ko'chasi 7" },
  { country: "Fransiya (France)", flag: "🇫🇷", phone: "+998 71 232 81 00", emergency: "+998 71 232 81 00", address: "Toshkent sh., Istiqbol ko'chasi 25" }
];

const MEDICAL_PHRASES = [
  { uz: "Menga tez yordam chaqirib bering!", en: "Please call an ambulance for me!", phonetic: "Menga tez yor-dam cha-qi-rib be-ring!" },
  { uz: "Eng yaqin 24 soatlik dorixona qayerda?", en: "Where is the nearest 24/7 pharmacy?", phonetic: "Eng ya-qin yigir-ma to'rt so-at-lik do-ri-kho-na qa-yer-da?" },
  { uz: "Mening qon bosimim oshdi / yuragim bezovta qilyapti.", en: "My blood pressure is high / my heart hurts.", phonetic: "Me-ning qon bo-si-mim osh-di..." },
  { uz: "Mening bu doriga allergiyam bor.", en: "I am allergic to this medicine.", phonetic: "Me-ning bu do-ri-ga al-ler-gi-yam bor." },
  { uz: "Pasportimni / hamyonimni yo'qotib qo'ydim.", en: "I lost my passport / wallet.", phonetic: "Pas-por-tim-ni yo'qo-tib qo'y-dim." }
];

export const EmergencySosPage: React.FC = () => {
  const [searchEmbassy, setSearchEmbassy] = useState('');

  const speakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const filteredEmbassies = EMBASSIES.filter(e =>
    e.country.toLowerCase().includes(searchEmbassy.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Red Alert Header */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(7, 13, 30, 0.95))',
        border: '1px solid rgba(239, 68, 68, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 800 }}>
            <ShieldAlert size={14} /> 24/7 Sayyohlik Xavfsizligi
          </div>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>● Tezkor aloqa liniyalari faol</span>
        </div>
        <h1 style={{ fontSize: '26px', color: '#fff', marginBottom: '6px' }}>
          🆘 Sayyoh SOS & Favqulodda Yordam
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
          O'zbekistonda sayyohlik politsiyasi, tez tibbiy yordam va elchixonalar bilan 1 ta teginishda bog'lanish.
        </p>
      </div>

      {/* 1-Tap Emergency Hotlines */}
      <div>
        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PhoneCall size={18} color="var(--accent-turquoise)" /> 1-Bosishda Qo'ng'iroq Qilish
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {[
            { title: "Sayyohlik Politsiyasi", number: "1173", desc: "Ingliz, Rus, Turk tillarida yordam", color: "var(--accent-turquoise)" },
            { title: "Yagona Qutqaruv (MChS)", number: "112", desc: "Barcha favqulodda holatlar", color: "#EF4444" },
            { title: "Tez Tibbiy Yordam", number: "103", desc: "Kasalxona va shoshilinch feldsher", color: "#10B981" },
            { title: "Ichki Ishlar (Militsiya)", number: "102", desc: "Xavfsizlik va huquqiy yordam", color: "var(--accent-gold)" }
          ].map((item, i) => (
            <a
              key={i}
              href={`tel:${item.number}`}
              className="glass-panel"
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `1px solid ${item.color}40`,
                textDecoration: 'none',
                transition: 'transform 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '2px 0' }}>{item.number}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                <PhoneCall size={20} />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Emergency Medical Phrases */}
      <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeartPulse size={18} color="#EF4444" /> Tibbiy & Favqulodda O'zbekcha Iboralar
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MEDICAL_PHRASES.map((phrase, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>"{phrase.uz}"</div>
                <div style={{ fontSize: '12px', color: 'var(--accent-turquoise)', margin: '2px 0' }}>Talaffuz: {phrase.phonetic}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{phrase.en}</div>
              </div>
              <button
                onClick={() => speakPhrase(phrase.uz)}
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px', borderRadius: '50%', color: '#FCA5A5' }}
                title="Talaffuzni eshitish"
              >
                <Volume2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Embassies Directory */}
      <div className="glass-panel" style={{ padding: '22px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--accent-gold)" /> Chet El Elchixonalari (Toshkent)
          </h2>
          <input
            type="text"
            placeholder="Elchixonani qidiring (AQSH, Rossiya, Turkiya...)"
            value={searchEmbassy}
            onChange={(e) => setSearchEmbassy(e.target.value)}
            style={{ background: '#0D1630', border: '1px solid var(--border-subtle)', color: '#fff', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '12px', outline: 'none', width: '240px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {filteredEmbassies.map((emb, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '20px' }}>{emb.flag}</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{emb.country}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                {emb.address}
              </div>
              <a
                href={`tel:${emb.phone}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--accent-turquoise)', textDecoration: 'none' }}
              >
                <PhoneCall size={14} /> {emb.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
