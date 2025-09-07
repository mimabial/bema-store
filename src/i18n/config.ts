import type {Pathnames} from 'next-intl/routing';

export const port = process.env.PORT ?? 3000;
export const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${port}`;

export const defaultLocale = 'en';
export const locales = ['en', 'fr'] as const;
export type Locale= typeof locales[number];
export const pathnames = {
  '/': '/',
  '/cart': {
    en: '/cart',
    fr: '/panier'
  },
  '/checkout': {
    en: '/checkout',
    fr: '/paiement'
  },
  '/dashboard': {
    en: '/dashboard',
    fr: '/tableau-de-bord'
  },
  '/products': {
    en: '/products',
    fr: '/produits'
  },
  '/products/:id': {
    en: '/products/:id',
    fr: '/produits/:id'
  },
  '/login': {
    en: '/login',
    fr: '/connexion'
  },

} satisfies Pathnames<typeof locales>;

export const localePrefix = 'always'