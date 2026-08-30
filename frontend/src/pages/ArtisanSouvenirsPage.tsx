import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Tag,
  Award,
  ExternalLink,
  ShoppingBag,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CraftMasterpiece {
  id: string;
  name: string;
  city: string;
  unescoStatus: string;
  imageUrl: string;
  priceRangeUzs: string;
  priceRangeUsd: string;
  description: string;
  authenticityGuide: string[];
  topWorkshops: { name: string; address: string; master: string }[];
}

const CRAFTS: CraftMasterpiece[] = [
  {
    id: 'rishton-ceramics',
    name: 'Rishton Moviy Kulolchiligi',
    city: "Rishton (Farg'ona)",
    unescoStatus: "YUNESKO Nomoddiy Madaniy Merosi",
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    priceRangeUzs: "50,000 – 600,000 UZS",
    priceRangeUsd: "$4 – $50",
    description: "Qizil loy va 'Ishqor' tabiiy o'simlik siridan foydalanib yasaladigan o'zgarmas zumrad-feruza rangli lagan va piyolalar.",
    authenticityGuide: [
      "Orqa tomonida qizil loy rangi va usta imzosi bo'ladi.",
      "Taqillatganda shisha kabi jarangdor toza ovoz chiqaradi.",
      "Tabiiy ishqor siri yillar o'tsa ham yorilmaydi va zaharli qo'rg'oshin bo'lmaydi."
    ],
    topWorkshops: [
      { name: "Usta Alisher Nazirov Kulolchilik Markazi", address: "Rishton sh., Farg'ona ko'chasi 45", master: "Alisher Nazirov (Bosh Usta)" },
      { name: "Said Ahmadxon Madrasa Hunarmandlar Rastalari", address: "Marg'ilon sh., Ipakchilar ko'chasi", master: "Usta Saidbek" }
    ]
  },
  {
    id: 'margilan-silk',
    name: "Marg'ilon Xonatlasi & Adras (Ikat)",
    city: "Marg'ilon (Farg'ona)",
    unescoStatus: "YUNESKOning Ilg'or Meros Reestri",
    imageUrl: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=800&q=80',
    priceRangeUzs: "80,000 – 1,200,000 UZS / metr",
    priceRangeUsd: "$7 – $95 / metr",
    description: "Ipak qurtidan olinadigan 100% tabiiy ipak tolalari, anor po'sti, yong'oq va o'simliklar bilan bo'yalgan dunyoga mashhur Xonatlas va Adras.",
    authenticityGuide: [
      "Qo'lda to'qilgan atlasning orqa va old tomoni bir xil yorqinlikda bo'ladi.",
      "Ipak tolasini kuydirib ko'rganda soch kabi yonadi va kul bo'lib qoladi (sintetika kabi erimaydi).",
      "Ikat naqshlarining ulanish chiziqlari bir oz erkin va qo'l mehnati hissi bilan ajralib turadi."
    ],
    topWorkshops: [
      { name: "'Yodgorlik' Ipakchilik Fabrikasi", address: "Marg'ilon sh., Ipak Yo'li ko'chasi 12", master: "A'zamxon Usta" },
      { name: "Fazliddin Ipak To'quvchilar Markazi", address: "Marg'ilon sh., Xonaqoh ko'chasi 5", master: "Fazliddin Qosimov" }
    ]
  },
  {
    id: 'bukhara-gold',
    name: "Buxoro Zardo'zligi & Misgarlik",
    city: "Buxoro",
    unescoStatus: "Sharq Amaliy San'at Durdonasi",
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80',
    priceRangeUzs: "150,000 – 3,000,000 UZS",
    priceRangeUsd: "$12 – $240",
    description: "Buxoro amirlari saroylaridan meros bo'lgan tilla va kumush iplar bilan baxmal ustiga qo'lda tikiladigan zardo'zi choponlar va mis buyumlar.",
    authenticityGuide: [
      "Haqiqiy zardo'zlik baxmal matoga maxsus karton asos (shablon) ustidan tikiladi.",
      "Zar iplari vaqt o'tishi bilan qoraymaydi va yaltirashini yo'qotmaydi.",
      "Toqiy Zargaron va Toqiy Telpak Furushon gumbazlari ostida sertifikatlangan ustalardan xarid qiling."
    ],
    topWorkshops: [
      { name: "Toqiy Zargaron Zardo'zlik Rastasi", address: "Buxoro sh., Eski Shahar markazi", master: "Usta Bahromjon" },
      { name: "Sayfiddin Misgarlik Ustaxonasi", address: "Buxoro sh., Labi Hovuz orqasi 8", master: "Sayfiddin Ikromov" }
    ]
  },
  {
    id: 'samarkand-paper',
    name: "Konigil Samarqand Ipak Qog'ozi",
    city: "Samarqand",
    unescoStatus: "Qadimiy Qog'oz Tiklanish Loyihasi",
    imageUrl: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80',
    priceRangeUzs: "30,000 – 400,000 UZS",
    priceRangeUsd: "$2.50 – $32",
    description: "Tut daraxti po'stlog'idan suv tegirmoni yordamida yasaladigan, 2000 yil davomida chirimasdan saqlanuvchi afsonaviy Samarqand qog'ozi.",
    authenticityGuide: [
      "Qog'oz yuzasi silliq shox yoki chig'anoq bilan sayqallangan bo'ladi.",
      "Namlikka juda chidamli bo'lib, suv tekkanida ham yirtilib ketmaydi.",
      "Undan tayyorlangan xattotlik namunalari va qadimiy miniatyuralar eng qadrli sovg'adir."
    ],
    topWorkshops: [
      { name: "'Meros' Konigil Qog'oz Tegirmoni", address: "Samarqand tumani, Konigil qishlog'i", master: "Zarif Muxtorov" }
    ]
  }
];

