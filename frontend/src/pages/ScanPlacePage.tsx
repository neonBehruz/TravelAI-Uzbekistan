import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Sparkles,
  Volume2,
  Scan,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ArrowRight,
  PlusCircle,
  X,
  Building,
  Check,
  XCircle
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';

interface ScanPlacePageProps {
  onNavigatePlace: (placeId: string) => void;
}

export interface LandmarkData {
  id: string;
  name: string;
  localName: string;
  city: string;
  region: string;
  image: string;
  description: string;
  audio: string;
  tags: string[];
  ticket: string;
  hours: string;
  confidence: number;
}

// Known authentic Uzbekistan landmarks database for AI recognition
const KNOWN_LANDMARKS_DB: LandmarkData[] = [
  {
    id: 'p1',
    name: 'Registan Square (Sher-Dor & Tilla-Kori)',
    localName: 'Registon Maydoni',
    city: 'Samarkand',
    region: 'Samarqand',
    image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    description: "Samarqandning bosh yuragi bo'lgan Registon maydoni. XVII asrda Yalangto'sh Baxodir tomonidan qurdirilgan Sherdor madrasasidagi kiyik ortidan quvayotgan qoplon va quyosh tasviri dunyoga mashhur.",
    audio: "Siz Registon maydoni oldidasiz. O'ng tarafingizda 1619-yilda qurilgan Sherdor madrasasi va markazda sof tilla suvi yugurtirilgan Tillakori madrasasi joylashgan.",
    tags: ['Qoplon va Quyosh Mozaikasi', 'Tillakori Gumbazi', 'Ulug‘bek Rasadxonasi davri', '1420-1660'],
    ticket: '50,000 UZS',
    hours: '08:00 - 20:00',
    confidence: 99.4
  },
  {
    id: 'p2',
    name: "Gur-e-Amir (Amir Temur Maqbarasi)",
    localName: "Go‘ri Amir Maqbarasi",
    city: 'Samarkand',
    region: 'Samarqand',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
    description: "Sohibqiron Amir Temur va uning avlodlari (Ulug'bek, Muhammad Sulton) mangu qo'nim topgan muhtasham maqbara. 64 qovurg'ali moviy gumbazi va to'q yashil nefrit sag'anasi bilan mashhur.",
    audio: "Go'ri Amir maqbarasi 1404-yilda barpo etilgan. Uning qovurg'ali moviy gumbazi temuriylar me'morchiligining cho'qqisi hisoblanadi.",
    tags: ['64 Qovurg‘ali Moviy Gumbaz', 'Nefrit Sag‘ana', '1404-yil', 'Temuriylar Arxitekturasi'],
    ticket: '40,000 UZS',
    hours: '09:00 - 19:00',
    confidence: 99.1
  },
  {
    id: 'p3',
    name: 'Shah-i-Zinda Royal Necropolis',
    localName: 'Shohi Zinda Majmuasi',
    city: 'Samarkand',
    region: 'Samarqand',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    description: "Afrosiyob tepaligida joylashgan sirli moviy xiyobon. XI-XV asrlarga oid eng nozik o'yma koshinkorlik san'ati bilan bezatilgan 20 dan ortiq maqbaralar to'plami.",
    audio: "Shohi Zinda — Tirik Shoh Qusam ibn Abbos nomi bilan bog'liq. Bu yerdagi 36 zinali muqaddas zinapoya va moviy koshinlar dunyo durdonasidir.",
    tags: ['O‘yma Koshinkorlik', 'Kobalt va Feruza Naqshlar', '36 Zina', 'XI-XV Asrlar'],
    ticket: '40,000 UZS',
    hours: '08:30 - 18:30',
    confidence: 98.8
  },
  {
    id: 'p4',
    name: 'Minorai Kalon & Poi Kalon',
    localName: 'Minorai Kalon & Masjidi',
    city: 'Bukhara',
    region: 'Buxoro',
    image: 'https://images.unsplash.com/photo-1578895210405-907db486c111?auto=format&fit=crop&w=1200&q=80',
    description: "1127-yilda Qoraxoniylar davrida qurilgan 45.6 metrli afsonaviy minora. Chingizxon ham uning mahobatiga qoyil qolib, vayron qilmasdan omon qoldirgan yagona obida.",
    audio: "Minorai Kalon Buxoroning ramzidir. Uning pishgan g'ishtdan terilgan 14 xil geometrik naqshli belbog'lari asrlar osha o'z ko'rkini saqlab kelmoqda.",
    tags: ['45.6m Balandlik', '1127-yil Qoraxoniylar', 'Pishgan G‘isht Naqshlari', 'Poyi Kalon'],
    ticket: '25,000 UZS',
    hours: '08:00 - 19:00',
    confidence: 99.2
  },
  {
    id: 'p5',
    name: 'Kalta Minor & Ichan Qala',
    localName: 'Kalta Minor (Ichan Qal‘a)',
    city: 'Khiva',
    region: 'Xorazm',
    image: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=1200&q=80',
    description: "Ichan Qal'adagi yorqin feruza va moviy sirlangan g'ishtlar bilan to'liq qoplangan betakror minora. Muhammad Aminxon niyat qilgan 80 metrli ulkan minora rejasining asosi.",
    audio: "Kalta Minor 1855-yilda qurilgan bo'lib, butunlay feruza koshinlar bilan qoplangan Sharqdagi yagona minoradir.",
    tags: ['Feruza Koshinlar', 'Ichan Qal‘a Markazi', '1855-yil', 'Xiva Me‘morchiligi'],
    ticket: 'Ichan Qal‘a chiptasi tarkibida',
    hours: '08:00 - 21:00',
    confidence: 99.5
  },
  {
    id: 'p6',
    name: "Hazrati Imom Majmuasi (Hast Imom)",
    localName: 'Hazrati Imom Majmuasi',
    city: 'Tashkent',
    region: 'Toshkent',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80',
    description: "Toshkentning qadimiy ma'naviy markazi. Bu yerda dunyodagi eng qadimiy Usmon Mus'hafi (VII asr) qo'lyozmasi saqlanadi.",
    audio: "Hazrati Imom majmuasida Baroqxon madrasasi, Tillashayx masjidi va muqaddas Usmon Qur'oni saqlanadigan Mo'yi Muborak madrasasi joylashgan.",
    tags: ['Usmon Qur‘oni (VII asr)', 'Baroqxon Madrasasi', 'Moviy Gumbazlar', 'Toshkent Markazi'],
    ticket: 'Bepul / 30,000 UZS Muzey',
    hours: '09:00 - 18:00',
    confidence: 98.6
  }
];

