import React, { useState } from 'react';
import {
  Coins,
  Calculator,
  Volume2,
  TrendingDown,
  Sparkles,
  ShoppingBag,
  Info,
  CheckCircle,
  Percent,
  RefreshCw
} from 'lucide-react';
import { UzbekFlag } from '../components/UzbekFlag';

interface BazaarItem {
  id: string;
  name: string;
  category: string;
  typicalFairPriceUZS: number;
  discountFactor: number;
  tips: string;
}

const BAZAAR_ITEMS: BazaarItem[] = [
  {
    id: 'halva',
    name: "Samarqand Halvasi (Quti)",
    category: "Shirinliklar",
    typicalFairPriceUZS: 35000,
    discountFactor: 0.75,
    tips: "Siyob bozorida har xil ta'mini (pista, yong'oq, qaymoq) bepul tatib ko'rib, 3 quti olsangiz arzonroq olasiz."
  },
  {
    id: 'scarf',
    name: "Ipak Ro'mol / Suzani Shol",
    category: "Hunarmandchilik",
    typicalFairPriceUZS: 120000,
    discountFactor: 0.65,
    tips: "Tabiiy ipakligini bilish uchun tolasini tekshiring. 200,000 so'm so'ralsa, 110,000 dan savdoni boshlang."
  },
  {
    id: 'ceramics',
    name: "Rishton Sopol Lagani (Katta)",
    category: "Kulolchilik",
    typicalFairPriceUZS: 85000,
    discountFactor: 0.70,
    tips: "Qo'lda chizilgan naqshlar orqa tomonida usta muhri bo'ladi. Xavfsiz qadoqlashni so'rang."
  },
  {
    id: 'doppi',
    name: "Milliy Do'ppi (Chust / Samarqand)",
    category: "Kiyim-kechak",
    typicalFairPriceUZS: 50000,
    discountFactor: 0.75,
    tips: "Qo'lda tikilgan gulli do'ppilar biroz qimmatroq, lekin xotira uchun ajoyib sovg'a."
  },
  {
    id: 'spices',
    name: "Osh Zirasi & Za'faron (100g)",
    category: "Ziravorlar",
    typicalFairPriceUZS: 25000,
    discountFactor: 0.80,
    tips: "Tog' zirasi (qora mayda) eng xushbo'y hisoblanadi. Bir siqim ezib hidlab ko'ring."
  },
  {
    id: 'nuts',
    name: "Tuzlangan Pista / Bodom (1kg)",
    category: "Quruq mevalar",
    typicalFairPriceUZS: 90000,
    discountFactor: 0.85,
    tips: "Bozorda 1 kg olganda yaxshilab aralashtirib, yangisini berishini so'rang."
  }
];

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rateToUzs: 12850 },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToUzs: 13950 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rateToUzs: 140 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rateToUzs: 380 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rateToUzs: 1780 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rateToUzs: 16400 },
  { code: 'KZT', name: 'Kazakh Tenge', symbol: '₸', rateToUzs: 27 }
];

