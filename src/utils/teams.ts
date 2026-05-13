import type { Locale } from '../config/site';
import type { WorldCupMatch } from '../data/worldcup2026';
import { isKnownCountry } from '../i18n/countries';
import { getLocalizedPath, translate } from '../i18n/ui';
import { normalizeSlug } from './slugs';

export interface TeamSummary {
  name: string;
  matches: WorldCupMatch[];
  groups: string[];
}

export function getTeamSlug(team: string) {
  return normalizeSlug(team);
}

export function getTeamPath(team: string, locale: Locale) {
  return getLocalizedPath(`${translate(locale, 'routes.teams')}/${getTeamSlug(team)}`, locale);
}

export function getTeamsFromMatches(matches: WorldCupMatch[]): TeamSummary[] {
  const teams = new Map<string, TeamSummary>();

  matches.forEach((match) => {
    [match.team1, match.team2].forEach((team) => {
      if (!isKnownCountry(team)) {
        return;
      }

      const teamSummary = teams.get(team) ?? { name: team, matches: [], groups: [] };
      teamSummary.matches.push(match);

      if (match.group && !teamSummary.groups.includes(match.group)) {
        teamSummary.groups.push(match.group);
      }

      teams.set(team, teamSummary);
    });
  });

  return [...teams.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getTeamBySlug(matches: WorldCupMatch[], slug: string) {
  return getTeamsFromMatches(matches).find((team) => getTeamSlug(team.name) === slug);
}
