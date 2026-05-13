import type { Locale } from '../config/site';
import type { WorldCupGroup, WorldCupMatch } from '../data/worldcup2026';
import { getLocalizedPath, translate } from '../i18n/ui';

export interface TeamStanding {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

function normalizeSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getGroupSlug(groupName: string) {
  return normalizeSlug(groupName);
}

export function getGroupPath(groupName: string, locale: Locale) {
  return getLocalizedPath(`${translate(locale, 'routes.groups')}/${getGroupSlug(groupName)}`, locale);
}

function createStanding(team: string): TeamStanding {
  return {
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  };
}

function applyResult(standing: TeamStanding, goalsFor: number, goalsAgainst: number) {
  standing.played += 1;
  standing.goalsFor += goalsFor;
  standing.goalsAgainst += goalsAgainst;
  standing.goalDifference = standing.goalsFor - standing.goalsAgainst;

  if (goalsFor > goalsAgainst) {
    standing.won += 1;
    standing.points += 3;
  } else if (goalsFor === goalsAgainst) {
    standing.drawn += 1;
    standing.points += 1;
  } else {
    standing.lost += 1;
  }
}

export function getGroupStandings(group: WorldCupGroup): TeamStanding[] {
  const standings = new Map<string, TeamStanding>();

  group.teams.forEach((team) => standings.set(team, createStanding(team)));

  group.matches.forEach((match: WorldCupMatch) => {
    if (match.score1 === undefined || match.score2 === undefined) {
      return;
    }

    const team1 = standings.get(match.team1) ?? createStanding(match.team1);
    const team2 = standings.get(match.team2) ?? createStanding(match.team2);

    applyResult(team1, match.score1, match.score2);
    applyResult(team2, match.score2, match.score1);

    standings.set(match.team1, team1);
    standings.set(match.team2, team2);
  });

  return [...standings.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.team.localeCompare(b.team);
  });
}
