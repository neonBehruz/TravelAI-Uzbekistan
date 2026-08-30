import React, { useState, useEffect } from 'react';
import {
  Languages,
  Mic,
  MicOff,
  Volume2,
  ArrowRightLeft,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Play,
  Square,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { api } from '../services/api';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../i18n/translations';

export const TranslatorPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { playAudio, isPlaying, stopAudio } = useAudioGuide();

  const [sourceLang, setSourceLang] = useState<LanguageCode>('en');
  const [targetLang, setTargetLang] = useState<LanguageCode>('uz');
  const [inputText, setInputText] = useState('Where is the nearest traditional restaurant for authentic Samarkand Osh?');
  const [translatedText, setTranslatedText] = useState('Eng yaqin haqiqiy Samarqand oshi tayyorlanadigan milliy oshxona qayerda?');
  const [phonetic, setPhonetic] = useState('Eng yah-kin hah-kee-keey Sah-mar-kand oh-shee tay-yor-lah-nah-dee-gahn meel-leey osh-kho-nah kah-yer-dah?');
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.translateText(text, sourceLang, targetLang);
      setTranslatedText(res.translatedText);
      setPhonetic(res.phoneticPronunciation || '');
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(translatedText);
    handleTranslate(translatedText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support live speech recognition. You can type your question directly in the text box below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

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

      recognition.lang = langMap[sourceLang] || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleTranslate(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition exception:', err);
      setIsListening(false);
    }
  };

  const speakTranslation = () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(translatedText);

      const langMap: Record<string, string> = {
        uz: 'uz-UZ',
        en: 'en-US',
        ru: 'ru-RU',
        tr: 'tr-TR',
        de: 'de-DE',
        fr: 'fr-FR',
        es: 'es-ES',
        zh: 'zh-CN',
        ja: 'ja-JP',
        ko: 'ko-KR'
      };

      utterance.lang = langMap[targetLang] || 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      playAudio('Translation', translatedText, targetLang);
    }
  };

  const quickPhrases = [
    { title: 'Traditional Food', en: 'Where can I eat authentic Samarkand Osh?' },
    { title: 'Taxi to Registan', en: 'How much is a taxi to Registan Square?' },
    { title: 'Bazaar Non Bread', en: 'How much does this warm Samarkand non bread cost?' },
    { title: 'Card / Cash', en: 'Do you accept international bank cards or only cash?' },
    { title: 'Ticket Office', en: 'Where is the ticket office for Shah-i-Zinda?' },
    { title: 'Photo Permission', en: 'May I take a photo here?' }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div className="badge-turquoise" style={{ marginBottom: '8px' }}>
          <Languages size={14} /> AI Speech & Real-Time Translation
        </div>
        <h1 style={{ fontSize: '32px', color: '#fff', fontWeight: 800 }}>2-Way Voice & Text Translator</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '550px', margin: '6px auto 0' }}>
          Speak in your native language and translate instantly to Uzbek with natural voice synthesis and phonetic pronunciation assistance.
        </p>
      </div>

      {/* Language Switcher Bar */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        background: 'rgba(13, 22, 48, 0.85)',
        border: '1px solid var(--border-active)'
      }}>
        {/* Source Language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800 }}>INPUT:</span>
          <select
            value={sourceLang}
            onChange={(e) => {
              const val = e.target.value as LanguageCode;
              setSourceLang(val);
              handleTranslate(inputText);
            }}
            style={{
              background: 'var(--bg-secondary)',
              color: '#fff',
              border: '1px solid var(--border-subtle)',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} style={{ background: '#0D1630' }}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="btn-secondary"
          style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0 }}
          title="Swap Languages"
        >
          <ArrowRightLeft size={18} color="var(--accent-turquoise)" />
        </button>

        {/* Target Language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800 }}>TRANSLATE TO:</span>
          <select
            value={targetLang}
            onChange={(e) => {
              const val = e.target.value as LanguageCode;
              setTargetLang(val);
              handleTranslate(inputText);
            }}
            style={{
              background: 'var(--bg-secondary)',
              color: '#fff',
              border: '1px solid var(--border-subtle)',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} style={{ background: '#0D1630' }}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Translation Panels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Source Text Input Card */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '260px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Original Phrase</span>
              {isListening && (
                <span className="badge-turquoise" style={{ fontSize: '11px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 1s infinite' }} />
                  Listening...
                </span>
              )}
            </div>

            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                handleTranslate(e.target.value);
              }}
              placeholder="Type or click the microphone to speak..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}>
            <button
              onClick={() => {
                setInputText('');
                setTranslatedText('');
                setPhonetic('');
              }}
              style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={14} /> Clear
            </button>

            <button
              onClick={startVoiceInput}
              className={isListening ? 'btn-gold' : 'btn-primary'}
              style={{ padding: '10px 18px', borderRadius: 'var(--radius-full)', fontSize: '13px' }}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isListening ? 'Stop Speaking' : 'Hold & Speak'}</span>
            </button>
          </div>
        </div>

        {/* Translated Output Card */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-active)',
          background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.12), rgba(13, 22, 48, 0.95))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '260px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="badge-turquoise" style={{ fontSize: '11px' }}>
                <Sparkles size={12} /> Translated Output
              </span>

              <button
                onClick={handleCopy}
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                title="Copy Translation"
              >
                {copied ? <Check size={16} color="var(--accent-turquoise)" /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div style={{ fontSize: '18px', color: '#fff', fontWeight: 700, lineHeight: 1.6, minHeight: '60px' }}>
              {loading ? 'Translating with AI…' : translatedText || 'Translation will appear here.'}
            </div>

            {phonetic && (
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid var(--border-gold)',
                color: 'var(--text-gold)',
                fontSize: '13px',
                lineHeight: 1.5
              }}>
                🗣️ <strong>Phonetic:</strong> {phonetic}
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}>
            <button
              onClick={speakTranslation}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '13px' }}
            >
              <Volume2 size={16} />
              <span>Speak Audio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Common Travel Phrase Shortcuts */}
      <div className="glass-panel" style={{ padding: '24px 32px', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="var(--accent-gold)" /> Frequent Tourist Questions (1-Click Translate & Speak)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {quickPhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(phrase.en);
                handleTranslate(phrase.en);
              }}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '13px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-turquoise)';
                e.currentTarget.style.background = 'rgba(0, 168, 150, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 700 }}>{phrase.title}</div>
                <div style={{ marginTop: '2px', color: '#E2E8F0' }}>{phrase.en}</div>
              </div>
              <Sparkles size={14} color="var(--accent-turquoise)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
