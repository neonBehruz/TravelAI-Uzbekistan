import React, { useState } from 'react';
import {
  Utensils,
  Clock,
  MapPin,
  Star,
  Flame,
  Check,
  ChevronRight,
  Info,
  Sparkles,
  Heart
} from 'lucide-react';
import { UzbekFlag } from '../components/UzbekFlag';

interface Dish {
  id: string;
  name: string;
  category: string;
  region: string;
  imageUrl: string;
  rating: number;
  priceRangeUZS: string;
  bestTime: string;
  description: string;
  ingredients: string[];
  isHalal: boolean;
  bestSpots: { name: string; address: string; rating: number }[];
}

const DISHES: Dish[] = [
  {
    id: 'samarkand-plov',
    name: "Samarqand Palovi (Ziravorli)",
    category: "Palov",
    region: "Samarqand",
    imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80",
    rating: 4.95,
    priceRangeUZS: "35,000 - 55,000 UZS",
    bestTime: "11:30 - 13:30 (Tushlik)",
    description: "Samarqand palovining o'ziga xosligi — u aralashtirilmasdan qatlam-qatlam suziladi: guruch, sarg'ish sabzi va ustida shirali yumshoq mol go'shti.",
    ingredients: ["Devzira/Alanga guruch", "Marmar mol go'shti", "Sariq sabzi", "Zira", "Bedana tuxumi", "Qazi"],
    isHalal: true,
    bestSpots: [
      { name: "Samarqand Osh Markazi", address: "Spitamen shoh ko'chasi 42", rating: 4.9 },
      { name: "Choyxona Registon", address: "Registon maydoni yonida", rating: 4.8 }
    ]
  },
  {
    id: 'tashkent-plov',
    name: "Toshkent To'y Oshi (Choyxona Palovi)",
    category: "Palov",
    region: "Toshkent",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    rating: 4.92,
    priceRangeUZS: "40,000 - 65,000 UZS",
    bestTime: "11:45 - 14:00 (Tushlik)",
    description: "Katta to'y qozonlarida no'xat, mayiz, qazi va dumba yog'i bilan pishiriladigan shirador, to'yimli Toshkentcha palov.",
    ingredients: ["Lazer guruchi", "Qo'zichoq go'shti", "Noxat", "Qora mayiz", "Qazi"],
    isHalal: true,
    bestSpots: [
      { name: "Besh Qozon (Osh Markazi)", address: "Toshkent teleminorasi yonida", rating: 4.9 },
      { name: "Rayhon Milliy Taomlar", address: "Chilonzor 3-mavze", rating: 4.7 }
    ]
  },
  {
    id: 'tandir-somsa',
    name: "Jizzax & Samarqand Tandir Somsasi",
    category: "Xamir taomlar",
    region: "Jizzax / Samarqand",
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    priceRangeUZS: "12,000 - 25,000 UZS",
    bestTime: "10:00 - 18:00",
    description: "Tandir devorida qarsildoq qilib yopilgan, ichi to'la mayda to'g'ralgan go'sht va piyozli, sershira somsa.",
    ingredients: ["Qatlama xamir", "Mayda to'g'ralgan go'sht", "Piyoz", "Zira", "Sedana"],
    isHalal: true,
    bestSpots: [
      { name: "Siyob Bozori Somsa Qatori", address: "Bibixonim masjidi orqasi", rating: 4.9 },
      { name: "Jizzax Somsa Samarqand", address: "Gagarin ko'chasi", rating: 4.8 }
    ]
  },
  {
    id: 'shashlik',
    name: "G'ijduvon & Qashqadaryo Shashligi",
    category: "Kabab",
    region: "Buxoro / Qashqadaryo",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    rating: 4.88,
    priceRangeUZS: "18,000 - 28,000 UZS (1 dona)",
    bestTime: "12:00 - 22:00",
    description: "Maxsus marinadlangan qiyma va bo'lak go'shtli, ko'mir cho'g'ida pishirilgan xushbo'y shashlik.",
    ingredients: ["Qo'y go'shti", "Dumba", "Kashnich urug'i", "Qizil qalampir", "Sirka piyoz"],
    isHalal: true,
    bestSpots: [
      { name: "Buxoro Choyxonasi", address: "Lab-i Hovuz majmuasi", rating: 4.8 }
    ]
  },
  {
    id: 'samarkand-bread',
    name: "Samarqand Galaosiyo Noni (3 yil saqlanadigan)",
    category: "Non",
    region: "Samarqand",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    rating: 4.98,
    priceRangeUZS: "10,000 - 25,000 UZS",
    bestTime: "Ertalabdan kechgacha",
    description: "Samarqandning afsonaviy og'ir va qattiq yaltiroq noni. Bir necha yil qotmasdan saqlanishi va suv sepib isitganda yangidek bo'lishi bilan mashhur.",
    ingredients: ["Oliy nav un", "Qatiq", "Kunjut", "Sut"],
    isHalal: true,
    bestSpots: [
      { name: "Siyob Bozori Non rastalari", address: "Siyob bozori markazi", rating: 5.0 },
      { name: "Konigil Qishlog'i Nonvoyxonasi", address: "Konigil qishlog'i", rating: 4.9 }
    ]
  }
];

