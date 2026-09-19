import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Plus,
  Trash2,
  MessageSquare,
  Compass,
  Utensils,
  Landmark,
  Train,
  ChevronDown,
  Globe,
  Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../i18n/translations';
import { useAudioGuide } from '../context/AudioGuideContext';
import { useLocation } from '../context/LocationContext';
import { api } from '../services/api';
import { FormattedMessage } from '../components/FormattedMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  suggestedFollowUps?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: Message[];
}

const GREETINGS: Partial<Record<LanguageCode, { text: (city: string) => string; suggestions: (city: string) => string[] }>> = {
  uz: {
    text: (city) =>
      `🌟 Assalomu Alaykum! Xush kelibsiz.\n\nO'zbekistonning barcha 14 hududi (${city}) bo'ylab istalgan savolingizni bering: tarixiy obidalar, milliy taomlar, sayohat marshrutlari, Afrosiyob poyezd chiptalari yoki bozor maslahatlari!`,
    suggestions: (city) => [
      `${city}dagi eng mashhur 5 ta obida`,
      'Haqiqiy Samarqand oshi qayerda pishiriladi?',
      '3 kunlik O‘zbekiston sayohat rejasi',
      'Afrosiyob poyezd chiptasini qanday olish mumkin?'
    ]
  },
  en: {
    text: (city) =>
      `🌟 Assalomu Alaykum! Welcome.\n\nAsk me anything about Uzbekistan (${city}) across all 14 regions: historical landmarks, traditional cuisine, travel routes, train tickets (Afrosiyob), or local tips!`,
    suggestions: (city) => [
      `Top 5 places to visit in ${city}`,
      'Where can I eat authentic plov and somsa?',
      'Best 3-Day Silk Road itinerary',
      'Afrosiyob bullet train ticket booking guide'
    ]
  },
  ru: {
    text: (city) =>
      `🌟 Здравствуйте! Добро пожаловать.\n\nЗадайте любой вопрос по Узбекистану (${city}) во всех 14 регионах: достопримечательности, национальная кухня, маршруты, билеты на Афросиаб или полезные советы!`,
    suggestions: (city) => [
      `Топ-5 достопримечательностей в г. ${city}`,
      'Где поесть самый вкусный традиционный плов?',
      'Идеальный 3-дневный маршрут по Шелковому пути',
      'Как купить билеты на поезд Афросиаб?'
    ]
  },
  tr: {
    text: (city) =>
      `🌟 Hoş Geldiniz!\n\nÖzbekistan'ın 14 bölgesinde (${city}) tarihi mekanlar, Özbek mutfağı, seyahat rotaları veya Afrosiyob tren biletleri hakkında her şeyi sorabilirsiniz!`,
    suggestions: (city) => [
      `${city} şehrinde gezilecek en iyi 5 yer`,
      'En lezzetli Özbek pilavı nerede yenir?',
      '3 günlük Özbekistan seyahat rotası',
      'Afrosiyob hızlı tren rehberi'
    ]
  },
  de: {
    text: (city) =>
      `🌟 Willkommen!\n\nFragen Sie nach Sehenswürdigkeiten, Nationalgerichten, Reiserouten oder Schnellzügen für Usbekistan (${city}) in allen 14 Regionen!`,
    suggestions: (city) => [
      `Top 5 Sehenswürdigkeiten in ${city}`,
      'Wo gibt es das beste traditionelle Plov?',
      '3-Tage-Route entlang der Seidenstraße',
      'Afrosiyob Schnellzug-Tickets buchen'
    ]
  },
  fr: {
    text: (city) =>
      `🌟 Bienvenue !\n\nPosez vos questions sur les monuments historiques, la gastronomie ou les billets de train pour l'Ouzbékistan (${city}) !`,
    suggestions: (city) => [
      `Top 5 des lieux à visiter à ${city}`,
      'Où déguster le meilleur plov traditionnel ?',
      'Itinéraire de 3 jours sur la Route de la Soie',
      'Guide du train rapide Afrosiyob'
    ]
  },
  es: {
    text: (city) =>
      `🌟 ¡Bienvenido!\n\nPregúntame sobre monumentos históricos, comida tradicional, rutas o trenes de alta velocidad para Uzbekistán (${city}).`,
    suggestions: (city) => [
      `Top 5 lugares para visitar en ${city}`,
      '¿Dónde comer el mejor plov tradicional?',
      'Itinerario de 3 días por la Ruta de la Seda',
      'Guía de billetes del tren Afrosiyob'
    ]
  },
  zh: {
    text: (city) =>
      `🌟 您好！欢迎使用。\n\n您可以随时咨询乌兹别克斯坦（${city}）的历史名胜、特色抓饭美食、丝路行程规划或阿芙罗西阿卜高铁指南！`,
    suggestions: (city) => [
      `${city} 必去的5大经典景点`,
      '哪里可以吃到最正宗的乌兹别克抓饭？',
      '乌兹别克斯坦3天经典丝路路线推荐',
      '阿芙罗西阿卜高铁购票与出行指南'
    ]
  },
  ja: {
    text: (city) =>
      `🌟 ようこそ！\n\nウズベキスタン全14地域（${city}）の歴史的名所、伝統料理プロフ、旅行プラン、高速鉄道について何でもご質問ください！`,
    suggestions: (city) => [
      `${city} の絶対に行くべき名所トップ5`,
      '本場のウズベク・プロフが美味しい店',
      '3日間のシルクロードおすすめ旅程',
      '高速鉄道アフロシヤブ号の予約方法'
    ]
  },
  ko: {
    text: (city) =>
      `🌟 환영합니다!\n\n우즈베키스тан 전역（${city}）의 역사적 명소, 전통 플로프 요리, 맞춤 여행 일정, 고속철도 티켓에 대해 언제든 물어보세요!`,
    suggestions: (city) => [
      `${city} 필수 방문 명소 TOP 5`,
      '가장 맛있는 전통 플로프 식당 추천',
      '3일간의 실크로드 추천 여행 코스',
      '아프로시욥 고속열차 예매 및 이용 팁'
    ]
  }
};

