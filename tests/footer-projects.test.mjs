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

describe('AlonSoftware footer projects', () => {
  it('keeps footer projects in a small data module', () => {
    const path = 'src/data/alonsoftwareProjects.ts';
    const projects = readText(path);

    assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    assert.match(projects, /footerTools/);
    assert.match(projects, /footerGames/);
    assert.match(projects, /https:\/\/eurovision\.alon\.one/);
    assert.match(projects, /https:\/\/mundial2026\.alon\.one/);
  });

  it('wires the footer to project groups and translated labels', () => {
    const footer = readText('src/components/Footer.astro');

    assert.match(footer, /footerTools/);
    assert.match(footer, /footerGames/);
    assert.match(footer, /footer\.eyebrow/);
    assert.match(footer, /footer\.openProject/);
    assert.match(footer, /site-footer__projects/);
    assert.match(footer, /noopener noreferrer/);
  });

  it('keeps footer labels translated in all configured locales', () => {
    ['es', 'en'].forEach((locale) => {
      const translations = readJson(`src/i18n/translations/${locale}.json`);

      [
        'footer.eyebrow',
        'footer.title',
        'footer.copy',
        'footer.tools',
        'footer.games',
        'footer.openProject',
      ].forEach((key) => {
        assert.ok(translations[key], `${locale}.json should include ${key}`);
      });
    });
  });
});
