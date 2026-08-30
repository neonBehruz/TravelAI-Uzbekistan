import React, { useState, useRef } from 'react';
import {
  Compass,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  Info,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudioGuide } from '../context/AudioGuideContext';

interface VirtualPanorama {
  id: string;
  title: string;
  city: string;
  century: string;
  imageUrl: string;
  description: string;
  hotspots: { title: string; desc: string; x: number; y: number }[];
}

const PANORAMAS: VirtualPanorama[] = [
  {
    id: 'registan',
    title: 'Registon Maydoni (Tilla-Kori & Sherdor)',
    city: 'Samarqand',
    century: 'XV–XVII asrlar',
    imageUrl: '/panoramas/registan_pano.jpg',
    description: "Sharq me'morchiligining tengsiz durdonasi. Ulug'bek, Sherdor va Tillakori madrasalarining tillarang va moviy naqshinkor koshinlari.",
    hotspots: [
      { title: "Tillakori Gumbazi", desc: "Ichki qismi 100% zarhal tilla suvi bilan bezatilgan muazzam gumbaz.", x: 48, y: 35 },
      { title: "Sherdor Sherlari", desc: "Quyosh ortib olgan afsonaviy ohu quvayotgan qoplon-sherlar mozaikasi.", x: 75, y: 50 },
      { title: "Ulug'bek Kursisi", desc: "Mirzo Ulug'bek talabalarga astronomiya va matematika saboqlarini bergan hujralar.", x: 22, y: 55 }
    ]
  },
  {
    id: 'kalyan',
    title: 'Poyi Kalon & Minorai Kalon',
    city: 'Buxoro',
    century: '1127-yil (XII asr)',
    imageUrl: '/panoramas/kalyan_pano.jpg',
    description: "45.6 metrli muhtasham minora. Chingizxon ham uning mahobatiga qoyil qolib vayron qilmagan afsonaviy yodgorlik.",
    hotspots: [
      { title: "Minorai Kalon Cho'qqisi", desc: "Karvonlarga yo'l ko'rsatuvchi mayoq vazifasini o'tagan 14 xil pishiq g'isht naqshi.", x: 50, y: 25 },
      { title: "Masjidi Kalon Hovlisi", desc: "10,000 namozxonni o'z bag'riga sig'diruvchi moviy gumbazli masjid.", x: 30, y: 65 }
    ]
  },
  {
    id: 'ichankala',
    title: 'Ko‘hna Ichan Qal‘a & Kalta Minor',
    city: 'Xiva',
    century: 'XII–XIX asrlar',
    imageUrl: '/panoramas/ichankala_pano.jpg',
    description: "To'liq saqlanib qolgan tirik o'rta asr qal'a-shahri. YUNESKO butunjahon madaniy merosi ob'ekti.",
    hotspots: [
      { title: "Kalta Minor", desc: "Balandligi 70 metr bo'lishi rejalashtirilgan, to'liq sirlangan feruza g'ishtli minora.", x: 42, y: 48 },
      { title: "Kuhnya Ark", desc: "Xiva xonlarining rasmiy saroyi va zarbxonasi joylashgan qadimiy qo'rg'on.", x: 70, y: 40 }
    ]
  }
];

export const VirtualTour360Page: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { playAudio } = useAudioGuide();
  const [selectedPanoIndex, setSelectedPanoIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<{ title: string; desc: string } | null>(null);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const currentPano = PANORAMAS[selectedPanoIndex];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setPanOffset((prev) => prev + delta * 0.4);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(7, 13, 30, 0.95))',
        border: '1px solid var(--border-gold)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 175, 55, 0.2)', color: '#FFD700', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 800 }}>
            <Compass size={14} /> 360° Interaktiv Virtual Sayohat
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Jonli Panoramik Ko'rinish & Nuqtalar</span>
        </div>
        <h1 style={{ fontSize: '28px', color: '#fff', marginBottom: '6px' }}>
          🔮 O'zbekiston Obidalari Bo'ylab 360° Virtual Tur
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '750px' }}>
          Tarixiy obidalarni sichqoncha yordamida harakatlantirib 360 darajada tomosha qiling va qiziqarli nuqtalarni o'rganing.
        </p>

        {/* Panorama Selector Tabs */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
          {PANORAMAS.map((pano, idx) => (
            <button
              key={pano.id}
              onClick={() => {
                setSelectedPanoIndex(idx);
                setActiveHotspot(null);
                setPanOffset(0);
              }}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: selectedPanoIndex === idx ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                background: selectedPanoIndex === idx ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedPanoIndex === idx ? 'var(--text-gold)' : '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📍 {pano.title.split('(')[0]} ({pano.city})
            </button>
          ))}
        </div>
      </div>

      {/* Panorama Viewer Canvas Box */}
      <div className="glass-panel" style={{
        position: 'relative',
        height: '520px',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--border-active)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none'
      }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Panoramic Sliding Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: `${panOffset % 800}px`,
          width: '200%',
          height: '100%',
          backgroundImage: `url(${currentPano.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.95)',
          transition: isDragging ? 'none' : 'transform 0.2s ease'
        }} />

        {/* Hotspots */}
        {currentPano.hotspots.map((spot, sIdx) => (
          <div
            key={sIdx}
            onClick={(e) => {
              e.stopPropagation();
              setActiveHotspot(spot);
            }}
            style={{
              position: 'absolute',
              top: `${spot.y}%`,
              left: `calc(${spot.x}% + ${(panOffset * 0.1) % 100}px)`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0, 168, 150, 0.9)',
              border: '2px solid #fff',
              boxShadow: '0 0 15px rgba(0, 229, 201, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              animation: 'pulse 2s infinite'
            }}>
              <Info size={16} />
            </div>
          </div>
        ))}

        {/* Top Info Overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '12px 18px',
          borderRadius: '12px',
          background: 'rgba(7, 13, 30, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-subtle)',
          zIndex: 5
        }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{currentPano.title}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-gold)', marginTop: '2px' }}>
            {currentPano.city} • {currentPano.century}
          </div>
        </div>

        {/* Drag Hint Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(7, 13, 30, 0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-subtle)',
          color: '#fff',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none'
        }}>
          <Compass size={14} color="var(--accent-turquoise)" /> Sichqoncha bilan surib 360° tomosha qiling
        </div>

        {/* Audio Narration Button */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 5 }}>
          <button
            onClick={() => playAudio(currentPano.title, currentPano.description, 'en')}
            className="btn-primary"
            style={{ padding: '10px 16px', fontSize: '12px', gap: '6px' }}
          >
            <Volume2 size={16} />
            <span>Audiogidni Tinglash</span>
          </button>
        </div>
      </div>

      {/* Active Hotspot Info Card */}
      {activeHotspot && (
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.15), rgba(7, 13, 30, 0.95))',
          border: '1px solid var(--border-active)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-turquoise)', marginBottom: '4px' }}>
              🔍 {activeHotspot.title}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {activeHotspot.desc}
            </div>
          </div>
          <button
            onClick={() => setActiveHotspot(null)}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Yopish
          </button>
        </div>
      )}
    </div>
  );
};
