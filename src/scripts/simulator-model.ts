export interface SimulatorTeam {
  raw: string;
  label: string;
  flag: string | null;
  isCountry: boolean;
}

export interface SimulatorMatch {
  id: string;
  index: number;
  num: number | null;
  round: string;
  group: string | null;
  groupCode: string;
  team1: SimulatorTeam;
  team2: SimulatorTeam;
  score1: number | null;
  score2: number | null;
}

export interface SimulatorLabels {
  pickWinner: string;
  simulated: string;
  realResult: string;
  pending: string;
  noChampion: string;
  unresolvedTeam: string;
  groupStage: string;
  knockoutStage: string;
}

export type SimulatorPicks = Record<string, string>;

export interface SimulatorStanding {
  team: SimulatorTeam;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface SimulatorContext {
  groupStandings: Map<string, SimulatorStanding[]>;
  matchByNumber: Map<string, SimulatorMatch>;
  picks: SimulatorPicks;
}

export function getMatchNumberMap(matches: SimulatorMatch[]) {
  return new Map(matches.filter((match) => match.num).map((match) => [String(match.num), match]));
}

function makeStanding(team: SimulatorTeam): SimulatorStanding {
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

function applyScore(standing: SimulatorStanding, goalsFor: number, goalsAgainst: number) {
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

function applyPickedWin(team1: SimulatorStanding, team2: SimulatorStanding, winner: SimulatorTeam) {
  if (winner.raw === team1.team.raw) {
    applyScore(team1, 1, 0);
    applyScore(team2, 0, 1);
  } else {
    applyScore(team1, 0, 1);
    applyScore(team2, 1, 0);
  }
}

export function getPickedWinner(match: SimulatorMatch, context: SimulatorContext) {
  const picked = context.picks[match.id];
  const [team1, team2] = getTeams(match, context);

  if (picked === team1?.raw) return team1;
  if (picked === team2?.raw) return team2;
  return null;
}

export function getRealWinner(match: SimulatorMatch, context: SimulatorContext) {
  if (match.score1 === null || match.score2 === null || match.score1 === match.score2) return null;

  const [team1, team2] = getTeams(match, context);
  return match.score1 > match.score2 ? team1 : team2;
}

export function getWinner(match: SimulatorMatch, context: SimulatorContext) {
  return getRealWinner(match, context) ?? getPickedWinner(match, context);
}

export function getGroupStandings(matches: SimulatorMatch[], picks: SimulatorPicks) {
  const groups = new Map<string, Map<string, SimulatorStanding>>();
  const baseContext: SimulatorContext = {
    picks,
    groupStandings: new Map(),
    matchByNumber: getMatchNumberMap(matches),
  };

  matches.filter((match) => match.group).forEach((match) => {
    const group = groups.get(match.groupCode) ?? new Map<string, SimulatorStanding>();

    [match.team1, match.team2].forEach((team) => {
      if (team.isCountry && !group.has(team.raw)) {
        group.set(team.raw, makeStanding(team));
      }
    });

    groups.set(match.groupCode, group);
  });

  matches.filter((match) => match.group).forEach((match) => {
    const group = groups.get(match.groupCode);
    const standing1 = group?.get(match.team1.raw);
    const standing2 = group?.get(match.team2.raw);

    if (!standing1 || !standing2) return;

    if (match.score1 !== null && match.score2 !== null) {
      applyScore(standing1, match.score1, match.score2);
      applyScore(standing2, match.score2, match.score1);
      return;
    }

    const winner = getPickedWinner(match, baseContext);
    if (winner) applyPickedWin(standing1, standing2, winner);
  });

  return new Map(
    [...groups.entries()].map(([groupCode, standings]) => [
      groupCode,
      [...standings.values()].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.team.label.localeCompare(b.team.label);
      }),
    ])
  );
}

export function buildContext(matches: SimulatorMatch[], picks: SimulatorPicks): SimulatorContext {
  return {
    picks,
    groupStandings: getGroupStandings(matches, picks),
    matchByNumber: getMatchNumberMap(matches),
  };
}

export function resolveTeam(team: SimulatorTeam, context: SimulatorContext): SimulatorTeam | null {
  if (team.isCountry) return team;

  const winnerMatch = team.raw.match(/^W(\d+)$/);
  if (winnerMatch) {
    const source = context.matchByNumber.get(winnerMatch[1]);
    return source ? getWinner(source, context) : null;
  }

  const loserMatch = team.raw.match(/^L(\d+)$/);
  if (loserMatch) {
    const source = context.matchByNumber.get(loserMatch[1]);
    const winner = source ? getWinner(source, context) : null;
    const [team1, team2] = source ? getTeams(source, context) : [];

    if (!winner || !team1 || !team2) return null;
    return winner.raw === team1.raw ? team2 : team1;
  }

  const groupPosition = team.raw.match(/^([123])([A-L](?:\/[A-L])*)$/);
  if (!groupPosition) return null;

  const position = Number(groupPosition[1]);
  const groupCodes = groupPosition[2].split('/');

  if (position === 3 && groupCodes.length > 1) {
    return groupCodes
      .map((code) => context.groupStandings.get(code)?.[2])
      .filter((standing): standing is SimulatorStanding => Boolean(standing))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return a.team.label.localeCompare(b.team.label);
      })[0]?.team ?? null;
  }

  return context.groupStandings.get(groupCodes[0])?.[position - 1]?.team ?? null;
}

export function getTeams(match: SimulatorMatch, context: SimulatorContext) {
  return [resolveTeam(match.team1, context), resolveTeam(match.team2, context)] as const;
}

export function getChampion(matches: SimulatorMatch[], context: SimulatorContext) {
  const finalMatch = matches.find((match) => /final/i.test(match.round));
  return finalMatch ? getWinner(finalMatch, context) : null;
}

export function randomizePicks(matches: SimulatorMatch[], initialPicks: SimulatorPicks) {
  const picks = { ...initialPicks };

  for (let guard = 0; guard < 24; guard += 1) {
    let changed = false;
    const context = buildContext(matches, picks);

    matches.forEach((match) => {
      if (match.score1 !== null && match.score2 !== null) return;
      if (getPickedWinner(match, context)) return;

      const [team1, team2] = getTeams(match, context);
      if (!team1 || !team2) return;

      picks[match.id] = Math.random() > 0.5 ? team1.raw : team2.raw;
      changed = true;
    });

    if (!changed) break;
  }

  return picks;
}
