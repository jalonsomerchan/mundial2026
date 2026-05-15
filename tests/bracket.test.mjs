import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

function readJson(path) {
  return JSON.parse(readText(path));
}

describe('localized bracket page', () => {
  it('keeps the localized bracket routes and components available', () => {
    [
      'src/pages/cuadro/index.astro',
      'src/pages/en/bracket/index.astro',
      'src/components/WorldCupBracket.astro',
      'src/components/BracketBoard.astro',
      'src/components/BracketRoundSection.astro',
      'src/components/BracketMatchCard.astro',
      'src/components/BracketTeam.astro',
      'src/utils/bracket.ts',
      'src/utils/simulator.ts',
    ].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });
  });

  it('uses shared simulator helpers to resolve knockout slots', () => {
    const bracketUtils = readText('src/utils/bracket.ts');
    const simulatorUtils = readText('src/utils/simulator.ts');
    const simulator = readText('src/components/WorldCupSimulatorOptimized.astro');

    assert.match(bracketUtils, /buildContext/);
    assert.match(bracketUtils, /getTeams/);
    assert.match(bracketUtils, /getKnockoutMatches/);
    assert.match(bracketUtils, /getBracketRounds/);
    assert.match(bracketUtils, /Ronda de 32/);
    assert.match(simulatorUtils, /getSimulatorMatches/);
    assert.match(simulator, /getSimulatorMatches/);
  });

  it('renders accessible bracket rounds, match cards and team links', () => {
    const page = readText('src/components/WorldCupBracket.astro');
    const board = readText('src/components/BracketBoard.astro');
    const round = readText('src/components/BracketRoundSection.astro');
    const card = readText('src/components/BracketMatchCard.astro');
    const team = readText('src/components/BracketTeam.astro');

    assert.match(page, /Breadcrumbs/);
    assert.match(page, /ContextualLinks/);
    assert.match(page, /BracketBoard/);
    assert.match(page, /accessibleListTitle/);
    assert.match(page, /round-nav/);
    assert.match(board, /data-bracket-viewport/);
    assert.match(board, /data-bracket-stage/);
    assert.match(board, /data-bracket-zoom-in/);
    assert.match(board, /pointerdown/);
    assert.match(board, /touch-action:\s*none/);
    assert.match(round, /aria-labelledby/);
    assert.match(round, /role="list"/);
    assert.match(card, /compact\?: boolean/);
    assert.match(card, /aria-labelledby/);
    assert.match(card, /getMatchPath/);
    assert.match(card, /VenueLink/);
    assert.match(team, /TeamLink/);
  });

  it('keeps bracket route, nav and SEO labels translated', () => {
    ['es', 'en'].forEach((locale) => {
      const translations = readJson(`src/i18n/translations/${locale}.json`);

      assert.ok(translations['nav.bracket'], `${locale} should include nav.bracket`);
      assert.ok(translations['routes.bracket'], `${locale} should include routes.bracket`);
      assert.ok(translations['bracket.metaTitle'], `${locale} should include bracket.metaTitle`);
      assert.ok(translations['bracket.metaDescription'], `${locale} should include bracket.metaDescription`);
      assert.ok(translations['bracket.title'], `${locale} should include bracket.title`);
      assert.ok(translations['bracket.roundNavigation'], `${locale} should include bracket.roundNavigation`);
      assert.ok(translations['bracket.boardTitle'], `${locale} should include bracket.boardTitle`);
      assert.ok(translations['bracket.zoomIn'], `${locale} should include bracket.zoomIn`);
      assert.ok(translations['bracket.accessibleListTitle'], `${locale} should include bracket.accessibleListTitle`);
    });
  });

  it('links the bracket page from the header', () => {
    const header = readText('src/components/Header.astro');

    assert.match(header, /routes\.bracket/);
    assert.match(header, /nav\.bracket/);
    assert.match(header, /bracketUrl/);
  });
});
