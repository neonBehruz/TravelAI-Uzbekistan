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
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { useLocation } from '../context/LocationContext';
import { api } from '../services/api';

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
  messages: Message[];
  updatedAt: number;
}

export const AiGuidePage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { playAudio } = useAudioGuide();
  const { location } = useLocation();

  const [persona, setPersona] = useState<'guide' | 'historian' | 'local'>('guide');
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('safar_ai_chat_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse chat sessions', e);
      }
    }
    return [
      {
        id: 'session-1',
        title: 'Samarkand & Silk Road Tour',
        updatedAt: Date.now(),
        messages: [
          {
            id: 'init-1',
            role: 'assistant',
            text: `### 🌟 **Assalomu Alaykum! Welcome to SAFAR AI.**\n\nI am your intelligent 24/7 travel guide and cultural companion for **Uzbekistan** across all 14 regions.\n\nAsk me anything about **historical landmarks**, **traditional cuisine**, **travel routes**, **train tickets (Afrosiyob)**, or **local tips**!`,
            time: 'Just now',
            suggestedFollowUps: [
              'What is Registan Square?',
              'Where can I eat authentic Samarkand Osh?',
              'Best 3-Day itinerary for Uzbekistan',
              'Tell me about Afrosiyob fast train'
            ]
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

  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];

  useEffect(() => {
    localStorage.setItem('safar_ai_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages, loading, streamingMessageId]);

  const handleCreateNewChat = () => {
    const newSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: 'New Conversation',
      updatedAt: Date.now(),
      messages: [
        {
          id: 'msg-' + Date.now(),
          role: 'assistant',
          text: `### 🌟 **Assalomu Alaykum! Welcome to SAFAR AI.**\n\nI am your intelligent 24/7 travel guide for **Uzbekistan** (${location.city}). How can I make your journey extraordinary today?`,
          time: 'Just now',
          suggestedFollowUps: [
            `Top places to visit in ${location.city}`,
            'Where can I eat traditional plov?',
            'What is the best 3-day route in Uzbekistan?',
            'Afrosiyob train ticket guide'
          ]
        }
      ]
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleCreateNewChat();
      return;
    }
    const filtered = sessions.filter((s) => s.id !== sessionId);
    setSessions(filtered);
    if (currentSessionId === sessionId) {
      setCurrentSessionId(filtered[0].id);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...currentSession.messages, userMsg];

    // Update title if it's the first user message
    const hasUserMessages = currentSession.messages.some((m) => m.role === 'user');
    const newTitle = !hasUserMessages ? (query.length > 28 ? query.slice(0, 25) + '…' : query) : currentSession.title;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSessionId
          ? { ...s, title: newTitle, messages: updatedMessages, updatedAt: Date.now() }
          : s
      )
    );

    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const historyDto = updatedMessages.map((m) => ({ role: m.role, content: m.text }));
      const res = await api.chatWithAi(
        query,
        currentLanguage,
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
          s.id === currentSessionId
            ? { ...s, messages: [...updatedMessages, aiPlaceholder], updatedAt: Date.now() }
            : s
        )
      );

      // Stream character by character
      let charIdx = 0;
      const stepSize = Math.max(2, Math.floor(aiFullText.length / 40));
      const interval = setInterval(() => {
        charIdx += stepSize;
        if (charIdx >= aiFullText.length) {
          clearInterval(interval);
          setStreamingMessageId(null);
          setSessions((prev) =>
            prev.map((s) =>
              s.id === currentSessionId
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
              s.id === currentSessionId
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
    recognition.lang = currentLanguage === 'uz' ? 'uz-UZ' : currentLanguage === 'ru' ? 'ru-RU' : 'en-US';

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

  const quickStarters = [
    {
      icon: Landmark,
      title: 'Top 5 Monuments',
      prompt: `What are the top 5 absolute must-see places in ${location.city}?`
    },
    {
      icon: Utensils,
      title: 'Best Plov & Somsa',
      prompt: `Where can I find the most delicious traditional plov and tandir somsa in ${location.city}?`
    },
    {
      icon: Compass,
      title: '3-Day Silk Road Plan',
      prompt: 'Can you create a custom 3-day itinerary covering Samarkand, Bukhara, and Tashkent?'
    },
    {
      icon: Train,
      title: 'Afrosiyob Train Guide',
      prompt: 'How do I book tickets for the Afrosiyob high-speed bullet train in Uzbekistan?'
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
          <span>New Chat</span>
        </button>

        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '6px' }}>
          Recent Conversations
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '2px' }}>
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
                  title="Delete chat"
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
            AI Persona Mode
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
            <option value="guide">🤖 Safar AI (Smart Guide)</option>
            <option value="historian">📜 Tarixchi Bobo (Scholar)</option>
            <option value="local">🍲 Mahalliy Do'st (Insider)</option>
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
                Active City Context: <strong>{location.city}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCreateNewChat()}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} /> Reset Chat
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="glass-panel" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minHeight: 0
        }}>
          {/* Quick starter cards on empty/first chat */}
          {currentSession.messages.length <= 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '8px' }}>
              {quickStarters.map((qs, i) => (
                <div
                  key={i}
                  onClick={() => handleSendMessage(qs.prompt)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="quick-card-hover"
                >
                  <qs.icon size={18} color="var(--accent-turquoise)" style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{qs.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{qs.prompt}</div>
                </div>
              ))}
            </div>
          )}

          {currentSession.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: isUser ? '80%' : '90%'
                }}
              >
                {!isUser && (
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'rgba(0, 168, 150, 0.2)',
                    border: '1px solid var(--border-active)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--accent-turquoise)'
                  }}>
                    <Bot size={17} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: isUser
                      ? 'linear-gradient(135deg, var(--accent-turquoise), #05B2D2)'
                      : 'rgba(13, 22, 48, 0.95)',
                    border: isUser ? 'none' : '1px solid var(--border-subtle)',
                    color: isUser ? '#070D1E' : '#fff',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    fontWeight: isUser ? 600 : 400,
                    boxShadow: isUser ? '0 4px 15px rgba(0, 168, 150, 0.3)' : '0 4px 20px rgba(0,0,0,0.3)',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}

                    {/* Action buttons under assistant message */}
                    {!isUser && msg.text && (
                      <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                        <button
                          onClick={() => playAudio('SAFAR AI Guide', msg.text.replace(/[#*•]/g, ''), currentLanguage)}
                          className="btn-primary"
                          style={{
                            padding: '5px 12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            gap: '6px'
                          }}
                        >
                          <Volume2 size={13} /> Listen Voice
                        </button>

                        <button
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          style={{
                            padding: '5px 10px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-subtle)',
                            color: copiedId === msg.id ? '#10B981' : 'var(--text-secondary)',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested follow-up prompt chips */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                      {msg.suggestedFollowUps.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(chip)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(212, 175, 55, 0.1)',
                            border: '1px solid var(--border-gold)',
                            color: 'var(--text-gold)',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          ✨ {chip}
                        </button>
                      ))}
                    </div>
                  )}

                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && !streamingMessageId && (
            <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(0, 168, 150, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-turquoise)'
              }}>
                <Bot size={17} />
              </div>
              <div style={{ padding: '12px 18px', borderRadius: '16px', background: 'rgba(13, 22, 48, 0.95)', color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span>SAFAR AI is thinking…</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="glass-panel" style={{
          padding: '10px 14px',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(13, 22, 48, 0.95)',
          border: '1px solid var(--border-active)',
          flexShrink: 0
        }}>
          <button
            onClick={handleSpeechInput}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: isRecording ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.06)',
              color: isRecording ? '#EF4444' : 'var(--accent-turquoise)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isRecording ? '1px solid #EF4444' : '1px solid var(--border-subtle)',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            title={isRecording ? 'Listening...' : 'Voice Input'}
          >
            {isRecording ? <MicOff size={17} /> : <Mic size={17} />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Message SAFAR AI: 'What is Registan?', 'Best plov in Tashkent', 'Afrosiyob ticket booking'..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              fontSize: '14px'
            }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || loading}
            className="btn-primary"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              padding: 0,
              flexShrink: 0,
              opacity: !inputText.trim() ? 0.5 : 1
            }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
