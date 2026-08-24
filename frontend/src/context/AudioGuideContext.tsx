import React, { createContext, useContext, useState, useEffect } from 'react';

interface AudioGuideContextType {
  isPlaying: boolean;
  currentTitle: string;
  currentText: string;
  progress: number;
  playAudio: (title: string, text: string, langCode?: string) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
}

const AudioGuideContext = createContext<AudioGuideContextType | undefined>(undefined);

export const AudioGuideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [progress, setProgress] = useState(0);

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const playAudio = (title: string, text: string, langCode: string = 'en') => {
    stopAudio();
    setCurrentTitle(title);
    setCurrentText(text);
    setIsPlaying(true);

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Natural conversational pace
      utterance.pitch = 1.0;

      // Map language code
      const langMap: Record<string, string> = {
        en: 'en-US',
        uz: 'uz-UZ',
        ru: 'ru-RU',
        tr: 'tr-TR',
        de: 'de-DE',
        fr: 'fr-FR',
        es: 'es-ES',
        zh: 'zh-CN',
        ja: 'ja-JP',
        ko: 'ko-KR'
      };

      utterance.lang = langMap[langCode] || 'en-US';

      // Pick a smooth voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang.startsWith(langCode));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);

      // Simulate progress bar based on word count
      const estimatedDurationMs = (text.split(' ').length / 2.5) * 1000;
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(100, Math.round((elapsed / estimatedDurationMs) * 100));
        setProgress(p);
        if (p >= 100) clearInterval(interval);
      }, 200);
    }
  };

  const pauseAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
  };

  const resumeAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    setIsPlaying(true);
  };

  return (
    <AudioGuideContext.Provider
      value={{ isPlaying, currentTitle, currentText, progress, playAudio, pauseAudio, resumeAudio, stopAudio }}
    >
      {children}
    </AudioGuideContext.Provider>
  );
};

export const useAudioGuide = () => {
  const context = useContext(AudioGuideContext);
  if (!context) throw new Error('useAudioGuide must be used within an AudioGuideProvider');
  return context;
};
