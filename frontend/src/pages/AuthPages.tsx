import React, { useState } from 'react';
import {
  Navigation,
  Lock,
  Mail,
  User as UserIcon,
  Globe,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../i18n/translations';
import { api } from '../services/api';
import { SilkRoadShader } from '../components/SilkRoadShader';

interface AuthPagesProps {
  mode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onSuccess: () => void;
  onBack?: () => void;
}

interface CountryOption {
  name: string;
  lang: LanguageCode;
}

// Clean and comprehensive list of countries without any messy code tags or prefixes
const COUNTRIES: CountryOption[] = [
  { name: "O'zbekiston", lang: 'uz' },
  { name: 'Tojikiston', lang: 'tg' },
  { name: 'Rossiya', lang: 'ru' },
  { name: "Qozog'iston", lang: 'ru' },
  { name: "Qirg'iziston", lang: 'ru' },
  { name: 'Turkmaniston', lang: 'uz' },
  { name: 'Ozarbayjon', lang: 'az' },
  { name: 'Turkiya', lang: 'tr' },
  { name: 'Germaniya', lang: 'de' },
  { name: 'Fransiya', lang: 'fr' },
  { name: 'Italiya', lang: 'it' },
  { name: 'Ispaniya', lang: 'es' },
  { name: 'AQSH (USA)', lang: 'en' },
  { name: 'Buyuk Britaniya', lang: 'en' },
  { name: 'Kanada', lang: 'en' },
  { name: 'Xitoy', lang: 'zh' },
  { name: 'Yaponiya', lang: 'ja' },
  { name: 'Janubiy Koreya', lang: 'ko' },
  { name: 'BAA (Dubay)', lang: 'ar' },
  { name: 'Saudiya Arabistoni', lang: 'ar' },
  { name: 'Eron', lang: 'fa' },
  { name: 'Afg\'oniston', lang: 'fa' },
  { name: 'Pokiston', lang: 'ur' },
  { name: 'Hindiston', lang: 'hi' },
  { name: 'Malayziya', lang: 'ms' },
  { name: 'Indoneziya', lang: 'id' },
  { name: 'Polsha', lang: 'pl' },
  { name: 'Niderlandiya', lang: 'nl' },
  { name: 'Boshqa davlat', lang: 'en' }
];

export const AuthPages: React.FC<AuthPagesProps> = ({ mode, onSwitchMode, onSuccess, onBack }) => {
  const { login } = useAuth();
  const { languages, currentLanguage, setLanguage, t } = useLanguage();

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gmail, setGmail] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0].name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSentNotification, setOtpSentNotification] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-detect language based on selected country
  const getLanguageForCountry = (countryName: string): LanguageCode => {
    const found = COUNTRIES.find((c) => c.name === countryName);
    return found?.lang || 'en';
  };

  // Handle Initial Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      if (!loginIdentifier.trim() || !password) {
        setError(t('authenticating') || 'Please enter your login and password.');
        return;
      }
      setLoading(true);
      try {
        const res = await api.login(loginIdentifier.trim(), password);
        const userLang = getLanguageForCountry(res.country) || (res.language as LanguageCode) || currentLanguage;
        setLanguage(userLang);

        login(res.token, {
          id: res.userId,
          name: res.name,
          email: res.email,
          country: res.country,
          language: userLang,
          role: res.role as any
        });
        onSuccess();
      } catch (err: any) {
        setError(err.message || 'Login failed.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!fullName.trim() || !nickname.trim() || !gmail.trim() || !password) {
        setError(t('authenticating') || 'Please fill in all fields.');
        return;
      }
      if (password !== confirmPassword) {
        setError(t('confirmPassword') || 'Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      // Generate 6-digit OTP code and move to verification step
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpInput('');
      setOtpSentNotification(`✉️ ${t('otpDesc') || 'Kod yuborildi'} (${gmail.trim()}): ${code}`);
      setIsOtpStep(true);
    }
  };

  // Handle OTP Verification & Registration
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpInput.trim() !== generatedOtp) {
      setError(t('otpTitle') ? `${t('otpTitle')} - xato!` : 'Invalid verification code.');
      return;
    }

    setLoading(true);
    try {
      const selectedLang = getLanguageForCountry(country);
      const cleanEmail = gmail.trim().includes('@') ? gmail.trim() : `${nickname.trim()}@safarai.uz`;
      const displayName = `${fullName.trim()} (@${nickname.trim()})`;

      const res = await api.register(displayName, cleanEmail, password, country, selectedLang);

      // Auto-switch website to country language
      setLanguage(selectedLang);

      login(res.token, {
        id: res.userId,
        name: res.name,
        email: res.email,
        country: res.country,
        language: selectedLang,
        role: res.role as any
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtpSentNotification(`✉️ ${t('otpDesc') || 'Yangi kod yuborildi'} (${gmail.trim()}): ${newCode}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#070D1E'
    }}>
      {/* Full-Screen WebGL Silk Road Shader Background */}
      <SilkRoadShader style={{ opacity: 0.75, zIndex: 0 }} />

      {/* Top Left Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            zIndex: 3,
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
          }}
        >
          <ArrowLeft size={16} color="var(--accent-turquoise)" />
          <span>{t('back')}</span>
        </button>
      )}

      {/* Top Right Language Switcher */}
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 3
      }}>
        <Globe size={16} color="var(--accent-turquoise)" />
        <select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value as any)}
          style={{
            background: 'rgba(7, 13, 30, 0.85)',
            border: '1px solid var(--border-subtle)',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code} style={{ background: '#0D1630', color: '#fff' }}>
              {l.nativeName || l.name}
            </option>
          ))}
        </select>
      </div>

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: isOtpStep ? '460px' : mode === 'register' ? '500px' : '440px',
        padding: '36px 32px',
        borderRadius: '24px',
        border: '1px solid var(--border-active)',
        boxShadow: '0 25px 70px rgba(0,0,0,0.7)',
        background: 'rgba(13, 22, 48, 0.92)',
        backdropFilter: 'blur(24px)',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-turquoise), var(--accent-gold))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 0 25px rgba(0, 168, 150, 0.5)'
          }}>
            {isOtpStep ? <KeyRound size={26} color="#070D1E" /> : <Navigation size={26} color="#070D1E" />}
          </div>

          <h1 style={{ fontSize: '24px', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>
            {isOtpStep
              ? (t('otpTitle') || 'Gmail Tasdiqlash Kodi')
              : mode === 'login'
              ? t('signInToSafar')
              : t('createYourAccount')}
          </h1>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {isOtpStep
              ? `${t('otpDesc') || 'Biz pochtangizga tasdiqlash kodini yubordik'}: ${gmail}`
              : mode === 'login'
              ? `“${t('tagline')}”`
              : t('joinSmartTourism')}
          </p>
        </div>

        {/* OTP Notification Toast */}
        {otpSentNotification && isOtpStep && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.2), rgba(212, 175, 55, 0.15))',
            border: '1px solid var(--accent-turquoise)',
            color: '#fff',
            fontSize: '13px',
            lineHeight: 1.5,
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 20px rgba(0, 168, 150, 0.25)'
          }}>
            <Sparkles size={20} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
            <div>{otpSentNotification}</div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#F87171',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* OTP Verification Step */}
        {isOtpStep ? (
          <form onSubmit={handleVerifyOtpAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-gold)', marginBottom: '8px', textAlign: 'center' }}>
                {t('enterOtpLabel') || '6 Xonali Tasdiqlash Kodini Kiriting'}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '2px solid var(--accent-turquoise)',
                  borderRadius: '14px',
                  color: '#fff',
                  fontSize: '24px',
                  fontWeight: 900,
                  letterSpacing: '12px',
                  textAlign: 'center',
                  outline: 'none',
                  boxShadow: '0 0 20px rgba(0, 168, 150, 0.25)'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpInput.length < 6}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center', fontWeight: 800 }}
            >
              {loading ? (t('authenticating') || 'Tasdiqlanmoqda...') : (t('verifyOtpButton') || 'Kodni Tasdiqlash & Akkauntni Ochish')}
              <CheckCircle2 size={18} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}
              >
                ← {t('changeInfo') || "Ma'lumotlarni o'zgartirish"}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                style={{ background: 'none', border: 'none', color: 'var(--accent-turquoise)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RefreshCw size={12} /> {t('resendOtp') || 'Kodni qayta yuborish'}
              </button>
            </div>
          </form>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' ? (
              <>
                {/* 1. Ismi va Familiyasi */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('fullName')}
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
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ali Valiyev"
                      style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13.5px' }}
                    />
                  </div>
                </div>

                {/* 2. Nickname */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('nickname') || 'Nickname (Foydalanuvchi nomi)'}
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
                    <Sparkles size={16} color="var(--accent-turquoise)" />
                    <input
                      type="text"
                      required
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      placeholder="ali_sayyoh"
                      style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13.5px' }}
                    />
                  </div>
                </div>

                {/* 3. Gmail / Elektron Pochta */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('emailAddress')}
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
                    <Mail size={16} color="var(--accent-gold)" />
                    <input
                      type="email"
                      required
                      value={gmail}
                      onChange={(e) => setGmail(e.target.value)}
                      placeholder="alivaliyev@gmail.com"
                      style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13.5px' }}
                    />
                  </div>
                </div>

                {/* 4. Davlat (Country) */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    {t('country') || 'Davlat'}
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
                    <Globe size={16} color="var(--accent-turquoise)" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        width: '100%',
                        outline: 'none',
                        fontSize: '13.5px',
                        cursor: 'pointer'
                      }}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.name} value={c.name} style={{ background: '#0D1630', color: '#fff' }}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 5. Parol va Tasdiqlash */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      {t('password')}
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px'
                    }}>
                      <Lock size={15} color="var(--text-muted)" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                      {t('confirmPassword')}
                    </label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px'
                    }}>
                      <Lock size={15} color="var(--text-muted)" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13px' }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Login Form */
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {t('loginIdentifier') || 'Foydalanuvchi nomi'}
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
                    <UserIcon size={16} color="var(--text-turquoise)" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="(Nickname)"
                      style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {t('password')}
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
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '8px', fontSize: '14.5px', justifyContent: 'center', fontWeight: 800 }}
            >
              {loading
                ? (t('authenticating') || 'Tekshirilmoqda...')
                : mode === 'login'
                ? t('signIn')
                : (t('getOtpAndProceed') || 'Kod Olish & Davom Etish')}
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Footer switch */}
        {!isOtpStep && (
          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? (
              <span>
                {t('dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => onSwitchMode('register')}
                  style={{ color: 'var(--accent-turquoise)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {t('register')}
                </button>
              </span>
            ) : (
              <span>
                {t('alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => onSwitchMode('login')}
                  style={{ color: 'var(--accent-turquoise)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {t('signIn')}
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
