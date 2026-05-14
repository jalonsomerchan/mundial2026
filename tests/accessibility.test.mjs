import { readFileSync } from 'node:fs';
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

describe('base accessibility checks', () => {
  it('keeps layout landmarks and skip link wired', () => {
    const layout = readText('src/layouts/BaseLayout.astro');
    const styles = readText('src/styles/global.css');

    assert.match(layout, /class="skip-link"/);
    assert.match(layout, /href="#main-content"/);
    assert.match(layout, /<main id="main-content"/);
    assert.match(layout, /tabindex="-1"/);
    assert.match(layout, /aria-label=\{t\('a11y\.mainContent'\)\}/);
    assert.match(styles, /\.skip-link/);
    assert.match(styles, /\.sr-only/);
    assert.match(styles, /:focus-visible/);
  });

  it('labels header, language and footer landmarks', () => {
    const header = readText('src/components/Header.astro');
    const footer = readText('src/components/Footer.astro');

    assert.match(header, /aria-label=\{t\('a11y\.primaryNavigation'\)\}/);
    assert.match(header, /aria-label=\{t\('a11y\.languageNavigation'\)\}/);
    assert.match(header, /aria-current/);
    assert.match(header, /hreflang/);
    assert.match(footer, /aria-label=\{t\('a11y\.footerNavigation'\)\}/);
  });

  it('labels calendar rows and match detail links', () => {
    const calendar = readText('src/components/MatchCalendar.astro');
    const row = readText('src/components/CalendarMatchRow.astro');

    assert.match(calendar, /role="list"/);
    assert.match(calendar, /tabindex="-1"/);
    assert.match(calendar, /a11y\.calendarMatchesForDay/);
    assert.match(row, /role="listitem"/);
    assert.match(row, /a11y\.openMatchDetails/);
    assert.match(row, /aria-label=\{detailLabel\}/);
  });

  it('labels simulator regions and generated winner buttons', () => {
    const simulator = readText('src/components/WorldCupSimulatorOptimized.astro');
    const randomizer = readText('src/components/SimulatorRandomizer.astro');
    const model = readText('src/scripts/simulator-model.ts');
    const dom = readText('src/scripts/simulator-dom.ts');

    assert.match(simulator, /aria-labelledby="simulator-title"/);
    assert.match(simulator, /role="region"/);
    assert.match(simulator, /a11y\.simulatorBoard/);
    assert.match(randomizer, /role="group"/);
    assert.match(randomizer, /actionsLabel/);
    assert.match(model, /pickWinnerForMatch/);
    assert.match(dom, /aria-pressed/);
    assert.match(dom, /pickWinnerForMatch/);
  });

  it('keeps accessibility labels translated in all locales', () => {
    ['es', 'en'].forEach((locale) => {
      const translations = readJson(`src/i18n/translations/${locale}.json`);

      [
        'a11y.skipToContent',
        'a11y.mainContent',
        'a11y.primaryNavigation',
        'a11y.languageNavigation',
        'a11y.changeLanguage',
        'a11y.footerNavigation',
        'a11y.calendarMatchesForDay',
        'a11y.openMatchDetails',
        'a11y.simulatorBoard',
        'a11y.simulatorActions',
        'a11y.pickWinnerForMatch',
      ].forEach((key) => {
        assert.ok(translations[key], `${locale}.json should include ${key}`);
      });
    });
  });
});