interface AiGuidePageProps {
  onNavigate?: (tab: string, params?: any) => void;
}

export const AiGuidePage: React.FC<AiGuidePageProps> = ({ onNavigate }) => {
  const { currentLanguage, languages, t } = useLanguage();
  const { playAudio } = useAudioGuide();
  const { location } = useLocation();

  // Dedicated Chat Language: isolates chat conversation language from global interface
  const [chatLanguage, setChatLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('safar_ai_chat_language');
    return (saved as LanguageCode) || currentLanguage || 'uz';
  });

  const [persona, setPersona] = useState<'guide' | 'historian' | 'local'>('guide');

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('safar_ai_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((s: ChatSession) => ({
            ...s,
            messages: (s.messages || []).map((m) => ({
              ...m,
              text: (m.text || '')
                .replace(/###\s*🌟\s*\*\*([^*]+)\*\*/g, '🌟 $1')
                .replace(/###\s*/g, '')
            }))
          }));
        }
      } catch (e) {
        console.warn('Failed to parse chat sessions', e);
      }
    }
    const initialLang = (localStorage.getItem('safar_ai_chat_language') as LanguageCode) || currentLanguage || 'uz';
    const greeting = GREETINGS[initialLang] || GREETINGS.uz!;
    return [
      {
        id: 'session-1',
        title: initialLang === 'uz' ? 'Samarqand & Ipak Yo‘li Sayohati' : 'Silk Road Journey',
        updatedAt: Date.now(),
        messages: [
          {
            id: 'init-1',
            role: 'assistant',
            text: greeting.text(location.city),
            time: 'Just now',
            suggestedFollowUps: greeting.suggestions(location.city)
          }
        ]
      }
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => sessions[0]?.id || 'session-1');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSession = currentSessionId ? sessions.find((s) => s.id === currentSessionId) : undefined;

  useEffect(() => {
    localStorage.setItem('safar_ai_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, loading, streamingMessageId]);

  // Handle chat language switch without modifying global UI language
  const handleChatLanguageChange = (newLang: LanguageCode) => {
    setChatLanguage(newLang);
    localStorage.setItem('safar_ai_chat_language', newLang);

    // If current session only has greeting message, update greeting to match selected language immediately
    const greeting = GREETINGS[newLang] || GREETINGS.en || GREETINGS.uz!;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === currentSessionId && s.messages.length === 1 && s.messages[0].role === 'assistant') {
          return {
            ...s,
            title: newLang === 'uz' ? 'Yangi Suhbat' : newLang === 'ru' ? 'Новый Чат' : 'New Conversation',
            messages: [
              {
                id: s.messages[0].id,
                role: 'assistant',
                text: greeting.text(location.city),
                time: 'Just now',
                suggestedFollowUps: greeting.suggestions(location.city)
              }
            ]
          };
        }
        return s;
      })
    );
  };

  const handleCreateNewChat = () => {
    const greeting = GREETINGS[chatLanguage] || GREETINGS.uz!;
    const newSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: chatLanguage === 'uz' ? 'Yangi Suhbat' : chatLanguage === 'ru' ? 'Новый Чат' : 'New Conversation',
      updatedAt: Date.now(),
      messages: [
        {
          id: 'msg-' + Date.now(),
          role: 'assistant',
          text: greeting.text(location.city),
          time: 'Just now',
          suggestedFollowUps: greeting.suggestions(location.city)
        }
      ]
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    setSessions(filtered);
    if (currentSessionId === sessionId) {
      setCurrentSessionId('');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    let targetSessionId = currentSessionId;
    let baseMessages: Message[] = [];

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!currentSession) {
      const greeting = GREETINGS[chatLanguage] || GREETINGS.uz!;
      const newSessionId = 'session-' + Date.now();
      const initialAssistantGreeting: Message = {
        id: 'init-' + Date.now(),
        role: 'assistant',
        text: greeting.text(location.city),
        time: 'Just now',
        suggestedFollowUps: greeting.suggestions(location.city)
      };
      const newSession: ChatSession = {
        id: newSessionId,
        title: query.length > 28 ? query.slice(0, 25) + '…' : query,
        updatedAt: Date.now(),
        messages: [initialAssistantGreeting, userMsg]
      };
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSessionId);
      targetSessionId = newSessionId;
      baseMessages = [initialAssistantGreeting, userMsg];
    } else {
      const updatedMessages = [...currentSession.messages, userMsg];
      const hasUserMessages = currentSession.messages.some((m) => m.role === 'user');
      const newTitle = !hasUserMessages ? (query.length > 28 ? query.slice(0, 25) + '…' : query) : currentSession.title;

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? { ...s, title: newTitle, messages: updatedMessages, updatedAt: Date.now() }
            : s
        )
      );
      baseMessages = updatedMessages;
    }

    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const historyDto = baseMessages.map((m) => ({ role: m.role, content: m.text }));
      const res = await api.chatWithAi(
        query,
        chatLanguage,
        location.city,
        persona,
        historyDto
      );

      const aiMsgId = 'ai-' + Date.now();
      const aiFullText = res.reply;

      // Real-time typewriter effect
      setStreamingMessageId(aiMsgId);
      const aiPlaceholder: Message = {
        id: aiMsgId,
        role: 'assistant',
        text: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: res.suggestedFollowUps
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? { ...s, messages: [...baseMessages, aiPlaceholder], updatedAt: Date.now() }
            : s
        )
      );

      let charIdx = 0;
      const stepSize = Math.max(2, Math.floor(aiFullText.length / 40));
      const interval = setInterval(() => {
        charIdx += stepSize;
        if (charIdx >= aiFullText.length) {
          clearInterval(interval);
          setStreamingMessageId(null);
          setSessions((prev) =>
            prev.map((s) =>
              s.id === targetSessionId
                ? {
                    ...s,
                    messages: s.messages.map((m) => (m.id === aiMsgId ? { ...m, text: aiFullText } : m))
                  }
                : s
            )
          );
        } else {
          const currentChunk = aiFullText.slice(0, charIdx);
          setSessions((prev) =>
            prev.map((s) =>
              s.id === targetSessionId
                ? {
                    ...s,
                    messages: s.messages.map((m) => (m.id === aiMsgId ? { ...m, text: currentChunk } : m))
                  }
                : s
            )
          );
        }
      }, 25);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Microphone speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang =
      chatLanguage === 'uz'
        ? 'uz-UZ'
        : chatLanguage === 'ru'
        ? 'ru-RU'
        : chatLanguage === 'tr'
        ? 'tr-TR'
        : chatLanguage === 'de'
        ? 'de-DE'
        : chatLanguage === 'fr'
        ? 'fr-FR'
        : chatLanguage === 'es'
        ? 'es-ES'
        : chatLanguage === 'zh'
        ? 'zh-CN'
        : chatLanguage === 'ja'
        ? 'ja-JP'
        : chatLanguage === 'ko'
        ? 'ko-KR'
        : 'en-US';

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsRecording(false);
      handleSendMessage(transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  // Quick prompt buttons dynamically rendered in chatLanguage
  const quickStarters = [
    {
      icon: Landmark,
      title:
        chatLanguage === 'uz'
          ? 'Top 5 Tarixiy Obida'
          : chatLanguage === 'ru'
          ? 'Топ-5 Памятников'
          : chatLanguage === 'tr'
          ? 'En İyi 5 Tarihi Yer'
          : 'Top 5 Monuments',
      prompt:
        chatLanguage === 'uz'
          ? `${location.city} shahrida albatta borish kerak bo'lgan eng yaxshi 5 ta tarixiy obida qaysilar?`
          : chatLanguage === 'ru'
          ? `Назовите топ-5 главных достопримечательностей в г. ${location.city}, которые обязательно стоит посетить?`
          : chatLanguage === 'tr'
          ? `${location.city} şehrinde mutlaka görülmesi gereken en iyi 5 tarihi mekan hangileridir?`
          : `What are the top 5 absolute must-see places in ${location.city}?`
    },
    {
      icon: Utensils,
      title:
        chatLanguage === 'uz'
          ? 'Eng Mazali Osh & Somsa'
          : chatLanguage === 'ru'
          ? 'Лучший Плов и Самса'
          : chatLanguage === 'tr'
          ? 'En Lezzetli Pilav'
          : 'Best Plov & Somsa',
      prompt:
        chatLanguage === 'uz'
          ? `${location.city} shahrida eng mazali an'anaviy palov va tandir somsa qayerda pishiriladi?`
          : chatLanguage === 'ru'
          ? `Где в г. ${location.city} готовят самый вкусный традиционный свадебный плов и тандырную самсу?`
          : chatLanguage === 'tr'
          ? `${location.city} şehrinde en lezzetli geleneksel Özbek pilavı nerede yenir?`
          : `Where can I find the most delicious traditional plov and tandir somsa in ${location.city}?`
    },
    {
      icon: Compass,
      title:
        chatLanguage === 'uz'
          ? '3 Kunlik Ipak Yo‘li Rejasi'
          : chatLanguage === 'ru'
          ? '3-Дневный Маршрут'
          : chatLanguage === 'tr'
          ? '3 Günlük Seyahat Planı'
          : '3-Day Silk Road Plan',
      prompt:
        chatLanguage === 'uz'
          ? `Samarqand, Buxoro va Toshkentni qamrab oluvchi mukammal 3 kunlik sayohat rejasini tuzib bering.`
          : chatLanguage === 'ru'
          ? `Составьте идеальный 3-дневный маршрут путешествия: Ташкент, Самарканд и Бухара.`
          : chatLanguage === 'tr'
          ? `Semerkant, Buhara ve Taşkent için 3 günlük harika bir seyahat planı hazırlar mısınız?`
          : 'Can you create a custom 3-day itinerary covering Samarkand, Bukhara, and Tashkent?'
    },
    {
      icon: Train,
      title:
        chatLanguage === 'uz'
          ? 'Afrosiyob Poyezd Qo‘llanmasi'
          : chatLanguage === 'ru'
          ? 'Поезд Афросиаб'
          : chatLanguage === 'tr'
          ? 'Afrosiyob Hızlı Treni'
          : 'Afrosiyob Train Guide',
      prompt:
        chatLanguage === 'uz'
          ? `O'zbekistonda Afrosiyob tezyurar poyezd chiptasini qanday qilib oson sotib olish mumkin?`
          : chatLanguage === 'ru'
          ? `Как удобно и быстро купить билеты на скоростной поезд Афросиаб в Узбекистане?`
          : chatLanguage === 'tr'
          ? `Özbekistan'da Afrosiyob hızlı tren bileti nasıl kolayca alınır?`
          : 'How do I book tickets for the Afrosiyob high-speed bullet train in Uzbekistan?'
    }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      height: 'calc(100vh - 130px)',
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      gap: '16px'
    }}>
      {/* ChatGPT Style History Sidebar */}
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        overflow: 'hidden'
      }}>
        {/* NEW CHAT BUTTON (FIXED DOUBLE PLUS) */}
        <button
          onClick={handleCreateNewChat}
          className="btn-primary"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '10px 14px',
            fontSize: '13px',
            gap: '8px'
          }}
        >
          <Plus size={16} />
          <span>{chatLanguage === 'uz' ? 'Yangi Suhbat' : chatLanguage === 'ru' ? 'Новый Чат' : chatLanguage === 'tr' ? 'Yeni Sohbet' : 'New Chat'}</span>
        </button>

        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '6px' }}>
          {chatLanguage === 'uz' ? 'Oxirgi Suhbatlar' : chatLanguage === 'ru' ? 'История Бесед' : chatLanguage === 'tr' ? 'Son Sohbetler' : 'Recent Conversations'}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '2px' }}>
          {sessions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '12px' }}>
              {chatLanguage === 'uz' ? "Suhbatlar tarixi bo'sh" : chatLanguage === 'ru' ? 'История бесед пуста' : 'No chats yet'}
            </div>
          )}
          {sessions.map((s) => {
            const isSelected = s.id === currentSessionId;
            return (
              <div
                key={s.id}
                onClick={() => setCurrentSessionId(s.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(0, 168, 150, 0.18)' : 'rgba(255,255,255,0.02)',
                  border: isSelected ? '1px solid var(--accent-turquoise)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <MessageSquare size={14} color={isSelected ? 'var(--accent-turquoise)' : 'var(--text-secondary)'} />
                  <span style={{
                    fontSize: '12px',
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 400,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {s.title}
                  </span>
                </div>

                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    opacity: isSelected ? 0.8 : 0.3
                  }}
                  title="O'chirish"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Persona Selector */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 700, marginBottom: '6px' }}>
            {chatLanguage === 'uz' ? 'AI Shaxsi (Persona Mode)' : chatLanguage === 'ru' ? 'Режим ИИ-Гида' : 'AI Persona Mode'}
          </div>
          <select
            value={persona}
            onChange={(e) => setPersona(e.target.value as any)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(7, 13, 30, 0.8)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value="guide">🤖 Safar AI (Aqlli Tur Gid)</option>
            <option value="historian">📜 Tarixchi Olim (Tarix va Madaniyat)</option>
            <option value="local">🍲 Mahalliy Do‘st (Oshxona & Bozor)</option>
          </select>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', minWidth: 0 }}>
        {/* Chat Top Header */}
        <div className="glass-panel" style={{
          padding: '12px 20px',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070D1E',
              fontWeight: 900
            }}>
              <Bot size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '16px', color: '#fff', fontWeight: 800 }}>SAFAR AI 4.0 Tour Companion</h2>
                <span className="badge-turquoise" style={{ fontSize: '10px', padding: '2px 8px' }}>ChatGPT Engine</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-turquoise)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                Faol Hudud: <strong>{location.city}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onNavigate && (
              <button
                onClick={() => onNavigate('translator')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.25), rgba(212, 175, 55, 0.2))',
                  border: '1px solid rgba(0, 168, 150, 0.5)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Jonli 2-tomonlama Ovozli Tarjimon"
              >
                <Languages size={15} color="var(--accent-turquoise)" />
                <span>Ovozli Tarjimon</span>
              </button>
            )}

            {/* Direct Isolated Language Switcher for AI Chat only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
              <Globe size={14} color="var(--accent-turquoise)" />
              <select
                value={chatLanguage}
                onChange={(e) => handleChatLanguageChange(e.target.value as LanguageCode)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none'
                }}
                title="AI Suhbat Tilini Tanlash"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} style={{ background: '#0D1630', color: '#fff' }}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="glass-panel" style={{
          flex: 1,
          borderRadius: 'var(--radius-xl)',
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {!currentSession || !currentSession.messages || currentSession.messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              padding: '40px 20px',
              textAlign: 'center',
              gap: '16px',
              margin: 'auto 0'
            }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#070D1E',
                boxShadow: '0 0 30px rgba(0, 168, 150, 0.45)'
              }}>
                <Sparkles size={34} />
              </div>

              <div>
                <h2 style={{ fontSize: '26px', color: '#fff', fontWeight: 900, marginBottom: '6px' }}>
                  {chatLanguage === 'uz' ? 'Xush kelibsiz! ✨' : chatLanguage === 'ru' ? 'Добро пожаловать! ✨' : 'Welcome! ✨'}
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.6, margin: '0 auto' }}>
                  {chatLanguage === 'uz'
                    ? "Safar AI O'zbekistonning barcha 14 ta viloyati, tarixiy obidalari, milliy taomlari va poyezdlar bo'yicha shaxsiy aqlli gid yordamchingizdir. Suhbat boshlash uchun quyidagi tugmani bosing yoki savolingizni yozing!"
                    : chatLanguage === 'ru'
                    ? 'Safar AI — ваш персональный ИИ-гид по всем 14 регионам Узбекистана. Нажмите кнопку ниже или задайте любой вопрос!'
                    : 'Safar AI is your personal smart travel companion for Uzbekistan. Click below to start a new chat or ask any question!'}
                </p>
              </div>

              <button
                onClick={handleCreateNewChat}
                className="btn-primary"
                style={{ padding: '12px 26px', fontSize: '13.5px', fontWeight: 800, gap: '8px' }}
              >
                <Plus size={18} />
                <span>{chatLanguage === 'uz' ? 'Yangi Suhbat Boshlash' : chatLanguage === 'ru' ? 'Начать Новый Чат' : 'Start New Chat'}</span>
              </button>
            </div>
          ) : (
            currentSession.messages.map((msg) => {
              const isAi = msg.role === 'assistant';
              const isCurrentlyStreaming = msg.id === streamingMessageId;

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'flex-start' : 'flex-end',
                    gap: '4px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    maxWidth: '85%',
                    flexDirection: isAi ? 'row' : 'row-reverse'
                  }}>
                    {isAi && (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-turquoise), #0D1630)',
                        border: '1px solid var(--border-active)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-turquoise)',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <Bot size={18} />
                      </div>
                    )}

                    <div style={{
                      padding: '14px 18px',
                      borderRadius: isAi ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                      background: isAi ? 'rgba(255, 255, 255, 0.04)' : 'linear-gradient(135deg, var(--accent-turquoise), #047857)',
                      border: isAi ? '1px solid var(--border-subtle)' : 'none',
                      color: '#fff',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      wordBreak: 'break-word',
                      boxShadow: isAi ? 'none' : '0 4px 14px rgba(0, 168, 150, 0.3)'
                    }}>
                      <FormattedMessage content={msg.text} text={msg.text} isUser={!isAi} />

                      {isCurrentlyStreaming && (
                        <span style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--accent-turquoise)', marginLeft: '4px', verticalAlign: 'middle', animation: 'pulse 0.8s infinite' }} />
                      )}

                      {/* AI Quick Actions inside bubble */}
                      {isAi && msg.text && !isCurrentlyStreaming && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '12px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(255,255,255,0.08)'
                        }}>
                          <button
                            onClick={() => playAudio('SAFAR AI Guide', msg.text, chatLanguage)}
                            style={{
                              background: 'rgba(0, 168, 150, 0.15)',
                              border: '1px solid rgba(0, 168, 150, 0.3)',
                              borderRadius: 'var(--radius-full)',
                              padding: '4px 10px',
                              color: 'var(--accent-turquoise)',
                              fontSize: '11px',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Volume2 size={12} />
                            <span>{chatLanguage === 'uz' ? 'Audio Tinglash' : chatLanguage === 'ru' ? 'Слушать' : chatLanguage === 'tr' ? 'Dinle' : 'Listen Voice'}</span>
                          </button>

                          <button
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: 'var(--radius-full)',
                              padding: '4px 10px',
                              color: 'var(--text-secondary)',
                              fontSize: '11px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            {copiedId === msg.id ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                            <span>{copiedId === msg.id ? (chatLanguage === 'uz' ? 'Nusxalandi' : 'Copied!') : (chatLanguage === 'uz' ? 'Nusxalash' : 'Copy')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggested Follow-Ups */}
                  {isAi && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && !isCurrentlyStreaming && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginLeft: '42px',
                      marginTop: '4px'
                    }}>
                      {msg.suggestedFollowUps.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          style={{
                            background: 'rgba(212, 175, 55, 0.08)',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            borderRadius: 'var(--radius-full)',
                            padding: '4px 12px',
                            color: 'var(--text-gold)',
                            fontSize: '11.5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span>✨ {chip}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: isAi ? '42px' : 0, marginRight: isAi ? 0 : '42px' }}>
                    {msg.time}
                  </span>
                </div>
              );
            })
          )}

          {loading && !streamingMessageId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '42px' }}>
              <div className="pulse-loader" style={{ display: 'flex', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-turquoise)' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-gold)' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-turquoise)' }} />
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-turquoise)' }}>
                {chatLanguage === 'uz' ? 'SAFAR AI javob yozmoqda…' : chatLanguage === 'ru' ? 'SAFAR AI печатает…' : chatLanguage === 'tr' ? 'SAFAR AI yazıyor…' : 'SAFAR AI is thinking…'}
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Starters if few messages */}
        {currentSession && currentSession.messages && currentSession.messages.length > 0 && currentSession.messages.length <= 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            {quickStarters.map((qs, i) => {
              const Icon = qs.icon;
              return (
                <div
                  key={i}
                  onClick={() => handleSendMessage(qs.prompt)}
                  className="glass-panel"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255,255,255,0.06)'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'rgba(0, 168, 150, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-turquoise)',
                    flexShrink: 0
                  }}>
                    <Icon size={14} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>{qs.title}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Input Bar */}
        <div className="glass-panel" style={{
          padding: '10px 16px',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1px solid var(--border-active)',
          background: 'rgba(13, 22, 48, 0.95)'
        }}>
          <button
            type="button"
            onClick={handleSpeechInput}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: isRecording ? '#EF4444' : 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-subtle)',
              color: isRecording ? '#fff' : 'var(--text-turquoise)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Ovoz bilan gapirish"
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              chatLanguage === 'uz'
                ? "AI Hamrohingizga istalgan savolni bering (O'zbekiston bo'yicha)..."
                : chatLanguage === 'ru'
                ? "Задайте вопрос ИИ-гиду об Узбекистане..."
                : chatLanguage === 'tr'
                ? "Özbekistan hakkında her şeyi sorun..."
                : "Ask anything about Uzbekistan history, food, or routes..."
            }
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              outline: 'none'
            }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || loading}
            className="btn-primary"
            style={{
              width: '38px',
              height: '38px',
              padding: 0,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !inputText.trim() || loading ? 0.4 : 1
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
