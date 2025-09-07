import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
import {locales, pathnames, localePrefix, defaultLocale} from "~/i18n/config";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
  pathnames,
  localePrefix,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);