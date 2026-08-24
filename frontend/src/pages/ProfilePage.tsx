import React, { useState } from 'react';
import {
  User as UserIcon,
  Globe,
  Volume2,
  Lock,
  Heart,
  Save,
  Compass,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { languages, currentLanguage, setLanguage } = useLanguage();

  const [name, setName] = useState(user ? user.name : 'Alexander Miller');
  const [country, setCountry] = useState(user ? user.country : 'Germany');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceGender, setVoiceGender] = useState('female');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser({
        ...user,
        name,
        country
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div className="badge-turquoise" style={{ marginBottom: '8px' }}>
          <UserIcon size={12} /> Account & Preferences
        </div>
        <h1 style={{ fontSize: '32px', color: '#fff' }}>User Profile Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Configure your travel preferences, voice narrator speed, and regional language settings.
        </p>
      </div>

      {savedSuccess && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '10px',
          background: 'rgba(0, 168, 150, 0.15)',
          border: '1px solid var(--border-active)',
          color: 'var(--text-turquoise)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px'
        }}>
          <Check size={18} /> Settings updated successfully!
        </div>
      )}

      {/* User Info Card */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-xl)' }}>
        <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '20px' }}>Personal Information</h2>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Country of Origin
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              App Interface & Audio Guide Language
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => setLanguage(e.target.value as any)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                color: '#fff',
                outline: 'none',
                fontSize: '14px'
              }}
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} style={{ background: '#0D1630' }}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
            <Save size={16} /> Save Profile Changes
          </button>
        </form>
      </div>

      {/* AI Voice Guide Settings */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-xl)' }}>
        <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={18} color="var(--accent-gold)" /> AI Voice & Speech Customization
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Narration Speed</label>
              <span style={{ fontWeight: 700, color: 'var(--accent-turquoise)' }}>{voiceSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.05"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-turquoise)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Voice Persona & Tone
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['Warm Conversational (Female)', 'Deep Narrator (Male)'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => setVoiceGender(gender)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: voiceGender === gender ? 'rgba(0, 168, 150, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: voiceGender === gender ? '1px solid var(--accent-turquoise)' : '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontWeight: voiceGender === gender ? 700 : 500,
                    fontSize: '13px'
                  }}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