export const GastronomyPlovPage: React.FC<{ onOpenMap?: () => void }> = ({ onOpenMap }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Hammasi');
  const [selectedDish, setSelectedDish] = useState<Dish>(DISHES[0]);

  const categories = ['Hammasi', 'Palov', 'Xamir taomlar', 'Kabab', 'Non'];

  const filteredDishes = selectedCategory === 'Hammasi'
    ? DISHES
    : DISHES.filter(d => d.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.15), rgba(7, 13, 30, 0.9))',
        border: '1px solid var(--border-active)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div className="badge-turquoise">
            <Utensils size={14} /> Ipak Yo'li Gastronomiyasi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Clock size={12} /> Bugungi Osh Vaqti: 11:30 — 14:00
          </div>
        </div>
        <h1 style={{ fontSize: '26px', color: '#fff', marginBottom: '6px' }}>
          🍲 O'zbek Milliy Taomlar Gidi & Osh Xaritasi
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
          Samarqand, Toshkent va Buxoroning haqiqiy an'anaviy palovlari, somsasi va eng nufuzli choyxonalari.
        </p>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: selectedCategory === cat ? 'linear-gradient(135deg, var(--accent-turquoise), #028090)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedCategory === cat ? '#070D1E' : 'var(--text-secondary)',
              fontWeight: selectedCategory === cat ? 800 : 500,
              fontSize: '13px',
              border: `1px solid ${selectedCategory === cat ? 'var(--accent-turquoise)' : 'var(--border-subtle)'}`,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dish List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            onClick={() => setSelectedDish(dish)}
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              cursor: 'pointer',
              border: `1px solid ${selectedDish.id === dish.id ? 'var(--accent-turquoise)' : 'var(--border-subtle)'}`,
              boxShadow: selectedDish.id === dish.id ? '0 0 20px rgba(0, 168, 150, 0.3)' : 'none',
              transition: 'all 0.25s ease'
            }}
          >
            <div style={{ position: 'relative', height: '160px' }}>
              <img src={dish.imageUrl} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(7, 13, 30, 0.85)', padding: '4px 10px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 700 }}>
                <Star size={12} fill="var(--accent-gold)" color="var(--accent-gold)" />
                <span>{dish.rating}</span>
              </div>
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0, 168, 150, 0.85)', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', color: '#070D1E', fontWeight: 800 }}>
                {dish.region}
              </div>
            </div>

            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '16px', color: '#fff', fontWeight: 700, marginBottom: '6px' }}>{dish.name}</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
                {dish.description.slice(0, 85)}...
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--accent-turquoise)', fontWeight: 700 }}>{dish.priceRangeUZS}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{dish.bestTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Dish Detail Drawer / Panel */}
      {selectedDish && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-active)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 700 }}>{selectedDish.region} Milliy Taomi</span>
                <span style={{ fontSize: '11px', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>✓ 100% Halol</span>
              </div>
              <h2 style={{ fontSize: '22px', color: '#fff', fontWeight: 800 }}>{selectedDish.name}</h2>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-turquoise)' }}>
              {selectedDish.priceRangeUZS}
            </div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            {selectedDish.description}
          </p>

          {/* Ingredients */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', color: '#fff', fontWeight: 700, marginBottom: '8px' }}>Asosiy tarkibiy mahsulotlar:</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedDish.ingredients.map((ing, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '12px', color: 'var(--text-primary)' }}>
                  🌾 {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Authentic Spots */}
          <div>
            <h4 style={{ fontSize: '13px', color: '#fff', fontWeight: 700, marginBottom: '10px' }}>Tavsiya etiladigan eng yaxshi joylar (Oshxonalar):</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {selectedDish.bestSpots.map((spot, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{spot.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={11} color="var(--accent-turquoise)" /> {spot.address}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--accent-gold)', fontWeight: 700, fontSize: '12px' }}>
                    <Star size={12} fill="var(--accent-gold)" color="var(--accent-gold)" /> {spot.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