export const ArtisanSouvenirsPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [selectedCraft, setSelectedCraft] = useState<CraftMasterpiece>(CRAFTS[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(7, 13, 30, 0.95))',
        border: '1px solid rgba(236, 72, 153, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236, 72, 153, 0.2)', color: '#F472B6', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 800 }}>
            <Award size={14} /> Milliy Hunarmandchilik & Suvenirlar
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Haqiqiy Qo'l Mehnati Gidi</span>
        </div>
        <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '6px' }}>
          🏺 O'zbekiston Milliy Suvenirlari, Hunarmandlik & Narxlar
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '750px' }}>
          Haqiqiy qo'l mehnatini zavod nusxalaridan qanday ajratish, o'rtacha bozor narxlari va eng sara usta-hunarmandlar manzillari.
        </p>

        {/* Craft Selector Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
          {CRAFTS.map((craft) => (
            <button
              key={craft.id}
              onClick={() => setSelectedCraft(craft)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: selectedCraft.id === craft.id ? '1px solid #EC4899' : '1px solid var(--border-subtle)',
                background: selectedCraft.id === craft.id ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCraft.id === craft.id ? '#F472B6' : '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {craft.name.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Craft Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left: Image & Description */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ height: '240px', borderRadius: '14px', overflow: 'hidden', marginBottom: '18px' }}>
            <img src={selectedCraft.imageUrl} alt={selectedCraft.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-gold)', fontWeight: 700 }}>
              🏛️ {selectedCraft.unescoStatus}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              📍 {selectedCraft.city}
            </span>
          </div>

          <h2 style={{ fontSize: '22px', color: '#fff', fontWeight: 800, marginBottom: '10px' }}>
            {selectedCraft.name}
          </h2>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
            {selectedCraft.description}
          </p>

          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>O'rtacha Bozor Narxi:</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-turquoise)', marginTop: '2px' }}>
              {selectedCraft.priceRangeUzs} <span style={{ fontSize: '13px', color: 'var(--text-gold)' }}>({selectedCraft.priceRangeUsd})</span>
            </div>
          </div>
        </div>

        {/* Right: Authenticity Guide & Top Workshops */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Authenticity Checklist */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-active)' }}>
            <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <CheckCircle size={18} color="var(--accent-turquoise)" /> Qalbaki emas, haqiqiyligini tekshirish usullari:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedCraft.authenticityGuide.map((guide, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--accent-turquoise)', fontWeight: 800 }}>✓</span>
                  <span>{guide}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Verified Workshops */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <ShoppingBag size={18} color="var(--accent-gold)" /> Tavsiya etilgan usta va ustaxonalar:
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedCraft.topWorkshops.map((ws, wIdx) => (
                <div key={wIdx} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{ws.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-gold)', marginTop: '2px' }}>Ustoz: {ws.master}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>📍 {ws.address}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
