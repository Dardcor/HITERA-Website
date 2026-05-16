'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { t } from '@/lib/translations';
import { Locale } from 'date-fns';
import { id, enUS, ms, ja, zhCN } from 'date-fns/locale';

const LOCALE_TAG_MAP: Record<string, string> = {
  id: 'id-ID',
  en: 'en-US',
  ms: 'ms-MY',
  ja: 'ja-JP',
  zh: 'zh-CN',
};

const DATE_FNS_LOCALE_MAP: Record<string, Locale> = {
  id,
  en: enUS,
  ms,
  ja,
  zh: zhCN,
};

interface LanguageContextType {
  t: (key: string) => string;
  locale: string;
  localeTag: string;
  dateFnsLocale: Locale;
  changeLanguage: (newLocale: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType>({
  t: (key) => key,
  locale: 'id',
  localeTag: 'id-ID',
  dateFnsLocale: id,
  changeLanguage: async () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { settings, loading, updateSettings } = useSettings();
  const [locale, setLocale] = useState('id');

  useEffect(() => {
    if (!loading && settings?.bahasa) {
      setLocale(settings.bahasa);
    }
  }, [settings, loading]);

  const translate = (key: string) => t(key, locale);
  const localeTag = LOCALE_TAG_MAP[locale] ?? 'id-ID';
  const dateFnsLocale = DATE_FNS_LOCALE_MAP[locale] ?? id;

  const changeLanguage = async (newLocale: string) => {
    setLocale(newLocale);
    await updateSettings({ bahasa: newLocale });
  };

  return (
    <LanguageContext.Provider value={{ t: translate, locale, localeTag, dateFnsLocale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}