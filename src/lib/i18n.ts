import { createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const locales = ['en', 'fr'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

// Import messages
import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';

const messages = {
  en: enMessages,
  fr: frMessages,
} as const;

// Get nested value using dot notation
function getValue(obj: any, path: string): string {
  return path.split('.').reduce((o, p) => o?.[p], obj) || path;
}

export function translate(locale: Locale, key: string, values?: Record<string, string>): string {
  const msgs = messages[locale] || messages[defaultLocale];
  let text = getValue(msgs, key);
  
  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
  }
  
  return text;
}

// Context
export const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string>) => string;
}>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key: string) => key,
});

export const useI18n = () => useContext(I18nContext);

// Navigation hook that preserves locale
export function useLocalizedRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useI18n();
  
  const push = (href: string) => {
    router.push(`/${locale}${href}`);
  };
  
  const replace = (href: string) => {
    router.replace(`/${locale}${href}`);
  };
  
  return { push, replace, pathname: pathname.slice(3) }; // Remove locale prefix
}