export const BazaarCalculatorPage: React.FC = () => {
  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [foreignAmount, setForeignAmount] = useState<string>('100');
  const [uzsAmount, setUzsAmount] = useState<string>((100 * CURRENCIES[0].rateToUzs).toLocaleString('uz-UZ'));

  // Bargain AI state
  const [selectedItem, setSelectedItem] = useState<BazaarItem>(BAZAAR_ITEMS[0]);
  const [askingPrice, setAskingPrice] = useState<string>('50000');

  const handleForeignChange = (val: string) => {
    setForeignAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setUzsAmount(Math.round(num * selectedCurrency.rateToUzs).toLocaleString('uz-UZ'));
    } else {
      setUzsAmount('0');
    }
  };

  const handleUzsChange = (val: string) => {
    const clean = val.replace(/\s+/g, '').replace(/,/g, '');
    setUzsAmount(val);
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      setForeignAmount((num / selectedCurrency.rateToUzs).toFixed(2));
    } else {
      setForeignAmount('0');
    }
  };

  const speakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const parsedAsking = parseFloat(askingPrice.replace(/\D/g, '')) || selectedItem.typicalFairPriceUZS * 1.4;
  const counterOffer = Math.round(parsedAsking * 0.6 / 1000) * 1000;
  const realisticDeal = Math.round(parsedAsking * selectedItem.discountFactor / 1000) * 1000;
  const savings = Math.max(0, parsedAsking - realisticDeal);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(7, 13, 30, 0.9))',
        border: '1px solid var(--border-gold)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div className="badge-gold">
            <Coins size={14} /> Markaziy Bank Kurslari
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bugungi Jonli Valyuta</span>
        </div>
        <h1 style={{ fontSize: '26px', color: '#fff', marginBottom: '6px' }}>
          💱 Valyuta & Bozor Savdolashuvchi AI
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
          Siyob va Chorsu bozorlarida ortiqcha to'lamaslik uchun real narxni hisoblang va o'zbek tilida savdolashing!
        </p>
      </div>

      {/* 1. Live Currency Converter */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={18} color="var(--accent-gold)" /> Tezkor Valyuta Konvertori
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'center' }}>
          {/* Foreign Input */}
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Chet el valyutasi</label>
              <select
                value={selectedCurrency.code}
                onChange={(e) => {
                  const c = CURRENCIES.find(x => x.code === e.target.value) || CURRENCIES[0];
                  setSelectedCurrency(c);
                  const num = parseFloat(foreignAmount);
                  if (!isNaN(num)) {
                    setUzsAmount(Math.round(num * c.rateToUzs).toLocaleString('uz-UZ'));
                  }
                }}
                style={{ background: '#0D1630', border: '1px solid var(--border-subtle)', color: 'var(--accent-gold)', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', fontWeight: 700 }}
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-gold)' }}>{selectedCurrency.symbol}</span>
              <input
                type="number"
                value={foreignAmount}
                onChange={(e) => handleForeignChange(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', fontWeight: 800, width: '100%', outline: 'none' }}
              />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              1 {selectedCurrency.code} = {selectedCurrency.rateToUzs.toLocaleString('uz-UZ')} UZS
            </div>
          </div>

          {/* UZS Output */}
          <div style={{ background: 'rgba(0, 168, 150, 0.08)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-active)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <UzbekFlag size={16} />
              <label style={{ fontSize: '12px', color: 'var(--text-turquoise)', fontWeight: 700 }}>O'zbekiston So'mi (UZS)</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                value={uzsAmount}
                onChange={(e) => handleUzsChange(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', fontWeight: 800, width: '100%', outline: 'none' }}
              />
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-turquoise)' }}>UZS</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Naqd pul & Humo / UzCard to'lovlar
            </div>
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {[50, 100, 200, 500].map(amt => (
            <button
              key={amt}
              onClick={() => handleForeignChange(amt.toString())}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              {selectedCurrency.symbol}{amt}
            </button>
          ))}
          <button
            onClick={() => handleUzsChange('500000')}
            style={{
              background: 'rgba(0, 168, 150, 0.1)',
              border: '1px solid var(--border-active)',
              color: 'var(--text-turquoise)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            500,000 UZS
          </button>
        </div>
      </div>

      {/* 2. AI Bozor Savdolashuvchi */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '18px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} color="var(--accent-turquoise)" /> AI Bozor Savdolashuvchi Maslahatchisi
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sotuvchi narx aytganda qanday javob berishni hisoblang</p>
          </div>
          <div className="badge-turquoise">
            <Sparkles size={12} /> Aqlli Formula
          </div>
        </div>

        {/* Item Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>
            Xarid qilinayotgan mahsulot turi:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
            {BAZAAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setAskingPrice((item.typicalFairPriceUZS * 1.4).toString());
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedItem.id === item.id ? 'rgba(0, 168, 150, 0.2)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedItem.id === item.id ? 'var(--border-active)' : 'var(--border-subtle)'}`,
                  textAlign: 'left',
                  color: selectedItem.id === item.id ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700 }}>{item.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>O'rtacha: ~{item.typicalFairPriceUZS.toLocaleString('uz-UZ')} UZS</div>
              </button>
            ))}
          </div>
        </div>

        {/* Asking Price Input */}
        <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <label style={{ fontSize: '13px', color: '#fff', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            Sotuvchi aytgan narxni kiriting (UZS):
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="number"
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.value)}
              placeholder="Masalan: 150000"
              style={{
                background: '#0D1630',
                border: '1px solid var(--border-active)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 800,
                padding: '10px 16px',
                flex: 1,
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '15px', color: 'var(--text-gold)', fontWeight: 700 }}>UZS</span>
          </div>
        </div>

        {/* Calculation Result Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: 600 }}>Sotuvchi aytgan</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{parsedAsking.toLocaleString('uz-UZ')} UZS</div>
            <div style={{ fontSize: '11px', color: '#FCA5A5', marginTop: '4px' }}>Boshlang'ich qimmat narx</div>
          </div>

          <div style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--border-gold)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 600 }}>Siz taklif qiling (1-qadam)</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-gold)', marginTop: '2px' }}>{counterOffer.toLocaleString('uz-UZ')} UZS</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>40-50% pasaytirib boshlang</div>
          </div>

          <div style={{ background: 'rgba(0, 168, 150, 0.12)', border: '1px solid var(--border-active)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-turquoise)', fontWeight: 700 }}>Adolatli Kelishuv Narxi</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent-turquoise)', marginTop: '2px' }}>{realisticDeal.toLocaleString('uz-UZ')} UZS</div>
            <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px' }}>Tejaladi: ~{savings.toLocaleString('uz-UZ')} UZS</div>
          </div>
        </div>

        {/* Spoken Phrases in Uzbek with Audio */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '13px', color: '#fff', fontWeight: 700, marginBottom: '10px' }}>
            🗣️ Sotuvchiga aytiladigan o'zbekcha iboralar (Eshiting va takrorlang):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { uz: `Aka, ${counterOffer.toLocaleString('uz-UZ')} so'mga bering, olaman.`, en: "Brother, give it for this price and I will take it." },
              { uz: "Oxirgi narxi qancha bo'ladi? Yaxshiroq qilib bering.", en: "What is your best final price? Make a good discount." },
              { uz: "Ikkita olsam, qanchadan qilib berasiz?", en: "If I take two, how much will you charge?" }
            ].map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>"{p.uz}"</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.en}</div>
                </div>
                <button
                  onClick={() => speakPhrase(p.uz)}
                  style={{ background: 'rgba(0, 168, 150, 0.2)', padding: '8px', borderRadius: '50%', color: 'var(--accent-turquoise)' }}
                  title="Tinglash"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Expert Bozor Tips */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(212, 175, 55, 0.05)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <Info size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: '#fff' }}>Gid Maslahati:</strong> {selectedItem.tips} Savdolashish O'zbekiston bozorlarida madaniyatning bir qismi hisoblanadi. Tabassum qiling va do'stona muloqot qiling!
          </div>
        </div>
      </div>
    </div>
  );
};
