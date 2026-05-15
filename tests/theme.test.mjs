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

describe('persistent theme mode', () => {
  it('applies the persisted or system theme before rendering', () => {
    const layout = readText('src/layouts/BaseLayout.astro');

    assert.match(layout, /<meta name="color-scheme" content="light dark"/);
    assert.match(layout, /const storageKey = 'mundial2026-theme'/);
    assert.match(layout, /localStorage\.getItem\(storageKey\)/);
    assert.match(layout, /prefers-color-scheme: dark/);
    assert.match(layout, /root\.dataset\.theme = theme/);
    assert.match(layout, /root\.style\.colorScheme = theme/);
  });

  it('keeps theme tokens compatible with persisted and system preferences', () => {
    const styles = readText('src/styles/global.css');

    assert.match(styles, /:root\[data-theme='dark'\]/);
    assert.match(styles, /:root:not\(\[data-theme\]\)/);
    assert.match(styles, /@media \(prefers-color-scheme: dark\)/);
    assert.match(styles, /color-scheme:\s*dark/);
    assert.match(styles, /--color-text:\s*#f8fafc/);
  });

  it('exposes an accessible and translated header toggle', () => {
    const header = readText('src/components/Header.astro');
    const toggle = readText('src/components/ThemeToggle.astro');

    assert.match(header, /ThemeToggle/);
    assert.match(toggle, /aria-pressed="false"/);
    assert.match(toggle, /aria-label=\{t\('theme\.toggle'\)\}/);
    assert.match(toggle, /localStorage\.setItem\(storageKey, theme\)/);
    assert.match(toggle, /matchMedia\('\(prefers-color-scheme: dark\)'\)/);
    assert.match(toggle, /:focus-visible/);
    assert.match(toggle, /@media \(max-width: 560px\)/);
  });

  it('keeps theme labels translated in every locale', () => {
    ['es', 'en'].forEach((locale) => {
      const translations = readJson(`src/i18n/translations/${locale}.json`);

      assert.ok(translations['theme.toggle'], `${locale} should include theme.toggle`);
      assert.ok(translations['theme.light'], `${locale} should include theme.light`);
      assert.ok(translations['theme.dark'], `${locale} should include theme.dark`);
    });
  });
});
