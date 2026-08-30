import React, { useState } from 'react';
import {
  Smartphone,
  ShieldCheck,
  FileText,
  CreditCard,
  Wifi,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Plane,
  Building,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TravelPracticalGuidePage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'esim' | 'reg' | 'visa' | 'money'>('esim');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.18), rgba(7, 13, 30, 0.95))',
        border: '1px solid var(--border-active)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 168, 150, 0.2)', color: '#2EE6D6', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 800 }}>
            <Sparkles size={14} /> Rasmiy Sayyohlik Qo'llanmasi
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>O'zbekiston Turizm Qo'mitasi Standartlari</span>
        </div>
        <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '6px' }}>
          📲 Sayyoh uchun Amaliy Qo'llanma (eSIM, Viza, Ro'yxatdan O'tish & Bank)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '750px' }}>
          O'zbekistonga kelish arafasida va yetib kelgach bilishingiz zarur bo'lgan barcha qonuniy, texnik va moliyaviy yo'riqnomalar.
        </p>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
          {[
            { id: 'esim', label: '📱 eSIM & SIM-Karta', icon: Smartphone },
            { id: 'reg', label: '🏨 Ro‘yxatdan O‘tish (E-Mehmon)', icon: Building },
            { id: 'visa', label: '🛂 Viza & Bojxona', icon: FileText },
            { id: 'money', label: '💳 Bankomat, Karta & Naqd Pul', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                  background: isActive ? 'rgba(0, 168, 150, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#2EE6D6' : '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: eSIM & Connectivity */}
      {activeTab === 'esim' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plane size={18} color="var(--accent-turquoise)" /> Aeroportda SIM-Karta Olish
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>📍 Qayerdan olish mumkin?</div>
                Toshkent, Samarqand va Buxoro xalqaro aeroportlarining yuk olish (Arrivals) zallarida 24/7 ishlovchi rasmiy operator stendlari mavjud.
              </div>

              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>📄 Kerakli hujjatlar:</div>
                Faqat xorijiy pasportingiz kifoya. Xarid jarayoni 3 daqiqa davom etadi.
              </div>

              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>📶 Asosiy Mobil Operatorlar:</div>
                • <strong>Ucell</strong>, <strong>Mobiuz</strong>, <strong>Beeline</strong>, <strong>Uztelecom</strong><br />
                • Maxsus "Tourist SIM" tariflari: 20 GB - 50 GB internet (o'rtacha $4 – $9).
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} color="var(--accent-gold)" /> Onlayn eSIM Variantlari
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              O'zbekistonga yetib kelmasdan turib xalqaro eSIM ilovalari orqali ham internet ulab olishingiz mumkin:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Airalo (Uzbekistan eSIM)', desc: '1 GB – 5 GB paketlar, avtomatik aktivatsiya', price: '$4.50 dan' },
                { name: 'Maya Mobile', desc: 'Cheksiz internet opsiyasi mavjud', price: '$8.00 dan' },
                { name: 'Nomad eSIM', desc: 'Tezkor LTE/5G tezlik', price: '$5.00 dan' }
              ].map((esim, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{esim.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{esim.desc}</div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-gold)' }}>{esim.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: E-Mehmon & Registration */}
      {activeTab === 'reg' && (
        <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} color="var(--accent-turquoise)" /> O'zbekistonda Vaqtincha Ro'yxatdan O'tish (Reg / E-Mehmon)
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            O'zbekiston qonunchiligiga ko'ra, chet el fuqarolari mamlakatga kirgach 30 kungacha vizasiz yoki viza muddati doirasida bo'lishi mumkin.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(0, 168, 150, 0.08)', border: '1px solid var(--border-active)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#2EE6D6', marginBottom: '6px' }}>
                <CheckCircle2 size={16} /> Mehmonxonada yashasangiz:
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Siz hech qayerga borishingiz shart emas! Har qanday sertifikatlangan mehmonxona, mehmon uyi (guesthouse) yoki xostel sizni <strong>E-Mehmon (emehmon.uz)</strong> tizimi orqali avtomatik ro'yxatga qo'yadi va chiqishda qog'oz chek (vaucher) beradi. Uni safar oxirigacha saqlang.
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(245, 184, 56, 0.08)', border: '1px solid var(--border-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--text-gold)', marginBottom: '6px' }}>
                <AlertTriangle size={16} /> Xususiy xonadon yoki qarindoshnikida:
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Agar xususiy ijarada yoki chodirda (yurta, camping) yashasangiz, 3 ish kuni ichida <code>emehmon.uz</code> sayti orqali onlayn ro'yxatdan o'tishingiz mumkin.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Visa & Customs */}
      {activeTab === 'visa' && (
        <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--accent-gold)" /> Viza Rejimi va Rasmiy E-Visa Portali
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            O'zbekiston dunyoning eng ochiq va sayyoh-do'st mamlakatlaridan biridir.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>🟢 90+ Davlatlar uchun Vizasiz Rejim:</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Yevropa Ittifoqi (Germaniya, Fransiya, Italiya...), Buyuk Britaniya, BAA, Turkiya, Yaponiya, Janubiy Koreya, MDH davlatlari va boshqalar 30–60 kungacha vizasiz kirish huquqiga ega.
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>💻 Elektron Viza (E-Visa):</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                AQSH, Hindiston, Xitoy va boshqa davlatlar fuqarolari uchun rasmiy portal orqali 3 kunda beriladi ($20).
              </div>
            </div>
          </div>

          <a
            href="https://e-visa.gov.uz"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
          >
            <span>Rasmiy E-Visa Portaliga O'tish (e-visa.gov.uz)</span>
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      {/* Tab 4: Money, Cards & ATMs */}
      {activeTab === 'money' && (
        <div className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} color="var(--accent-turquoise)" /> Bank Kartalari, Bankomatlar va Valyuta Ayirboshlash
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>💳 Visa & Mastercard:</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Barcha yirik mehmonxonalar, zamonaviy restoranlar, Afrosiyob chiptalari va supermarketlarda muammosiz qabul qilinadi.
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>🏧 24/7 Bankomatlar (ATM):</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Shaharlar bo'ylab xalqaro kartalardan to'g'ridan-to'g'ri so'm (UZS) yoki AQSH dollari ($) naqd yechib olish mumkin.
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>💵 Bozorlar uchun Naqd Pul:</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Chorsu va Siyob kabi sharq bozorlarida, qishloq choyxonalarida va hunarmandlarda savdolashish uchun doim yoningizda ozroq naqd so'm (UZS) bo'lishi maqsadga muvofiq.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
