import type { WorldCupMatch } from '../data/worldcup2026';

export interface MatchDay {
  date: string;
  matches: WorldCupMatch[];
}

export function groupMatchesByDate(matches: WorldCupMatch[]): MatchDay[] {
  const grouped = new Map<string, WorldCupMatch[]>();

  matches.forEach((match) => {
    const dayMatches = grouped.get(match.date) ?? [];
    dayMatches.push(match);
    grouped.set(match.date, dayMatches);
  });

  return [...grouped.entries()]
    .map(([date, dayMatches]) => ({
      date,
      matches: [...dayMatches].sort((a, b) => a.time.localeCompare(b.time)),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
