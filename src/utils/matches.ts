import type { Locale } from '../config/site';
import type { WorldCupMatch } from '../data/worldcup2026';
import { getLocalizedPath, translate } from '../i18n/ui';
import { normalizeSlug } from './slugs';

export function getMatchUtcIso(match: Pick<WorldCupMatch, 'date' | 'time'>) {
  const timeMatch = match.time.match(/^(\d{1,2}):(\d{2})\s+UTC([+-]\d{1,2})$/);

  if (!timeMatch) {
    return `${match.date}T12:00:00.000Z`;
  }

  const [, hour, minute, offset] = timeMatch;
  const [year, month, day] = match.date.split('-').map(Number);
  const utcHour = Number(hour) - Number(offset);
  const timestamp = Date.UTC(year, month - 1, day, utcHour, Number(minute));

  return new Date(timestamp).toISOString();
}

export function getMatchResult(match: WorldCupMatch) {
  if (match.score1 !== undefined && match.score2 !== undefined) {
    return `${match.score1} - ${match.score2}`;
  }

  return '-';
}

export function getMatchSlug(match: WorldCupMatch) {
  const matchNumber = match.num ? `match-${match.num}` : normalizeSlug(`${match.date}-${match.team1}-${match.team2}`);
  const teams = normalizeSlug(`${match.team1}-${match.team2}`);

  return `${matchNumber}-${teams}`;
}

export function getMatchPath(match: WorldCupMatch, locale: Locale) {
  return getLocalizedPath(`${translate(locale, 'routes.matches')}/${getMatchSlug(match)}`, locale);
}

export function findMatchBySlug(matches: WorldCupMatch[], slug: string) {
  return matches.find((match) => getMatchSlug(match) === slug);
}
