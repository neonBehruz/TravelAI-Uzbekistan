import React from 'react';
import { Play, Pause, Square, Volume2, Sparkles, X } from 'lucide-react';
import { useAudioGuide } from '../context/AudioGuideContext';

export const AudioPlayerBar: React.FC = () => {
  const { isPlaying, currentTitle, progress, pauseAudio, resumeAudio, stopAudio } = useAudioGuide();

  if (!currentTitle && !isPlaying) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 320px)',
      maxWidth: '850px',
      background: 'rgba(13, 22, 48, 0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--border-gold)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      zIndex: 500,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 175, 55, 0.2)'
    }} className="floating-audio-bar">
      <style>{`
        @media (max-width: 1024px) {
          .floating-audio-bar {
            width: calc(100% - 32px) !important;
            bottom: 80px !important;
            padding: 10px 16px !important;
          }
        }
      `}</style>

      {/* Info & Soundwave */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-turquoise))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#070D1E',
          flexShrink: 0
        }}>
          <Volume2 size={22} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-gold" style={{ fontSize: '10px', padding: '2px 8px' }}>
              <Sparkles size={10} /> AI Audio Guide
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Natural Voice</span>
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginTop: '2px'
          }}>
            {currentTitle || 'Audio Guide Narrator'}
          </div>
        </div>

        {/* Dynamic Soundwave Bars */}
        {isPlaying && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '24px', padding: '0 8px' }}>
            <div className="waveform-bar" />
            <div className="waveform-bar" />
            <div className="waveform-bar" />
            <div className="waveform-bar" />
            <div className="waveform-bar" />
          </div>
        )}
      </div>

      {/* Progress & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={isPlaying ? pauseAudio : resumeAudio}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--accent-turquoise)',
            color: '#070D1E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 168, 150, 0.4)'
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
        </button>

        <button
          onClick={stopAudio}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Stop & Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
