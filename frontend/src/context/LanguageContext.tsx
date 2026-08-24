import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageMeta, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  languages: LanguageMeta[];
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('safar_language') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('safar_language', lang);
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languages: SUPPORTED_LANGUAGES, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
