import { I18nProvider } from "@/components/i18n-provider";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <I18nProvider locale={params.locale as Locale}>
      {children}
    </I18nProvider>
  );
}
