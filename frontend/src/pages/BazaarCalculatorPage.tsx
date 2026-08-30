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
import { useLanguage, LanguageCode } from '../context/LanguageContext';

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

const BAZAAR_STRINGS: Partial<Record<LanguageCode, {
  badge: string;
  liveRate: string;
  title: string;
  subtitle: string;
  converterTitle: string;
  foreignCurrency: string;
  uzsCurrency: string;
  bargainingTitle: string;
  selectProduct: string;
  askingPriceLabel: string;
  fairPriceLabel: string;
  suggestedOffer: string;
  dealPrice: string;
  youSave: string;
  bargainingPhrases: string;
}>> = {
  uz: {
    badge: "Markaziy Bank Kurslari",
    liveRate: "Bugungi Jonli Valyuta",
    title: "💱 Valyuta & Bozor Savdolashuvchi AI",
    subtitle: "Siyob va Chorsu bozorlarida ortiqcha to'lamaslik uchun real narxni hisoblang va o'zbek tilida savdolashing!",
    converterTitle: "Tezkor Valyuta Konvertori",
    foreignCurrency: "Chet el valyutasi",
    uzsCurrency: "O'zbekiston So'mi (UZS)",
    bargainingTitle: "Bozor Savdolashuvchi AI Kalkulyator",
    selectProduct: "Bozor mahsulotini tanlang:",
    askingPriceLabel: "Sotuvchi so'ragan narx (UZS):",
    fairPriceLabel: "Odatdagi adolatli narx:",
    suggestedOffer: "Tavsiya etilgan boshlang'ich taklif",
    dealPrice: "Haqiqiy adolatli kelishuv",
    youSave: "Tejaladigan mablag'",
    bargainingPhrases: "Bozorda Ishlatiladigan O'zbekcha Iboralar (Ovozli)"
  },
  en: {
    badge: "Central Bank Rates",
    liveRate: "Live Currency Exchange",
    title: "💱 Currency & Bazaar Bargaining AI",
    subtitle: "Calculate fair prices at Chorsu and Siab bazaars, avoid tourist markups, and bargain in Uzbek!",
    converterTitle: "Live Currency Converter",
    foreignCurrency: "Foreign Currency",
    uzsCurrency: "Uzbekistan Som (UZS)",
    bargainingTitle: "Bazaar Smart Bargaining AI Calculator",
    selectProduct: "Select souvenir or bazaar item:",
    askingPriceLabel: "Seller's Asking Price (UZS):",
    fairPriceLabel: "Typical Fair Market Price:",
    suggestedOffer: "Suggested Starting Counter-Offer",
    dealPrice: "Target Fair Deal Price",
    youSave: "Estimated Savings",
    bargainingPhrases: "Essential Uzbek Bazaar Phrases (Audio)"
  },
  ru: {
    badge: "Курсы ЦБ Узбекистана",
    liveRate: "Текущий курс валют",
    title: "💱 Валюта и ИИ-Торг на Базаре",
    subtitle: "Узнайте справедливые цены на Сиабском и Чорсу базарах и торгуйтесь на узбекском как местный!",
    converterTitle: "Быстрый Конвертер Валют",
    foreignCurrency: "Иностранная валюта",
    uzsCurrency: "Узбекский сум (UZS)",
    bargainingTitle: "ИИ-Калькулятор для Торга на Базаре",
    selectProduct: "Выберите товар или сувенир:",
    askingPriceLabel: "Цена, названная продавцом (UZS):",
    fairPriceLabel: "Справедливая рыночная цена:",
    suggestedOffer: "Рекомендуемое начальное предложение",
    dealPrice: "Ожидаемая цена сделки",
    youSave: "Ваша экономия",
    bargainingPhrases: "Полезные фразы для торга на базаре (Аудио)"
  },
  tr: {
    badge: "Merkez Bankası Kurları",
    liveRate: "Canlı Döviz Kuru",
    title: "💱 Döviz & Pazar Pazarlık Yapay Zekası",
    subtitle: "Çorsu ve Siyob pazarlarında adil fiyatı hesaplayın ve Özbekçe pazarlık yapın!",
    converterTitle: "Canlı Döviz Çevirici",
    foreignCurrency: "Yabancı Para Birimi",
    uzsCurrency: "Özbekistan Somu (UZS)",
    bargainingTitle: "Pazar Pazarlık AI Hesaplayıcı",
    selectProduct: "Ürün veya hatıra seçin:",
    askingPriceLabel: "Satıcının İstediği Fiyat (UZS):",
    fairPriceLabel: "Normal Piyasa Fiyatı:",
    suggestedOffer: "Önerilen Başlangıç Teklifi",
    dealPrice: "Hedef Anlaşma Fiyatı",
    youSave: "Tasarrufunuz",
    bargainingPhrases: "Pazarda Kullanılan Özbekçe Cümleler (Sesli)"
  },
  de: {
    badge: "Zentralbankkurse",
    liveRate: "Live-Wechselkurse",
    title: "💱 Währung & Basar-Verhandlungs-KI",
    subtitle: "Berechnen Sie faire Preise auf Basaren in Samarkand und Taschkent und verhandeln Sie auf Usbekisch!",
    converterTitle: "Live-Währungsrechner",
    foreignCurrency: "Fremdwährung",
    uzsCurrency: "Usbekischer Som (UZS)",
    bargainingTitle: "Basar-Verhandlungsrechner",
    selectProduct: "Produkt oder Souvenir wählen:",
    askingPriceLabel: "Geforderter Preis (UZS):",
    fairPriceLabel: "Typischer Marktpreis:",
    suggestedOffer: "Empfohlenes Gegenangebot",
    dealPrice: "Faires Zielangebot",
    youSave: "Ihre Ersparnis",
    bargainingPhrases: "Nützliche usbekische Basar-Phrasen (Audio)"
  },
  fr: {
    badge: "Taux Banque Centrale",
    liveRate: "Taux de change en direct",
    title: "💱 Devises & Négociation au Bazar par IA",
    subtitle: "Calculez le juste prix sur les bazars de Samarcande et Tachkent et négociez en ouzbek !",
    converterTitle: "Convertisseur de Devises",
    foreignCurrency: "Devise Étrangère",
    uzsCurrency: "Sum Ouzbek (UZS)",
    bargainingTitle: "Calculateur de Négociation IA",
    selectProduct: "Sélectionnez un article :",
    askingPriceLabel: "Prix demandé par le vendeur (UZS) :",
    fairPriceLabel: "Prix équitable habituel :",
    suggestedOffer: "Contre-offre initiale conseillée",
    dealPrice: "Prix d'accord équitable visé",
    youSave: "Votre économie estimée",
    bargainingPhrases: "Phrases utiles au bazar en ouzbek (Audio)"
  },
  es: {
    badge: "Tasas Banco Central",
    liveRate: "Tipo de cambio en vivo",
    title: "💱 Moneda y Regateo en el Bazar con IA",
    subtitle: "¡Calcula precios justos en los bazares de Uzbekistán y regatea en uzbeko!",
    converterTitle: "Conversor de Moneda en Vivo",
    foreignCurrency: "Moneda Extranjera",
    uzsCurrency: "Som Uzbeko (UZS)",
    bargainingTitle: "Calculadora de Regateo con IA",
    selectProduct: "Selecciona un artículo o souvenir:",
    askingPriceLabel: "Precio pedido por el vendedor (UZS):",
    fairPriceLabel: "Precio justo de mercado:",
    suggestedOffer: "Contraoferta inicial sugerida",
    dealPrice: "Precio justo objetivo",
    youSave: "Ahorro estimado",
    bargainingPhrases: "Frases útiles para regatear en uzbeko (Audio)"
  },
  zh: {
    badge: "央行实时汇率",
    liveRate: "实时货币汇率",
    title: "💱 汇率换算与巴扎智能砍价 AI",
    subtitle: "在帖木儿故里的巴扎里了解真实公道价格，用乌兹别克语地道砍价！",
    converterTitle: "实时汇率换算器",
    foreignCurrency: "外币金额",
    uzsCurrency: "乌兹别克斯坦苏姆 (UZS)",
    bargainingTitle: "巴扎智能砍价计算器",
    selectProduct: "选择特色纪念品或商品：",
    askingPriceLabel: "商家开价 (UZS)：",
    fairPriceLabel: "正常市场公道价：",
    suggestedOffer: "建议起始还价",
    dealPrice: "合理成交目标价",
    youSave: "预计节省金额",
    bargainingPhrases: "巴扎实用乌兹别克语砍价短语（带发音）"
  },
  ja: {
    badge: "中央銀行為替レート",
    liveRate: "リアルタイム為替",
    title: "💱 通貨換算＆バザール価格交渉AI",
    subtitle: "バザールで適正価格を把握し、ウズベク語でスムーズに価格交渉を楽しみましょう！",
    converterTitle: "リアルタイム通貨コンバーター",
    foreignCurrency: "外国通貨",
    uzsCurrency: "ウズベキスタン・スム (UZS)",
    bargainingTitle: "バザール交渉AIカリキュレーター",
    selectProduct: "お土産または商品を選択：",
    askingPriceLabel: "売り手の提示価格 (UZS)：",
    fairPriceLabel: "適正な市場価格：",
    suggestedOffer: "おすすめの最初の提示額",
    dealPrice: "適正な目標合意価格",
    youSave: "節約可能額",
    bargainingPhrases: "バザールで役立つウズベク語フレーズ（音声付）"
  },
  ko: {
    badge: "중앙은행 실시간 환율",
    liveRate: "실시간 환율 정보",
    title: "💱 환율 계산기 & 바자르 AI 흥정 도우미",
    subtitle: "우즈베키스탄 전통 시장에서 합리적인 가격을 확인하고 우즈베크어로 흥정해보세요!",
    converterTitle: "실시간 환율 변환기",
    foreignCurrency: "외화 금액",
    uzsCurrency: "우즈베키스탄 숨 (UZS)",
    bargainingTitle: "바자르 AI 흥정 계산기",
    selectProduct: "기념품 또는 품목 선택:",
    askingPriceLabel: "상인이 부른 가격 (UZS):",
    fairPriceLabel: "통상적인 적정 시장 가격:",
    suggestedOffer: "추천 시작 제안가",
    dealPrice: "목표 적정 합의가",
    youSave: "예상 절약 금액",
    bargainingPhrases: "바자르 필수 우즈베크어 표현 (오디오)"
  }
};

