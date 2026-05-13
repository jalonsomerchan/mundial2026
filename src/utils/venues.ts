import type { Locale } from '../config/site';
import type { WorldCupMatch } from '../data/worldcup2026';
import { getLocalizedPath, translate } from '../i18n/ui';
import { normalizeSlug } from './slugs';

export interface VenueSummary {
  name: string;
  matches: WorldCupMatch[];
}

export function getVenueSlug(venue: string) {
  return normalizeSlug(venue);
}

export function getVenuePath(venue: string, locale: Locale) {
  return getLocalizedPath(`${translate(locale, 'routes.venues')}/${getVenueSlug(venue)}`, locale);
}

export function getVenuesFromMatches(matches: WorldCupMatch[]): VenueSummary[] {
  const venues = new Map<string, VenueSummary>();

  matches.forEach((match) => {
    const venue = venues.get(match.ground) ?? { name: match.ground, matches: [] };
    venue.matches.push(match);
    venues.set(match.ground, venue);
  });

  return [...venues.values()].sort((a, b) => a.name.localeCompare(b.name));
}
