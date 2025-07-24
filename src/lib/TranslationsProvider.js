
'use client';

import { createContext, useContext } from 'react';

const TranslationsContext = createContext({});

export const useTranslations = () => {
  const context = useContext(TranslationsContext);

  if (!context || !context.dictionary || !context.locale) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }

  const { dictionary, locale } = context;

  // ✅ Use flat key directly (no splitting)
  const t = (key) => dictionary?.[key] || key;

  return Object.assign(t, { locale });
};


export default function TranslationsProvider({ children, dictionary, locale }) {
  return (
    <TranslationsContext.Provider value={{ dictionary, locale }}>
      {children}
    </TranslationsContext.Provider>
  );
}
