'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { t } from '@/lib/translations';

interface LanguageContextType {
  t: (key: string) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextType>({
  t: (key) => key,
  locale: 'id',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { settings, loading } = useSettings();
  const [locale, setLocale] = useState('id');

  useEffect(() => {
    if (!loading && settings?.bahasa) {
      setLocale(settings.bahasa);
    }
  }, [settings, loading]);

  const translate = (key: string) => t(key, locale);

  return (
    <LanguageContext.Provider value={{ t: translate, locale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}