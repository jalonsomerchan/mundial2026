import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('simulator performance checks', () => {
  it('uses the optimized simulator component on localized pages', () => {
    const spanishPage = readText('src/pages/simulador/index.astro');
    const englishPage = readText('src/pages/en/simulator/index.astro');

    assert.match(spanishPage, /WorldCupSimulatorOptimized/);
    assert.match(englishPage, /WorldCupSimulatorOptimized/);
    assert.doesNotMatch(spanishPage, /<SimulatorKnockoutPatch/);
    assert.doesNotMatch(englishPage, /<SimulatorKnockoutPatch/);
  });

  it('keeps simulator logic split into small focused scripts', () => {
    ['src/scripts/simulator-model.ts', 'src/scripts/simulator-dom.ts'].forEach((path) => {
      assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
    });

    const model = readText('src/scripts/simulator-model.ts');
    const dom = readText('src/scripts/simulator-dom.ts');
    const component = readText('src/components/WorldCupSimulatorOptimized.astro');

    assert.match(model, /randomizePicks/);
    assert.match(model, /buildContext/);
    assert.match(dom, /replaceChildren/);
    assert.match(dom, /worldCupSimulator/);
    assert.match(dom, /simulator:picks-loaded/);
    assert.match(component, /simulator-dom/);
  });

  it('avoids the old mutation-observer patch on optimized pages', () => {
    const dom = readText('src/scripts/simulator-dom.ts');

    assert.doesNotMatch(dom, /MutationObserver/);
    assert.doesNotMatch(dom, /innerHTML\s*=/);
  });

  it('adds rendering containment for the simulator board', () => {
    const component = readText('src/components/WorldCupSimulatorOptimized.astro');

    assert.match(component, /content-visibility:\s*auto/);
    assert.match(component, /contain-intrinsic-size/);
  });
});
