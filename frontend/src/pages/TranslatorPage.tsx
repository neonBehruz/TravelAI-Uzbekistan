import React, { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  VolumeX,
  Radio,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { api } from '../services/api';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../i18n/translations';

const QUICK_LANGUAGE_PAIRS: { label: string; src: LanguageCode; tgt: LanguageCode }[] = [
  { label: "🇺🇿 O'zbek ➡️ 🇬🇧 English", src: 'uz', tgt: 'en' },
  { label: "🇬🇧 English ➡️ 🇺🇿 O'zbek", src: 'en', tgt: 'uz' },
  { label: "🇺🇿 O'zbek ➡️ 🇷🇺 Русский", src: 'uz', tgt: 'ru' },
  { label: "🇷🇺 Русский ➡️ 🇺🇿 O'zbek", src: 'ru', tgt: 'uz' },
  { label: "🇺🇿 O'zbek ➡️ 🇹🇷 Türkçe", src: 'uz', tgt: 'tr' },
  { label: "🇺🇿 O'zbek ➡️ 🇸🇦 العربية", src: 'uz', tgt: 'ar' },
  { label: "🇺🇿 O'zbek ➡️ 🇨🇳 中文", src: 'uz', tgt: 'zh' },
  { label: "🇺🇿 O'zbek ➡️ 🇩🇪 Deutsch", src: 'uz', tgt: 'de' }
];

const SPEECH_LANG_MAP: Record<string, string> = {
  uz: 'uz-UZ',
  en: 'en-US',
  ru: 'ru-RU',
  tr: 'tr-TR',
  ar: 'ar-SA',
  fa: 'fa-IR',
  tg: 'tg-TJ',
  kk: 'kk-KZ',
  ky: 'ky-KG',
  az: 'az-AZ',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
  pt: 'pt-PT',
  hi: 'hi-IN',
  ur: 'ur-PK',
  id: 'id-ID',
  ms: 'ms-MY',
  pl: 'pl-PL',
  nl: 'nl-NL'
};

const COMMON_PHRASES = [
  {
    title: "Osh va Taomlar",
    uz: "Eng yaqin mashhur Samarqand oshi qayerda pishiriladi?",
    en: "Where can I eat authentic Samarkand Osh?"
  },
  {
    title: "Registonga Taksi",
    uz: "Registongacha taksi yo'lkira narxi qancha bo'ladi?",
    en: "How much is a taxi to Registan Square?"
  },
  {
    title: "Issiq Non Narxi",
    uz: "Ushbu yangi yopilgan Samarqand noni necha pul turadi?",
    en: "How much does this warm Samarkand non bread cost?"
  },
  {
    title: "Karta yoki Naqd",
    uz: "Xalqaro bank kartalarini (Visa/Mastercard) qabul qilasizmi?",
    en: "Do you accept international bank cards or only cash?"
  },
  {
    title: "Shohi Zinda Chiptasi",
    uz: "Shohi Zinda majmuasiga chiptaxona qayerda joylashgan?",
    en: "Where is the ticket office for Shah-i-Zinda?"
  },
  {
    title: "Fotosurat Ruxsati",
    uz: "Bu yerda fotosuratga yoki videoga tushsam maylimi?",
    en: "May I take a photo or video here?"
  },
  {
    title: "Mehmonxona Qidiruvi",
    uz: "Yaqin-atrofda yaxshi va qulay mehmonxona bormi?",
    en: "Is there a good and comfortable hotel nearby?"
  },
  {
    title: "Rahmat / Minnaddorlik",
    uz: "Katta rahmat, mehmondo'stligingiz uchun tashakkur!",
    en: "Thank you very much, I appreciate your hospitality!"
  }
];

export const TranslatorPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { playAudio, isPlaying, stopAudio } = useAudioGuide();

  const isUzDefault = currentLanguage === 'uz' || !currentLanguage;
  const [sourceLang, setSourceLang] = useState<LanguageCode>(() => (isUzDefault ? 'uz' : currentLanguage));
  const [targetLang, setTargetLang] = useState<LanguageCode>(() => (isUzDefault ? 'en' : 'uz'));

  const [inputText, setInputText] = useState(
    isUzDefault
      ? "Eng yaqin haqiqiy Samarqand oshi pishiriladigan milliy oshxona qayerda?"
      : "Where is the nearest traditional restaurant for authentic Samarkand Osh?"
  );
  const [translatedText, setTranslatedText] = useState(
    isUzDefault
      ? "Where is the nearest traditional restaurant that cooks authentic Samarkand plov?"
      : "Eng yaqin haqiqiy Samarqand oshi tayyorlanadigan milliy oshxona qayerda?"
  );
  const [phonetic, setPhonetic] = useState(
    isUzDefault
      ? "Wair iz the neer-est tra-dish-un-al res-tuh-rahnt that kooks aw-then-tik Sah-mar-kand plov?"
      : "Eng yah-kin hah-kee-keey Sah-mar-kand oh-shee tay-yor-lah-nah-dee-gahn meel-leey osh-kho-nah kah-yer-dah?"
  );

  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const speakText = (text: string, lang: LanguageCode) => {
    if (!text) return;
    if (isPlaying) {
      stopAudio();
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = SPEECH_LANG_MAP[lang] || 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      playAudio('Translation', text, lang);
    }
  };

  const handleTranslate = async (text: string, src = sourceLang, tgt = targetLang) => {
    if (!text.trim()) {
      setTranslatedText('');
      setPhonetic('');
      return;
    }
    setLoading(true);
    setSpeechError(null);
    try {
      const res = await api.translateText(text, src, tgt);
      setTranslatedText(res.translatedText);
      setPhonetic(res.phoneticPronunciation || '');
      if (autoSpeak && res.translatedText) {
        speakText(res.translatedText, tgt);
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    const prevInput = inputText;
    const prevTranslated = translatedText;

    setSourceLang(prevTgt);
    setTargetLang(prevSrc);
    setInputText(prevTranslated || prevInput);
    if (prevTranslated) {
      handleTranslate(prevTranslated, prevTgt, prevSrc);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        "Brauzeringiz ovozni aniqlashni to'liq qo'llab-quvvatlamaydi. Chrome yoki Edge brauzeridan foydalaning yoki matnni to'g'ridan-to'g'ri yozing."
      );
      return;
    }

    try {
      setSpeechError(null);
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      // Map language code to BCP 47 locale
      recognition.lang = SPEECH_LANG_MAP[sourceLang] || 'uz-UZ';

      recognition.onstart = () => {
        setIsListening(true);
      };

      let finalTranscript = '';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += trans;
          } else {
            interim += trans;
          }
        }
        const currentSpoken = finalTranscript || interim;
        if (currentSpoken) {
          setInputText(currentSpoken);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError("Mikrofon ruxsati berilmadi. Iltimos, brauzerda mikrofon ruxsatini yoqing.");
        } else if (event.error === 'network') {
          setSpeechError("Internet bilan aloqa sekin yoki ovozni aniqlash xizmatiga ulanib bo'lmadi.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (finalTranscript.trim()) {
          handleTranslate(finalTranscript.trim());
        }
      };

      recognition.start();
    } catch (err: any) {
      console.warn('Speech recognition launch exception:', err);
      setIsListening(false);
      setSpeechError("Ovozni tanishni ishga tushirishda xatolik yuz berdi. Matnni yozishingiz mumkin.");
    }
  };

  const selectPair = (src: LanguageCode, tgt: LanguageCode) => {
    setSourceLang(src);
    setTargetLang(tgt);
    handleTranslate(inputText, src, tgt);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center' }}>
        <div className="badge-turquoise" style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Languages size={15} color="var(--accent-turquoise)" />
          <span>SAFAR AI • Jonli 2 Tomonlama Ovozli Tarjimon</span>
        </div>
        <h1 style={{ fontSize: '30px', color: '#fff', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          Ovozli va Matnli Tezkor Tarjimon
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '620px', margin: '0 auto' }}>
          O'zbek tilida gapiring yoki yozing — sun'iy intellekt uni darhol ingliz, rus, turk yoki boshqa tillarga tarjima qiladi va tabiiy ovoz bilan o'qib beradi.
        </p>
      </div>

      {/* Quick Language Pair Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        padding: '4px 2px 10px',
        scrollbarWidth: 'none'
      }}>
        {QUICK_LANGUAGE_PAIRS.map((pair, idx) => {
          const isSelected = sourceLang === pair.src && targetLang === pair.tgt;
          return (
            <button
              key={idx}
              onClick={() => selectPair(pair.src, pair.tgt)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12.5px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                border: isSelected ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(0, 168, 150, 0.22)' : 'rgba(13, 22, 48, 0.65)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {pair.label}
            </button>
          );
        })}
      </div>

      {/* Language Switcher Bar */}
      <div className="glass-panel" style={{
        padding: '14px 20px',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'rgba(13, 22, 48, 0.9)',
        border: '1px solid var(--border-active)'
      }}>
        {/* Source Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-turquoise)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sizning Tilingiz:
          </span>
          <select
            value={sourceLang}
            onChange={(e) => {
              const val = e.target.value as LanguageCode;
              setSourceLang(val);
              handleTranslate(inputText, val, targetLang);
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
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="btn-secondary"
          style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0 }}
          title="Tillarni almashtirish (Swap)"
        >
          <ArrowRightLeft size={18} color="var(--accent-turquoise)" />
        </button>

        {/* Target Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tarjima Qilinadigan Til:
          </span>
          <select
            value={targetLang}
            onChange={(e) => {
              const val = e.target.value as LanguageCode;
              setTargetLang(val);
              handleTranslate(inputText, sourceLang, val);
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
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Auto-Speak Checkbox / Toggle Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
            style={{ cursor: 'pointer', accentColor: 'var(--accent-turquoise)' }}
          />
          <span>Tarjima qilingandan so'ng darhol ovoz chiqarib o'qib berish (Auto-Speak)</span>
        </label>
        <button
          onClick={() => {
            setInputText('');
            setTranslatedText('');
            setPhonetic('');
            setSpeechError(null);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={13} /> Tozalash
        </button>
      </div>

      {speechError && (
        <div style={{
          padding: '10px 16px',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#FCA5A5',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <HelpCircle size={16} color="#EF4444" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Translation Panels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Source Text Input Card */}
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '280px',
          border: isListening ? '1px solid #EF4444' : '1px solid var(--border-subtle)',
          boxShadow: isListening ? '0 0 25px rgba(239, 68, 68, 0.25)' : 'none'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-turquoise)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Asl Matn ({SUPPORTED_LANGUAGES.find((l) => l.code === sourceLang)?.name || sourceLang})
                </span>
              </div>
              {isListening && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 1s infinite' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#EF4444' }}>Ovoz eshitilmoqda... Gapiring!</span>
                </div>
              )}
            </div>

            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                handleTranslate(e.target.value);
              }}
              placeholder={sourceLang === 'uz' ? "Bu yerga o'zbekcha yozing yoki pastdagi mikrofoni bosib gapiring..." : "Type text or click microphone to speak..."}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '17px',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Soundwave animation if listening */}
          {isListening && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 0'
            }}>
              {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9].map((delay, i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: '24px',
                    borderRadius: '2px',
                    background: 'linear-gradient(to top, #EF4444, #F59E0B)',
                    animation: `pulse ${delay}s infinite ease-in-out alternate`
                  }}
                />
              ))}
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}>
            <button
              onClick={() => speakText(inputText, sourceLang)}
              disabled={!inputText.trim()}
              style={{
                fontSize: '12px',
                color: inputText.trim() ? 'var(--text-secondary)' : 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: inputText.trim() ? 'pointer' : 'default'
              }}
              title="Kiritilgan matnni o'qib berish"
            >
              <Volume2 size={15} /> Tinglash
            </button>

            {/* Hold & Speak / Stop Speaking Button */}
            <button
              onClick={toggleVoiceInput}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: 'none',
                color: '#fff',
                background: isListening
                  ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                  : 'linear-gradient(135deg, var(--accent-turquoise), #0284C7)',
                boxShadow: isListening
                  ? '0 0 20px rgba(239, 68, 68, 0.4)'
                  : '0 0 15px rgba(0, 168, 150, 0.3)'
              }}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              <span>{isListening ? "To'xtatish" : sourceLang === 'uz' ? "O'zbekcha Gapirish" : "Hold & Speak"}</span>
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
          minHeight: '280px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="badge-turquoise" style={{ fontSize: '11px', padding: '3px 8px' }}>
                <Sparkles size={12} /> {SUPPORTED_LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang} Tarjimasi
              </span>

              <button
                onClick={handleCopy}
                disabled={!translatedText}
                style={{
                  color: translatedText ? 'var(--text-secondary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  background: 'transparent',
                  border: 'none',
                  cursor: translatedText ? 'pointer' : 'default'
                }}
                title="Tarjimani nusxalash"
              >
                {copied ? <Check size={16} color="var(--accent-turquoise)" /> : <Copy size={16} />}
                <span>{copied ? 'Nusxalandi!' : 'Nusxa olish'}</span>
              </button>
            </div>

            <div style={{ fontSize: '18px', color: '#fff', fontWeight: 700, lineHeight: 1.6, minHeight: '70px' }}>
              {loading ? (
                <span style={{ color: 'var(--accent-turquoise)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="live-dot" /> Sun'iy intellekt tarjima qilmoqda...
                </span>
              ) : (
                translatedText || "Tarjima bu yerda paydo bo'ladi."
              )}
            </div>

            {phonetic && (
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid var(--border-gold)',
                color: 'var(--text-gold)',
                fontSize: '13px',
                lineHeight: 1.5
              }}>
                🗣️ <strong>Talaffuz (Phonetic):</strong> {phonetic}
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            gap: '10px'
          }}>
            <button
              onClick={() => speakText(translatedText, targetLang)}
              disabled={!translatedText}
              className="btn-primary"
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                opacity: translatedText ? 1 : 0.5,
                cursor: translatedText ? 'pointer' : 'default'
              }}
            >
              <Volume2 size={16} />
              <span>Ovoz Chiqarish (O'qish)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Common Travel Phrase Shortcuts in Uzbek */}
      <div className="glass-panel" style={{ padding: '24px 30px', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={17} color="var(--accent-gold)" /> Sayyohlar Uchun Ko'p Ishlatiladigan Ibora va Savollar (1-Bosishda Tarjima)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {COMMON_PHRASES.map((phrase, idx) => {
            const chosenText = sourceLang === 'uz' ? phrase.uz : phrase.en;
            return (
              <button
                key={idx}
                onClick={() => {
                  setInputText(chosenText);
                  handleTranslate(chosenText);
                }}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '13px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-turquoise)';
                  e.currentTarget.style.background = 'rgba(0, 168, 150, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 800 }}>{phrase.title}</div>
                  <div style={{ marginTop: '4px', color: '#F1F5F9', fontWeight: 600 }}>{chosenText}</div>
                </div>
                <Sparkles size={15} color="var(--accent-turquoise)" style={{ flexShrink: 0, marginLeft: '10px' }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
