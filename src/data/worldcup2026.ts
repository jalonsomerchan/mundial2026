export interface WorldCupMatch {
  round: string;
  num?: number;
  date: string;
  time: string;
  team1: string;
  team2: string;
  group?: string;
  ground: string;
}

interface WorldCupApiResponse {
  name: string;
  matches: WorldCupMatch[];
}

export interface WorldCupGroup {
  name: string;
  teams: string[];
  matches: WorldCupMatch[];
}

export interface WorldCupSummary {
  name: string;
  matches: WorldCupMatch[];
  groups: WorldCupGroup[];
  venues: string[];
  sourceUrl: string;
}

const sourceUrl = 'https://github.com/openfootball/worldcup.json/blob/master/2026/worldcup.json';
const dataUrl = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';

const fallbackData: WorldCupApiResponse = {
  name: 'World Cup 2026',
  matches: [
    {
      round: 'Matchday 1',
      date: '2026-06-11',
      time: '13:00 UTC-6',
      team1: 'Mexico',
      team2: 'South Africa',
      group: 'Group A',
      ground: 'Mexico City',
    },
    {
      round: 'Matchday 2',
      date: '2026-06-12',
      time: '15:00 UTC-4',
      team1: 'Canada',
      team2: 'Bosnia & Herzegovina',
      group: 'Group B',
      ground: 'Toronto',
    },
    {
      round: 'Matchday 3',
      date: '2026-06-13',
      time: '18:00 UTC-4',
      team1: 'Brazil',
      team2: 'Morocco',
      group: 'Group C',
      ground: 'New York/New Jersey (East Rutherford)',
    },
    {
      round: 'Matchday 5',
      date: '2026-06-15',
      time: '12:00 UTC-4',
      team1: 'Spain',
      team2: 'Cape Verde',
      group: 'Group H',
      ground: 'Atlanta',
    },
    {
      round: 'Matchday 7',
      date: '2026-06-17',
      time: '15:00 UTC-5',
      team1: 'England',
      team2: 'Croatia',
      group: 'Group L',
      ground: 'Dallas (Arlington)',
    },
    {
      round: 'Round of 32',
      num: 73,
      date: '2026-06-28',
      time: '12:00 UTC-7',
      team1: '2A',
      team2: '2B',
      ground: 'Los Angeles (Inglewood)',
    },
    {
      round: 'Final',
      num: 104,
      date: '2026-07-19',
      time: '15:00 UTC-4',
      team1: 'W102',
      team2: 'W103',
      ground: 'New York/New Jersey (East Rutherford)',
    },
  ],
};

function isWorldCupData(data: unknown): data is WorldCupApiResponse {
  return Boolean(
    data &&
      typeof data === 'object' &&
      'matches' in data &&
      Array.isArray((data as WorldCupApiResponse).matches)
  );
}

function sortMatches(matches: WorldCupMatch[]) {
  return [...matches].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);

    if (byDate !== 0) {
      return byDate;
    }

    return a.time.localeCompare(b.time);
  });
}

function getGroups(matches: WorldCupMatch[]): WorldCupGroup[] {
  const groups = new Map<string, WorldCupGroup>();

  matches
    .filter((match) => match.group)
    .forEach((match) => {
      const groupName = match.group as string;
      const group = groups.get(groupName) ?? { name: groupName, teams: [], matches: [] };

      [match.team1, match.team2].forEach((team) => {
        if (!group.teams.includes(team)) {
          group.teams.push(team);
        }
      });

      group.matches.push(match);
      groups.set(groupName, group);
    });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      teams: group.teams.sort((a, b) => a.localeCompare(b)),
      matches: sortMatches(group.matches),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getWorldCupSummary(): Promise<WorldCupSummary> {
  let data = fallbackData;

  try {
    const response = await fetch(dataUrl);
    const remoteData: unknown = await response.json();

    if (response.ok && isWorldCupData(remoteData)) {
      data = remoteData;
    }
  } catch {
    data = fallbackData;
  }

  const matches = sortMatches(data.matches);
  const venues = [...new Set(matches.map((match) => match.ground))].sort((a, b) => a.localeCompare(b));

  return {
    name: data.name,
    matches,
    groups: getGroups(matches),
    venues,
    sourceUrl,
  };
}
