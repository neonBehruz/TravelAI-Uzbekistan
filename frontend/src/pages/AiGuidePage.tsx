import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAudioGuide } from '../context/AudioGuideContext';
import { api } from '../services/api';

interface Message {
  id: string;
  isUser: boolean;
  text: string;
  time: string;
  suggestedFollowUps?: string[];
}

export const AiGuidePage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { playAudio } = useAudioGuide();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      isUser: false,
      text: 'Assalomu Alaykum! I am SAFAR AI, your personal tour companion and historian in Uzbekistan. What would you like to discover about Samarkand’s majestic madrasahs, Silk Road history, or traditional gastronomy?',
      time: 'Just now',
      suggestedFollowUps: [
        'What is Registan Square?',
        'Where can I eat authentic Samarkand Osh?',
        'I only have 3 hours. What should I visit?',
        'Tell me about Shah-i-Zinda'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      isUser: true,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const res = await api.chatWithAi(query, currentLanguage);
      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        isUser: false,
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: res.suggestedFollowUps
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
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

  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      height: 'calc(100vh - 140px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Top Title Bar */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#070D1E',
            flexShrink: 0
          }}>
            <Bot size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', color: '#fff', fontWeight: 800 }}>SAFAR AI Tour Guide</h2>
            <div style={{ fontSize: '12px', color: 'var(--text-turquoise)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-turquoise)' }} />
              Active Context: Samarkand Historic Center (Registan)
            </div>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          style={{
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RotateCcw size={14} /> Clear Chat
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="glass-panel" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minHeight: 0
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '12px',
              alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {!msg.isUser && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(0, 168, 150, 0.2)',
                border: '1px solid var(--border-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: 'var(--accent-turquoise)'
              }}>
                <Bot size={18} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isUser ? 'flex-end' : 'flex-start' }}>
              <div style={{
                padding: '16px 20px',
                borderRadius: '16px',
                background: msg.isUser
                  ? 'linear-gradient(135deg, var(--accent-turquoise), #05B2D2)'
                  : 'rgba(13, 22, 48, 0.95)',
                border: msg.isUser ? 'none' : '1px solid var(--border-subtle)',
                color: msg.isUser ? '#070D1E' : '#fff',
                fontSize: '14px',
                lineHeight: 1.6,
                fontWeight: msg.isUser ? 600 : 400,
                boxShadow: msg.isUser ? '0 4px 15px rgba(0, 168, 150, 0.3)' : '0 4px 20px rgba(0,0,0,0.3)',
                textAlign: 'left'
              }}>
                {msg.text}

                {!msg.isUser && (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => playAudio('SAFAR AI Guide', msg.text, currentLanguage)}
                      className="btn-primary"
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      <Volume2 size={13} /> Listen with Natural Voice
                    </button>
                  </div>
                )}
              </div>

              {/* Follow-up suggestions chips */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {msg.suggestedFollowUps.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(212, 175, 55, 0.12)',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--text-gold)',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
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
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(0, 168, 150, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-turquoise)'
            }}>
              <Bot size={18} />
            </div>
            <div style={{ padding: '12px 18px', borderRadius: '16px', background: 'rgba(13, 22, 48, 0.95)', color: 'var(--text-muted)', fontSize: '13px' }}>
              SAFAR AI is analyzing historical archives…
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="glass-panel" style={{
        padding: '12px 16px',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(13, 22, 48, 0.95)',
        border: '1px solid var(--border-active)',
        flexShrink: 0
      }}>
        <button
          onClick={handleSpeechInput}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isRecording ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.06)',
            color: isRecording ? '#EF4444' : 'var(--accent-turquoise)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: isRecording ? '1px solid #EF4444' : '1px solid var(--border-subtle)',
            flexShrink: 0
          }}
          title={isRecording ? 'Listening...' : 'Voice Input'}
        >
          {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask anything: 'What is Registan?', 'Where to eat traditional plov?', 'Photo spots'..."
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
          disabled={!inputText.trim()}
          className="btn-primary"
          style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, flexShrink: 0 }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
