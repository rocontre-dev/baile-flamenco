import { createContext, useContext, useState, useEffect } from 'react';
import es from './es.json';
import en from './en.json';

const translations = { es, en };

const I18nContext = createContext();

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    const saved = localStorage.getItem('locale');
    return saved || 'es';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key, defaultValue = '') => {
    const keys = key.split('.');
    let value = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return defaultValue;
    }
    
    return value || defaultValue;
  };

  const changeLocale = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
    }
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export default {
  translations,
  useTranslation,
  I18nProvider
};