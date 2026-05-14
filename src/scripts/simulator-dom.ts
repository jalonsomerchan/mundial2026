import {
  buildContext,
  getChampion,
  getPickedWinner,
  getRealWinner,
  getTeams,
  randomizePicks,
  type SimulatorContext,
  type SimulatorLabels,
  type SimulatorMatch,
  type SimulatorPicks,
  type SimulatorStanding,
  type SimulatorTeam,
} from './simulator-model';

interface SimulatorPayload {
  labels: SimulatorLabels;
  matches: SimulatorMatch[];
}

const storageKey = 'worldcup-2026-simulator-v1';
const payloadElement = document.getElementById('worldcup-simulator-data');
const payload = JSON.parse(payloadElement?.textContent || '{}') as SimulatorPayload;
const matches = payload.matches ?? [];
const labels = (payload.labels ?? {}) as SimulatorLabels;
const board = document.querySelector<HTMLElement>('[data-simulator-board]');
const championNode = document.querySelector<HTMLElement>('[data-simulator-champion]');
const resetButton = document.querySelector<HTMLButtonElement>('[data-reset-simulator]');
let picks = readPicks();

function readPicks(): SimulatorPicks {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

function savePicks() {
  localStorage.setItem(storageKey, JSON.stringify(picks));
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function setTeam(node: HTMLElement, team: SimulatorTeam | null) {
  node.replaceChildren();

  if (!team) {
    const placeholder = el('span', 'team-placeholder');
    placeholder.textContent = labels.unresolvedTeam;
    node.append(placeholder);
    return;
  }

  if (team.flag) {
    const flag = document.createElement('img');
    flag.src = team.flag;
    flag.width = 30;
    flag.height = 30;
    flag.alt = '';
    flag.loading = 'lazy';
    flag.decoding = 'async';
    node.append(flag);
  }

  const name = document.createElement('span');
  name.textContent = team.label || team.raw;
  node.append(name);
}

function getMatchLabel(match: SimulatorMatch, context: SimulatorContext) {
  const [team1, team2] = getTeams(match, context);
  return `${team1?.label ?? labels.unresolvedTeam} vs ${team2?.label ?? labels.unresolvedTeam}`;
}

function createMatchCard(match: SimulatorMatch) {
  const card = el('article', 'sim-match');
  card.dataset.matchId = match.id;

  const head = el('div', 'sim-match-head');
  const round = el('span', 'sim-match-round');
  const status = el('small', 'sim-status');
  round.textContent = match.group ?? match.round;
  head.append(round, status);

  const options = el('div', 'sim-options');
  const team1 = document.createElement('button');
  const versus = el('span', 'sim-versus');
  const team2 = document.createElement('button');
  versus.textContent = 'vs';

  [team1, team2].forEach((button) => {
    button.className = 'sim-team';
    button.type = 'button';
    button.dataset.pick = match.id;
  });

  options.append(team1, versus, team2);
  card.append(head, options);

  return card;
}

function createRoundSection(title: string, subtitle: string, roundMatches: SimulatorMatch[]) {
  const section = el('section', 'sim-round');
  const header = document.createElement('header');
  const copy = document.createElement('div');
  const eyebrow = document.createElement('p');
  const heading = document.createElement('h2');
  const count = document.createElement('span');
  const grid = el('div', 'sim-round-grid');
  const headingId = `sim-round-${roundMatches[0]?.id ?? title}`;

  section.setAttribute('aria-labelledby', headingId);
  eyebrow.textContent = subtitle;
  heading.id = headingId;
  heading.textContent = title;
  count.textContent = String(roundMatches.length);
  copy.append(eyebrow, heading);
  header.append(copy, count);
  roundMatches.forEach((match) => grid.append(createMatchCard(match)));
  section.append(header, grid);

  return section;
}

function createStandingsSection(context: SimulatorContext) {
  const section = el('section', 'sim-round standings-round');
  const header = document.createElement('header');
  const copy = document.createElement('div');
  const eyebrow = document.createElement('p');
  const heading = document.createElement('h2');
  const count = document.createElement('span');
  const grid = el('div', 'sim-groups-grid');

  section.setAttribute('aria-labelledby', 'sim-standings-title');
  eyebrow.textContent = labels.pickWinner;
  heading.id = 'sim-standings-title';
  heading.textContent = labels.groupStage;
  count.textContent = String(context.groupStandings.size);
  copy.append(eyebrow, heading);
  header.append(copy, count);

  context.groupStandings.forEach((standings, groupCode) => grid.append(createGroupTable(groupCode, standings)));
  section.append(header, grid);

  return section;
}

function createGroupTable(groupCode: string, standings: SimulatorStanding[]) {
  const section = el('section', 'sim-group-table');
  const title = document.createElement('h3');
  const list = document.createElement('ol');

  title.textContent = `Grupo ${groupCode}`;
  standings.forEach((standing, index) => {
    const item = document.createElement('li');
    const team = el('span', 'standing-team');
    const points = document.createElement('strong');

    item.className = index < 2 ? 'is-qualified' : index === 2 ? 'is-third' : '';
    setTeam(team, standing.team);
    points.textContent = String(standing.points);
    item.append(team, points);
    list.append(item);
  });

  section.append(title, list);
  return section;
}

function getRounds() {
  const rounds = new Map<string, SimulatorMatch[]>();

  matches.forEach((match) => {
    const key = match.group ? labels.groupStage : match.round || labels.knockoutStage;
    const roundMatches = rounds.get(key) ?? [];
    roundMatches.push(match);
    rounds.set(key, roundMatches);
  });

  return rounds;
}

function createBoard() {
  if (!board) return;

  const context = buildContext(matches, picks);
  const fragment = document.createDocumentFragment();
  fragment.append(createStandingsSection(context));

  getRounds().forEach((roundMatches, round) => {
    fragment.append(
      createRoundSection(
        round,
        round === labels.groupStage ? labels.pickWinner : labels.knockoutStage,
        roundMatches
      )
    );
  });

  board.replaceChildren(fragment);
  refreshBoard(context);
}

function refreshChampion(context: SimulatorContext) {
  const champion = getChampion(matches, context);

  if (!championNode) return;
  championNode.replaceChildren();
  if (champion) {
    setTeam(championNode, champion);
  } else {
    championNode.textContent = labels.noChampion;
  }
}

function refreshStandings(context: SimulatorContext) {
  const standingsSection = board?.querySelector('.standings-round');
  const grid = standingsSection?.querySelector('.sim-groups-grid');

  if (!grid) return;
  const fragment = document.createDocumentFragment();
  context.groupStandings.forEach((standings, groupCode) => fragment.append(createGroupTable(groupCode, standings)));
  grid.replaceChildren(fragment);
}

function refreshMatch(match: SimulatorMatch, context: SimulatorContext) {
  const card = board?.querySelector<HTMLElement>(`[data-match-id="${match.id}"]`);
  if (!card) return;

  const buttons = card.querySelectorAll<HTMLButtonElement>('[data-pick]');
  const status = card.querySelector<HTMLElement>('.sim-status');
  const [team1, team2] = getTeams(match, context);
  const realWinner = getRealWinner(match, context);
  const pickedWinner = getPickedWinner(match, context);
  const winner = realWinner ?? pickedWinner;
  const canPick = Boolean(team1 && team2 && !realWinner);
  const statusClass = realWinner ? 'status-real' : pickedWinner ? 'status-simulated' : 'status-pending';
  const matchLabel = getMatchLabel(match, context);

  card.classList.toggle('is-decided', Boolean(winner));
  card.classList.toggle('is-locked', Boolean(realWinner));
  card.setAttribute('aria-label', matchLabel);

  if (status) {
    status.className = `sim-status ${statusClass}`;
    status.textContent = realWinner ? labels.realResult : pickedWinner ? labels.simulated : labels.pending;
  }

  [team1, team2].forEach((team, index) => {
    const button = buttons[index];
    if (!button) return;

    button.dataset.team = team?.raw ?? '';
    button.disabled = !canPick;
    button.setAttribute('aria-pressed', winner?.raw === team?.raw ? 'true' : 'false');
    button.setAttribute(
      'aria-label',
      team ? labels.pickWinnerForMatch.replace('{team}', team.label).replace('{match}', matchLabel) : labels.unresolvedTeam
    );
    button.classList.toggle('is-selected', winner?.raw === team?.raw);
    setTeam(button, team);
  });
}

function refreshBoard(context = buildContext(matches, picks)) {
  refreshChampion(context);
  refreshStandings(context);
  matches.forEach((match) => refreshMatch(match, context));
}

function reloadStoredPicks() {
  picks = readPicks();
  refreshBoard();
}

function dispatchUpdate() {
  document.dispatchEvent(new CustomEvent('simulator:picks-updated'));
}

function pick(matchId: string, team: string) {
  picks[matchId] = team;
  savePicks();
  refreshBoard();
  dispatchUpdate();
}

board?.addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLButtonElement>('[data-pick]');
  if (!button || button.disabled) return;

  const matchId = button.dataset.pick;
  const team = button.dataset.team;
  if (!matchId || !team) return;

  pick(matchId, team);
});

resetButton?.addEventListener('click', () => {
  picks = {};
  savePicks();
  refreshBoard();
  dispatchUpdate();
});

document.addEventListener('simulator:picks-loaded', reloadStoredPicks);

window.worldCupSimulator = {
  clear() {
    picks = {};
    savePicks();
    refreshBoard();
    dispatchUpdate();
  },
  randomize() {
    picks = randomizePicks(matches, picks);
    savePicks();
    refreshBoard();
    dispatchUpdate();
  },
};

createBoard();

declare global {
  interface Window {
    worldCupSimulator?: {
      clear: () => void;
      randomize: () => void;
    };
  }
}
