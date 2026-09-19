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
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../i18n/translations';
import { api } from '../services/api';
import { SilkRoadShader } from '../components/SilkRoadShader';

interface AuthPagesProps {
  mode: 'login' | 'register' | 'forgot-password';
  onSwitchMode: (mode: 'login' | 'register' | 'forgot-password') => void;
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

  const [internalMode, setInternalMode] = useState<'login' | 'register' | 'forgot-password'>(mode);

  React.useEffect(() => {
    setInternalMode(mode);
  }, [mode]);

  const switchMode = (m: 'login' | 'register' | 'forgot-password') => {
    setError('');
    setSuccessMessage(null);
    setInternalMode(m);
    onSwitchMode(m);
  };

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gmail, setGmail] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0].name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP state (Registration)
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSentNotification, setOtpSentNotification] = useState<string | null>(null);

  // Forgot Password state
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetSentNotification, setResetSentNotification] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password visibility states (Ko'rib bo'ladigan / yashirin parol)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

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
    setSuccessMessage(null);

    if (internalMode === 'login') {
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
    } else if (internalMode === 'register') {
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

  // Handle Forgot Password - Request Code
  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(null);

    if (!loginIdentifier.trim()) {
      setError(t('loginIdentifier') || 'Iltimos, login yoki pochtangizni kiriting.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.forgotPassword(loginIdentifier.trim());
      setResetSentNotification(`✉️ ${t('resetCodeSent') || 'Tiklash kodi yuborildi'} (${res.targetEmail || loginIdentifier.trim()}): ${res.resetCode}`);
      setResetCode(res.resetCode || '');
      setForgotStep('verify');
    } catch (err: any) {
      setError(err.message || 'Parolni tiklashda xatolik.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password - Submit New Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resetCode.trim() || resetCode.trim().length < 6) {
      setError(t('enterResetCode') || '6 xonali tasdiqlash kodini to‘liq kiriting.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError(t('confirmPassword') || 'Parollar bir-biriga mos kelmadi.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(loginIdentifier.trim(), resetCode.trim(), newPassword);
      setSuccessMessage(t('passwordResetSuccess') || 'Parolingiz muvaffaqiyatli yangilandi! Endi yangi parol bilan tizimga kirishingiz mumkin.');
      setPassword('');
      setConfirmPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setResetCode('');
      setForgotStep('request');
      setInternalMode('login');
      onSwitchMode('login');
    } catch (err: any) {
      setError(err.message || 'Parolni yangilashda xatolik.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetCode = async () => {
    setError('');
    try {
      const res = await api.forgotPassword(loginIdentifier.trim());
      setResetSentNotification(`✉️ ${t('resetCodeSent') || 'Yangi kod yuborildi'} (${res.targetEmail || loginIdentifier.trim()}): ${res.resetCode}`);
      setResetCode(res.resetCode || '');
    } catch (err: any) {
      setError(err.message || 'Kodni qayta yuborishda xatolik.');
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
        maxWidth: isOtpStep || internalMode === 'forgot-password' ? '460px' : internalMode === 'register' ? '500px' : '440px',
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
            {isOtpStep || internalMode === 'forgot-password' ? <KeyRound size={26} color="#070D1E" /> : <Navigation size={26} color="#070D1E" />}
          </div>

          <h1 style={{ fontSize: '24px', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>
            {isOtpStep
              ? (t('otpTitle') || 'Gmail Tasdiqlash Kodi')
              : internalMode === 'forgot-password'
              ? (t('forgotPasswordTitle') || 'Parolni Qayta Tiklash')
              : internalMode === 'login'
              ? t('signInToSafar')
              : t('createYourAccount')}
          </h1>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {isOtpStep
              ? `${t('otpDesc') || 'Biz pochtangizga tasdiqlash kodini yubordik'}: ${gmail}`
              : internalMode === 'forgot-password'
              ? (t('forgotPasswordDesc') || 'Elektron pochta yoki foydalanuvchi nomingizni kiriting')
              : internalMode === 'login'
              ? `“${t('tagline')}”`
              : t('joinSmartTourism')}
          </p>
        </div>

        {/* Success Message Banner */}
        {successMessage && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34D399',
            fontSize: '13px',
            lineHeight: 1.5,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={20} color="#34D399" style={{ flexShrink: 0 }} />
            <div>{successMessage}</div>
          </div>
        )}

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
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#F87171',
            fontSize: '13px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            {internalMode === 'login' && (
              <button
                type="button"
                onClick={() => switchMode('forgot-password')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-turquoise)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                🔑 {t('forgotPassword') || 'Parolni unutdingizmi? Tiklash →'}
              </button>
            )}
            {internalMode === 'forgot-password' && error.includes('topilmadi') && (
              <button
                type="button"
                onClick={() => {
                  setNickname(loginIdentifier.trim());
                  switchMode('register');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-gold)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                ✨ Yangi hisob ochish (Ro'yxatdan o'tish) →
              </button>
            )}
          </div>
        )}

      {/* Forms Routing */}
      {internalMode === 'forgot-password' ? (
        forgotStep === 'request' ? (
          /* Forgot Password Step 1: Request Recovery Code */
          <form onSubmit={handleForgotPasswordRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {t('loginIdentifier') || 'Foydalanuvchi nomi yoki email'}
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px'
              }}>
                <UserIcon size={16} color="var(--text-turquoise)" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Masalan: behruz yoki tourist@safarai.com"
                  style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '6px', fontSize: '14.5px', justifyContent: 'center', fontWeight: 800 }}
            >
              {loading ? (t('authenticating') || 'Yuborilmoqda...') : (t('sendResetCode') || 'Tiklash Kodini Olish')}
              <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}
              >
                ← {t('backToLogin') || 'Kirish oynasiga qaytish'}
              </button>
            </div>
          </form>
        ) : (
          /* Forgot Password Step 2: Verify Code and Reset Password */
          <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {resetSentNotification && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 168, 150, 0.2), rgba(212, 175, 55, 0.15))',
                border: '1px solid var(--accent-turquoise)',
                color: '#fff',
                fontSize: '13px',
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Sparkles size={20} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <div>{resetSentNotification}</div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-gold)', marginBottom: '8px', textAlign: 'center' }}>
                {t('enterResetCode') || '6 Xonali Tiklash Kodini Kiriting'}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '2px solid var(--accent-turquoise)',
                  borderRadius: '14px',
                  color: '#fff',
                  fontSize: '22px',
                  fontWeight: 900,
                  letterSpacing: '10px',
                  textAlign: 'center',
                  outline: 'none',
                  boxShadow: '0 0 20px rgba(0, 168, 150, 0.25)'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                {t('newPassword') || 'Yangi Parol'}
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
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13.5px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  title={showNewPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  style={{ background: 'none', border: 'none', color: showNewPassword ? 'var(--accent-turquoise)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                {t('confirmNewPassword') || 'Yangi Parolni Qayta Kiriting'}
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
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13.5px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                  title={showConfirmNewPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  style={{ background: 'none', border: 'none', color: showConfirmNewPassword ? 'var(--accent-turquoise)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                >
                  {showConfirmNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || resetCode.length < 6}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '6px', fontSize: '14.5px', justifyContent: 'center', fontWeight: 800 }}
            >
              {loading ? (t('authenticating') || 'Yangilanmoqda...') : (t('resetPasswordButton') || 'Parolni Yangilash')}
              <CheckCircle2 size={18} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => setForgotStep('request')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}
              >
                ← {t('changeInfo') || 'Qayta kiritish'}
              </button>
              <button
                type="button"
                onClick={handleResendResetCode}
                style={{ background: 'none', border: 'none', color: 'var(--accent-turquoise)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RefreshCw size={12} /> {t('resendOtp') || 'Kodni qayta yuborish'}
              </button>
            </div>
          </form>
        )
      ) : isOtpStep ? (
        /* Registration OTP Step */
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
          {internalMode === 'register' ? (
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

              {/* 3. Gmail */}
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
                  <Mail size={16} color="var(--text-muted)" />
                  <input
                    type="email"
                    required
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    placeholder="ali@gmail.com"
                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              {/* 4. Davlat Tanlash */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  {t('country')}
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
                  <Globe size={16} color="var(--accent-gold)" />
                  <select
                    value={country}
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      setCountry(newCountry);
                      const mappedLang = getLanguageForCountry(newCountry);
                      setLanguage(mappedLang);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#fff',
                      width: '100%',
                      outline: 'none',
                      fontSize: '13px',
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

              {/* 5. Parol */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13.5px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                    style={{ background: 'none', border: 'none', color: showPassword ? 'var(--accent-turquoise)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* 6. Parolni Tasdiqlash */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  {t('confirmPassword') || 'Parolni tasdiqlang'}
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '13.5px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    title={showConfirmPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                    style={{ background: 'none', border: 'none', color: showConfirmPassword ? 'var(--accent-turquoise)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
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
                    placeholder="(Nickname/Email)"
                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {t('password')}
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot-password')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-turquoise)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {t('forgotPassword') || 'Parolni unutdingizmi?'}
                  </button>
                </div>
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '14px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                    style={{ background: 'none', border: 'none', color: showPassword ? 'var(--accent-turquoise)' : 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Quick Demo Credentials Pill */}
              <div style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed var(--border-subtle)',
                fontSize: '11.5px',
                color: 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '2px'
              }}>
                <span>Demo hisoblar:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    title="Sayyoh: tourist@safarai.com / Tourist123!"
                    onClick={() => {
                      setLoginIdentifier('tourist@safarai.com');
                      setPassword('Tourist123!');
                      setError('');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Sayyoh
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    title="Admin: admin@safarai.uz / Admin123!"
                    onClick={() => {
                      setLoginIdentifier('admin@safarai.uz');
                      setPassword('Admin123!');
                      setError('');
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-turquoise)', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Admin
                  </button>
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
              : internalMode === 'login'
              ? t('signIn')
              : (t('getOtpAndProceed') || 'Kod Olish & Davom Etish')}
            <ArrowRight size={16} />
          </button>
        </form>
      )}

      {/* Footer switch */}
      {!isOtpStep && (
        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {internalMode === 'login' ? (
            <span>
              {t('dontHaveAccount')}{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                style={{ color: 'var(--accent-turquoise)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {t('register')}
              </button>
            </span>
          ) : internalMode === 'register' ? (
            <span>
              {t('alreadyHaveAccount')}{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={{ color: 'var(--accent-turquoise)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {t('signIn')}
              </button>
            </span>
          ) : (
            <span>
              <button
                type="button"
                onClick={() => switchMode('login')}
                style={{ color: 'var(--accent-turquoise)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← {t('backToLogin') || 'Kirish oynasiga qaytish'}
              </button>
            </span>
          )}
        </div>
      )}
      </div>
    </div>
  );
};
