import React, { useState } from 'react';
import {
  Navigation,
  Lock,
  Mail,
  User as UserIcon,
  Globe,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

interface AuthPagesProps {
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onSuccess: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode, onSwitchMode, onSuccess }) => {
  const { login } = useAuth();
  const { languages, currentLanguage, setLanguage } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Germany');
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        const res = await api.register(name, email, password, country, selectedLanguage);
        login(res.token, {
          id: res.userId,
          name: res.name,
          email: res.email,
          country: res.country,
          language: res.language,
          role: res.role as any
        });
      } else {
        const res = await api.login(email, password);
        login(res.token, {
          id: res.userId,
          name: res.name,
          email: res.email,
          country: res.country,
          language: res.language,
          role: res.role as any
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'tourist' | 'admin') => {
    setLoading(true);
    const demoEmail = role === 'admin' ? 'admin@safarai.uz' : 'tourist@safarai.com';
    const demoPass = role === 'admin' ? 'Admin123!' : 'Tourist123!';
    const res = await api.login(demoEmail, demoPass);
    login(res.token, {
      id: res.userId,
      name: res.name,
      email: res.email,
      country: res.country,
      language: res.language,
      role: res.role as any
    });
    setLoading(false);
    onSuccess();
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, rgba(0, 168, 150, 0.15) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), var(--bg-primary)',
      padding: '24px',
      position: 'relative'
    }}>
      {/* Top Bar for Language Switcher */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Globe size={16} color="var(--accent-turquoise)" />
        <select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value as any)}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#fff',
            border: '1px solid var(--border-subtle)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code} style={{ background: '#0D1630' }}>
              {l.flag} {l.name}
            </option>
          ))}
        </select>
      </div>

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '40px 36px',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-active)',
        boxShadow: '0 25px 70px rgba(0,0,0,0.7)',
        background: 'rgba(13, 22, 48, 0.85)',
        backdropFilter: 'blur(24px)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(0, 168, 150, 0.5)'
          }}>
            <Navigation size={28} color="#070D1E" />
          </div>
          <h1 style={{ fontSize: '26px', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>
            {mode === 'login' ? 'Sign in to SAFAR AI' : 'Create Your Account'}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {mode === 'login'
              ? '“Your AI Guide. Your Language. Your Journey.”'
              : 'Join the intelligent tourism ecosystem in Uzbekistan'}
          </p>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div style={{
          marginBottom: '24px',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>
            ⚡ 1-Click Instant Demo Access
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('tourist')}
              className="btn-primary"
              style={{ padding: '8px 12px', fontSize: '12px', justifyContent: 'center' }}
            >
              <Sparkles size={14} /> Demo Tourist
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="btn-gold"
              style={{ padding: '8px 12px', fontSize: '12px', justifyContent: 'center' }}
            >
              <ShieldCheck size={14} /> Demo Admin
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>or sign in with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#F87171',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px'
              }}>
                <UserIcon size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alexander Miller"
                  style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px'
            }}>
              <Mail size={16} color="var(--text-muted)" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tourist@safarai.com"
                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px'
            }}>
              <Lock size={16} color="var(--text-muted)" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' }}
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Confirm Password
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px'
              }}>
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '15px', justifyContent: 'center' }}
          >
            {loading ? 'Authenticating…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer switch */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                style={{ color: 'var(--accent-turquoise)', fontWeight: 700 }}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                style={{ color: 'var(--accent-turquoise)', fontWeight: 700 }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
