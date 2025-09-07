import {getRequestConfig} from 'next-intl/server';
import {type Locale} from "~/types";
import {routing} from "~/i18n/routing";
type AbstractIntlMessages = {   [p: string]: AbstractIntlMessages | string }


export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    messages: (await import(`../../messages/${locale}.json`)).default as AbstractIntlMessages | undefined,
  };
});