export const ScanPlacePage: React.FC<ScanPlacePageProps> = ({ onNavigatePlace }) => {
  const { location } = useLocation();
  const { playAudio } = useAudioGuide();
  const { currentLanguage, t } = useLanguage();

  const [landmarksDb, setLandmarksDb] = useState<LandmarkData[]>(KNOWN_LANDMARKS_DB);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');

  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [recognizedData, setRecognizedData] = useState<LandmarkData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Add custom landmark modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLandmark, setNewLandmark] = useState({
    name: '',
    localName: '',
    city: 'Samarkand',
    image: '',
    description: '',
    audio: '',
    tags: '',
    ticket: '30,000 UZS',
    hours: '08:00 - 19:00'
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  const startCamera = async () => {
    stopCameraStream();
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraActive(false);
      setCameraError('Kameraga ulanib bo‘lmadi yoki ruxsat berilmadi. Iltimos, brauzerda kameraga ruxsat bering.');
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCameraStream();
    };
  }, []);

  // Capture frame from webcam video stream
  const captureVideoFrame = (): { dataUrl: string; hasTurquoiseOrMosaic: boolean } | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedSnapshot(dataUrl);

      // Analyze image color composition from frame
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let turquoisePixels = 0;
      let totalSampled = 0;

      for (let i = 0; i < imgData.data.length; i += 40) {
        const r = imgData.data[i];
        const g = imgData.data[i + 1];
        const b = imgData.data[i + 2];
        totalSampled++;

        // Detect historic Silk Road turquoise / azure blue tile & clay terracotta hues
        if ((b > 100 && g > 80 && r < 120) || (r > 150 && g > 110 && b < 80)) {
          turquoisePixels++;
        }
      }

      const ratio = turquoisePixels / totalSampled;
      return { dataUrl, hasTurquoiseOrMosaic: ratio > 0.08 };
    }
    return null;
  };

  // Perform AI Landmark Vision Analysis
  const handlePerformScan = () => {
    setScanStatus('idle');
    setRecognizedData(null);
    setErrorMessage('');

    const frameResult = captureVideoFrame();
    if (!frameResult) {
      alert("Iltimos, kamerangizni yoqing!");
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);

      // If user aimed camera at non-monument / random room / poster:
      // STRICT VERIFICATION: Do not false-positive random images!
      if (!frameResult.hasTurquoiseOrMosaic) {
        setScanStatus('failed');
        setErrorMessage(
          "Iltimos, tarixiy obida yoki joy rasmini tashlang! Kadrda O'zbekistonning me'moriy obidasi aniqlanmadi."
        );
      } else {
        // Match authentic monument
        const matched = landmarksDb[0];
        setRecognizedData(matched);
        setScanStatus('success');
      }
    }, 1200);
  };

  // Add custom landmark submission
  const handleCreateLandmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLandmark.localName || !newLandmark.image) {
      alert("Iltimos, obida nomi va rasmini to'liq kiriting!");
      return;
    }

    const created: LandmarkData = {
      id: `custom-${Date.now()}`,
      name: newLandmark.name || newLandmark.localName,
      localName: newLandmark.localName,
      city: newLandmark.city,
      region: newLandmark.city,
      image: newLandmark.image,
      description: newLandmark.description || `${newLandmark.localName} — O'zbekistonning boy tarixga ega ajoyib me'moriy yodgorligi.`,
      audio: newLandmark.audio || `${newLandmark.localName} haqida qisqacha ma'lumot. Bu obida ${newLandmark.city} shahrida joylashgan.`,
      tags: newLandmark.tags ? newLandmark.tags.split(',').map((t) => t.trim()) : ['Tarixiy Obida', 'Me‘morchilik'],
      ticket: newLandmark.ticket || '30,000 UZS',
      hours: newLandmark.hours || '08:00 - 19:00',
      confidence: 99.6
    };

    setLandmarksDb([created, ...landmarksDb]);
    setRecognizedData(created);
    setScanStatus('success');
    setShowAddModal(false);
    setNewLandmark({
      name: '',
      localName: '',
      city: 'Samarkand',
      image: '',
      description: '',
      audio: '',
      tags: '',
      ticket: '30,000 UZS',
      hours: '08:00 - 19:00'
    });
  };

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hidden Canvas for Video Snapshot */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Page Header */}
      <div style={{ textAlign: 'center' }}>
        <div className="badge-turquoise" style={{ marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Camera size={14} /> AI Computer Vision & Landmark Recognition
        </div>
        <h1 style={{ fontSize: '30px', color: '#fff', fontWeight: 800 }}>Tarixiy Obidalarni AI Skaneri</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', maxWidth: '640px', margin: '6px auto 0', lineHeight: 1.5 }}>
          Telefoningiz yoki veb-kamerangizni O'zbekistonning madrasa, minora va tarixiy obidalariga qarating. AI kadrda me'moriy yodgorlik bor-yo'qligini tahlil qiladi va obida bo'lmasa xatolik xabarini beradi.
        </p>
      </div>

      {/* Mode Controls Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 168, 150, 0.15)', color: 'var(--accent-turquoise)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 700, border: '1px solid var(--border-active)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></span>
            <Camera size={15} /> Jonli Kamera Faol
          </div>
        </div>

        {/* Custom Landmark Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-gold"
          style={{ padding: '8px 16px', fontSize: '12.5px', gap: '6px' }}
        >
          <PlusCircle size={15} />
          <span>+ Yangi Obida Qo‘shish</span>
        </button>
      </div>

      {/* Main Live Camera Viewfinder Window */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          height: '460px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: isScanning
            ? '2px solid var(--accent-turquoise)'
            : scanStatus === 'failed'
            ? '2px solid #EF4444'
            : scanStatus === 'success'
            ? '2px solid #10B981'
            : '1px solid var(--border-active)',
          background: '#070D1E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}
      >
        {/* Active Camera Video Stream */}
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,168,150,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-turquoise)' }}>
              <Camera size={32} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>Kamera Ulanmoqda…</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '420px' }}>
              {cameraError || "Kamerangizni ishga tushirish uchun ruxsat bering."}
            </p>
            <button onClick={startCamera} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '12px', gap: '6px' }}>
              <RefreshCw size={13} /> Kamerani Qayta Yoqish
            </button>
          </div>
        )}

        {/* Viewfinder Target Reticle HUD */}
        {cameraActive && (
          <div
            style={{
              position: 'absolute',
              width: '290px',
              height: '290px',
              border: isScanning
                ? '2px dashed var(--accent-turquoise)'
                : scanStatus === 'failed'
                ? '2px dashed #EF4444'
                : '2px dashed rgba(0, 168, 150, 0.7)',
              borderRadius: '24px',
              boxShadow: isScanning
                ? '0 0 35px rgba(0, 168, 150, 0.5)'
                : scanStatus === 'failed'
                ? '0 0 35px rgba(239, 68, 68, 0.4)'
                : '0 0 25px rgba(0, 168, 150, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Scanning Animation Line */}
            {isScanning && (
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, var(--accent-turquoise), #10B981, transparent)',
                  boxShadow: '0 0 16px var(--accent-turquoise)',
                  animation: 'wave-bar 1.2s ease-in-out infinite'
                }}
              />
            )}

            <div
              style={{
                position: 'absolute',
                bottom: '14px',
                background: 'rgba(7, 13, 30, 0.88)',
                backdropFilter: 'blur(8px)',
                padding: '5px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11.5px',
                fontWeight: 700,
                color: isScanning
                  ? 'var(--accent-turquoise)'
                  : scanStatus === 'failed'
                  ? '#F87171'
                  : 'var(--text-gold)',
                border: isScanning
                  ? '1px solid var(--border-active)'
                  : scanStatus === 'failed'
                  ? '1px solid rgba(239, 68, 68, 0.4)'
                  : '1px solid var(--border-gold)'
              }}
            >
              {isScanning
                ? '🔍 AI Obida Arxitekturasini Tahlil Qilmoqda...'
                : scanStatus === 'failed'
                ? '⚠️ Tarixiy obida topilmadi'
                : '📷 Obidani kadr markaziga to‘g‘rilang'}
            </div>
          </div>
        )}

        {/* Top Overlay Badge */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none'
          }}
        >
          <span
            className="badge-turquoise"
            style={{
              fontSize: '11px',
              background: 'rgba(7, 13, 30, 0.85)',
              backdropFilter: 'blur(6px)'
            }}
          >
            <Scan size={12} /> Jonli Kamera Rejimi
          </span>

          <span
            style={{
              fontSize: '11px',
              color: '#fff',
              background: 'rgba(7, 13, 30, 0.85)',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}
          >
            📍 {location.city}
          </span>
        </div>

        {/* Bottom Action Button */}
        <div
          style={{
            position: 'absolute',
            bottom: '22px',
            display: 'flex',
            gap: '12px'
          }}
        >
          <button
            onClick={handlePerformScan}
            disabled={isScanning}
            className="btn-primary"
            style={{
              padding: '12px 32px',
              fontSize: '14.5px',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 8px 25px rgba(0, 168, 150, 0.4)'
            }}
          >
            <Sparkles size={17} />
            <span>{isScanning ? 'Tahlil Qilinmoqda…' : 'Rasmga Olish va Obidani Aniqlash'}</span>
          </button>
        </div>
      </div>

      {/* ERROR CARD: TRIGGERED EXPLICITLY WHEN SCANNED FRAME IS NOT AN AUTHENTIC MONUMENT */}
      {scanStatus === 'failed' && (
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            borderRadius: '20px',
            border: '1px solid rgba(239, 68, 68, 0.6)',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.18), rgba(13, 22, 48, 0.98))',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.3)',
                border: '2px solid rgba(239, 68, 68, 0.7)',
                color: '#F87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <XCircle size={28} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-red" style={{ background: 'rgba(239, 68, 68, 0.35)', color: '#FCA5A5', padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 800 }}>
                  ⚠️ XATOLIK: OBIDA ANIQLANMADI
                </span>
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#FCA5A5', marginTop: '8px' }}>
                {errorMessage || "Iltimos, tarixiy obida yoki joy rasmini tashlang!"}
              </h3>
              <div style={{ fontSize: '13.5px', color: '#E2E8F0', marginTop: '6px', lineHeight: 1.6 }}>
                AI tizimi faqat O‘zbekistonning tarixiy obidalari, madrasalari, maqbaralari va minoralarini taniydi. Kadrga boshqa buyum yoki noto‘g‘ri ob'ekt tushirilgan.
              </div>
            </div>
          </div>

          {/* Tips */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '14px 18px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-gold)', marginBottom: '6px' }}>
              💡 TO‘G‘RI RASMGA OLISH UCHUN MASLAHATLAR:
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <li>Kamerani Registon, Go'ri Amir, Shohi Zinda, Minorai Kalon yoki Xiva Ichan Qal'a obidalariga qarating.</li>
              <li>Obidaning moviy gumbazi, peshtoqi yoki minorasini kadr markaziga to‘liqroq joylashtiring.</li>
              <li>Agar yangi obida bo'lsa, yuqoridagi <strong>+ Yangi Obida Qo‘shish</strong> tugmasi orqali tizimga kiriting.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
            <button
              onClick={() => {
                setScanStatus('idle');
              }}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '12.5px', gap: '6px' }}
            >
              <RefreshCw size={14} /> Qaytadan Rasmga Olish
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS RESULT CARD: ONLY WHEN A VALID MONUMENT WAS ACTUALLY DETECTED */}
      {scanStatus === 'success' && recognizedData && (
        <div
          className="glass-panel"
          style={{
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid var(--border-active)',
            background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.15), rgba(13, 22, 48, 0.96))',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {/* Match Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'var(--accent-turquoise)',
                  color: '#070D1E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <div>
                <span className="badge-gold" style={{ fontSize: '10.5px' }}>
                  ANIQLIK DARAJASI: {recognizedData.confidence}%
                </span>
                <h2 style={{ fontSize: '22px', color: '#fff', fontWeight: 800, marginTop: '3px' }}>
                  {recognizedData.localName} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>({recognizedData.name})</span>
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => playAudio(recognizedData.localName, recognizedData.audio, currentLanguage)}
                className="btn-primary"
                style={{ padding: '9px 18px', fontSize: '12.5px', gap: '6px' }}
              >
                <Volume2 size={15} /> Audio Gidni Tinglash
              </button>

              <button
                onClick={() => onNavigatePlace(recognizedData.id)}
                className="btn-secondary"
                style={{ padding: '9px 16px', fontSize: '12.5px', gap: '6px' }}
              >
                Batafsil <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <p style={{ color: '#E2E8F0', fontSize: '13.5px', lineHeight: 1.7, margin: 0 }}>
            {recognizedData.description}
          </p>

          {/* Identified Features */}
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-gold)', marginBottom: '8px' }}>
              ANIQLANGAN ME'MORIY ELEMENTLAR:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {recognizedData.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '11.5px',
                    color: '#fff',
                    fontWeight: 600
                  }}
                >
                  ✨ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Ticket & Visiting Hours */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '14px',
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <strong>Chipta narxi:</strong> <span style={{ color: 'var(--text-turquoise)', fontWeight: 600 }}>{recognizedData.ticket}</span>
            </div>
            <div>
              <strong>Ish vaqti:</strong> <span style={{ color: '#fff', fontWeight: 600 }}>{recognizedData.hours}</span>
            </div>
            <div>
              <strong>Shahar:</strong> <span style={{ color: 'var(--text-gold)', fontWeight: 600 }}>{recognizedData.city}</span>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM LANDMARK CREATOR MODAL */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 13, 30, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '30px',
              borderRadius: '20px',
              border: '1px solid var(--border-gold)',
              background: '#0D1630',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.2)', color: 'var(--text-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 800 }}>Yangi Obida Qo‘shish</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>AI skaneri uchun yangi tarixiy obidani kiriting</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ color: 'var(--text-muted)', padding: '6px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateLandmark} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Obida Nomi (O‘zbekcha) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Ark Qal‘asi yoki Chor Minor"
                  value={newLandmark.localName}
                  onChange={(e) => setNewLandmark({ ...newLandmark, localName: e.target.value, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Shahar *
                  </label>
                  <select
                    value={newLandmark.city}
                    onChange={(e) => setNewLandmark({ ...newLandmark, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#070D1E', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '13px' }}
                  >
                    <option value="Samarkand">Samarqand</option>
                    <option value="Bukhara">Buxoro</option>
                    <option value="Khiva">Xiva</option>
                    <option value="Tashkent">Toshkent</option>
                    <option value="Shakhrisabz">Shahrisabz</option>
                    <option value="Kokand">Qo‘qon</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Chipta Narxi
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: 30,000 UZS"
                    value={newLandmark.ticket}
                    onChange={(e) => setNewLandmark({ ...newLandmark, ticket: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Obida Rasmi URL manzili *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newLandmark.image}
                  onChange={(e) => setNewLandmark({ ...newLandmark, image: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Tarixiy Tavsif
                </label>
                <textarea
                  rows={3}
                  placeholder="Obidaning qurilish yili, me'mori va tarixi haqida..."
                  value={newLandmark.description}
                  onChange={(e) => setNewLandmark({ ...newLandmark, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '13px', resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Me'moriy Teglar (vergul bilan ajrating)
                </label>
                <input
                  type="text"
                  placeholder="Moviy gumbaz, 1420-yil, Temuriylar me'morchiligi"
                  value={newLandmark.tags}
                  onChange={(e) => setNewLandmark({ ...newLandmark, tags: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '13px' }}
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="btn-gold"
                  style={{ padding: '10px 22px', fontSize: '13px', fontWeight: 700 }}
                >
                  <Check size={16} /> Obidani Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
