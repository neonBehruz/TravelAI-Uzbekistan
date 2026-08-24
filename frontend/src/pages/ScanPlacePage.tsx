import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Sparkles,
  Volume2,
  Scan,
  RefreshCw,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Info,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { api } from '../services/api';

interface ScanPlacePageProps {
  onNavigatePlace: (placeId: string) => void;
}

export const ScanPlacePage: React.FC<ScanPlacePageProps> = ({ onNavigatePlace }) => {
  const { location } = useLocation();
  const { playAudio } = useAudioGuide();

  const [isScanning, setIsScanning] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [isLiveCamera, setIsLiveCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sampleLandmarks = [
    {
      id: 'p1',
      name: 'Registan Square (Sher-Dor & Tilla-Kori)',
      city: 'Samarkand',
      image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=80',
      description: 'The monumental central public square framed by 3 majestic madrasahs. Famous for the Sher-Dor facade depicting solar tigers and the pure gold leaf dome inside Tilla-Kori.',
      audio: 'You are standing before Registan Square, the beating heart of the Timurid Renaissance. Notice the Sher-Dor madrasah on your right, commissioned in 1619 by Yalangtush Bakhodur.',
      tags: ['Solar Tiger Mosaics', 'Timurid Majolica', 'Pure Gold Muqarnas', '1420-1660 AD'],
      ticket: '50,000 UZS',
      hours: '08:00 - 20:00',
      confidence: 98.9
    },
    {
      id: 'p2',
      name: 'Gur-e-Amir (Mausoleum of Amir Timur)',
      city: 'Samarkand',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
      description: 'The magnificent resting place of Emperor Amir Timur (Tamerlane). Crowned by a 64-ribbed fluted azure dome and containing the world famous dark green jade cenotaph.',
      audio: 'Gur-e-Amir is the imperial tomb of Amir Timur and his grandsons Ulugh Beg and Muhammad Sultan. The azure ribbed dome is composed of 64 distinct ribs.',
      tags: ['64-Ribbed Azure Dome', 'Jade Cenotaph', '1404 AD', 'Imperial Crypt'],
      ticket: '40,000 UZS',
      hours: '09:00 - 19:00',
      confidence: 99.4
    },
    {
      id: 'p3',
      name: 'Shah-i-Zinda Royal Necropolis',
      city: 'Samarkand',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      description: 'The "Living King" sacred hillside avenue of royal mausoleums adorned with the most intricate cobalt, turquoise, and lapis lazuli carved tiles in the Islamic world.',
      audio: 'Shah-i-Zinda means The Living King, dedicated to Kusam ibn Abbas. It contains over twenty royal mausoleums spanning the 11th through 15th centuries.',
      tags: ['Carved Majolica', 'Cobalt Terracotta', 'Sacred 36 Stairs', '11th-15th Cent.'],
      ticket: '40,000 UZS',
      hours: '08:30 - 18:30',
      confidence: 99.1
    }
  ];

  const currentPreset = sampleLandmarks[selectedPresetIndex];

  const startCamera = async () => {
    try {
      setIsLiveCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error, fallback to preset mode:', err);
      setIsLiveCamera(false);
      alert('Camera access was denied or not supported. You can use the preset landmark photos below to test instant AI landmark recognition!');
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);

    setTimeout(() => {
      setResult(currentPreset);
      setIsScanning(false);
    }, 1400);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div className="badge-turquoise" style={{ marginBottom: '8px' }}>
          <Camera size={14} /> AI Computer Vision & Landmark Recognition
        </div>
        <h1 style={{ fontSize: '32px', color: '#fff', fontWeight: 800 }}>Instant Landmark Scanner</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '580px', margin: '6px auto 0' }}>
          Point your phone camera at madrasahs, domes, or historical arches across Uzbekistan to instantly identify monuments and unlock their history.
        </p>
      </div>

      {/* Why Tourists Need AI Vision (Explainer Card) */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.1), rgba(13, 22, 48, 0.95))',
        border: '1px solid var(--border-active)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'rgba(0, 168, 150, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-turquoise)',
          flexShrink: 0
        }}>
          <HelpCircle size={22} />
        </div>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Why do tourists need the AI Scanner?</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
            Uzbekistan’s historical complexes contain multiple adjacent buildings with similar blue tiles. Tourists often don’t know which madrasah is which or what the symbols mean. The scanner identifies the exact monument, decodes architectural secrets, and starts your personal audio guide instantly.
          </div>
        </div>
      </div>

      {/* Preset Landmark Picker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={15} color="var(--accent-gold)" /> Select Sample Landmark to Scan:
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sampleLandmarks.map((lm, idx) => (
            <button
              key={lm.id}
              onClick={() => {
                setSelectedPresetIndex(idx);
                setResult(null);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: selectedPresetIndex === idx ? 'var(--accent-turquoise)' : 'rgba(255,255,255,0.05)',
                color: selectedPresetIndex === idx ? '#070D1E' : '#fff',
                fontSize: '12px',
                fontWeight: 700,
                border: selectedPresetIndex === idx ? 'none' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s ease'
              }}
            >
              {lm.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Scanner Viewfinder HUD */}
      <div className="glass-panel" style={{
        position: 'relative',
        height: '420px',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: isScanning ? '2px solid var(--accent-turquoise)' : '1px solid var(--border-active)',
        background: '#070D1E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
      }}>
        {/* Background Image / Stream */}
        {isLiveCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <img
            src={currentPreset.image}
            alt={currentPreset.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}

        {/* Viewfinder Target Reticle HUD */}
        <div style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          border: '2px dashed rgba(0, 168, 150, 0.8)',
          borderRadius: '24px',
          boxShadow: '0 0 30px rgba(0, 168, 150, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          {isScanning && (
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, var(--accent-turquoise), transparent)',
              boxShadow: '0 0 15px var(--accent-turquoise)',
              animation: 'wave-bar 1.2s ease-in-out infinite'
            }} />
          )}

          <div style={{
            position: 'absolute',
            bottom: '12px',
            background: 'rgba(7, 13, 30, 0.85)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent-turquoise)',
            border: '1px solid var(--border-active)'
          }}>
            {isScanning ? '🔍 AI Analyzing Features...' : '📷 Align Landmark Facade'}
          </div>
        </div>

        {/* Top Controls Overlay */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span className="badge-turquoise" style={{ fontSize: '11px', background: 'rgba(7, 13, 30, 0.85)' }}>
            <Scan size={12} /> Target: {currentPreset.name.split('(')[0]}
          </span>

          <button
            onClick={startCamera}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px', background: 'rgba(7, 13, 30, 0.85)' }}
          >
            <Camera size={13} /> {isLiveCamera ? 'Camera Active' : 'Switch to Webcam'}
          </button>
        </div>

        {/* Bottom Trigger Action */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          display: 'flex',
          gap: '12px'
        }}>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="btn-primary"
            style={{ padding: '12px 32px', fontSize: '15px', borderRadius: 'var(--radius-full)' }}
          >
            <Sparkles size={18} />
            <span>{isScanning ? 'Identifying Architecture…' : 'Capture & Identify Landmark'}</span>
          </button>
        </div>
      </div>

      {/* Recognition Result Card */}
      {result && (
        <div className="glass-panel" style={{
          padding: '32px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-active)',
          background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.15), rgba(13, 22, 48, 0.95))',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent-turquoise)',
                color: '#070D1E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="badge-gold" style={{ fontSize: '10px' }}>Match Confidence: {result.confidence}%</span>
                <h2 style={{ fontSize: '24px', color: '#fff', fontWeight: 800, marginTop: '2px' }}>{result.name}</h2>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => playAudio(result.name, result.audio, 'en')}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px' }}
              >
                <Volume2 size={16} /> Listen to Audio Guide
              </button>

              <button
                onClick={() => onNavigatePlace(result.id)}
                className="btn-secondary"
                style={{ padding: '10px 18px', fontSize: '13px' }}
              >
                Full Details <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <p style={{ color: '#E2E8F0', fontSize: '14px', lineHeight: 1.7 }}>
            {result.description}
          </p>

          {/* Detected Architectural Features */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-gold)', marginBottom: '8px' }}>
              IDENTIFIED ARCHITECTURAL FEATURES:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {result.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    color: '#fff',
                    fontWeight: 600
                  }}
                >
                  ✨ {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '24px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            <div><strong>Ticket Price:</strong> <span style={{ color: 'var(--text-turquoise)' }}>{result.ticket}</span></div>
            <div><strong>Opening Hours:</strong> <span style={{ color: '#fff' }}>{result.hours}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
