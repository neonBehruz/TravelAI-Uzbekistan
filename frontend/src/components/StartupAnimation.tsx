import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Zap } from 'lucide-react';
import { UzbekFlag } from './UzbekFlag';

interface StartupAnimationProps {
  onComplete: () => void;
}

export const StartupAnimation: React.FC<StartupAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const statuses = [
    "🏛️ Buyuk Ipak Yo'li va 14 ta viloyat obidalari yuklanmoqda...",
    "🤖 SAFAR AI Neyron Sayyohlik Gidi faollashtirilmoqda...",
    "🚄 Afrosiyob tezyurar poyezd jadvallari va GPS ulanmoqda...",
    "✨ O'zbekistonga Xush Kelibsiz! / Welcome to Uzbekistan!"
  ];

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200; // 2.2s total smooth intro

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(p);

      if (p < 25) setStatusIdx(0);
      else if (p < 60) setStatusIdx(1);
      else if (p < 90) setStatusIdx(2);
      else setStatusIdx(3);

      if (p >= 100) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 500); // 0.5s fade-out
      }
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(ellipse at center, #0B1E38 0%, #060B18 70%, #03060E 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.08)' : 'scale(1)',
        filter: isFadingOut ? 'blur(10px)' : 'none',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Dynamic Background Aura Rings */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 168, 150, 0.22) 0%, rgba(212, 175, 55, 0.12) 45%, transparent 70%)',
          animation: 'pulseAura 3s infinite alternate ease-in-out',
          pointerEvents: 'none'
        }}
      />

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          top: '28px',
          right: '28px',
          padding: '8px 16px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
      >
        O'tkazib yuborish ➔
      </button>

      {/* Main Animated Rosette & Emblem */}
      <div style={{ position: 'relative', width: '180px', height: '180px', marginBottom: '28px' }}>
        {/* Outer Rotating Islamic Geometry Star Pattern */}
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            animation: 'spinStar 12s linear infinite'
          }}
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D77F" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#00A896" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
          <polygon
            points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="1.2"
            filter="url(#glow)"
          />
          <polygon
            points="50,14 60,40 86,50 60,60 50,86 40,60 14,50 40,40"
            fill="none"
            stroke="#2EE6D6"
            strokeWidth="1"
            opacity="0.8"
            transform="rotate(45 50 50)"
          />
        </svg>

        {/* Inner Counter-Rotating Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            borderRadius: '50%',
            border: '1.5px dashed rgba(46, 230, 214, 0.4)',
            animation: 'spinStarReverse 8s linear infinite'
          }}
        />

        {/* Center Glowing AI Core Icon */}
        <div
          style={{
            position: 'absolute',
            inset: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0A2239, #070D1E)',
            border: '1.5px solid rgba(212, 175, 55, 0.6)',
            boxShadow: '0 0 30px rgba(0, 168, 150, 0.5), inset 0 0 15px rgba(212, 175, 55, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F5D77F'
          }}
        >
          <Compass size={38} className="animate-spin-slow" color="#2EE6D6" />
        </div>
      </div>

      {/* Brand Title with Sheen Sweep */}
      <div style={{ textAlign: 'center', marginBottom: '20px', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <UzbekFlag size={20} />
          <span style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '2px', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>
            O'zbekiston Milliy Turizm Sun'iy Intellekti
          </span>
        </div>

        <h1
          style={{
            fontSize: '38px',
            fontWeight: 900,
            letterSpacing: '3px',
            margin: 0,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F5D77F 50%, #2EE6D6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.6))'
          }}
        >
          SAFAR AI
        </h1>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '1px', marginTop: '4px' }}>
          SMART TOURISM & SILK ROAD COMPANION
        </div>
      </div>

      {/* Progress Bar Container */}
      <div
        style={{
          width: '320px',
          maxWidth: '85vw',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '14px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #D4AF37, #2EE6D6, #00A896)',
            borderRadius: '10px',
            boxShadow: '0 0 15px #2EE6D6',
            transition: 'width 0.1s linear'
          }}
        />
      </div>

      {/* Status Text & Progress Percentage */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '400px', textAlign: 'center', minHeight: '38px' }}>
        <Sparkles size={14} color="#F5D77F" className="animate-pulse" />
        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {statuses[statusIdx]}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-turquoise)', minWidth: '32px' }}>
          {progress}%
        </span>
      </div>

      <style>{`
        @keyframes spinStar {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinStarReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulseAura {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1.15); opacity: 0.85; }
        }
        .animate-spin-slow {
          animation: spinStar 16s linear infinite;
        }
      `}</style>
    </div>
  );
};
