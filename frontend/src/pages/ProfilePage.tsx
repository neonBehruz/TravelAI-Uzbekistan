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
  ShieldCheck,
  Crown,
  Key,
  Database,
  Activity,
  Camera,
  Upload
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage, LanguageCode } from '../context/LanguageContext';
import { api } from '../services/api';

const PROFILE_STRINGS: Partial<Record<LanguageCode, {
  adminBadge: string;
  userBadge: string;
  adminTitle: string;
  userTitle: string;
  adminSubtitle: string;
  userSubtitle: string;
  personalInfo: string;
  fullName: string;
  country: string;
  email: string;
  role: string;
  appLanguage: string;
  voiceSettings: string;
  voiceSpeed: string;
  voiceGender: string;
  female: string;
  male: string;
  saveChanges: string;
  savedSuccess: string;
}>> = {
  uz: {
    adminBadge: "Tizim Administratori Hisobi",
    userBadge: "Tasdiqlangan Sayyoh Profili",
    adminTitle: "Administrator Profili va Huquqlari",
    userTitle: "Foydalanuvchi Profili Sozlamalari",
    adminSubtitle: "Administrator parametrlari, tizim telemetriyasi va server sozlamalarini boshqaring.",
    userSubtitle: "Sayohat parametrlari, ovozli gid tezligi va mintaqaviy tilni sozlang.",
    personalInfo: "Shaxsiy Ma'lumotlar",
    fullName: "To'liq Ism-Sharif",
    country: "Kelib Chiqqan Davlat",
    email: "Elektron Pochta",
    role: "Foydalanuvchi Huquqi (Role)",
    appLanguage: "Ilova Tili (Preferred Language)",
    voiceSettings: "Ovozli Gid & Audiogid Sozlamalari",
    voiceSpeed: "Ovoz O'qish Tezligi",
    voiceGender: "Ovoz Turi",
    female: "Ayol Ovozi (Tabiiy)",
    male: "Erkak Ovozi (Natiq)",
    saveChanges: "O'zgarishlarni Saqlash",
    savedSuccess: "Sozlamalar muvaffaqiyatli saqlandi!"
  },
  en: {
    adminBadge: "System Administrator Account",
    userBadge: "Verified Silk Road Traveler",
    adminTitle: "Administrator Profile & Rights",
    userTitle: "User Profile Settings",
    adminSubtitle: "Manage administrator preferences, system telemetry permissions, and audio synthesizer defaults.",
    userSubtitle: "Configure your travel preferences, voice narrator speed, and regional language settings.",
    personalInfo: "Personal Information",
    fullName: "Full Name",
    country: "Country of Origin",
    email: "Email Address",
    role: "User Role",
    appLanguage: "Preferred Language",
    voiceSettings: "AI Voice Narrator Settings",
    voiceSpeed: "Narration Speed",
    voiceGender: "Voice Persona",
    female: "Female Voice (Natural)",
    male: "Male Voice (Professional)",
    saveChanges: "Save Settings",
    savedSuccess: "Settings updated successfully!"
  },
  ru: {
    adminBadge: "Аккаунт Администратора Системы",
    userBadge: "Проверенный Путешественник",
    adminTitle: "Профиль и Права Администратора",
    userTitle: "Настройки Профиля",
    adminSubtitle: "Управление правами администратора, телеметрией и настройками сервера.",
    userSubtitle: "Настройте параметры путешествий, скорость аудиогида и язык интерфейса.",
    personalInfo: "Личные Данные",
    fullName: "Полное Имя",
    country: "Страна Проживания",
    email: "Электронная Почта",
    role: "Роль в Системе",
    appLanguage: "Язык Приложения",
    voiceSettings: "Настройки Аудиогида",
    voiceSpeed: "Скорость Озвучки",
    voiceGender: "Тип Голоса",
    female: "Женский Голос (Естественный)",
    male: "Мужской Голос (Диктор)",
    saveChanges: "Сохранить Настройки",
    savedSuccess: "Настройки успешно сохранены!"
  },
  tr: {
    adminBadge: "Sistem Yöneticisi Hesabı",
    userBadge: "Doğrulanmış Gezgin Profili",
    adminTitle: "Yönetici Profili & Yetkileri",
    userTitle: "Kullanıcı Profil Ayarları",
    adminSubtitle: "Yönetici tercihlerini ve sistem telemetrisini yönetin.",
    userSubtitle: "Seyahat tercihlerinizi ve sesli rehber hızını yapılandırın.",
    personalInfo: "Kişisel Bilgiler",
    fullName: "Ad Soyad",
    country: "Ülke",
    email: "E-posta Adresi",
    role: "Kullanıcı Rolü",
    appLanguage: "Tercih Edilen Dil",
    voiceSettings: "Sesli Rehber Ayarları",
    voiceSpeed: "Okuma Hızı",
    voiceGender: "Ses Türü",
    female: "Kadın Sesi (Doğal)",
    male: "Erkek Sesi (Profesyonel)",
    saveChanges: "Değişiklikleri Kaydet",
    savedSuccess: "Ayarlar başarıyla kaydedildi!"
  },
  de: {
    adminBadge: "Systemadministrator-Konto",
    userBadge: "Verifizierter Seidenstraßen-Reisender",
    adminTitle: "Administratorprofil & Rechte",
    userTitle: "Benutzerprofil-Einstellungen",
    adminSubtitle: "Administrator-Einstellungen und System-Telemetrie verwalten.",
    userSubtitle: "Reiseeinstellungen und Audioguide-Geschwindigkeit konfigurieren.",
    personalInfo: "Persönliche Daten",
    fullName: "Vollständiger Name",
    country: "Herkunftsland",
    email: "E-Mail-Adresse",
    role: "Benutzerrolle",
    appLanguage: "Bevorzugte Sprache",
    voiceSettings: "Audio-Guide-Einstellungen",
    voiceSpeed: "Sprechgeschwindigkeit",
    voiceGender: "Stimmtyp",
    female: "Weibliche Stimme (Natürlich)",
    male: "Männliche Stimme (Professionell)",
    saveChanges: "Einstellungen speichern",
    savedSuccess: "Einstellungen erfolgreich gespeichert!"
  },
  fr: {
    adminBadge: "Compte Administrateur Système",
    userBadge: "Voyageur Vérifié",
    adminTitle: "Profil & Droits Administrateur",
    userTitle: "Paramètres du Profil",
    adminSubtitle: "Gérer les préférences d'administration et la télémétrie.",
    userSubtitle: "Configurez vos préférences de voyage et la voix de l'audioguide.",
    personalInfo: "Informations Personnelles",
    fullName: "Nom Complet",
    country: "Pays d'Origine",
    email: "Adresse E-mail",
    role: "Rôle",
    appLanguage: "Langue Préférée",
    voiceSettings: "Paramètres de l'Audioguide IA",
    voiceSpeed: "Vitesse de Lecture",
    voiceGender: "Type de Voix",
    female: "Voix Féminine (Naturelle)",
    male: "Voix Masculine (Professionnelle)",
    saveChanges: "Enregistrer les Modifications",
    savedSuccess: "Paramètres mis à jour avec succès !"
  },
  es: {
    adminBadge: "Cuenta de Administrador del Sistema",
    userBadge: "Viajero Verificado",
    adminTitle: "Perfil y Permisos de Administrador",
    userTitle: "Configuración del Perfil",
    adminSubtitle: "Gestionar preferencias de administración y telemetría.",
    userSubtitle: "Configura tus preferencias de viaje y velocidad del audioguía.",
    personalInfo: "Información Personal",
    fullName: "Nombre Completo",
    country: "País de Origen",
    email: "Correo Electrónico",
    role: "Rol de Usuario",
    appLanguage: "Idioma Preferido",
    voiceSettings: "Configuración del Audioguía IA",
    voiceSpeed: "Velocidad de Voz",
    voiceGender: "Tipo de Voz",
    female: "Voz Femenina (Natural)",
    male: "Voz Masculina (Profesional)",
    saveChanges: "Guardar Cambios",
    savedSuccess: "¡Configuración guardada con éxito!"
  },
  zh: {
    adminBadge: "系统管理员账户",
    userBadge: "已认证丝路旅行者",
    adminTitle: "管理员资料与权限",
    userTitle: "用户个人中心设置",
    adminSubtitle: "管理系统管理员首选项、平台监控与语音参数。",
    userSubtitle: "配置您的旅行偏好、语音导览语速及区域语言。",
    personalInfo: "个人基本信息",
    fullName: "全名",
    country: "所在国家/地区",
    email: "电子邮箱",
    role: "用户角色",
    appLanguage: "首选语言",
    voiceSettings: "AI语音导览参数设置",
    voiceSpeed: "播报语速",
    voiceGender: "声音风格",
    female: "女声（自然亲切）",
    male: "男声（沉稳播音）",
    saveChanges: "保存设置",
    savedSuccess: "设置已成功保存！"
  },
  ja: {
    adminBadge: "システム管理者アカウント",
    userBadge: "認証済み旅行者プロフィール",
    adminTitle: "管理者プロフィール＆権限",
    userTitle: "ユーザープロフィール設定",
    adminSubtitle: "管理者設定、システム監視、音声合成を管理します。",
    userSubtitle: "旅行の好み、音声ガイドの速度、言語を設定します。",
    personalInfo: "個人情報",
    fullName: "氏名",
    country: "国・地域",
    email: "メールアドレス",
    role: "ユーザー権限",
    appLanguage: "使用言語",
    voiceSettings: "AI音声ガイド設定",
    voiceSpeed: "読み上げ速度",
    voiceGender: "音声タイプ",
    female: "女性音声（ナチュラル）",
    male: "男性音声（アナウンサー風）",
    saveChanges: "設定を保存",
    savedSuccess: "設定が正常に保存されました！"
  },
  ko: {
    adminBadge: "시스템 관리자 계정",
    userBadge: "인증된 실크로드 여행자",
    adminTitle: "관리자 프로필 및 권한",
    userTitle: "사용자 프로필 설정",
    adminSubtitle: "관리자 환경설정, 시스템 텔레메트리 및 오디오를 관리합니다.",
    userSubtitle: "여행 선호도, 음성 안내 속도 및 언어를 설정하세요.",
    personalInfo: "개인 정보",
    fullName: "이름",
    country: "국가",
    email: "이메일 주소",
    role: "사용자 권한",
    appLanguage: "선호 언어",
    voiceSettings: "AI 음성 가이드 설정",
    voiceSpeed: "음성 재생 속도",
    voiceGender: "음성 종류",
    female: "여성 음성 (자연스러움)",
    male: "남성 음성 (전문적)",
    saveChanges: "설정 저장",
    savedSuccess: "설정이 성공적으로 저장되었습니다!"
  }
};

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { languages, currentLanguage, setLanguage } = useLanguage();
  const isAdmin = user?.role === 'Admin';
  const tProf = PROFILE_STRINGS[currentLanguage] || PROFILE_STRINGS.uz!;

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
        <div className={isAdmin ? 'badge-admin-crown' : 'badge-user-verified'} style={{ marginBottom: '8px' }}>
          {isAdmin ? <Crown size={13} color="#FFD700" /> : <UserIcon size={12} />}
          {isAdmin ? tProf.adminBadge : tProf.userBadge}
        </div>
        <h1 style={{ fontSize: '32px', color: '#fff' }}>
          {isAdmin ? tProf.adminTitle : tProf.userTitle}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          {isAdmin ? tProf.adminSubtitle : tProf.userSubtitle}
        </p>
      </div>

      {/* Role Distinction Status Banner */}
      {isAdmin ? (
        <div className="glass-panel" style={{
          padding: '24px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.16), rgba(13, 22, 48, 0.9))',
          border: '1px solid rgba(212, 175, 55, 0.5)',
          boxShadow: '0 0 25px rgba(212, 175, 55, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--accent-gold), #991B1B)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)'
              }}>
                <Crown size={24} color="#FFD700" />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {user?.name}
                  <span className="badge-admin-crown">ROOT SUPERADMIN</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-gold)', marginTop: '2px' }}>
                  {user?.email} • Authority: Full Platform Administration
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(0, 168, 150, 0.15)',
                color: 'var(--accent-turquoise)',
                border: '1px solid rgba(0, 168, 150, 0.3)',
                fontWeight: 700
              }}>
                ✓ User Management
              </span>
              <span style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(212, 175, 55, 0.15)',
                color: 'var(--text-gold)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                fontWeight: 700
              }}>
                ✓ System Telemetry
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(0, 168, 150, 0.08)',
          border: '1px solid rgba(0, 168, 150, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                position: 'relative',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: user?.avatarUrl ? `url(${user.avatarUrl}) center/cover` : 'linear-gradient(135deg, var(--accent-turquoise), #0A1128)',
                border: '2px solid var(--accent-turquoise)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: '18px'
              }}>
                {!user?.avatarUrl && (user?.name.charAt(0) || 'U')}
                <label
                  htmlFor="avatar-file-input"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--accent-turquoise)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 8px rgba(0,0,0,0.6)'
                  }}
                  title="Avatar rasmini yuklash (File Upload)"
                >
                  <Camera size={11} color="#000" />
                </label>
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const res = await api.uploadAvatar(file);
                        if (user && res.url) {
                          updateUser({ ...user, avatarUrl: res.url });
                          setSavedSuccess(true);
                          setTimeout(() => setSavedSuccess(false), 2500);
                        }
                      } catch (err: any) {
                        alert(err.message || 'Avatar yuklashda xatolik yuz berdi');
                      }
                    }
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{user?.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-turquoise)' }}>
                  Sayyoh • {user?.country || 'Uzbekistan'} ({user?.email})
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '8px' }}>
              Cloud / Server Storage Active
            </div>
          </div>
        </div>
      )}

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
          <Check size={18} /> {tProf.savedSuccess}
        </div>
      )}

      {/* User Info Card */}
      <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-xl)' }}>
        <h2 style={{ fontSize: '20px', color: '#fff', marginBottom: '20px' }}>{tProf.personalInfo}</h2>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {tProf.fullName}
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
                {tProf.country}
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {tProf.email}
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'traveler@safar.ai'}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {tProf.role}
              </label>
              <input
                type="text"
                disabled
                value={user?.role || 'User'}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  color: isAdmin ? 'var(--accent-gold)' : 'var(--text-turquoise)',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'not-allowed'
                }}
              />
            </div>
          </div>

          {/* Preferred Language Switcher */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {tProf.appLanguage}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={18} color="var(--accent-turquoise)" />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as any)}
                style={{
                  width: '100%',
                  background: '#0D1630',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} style={{ background: '#0D1630', color: '#fff' }}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Voice Preferences */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginTop: '10px' }}>
            <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={18} color="var(--accent-gold)" /> {tProf.voiceSettings}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {tProf.voiceSpeed} ({voiceSpeed}x)
                </label>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.25"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-turquoise)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {tProf.voiceGender}
                </label>
                <select
                  value={voiceGender}
                  onChange={(e) => setVoiceGender(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0D1630',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                >
                  <option value="female">{tProf.female}</option>
                  <option value="male">{tProf.male}</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '14px', gap: '8px' }}
            >
              <Save size={16} /> {tProf.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