export const BazaarCalculatorPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const tBazaar = BAZAAR_STRINGS[currentLanguage] || BAZAAR_STRINGS.uz!;

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
            <Coins size={14} /> {tBazaar.badge}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tBazaar.liveRate}</span>
        </div>
        <h1 style={{ fontSize: '26px', color: '#fff', marginBottom: '6px' }}>
          {tBazaar.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
          {tBazaar.subtitle}
        </p>
      </div>

      {/* 1. Live Currency Converter */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator size={18} color="var(--accent-gold)" /> {tBazaar.converterTitle}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'center' }}>
          {/* Foreign Input */}
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>{tBazaar.foreignCurrency}</label>
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
              <label style={{ fontSize: '12px', color: 'var(--text-turquoise)', fontWeight: 700 }}>{tBazaar.uzsCurrency}</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                value={uzsAmount}
                onChange={(e) => handleUzsChange(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-turquoise)', fontSize: '24px', fontWeight: 800, width: '100%', outline: 'none' }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>UZS</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              O'zbekiston milliy valyutasi
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bazaar Bargaining Calculator */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={18} color="var(--accent-turquoise)" /> {tBazaar.bargainingTitle}
        </h2>

        {/* Item Selector Chips */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {tBazaar.selectProduct}
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {BAZAAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setAskingPrice((item.typicalFairPriceUZS * 1.4).toString());
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: selectedItem.id === item.id ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.05)',
                  color: selectedItem.id === item.id ? '#070D1E' : '#fff',
                  border: selectedItem.id === item.id ? 'none' : '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
          {/* Asking Price Input */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              {tBazaar.askingPriceLabel}
            </label>
            <input
              type="number"
              value={askingPrice}
              onChange={(e) => setAskingPrice(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '18px', fontWeight: 800, outline: 'none' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              {tBazaar.fairPriceLabel} {selectedItem.typicalFairPriceUZS.toLocaleString('uz-UZ')} UZS
            </div>
          </div>

          {/* AI Recommended Start Offer */}
          <div style={{ background: 'rgba(212, 175, 55, 0.08)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 700 }}>
              <TrendingDown size={14} /> {tBazaar.suggestedOffer}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent-gold)', marginTop: '8px' }}>
              {counterOffer.toLocaleString('uz-UZ')} <span style={{ fontSize: '14px' }}>UZS</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Sotuvchi aytgan narxdan 40% pastroq taklif bering.
            </div>
          </div>

          {/* AI Fair Deal Target */}
          <div style={{ background: 'rgba(0, 168, 150, 0.1)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-turquoise)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-turquoise)', fontSize: '12px', fontWeight: 700 }}>
              <CheckCircle size={14} /> {tBazaar.dealPrice}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginTop: '8px' }}>
              {realisticDeal.toLocaleString('uz-UZ')} <span style={{ fontSize: '14px' }}>UZS</span>
            </div>
            <div style={{ fontSize: '11px', color: '#10B981', marginTop: '4px', fontWeight: 700 }}>
              ✓ {tBazaar.youSave}: {savings.toLocaleString('uz-UZ')} UZS
            </div>
          </div>
        </div>

        {/* Local Expert Tip */}
        <div style={{ marginTop: '16px', padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Info size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: '#fff' }}>Mahalliy maslahat:</strong> {selectedItem.tips}
          </div>
        </div>
      </div>

      {/* 3. Essential Uzbek Bazaar Phrases with Audio */}
      <div>
        <h2 style={{ fontSize: '18px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={18} color="var(--accent-turquoise)" /> {tBazaar.bargainingPhrases}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {[
            { uz: "Qanchaga berasiz, aka?", en: "What's your best price, brother?", phonetic: "Qan-cha-ga be-ra-siz, a-ka?" },
            { uz: "Biroz tushirib bering!", en: "Please give me a small discount!", phonetic: "Bi-roz tu-shi-rib be-ring!" },
            { uz: "Uchtasini olsam, qancha qilib berasiz?", en: "If I buy three, what's the discount?", phonetic: "Uch-ta-si-ni ol-sam, qan-cha qi-lib be-ra-siz?" },
            { uz: "Bu haqiqiy ipakmi / qo'l mehnati mi?", en: "Is this genuine silk / handmade?", phonetic: "Bu ha-qi-qiy ipak-mi?" },
            { uz: "Rahmat, juda chiroyli ekan!", en: "Thank you, it is very beautiful!", phonetic: "Rakh-mat, ju-da chi-roy-li e-kan!" },
            { uz: "Karta bilan to'lasam bo'ladimi?", en: "Can I pay by card (Uzcard/Humo/Visa)?", phonetic: "Kar-ta bi-lan to'la-sam bo'la-di-mi?" }
          ].map((phrase, i) => (
            <div
              key={i}
              className="glass-panel"
              style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>"{phrase.uz}"</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-turquoise)', marginTop: '2px' }}>Talaffuz: {phrase.phonetic}</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{phrase.en}</div>
              </div>

              <button
                onClick={() => speakPhrase(phrase.uz)}
                className="btn-secondary"
                style={{ width: '34px', height: '34px', padding: 0, borderRadius: '50%', flexShrink: 0 }}
                title="Ovoz chiqarib eshitish"
              >
                <Volume2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
