import React from 'react';
import { Play, Pause, Square, Volume2, Sparkles, X } from 'lucide-react';
import { useAudioGuide } from '../context/AudioGuideContext';

export const AudioPlayerBar: React.FC = () => {
  const { isPlaying, currentTitle, progress, pauseAudio, resumeAudio, stopAudio } = useAudioGuide();

  if (!currentTitle && !isPlaying) return null;

  return (
    <div className="floating-audio-bar">
      {/* Info & Soundwave */}
      <div className="audio-bar-info-section">
        <div className="audio-bar-icon-box">
          <Volume2 size={22} />
        </div>

        <div className="audio-bar-text-group">
          <div className="audio-bar-badge-row">
            <span className="badge-gold audio-bar-badge">
              <Sparkles size={10} /> AI Audio Guide
            </span>
            <span className="audio-bar-subtext">Natural Voice</span>
          </div>
          <div className="audio-bar-title">
            {currentTitle || 'Audio Guide Narrator'}
          </div>
        </div>

        {/* Dynamic Soundwave Bars */}
        {isPlaying && (
          <div className="audio-bar-waveforms">
            <div className="waveform-bar" />
            <div className="waveform-bar" />
            <div className="waveform-bar" />
            <div className="waveform-bar" />
            <div className="waveform-bar" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="audio-bar-controls">
        <button
          onClick={isPlaying ? pauseAudio : resumeAudio}
          className="audio-bar-play-btn"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            stopAudio();
          }}
          className="audio-bar-close-btn"
          title="Yopish (Close)"
          aria-label="Close audio player"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
