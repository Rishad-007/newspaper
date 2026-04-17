export const APP_LOCALES = ["en", "bn"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];
