import type { Locale } from '../config/site';
import type { WorldCupMatch } from '../data/worldcup2026';
import { buildContext, getTeams, type SimulatorMatch, type SimulatorPicks, type SimulatorTeam } from '../scripts/simulator-model';

export interface BracketMatch {
  match: WorldCupMatch;
  simulatorMatch: SimulatorMatch;
  team1: SimulatorTeam | null;
  team2: SimulatorTeam | null;
}

export interface BracketRound {
  id: string;
  name: string;
  matches: BracketMatch[];
}

const roundOrder = ['Round of 32', 'Round of 16', 'Quarter-finals', 'Semi-finals', 'Third-place play-off', 'Final'];

function normalizeRoundId(round: string) {
  return round.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function getKnockoutMatches(matches: WorldCupMatch[]) {
  return matches.filter((match) => !match.group);
}

export function getRoundLabel(round: string, locale: Locale) {
  const labels: Record<string, Record<Locale, string>> = {
    'Round of 32': { es: 'Ronda de 32', en: 'Round of 32' },
    'Round of 16': { es: 'Octavos de final', en: 'Round of 16' },
    'Quarter-finals': { es: 'Cuartos de final', en: 'Quarter-finals' },
    'Semi-finals': { es: 'Semifinales', en: 'Semi-finals' },
    'Third-place play-off': { es: 'Tercer puesto', en: 'Third-place play-off' },
    Final: { es: 'Final', en: 'Final' },
  };

  return labels[round]?.[locale] ?? round;
}

export function getBracketRounds(
  matches: WorldCupMatch[],
  simulatorMatches: SimulatorMatch[],
  locale: Locale,
  picks: SimulatorPicks = {}
): BracketRound[] {
  const context = buildContext(simulatorMatches, picks);
  const matchByIndex = new Map(simulatorMatches.map((match) => [match.index, match]));
  const rounds = new Map<string, BracketMatch[]>();

  getKnockoutMatches(matches).forEach((match) => {
    const simulatorMatch = matchByIndex.get(matches.indexOf(match));

    if (!simulatorMatch) return;

    const [team1, team2] = getTeams(simulatorMatch, context);
    const roundMatches = rounds.get(match.round) ?? [];
    roundMatches.push({ match, simulatorMatch, team1, team2 });
    rounds.set(match.round, roundMatches);
  });

  return [...rounds.entries()]
    .sort(([roundA], [roundB]) => {
      const orderA = roundOrder.indexOf(roundA);
      const orderB = roundOrder.indexOf(roundB);

      if (orderA !== -1 || orderB !== -1) {
        return (orderA === -1 ? Number.MAX_SAFE_INTEGER : orderA) - (orderB === -1 ? Number.MAX_SAFE_INTEGER : orderB);
      }

      return roundA.localeCompare(roundB);
    })
    .map(([round, roundMatches]) => ({
      id: normalizeRoundId(round),
      name: getRoundLabel(round, locale),
      matches: roundMatches.sort((a, b) => (a.match.num ?? 0) - (b.match.num ?? 0)),
    }));
}
