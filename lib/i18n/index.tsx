
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import en from './locales/en.json';
import fr from './locales/fr.json';
import tr from './locales/tr.json';

export type Language = 'en' | 'fr' | 'tr';

const translations = { en, fr, tr };

type TranslationContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('tr');

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    const keys = key.split('.');
    let translation = translations[language] as any;

    for (const k of keys) {
      translation = translation?.[k];
      if (translation === undefined) {
        // Fallback to English if translation is not found
        let fallbackTranslation = translations.en as any;
        for (const fk of keys) {
            fallbackTranslation = fallbackTranslation?.[fk];
            if(fallbackTranslation === undefined) return key;
        }
        translation = fallbackTranslation;
        break;
      }
    }
    
    let result = translation || key;

    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            result = result.replace(`{{${rKey}}}`, String(replacements[rKey]));
        });
    }

    return result;
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
