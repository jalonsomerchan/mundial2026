export const defaultLocale = 'es' as const;
export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const siteConfig = {
  name: 'Mundial 2026',
  description: 'Consulta partidos, grupos, sedes y selecciones del Mundial 2026.',
  url: import.meta.env.ASTRO_SITE ?? 'https://jalonsomerchan.github.io',
  base: import.meta.env.ASTRO_BASE ?? '/',
  author: 'Jorge Alonso',
  defaultLocale,
  locales,
};

export type SiteConfig = typeof siteConfig;
