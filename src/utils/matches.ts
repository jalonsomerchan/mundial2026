import type { WorldCupMatch } from '../data/worldcup2026';

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
