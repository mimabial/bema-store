'use client';

import { useRouter, usePathname } from 'next/navigation';
import { I18nContext, type Locale, translate } from '@/lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
  locale: Locale;
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = (newLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale; 
    router.push(segments.join('/'));
  };

  const t = (key: string, values?: Record<string, string>) => 
    translate(locale, key, values);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
