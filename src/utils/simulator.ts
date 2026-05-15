import type { Locale } from '../config/site';
import type { WorldCupMatch } from '../data/worldcup2026';
import { getCountryFlagUrl, getCountryName, isKnownCountry } from '../i18n/countries';
import type { SimulatorMatch, SimulatorTeam } from '../scripts/simulator-model';

function getGroupCode(groupName?: string) {
  return groupName?.match(/[A-Z]$/)?.[0] ?? '';
}

function getMatchId(match: WorldCupMatch, index: number) {
  return match.num ? `m${match.num}` : `i${index}`;
}

export function getSimulatorTeam(team: string, locale: Locale): SimulatorTeam {
  return {
    raw: team,
    label: getCountryName(team, locale),
    flag: getCountryFlagUrl(team),
    isCountry: isKnownCountry(team),
  };
}

export function getSimulatorMatches(matches: WorldCupMatch[], locale: Locale): SimulatorMatch[] {
  return matches.map((match, index) => ({
    id: getMatchId(match, index),
    index,
    num: match.num ?? null,
    round: match.round,
    group: match.group ?? null,
    groupCode: getGroupCode(match.group),
    team1: getSimulatorTeam(match.team1, locale),
    team2: getSimulatorTeam(match.team2, locale),
    score1: match.score1 ?? null,
    score2: match.score2 ?? null,
  }));
}
