import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import config from '../configs/theme-to-mode.mjs';
import { applyConfig } from './helpers.mjs';

const apply = (input) => applyConfig(config, input);

describe('theme-to-mode config', () => {
  // ─── setTheme call rewrites ───────────────────────────────────────────────

  describe('setTheme() → initDialtoneTheme() for known identifiers', () => {
    it('rewrites setTheme(DpLight) → initDialtoneTheme(DpLight, \'light\')', () => {
      const input = `setTheme(DpLight);`;
      const expected = `initDialtoneTheme(DpLight, 'light');`;
      assert.equal(apply(input), expected);
    });

    it('rewrites setTheme(DpDark) → initDialtoneTheme(DpDark, \'dark\')', () => {
      const input = `setTheme(DpDark);`;
      const expected = `initDialtoneTheme(DpDark, 'dark');`;
      assert.equal(apply(input), expected);
    });

    it('rewrites setTheme(TmoLight) → initDialtoneTheme(TmoLight, \'light\')', () => {
      const input = `setTheme(TmoLight);`;
      const expected = `initDialtoneTheme(TmoLight, 'light');`;
      assert.equal(apply(input), expected);
    });

    it('rewrites setTheme(TmoDark) → initDialtoneTheme(TmoDark, \'dark\')', () => {
      const input = `setTheme(TmoDark);`;
      const expected = `initDialtoneTheme(TmoDark, 'dark');`;
      assert.equal(apply(input), expected);
    });

    it('rewrites setTheme(ExpressiveLight) → initDialtoneTheme(ExpressiveLight, \'light\')', () => {
      const input = `setTheme(ExpressiveLight);`;
      const expected = `initDialtoneTheme(ExpressiveLight, 'light');`;
      assert.equal(apply(input), expected);
    });

    it('rewrites setTheme(ExpressiveDark) → initDialtoneTheme(ExpressiveDark, \'dark\')', () => {
      const input = `setTheme(ExpressiveDark);`;
      const expected = `initDialtoneTheme(ExpressiveDark, 'dark');`;
      assert.equal(apply(input), expected);
    });

    it('handles whitespace inside setTheme call', () => {
      const input = `setTheme( DpLight );`;
      const expected = `initDialtoneTheme(DpLight, 'light');`;
      assert.equal(apply(input), expected);
    });

    it('rewrites setTheme(DpLight) as part of onMounted setup', () => {
      const input = `onMounted(() => { setTheme(DpLight); });`;
      const expected = `onMounted(() => { initDialtoneTheme(DpLight, 'light'); });`;
      assert.equal(apply(input), expected);
    });

    it('does NOT rewrite setTheme() with a dynamic variable — emits TODO comment', () => {
      const input = `setTheme(myDynamicTheme);`;
      const result = apply(input);
      assert.ok(result.includes('setTheme(myDynamicTheme)'), 'original call preserved');
      assert.ok(result.includes('TODO: review for layered API migration'), 'TODO comment inserted');
    });

    it('does NOT rewrite setTheme() with an expression — emits TODO comment', () => {
      const input = `setTheme(isDark ? DpDark : DpLight);`;
      const result = apply(input);
      assert.ok(result.includes('setTheme(isDark ? DpDark : DpLight)'), 'original call preserved');
      assert.ok(result.includes('TODO: review for layered API migration'), 'TODO comment inserted');
    });

    it('does NOT rewrite myObj.setTheme() — unrelated method', () => {
      const input = `myThemeManager.setTheme(DpLight);`;
      assert.equal(apply(input), input);
    });
  });

  // ─── Attribute renames ────────────────────────────────────────────────────

  describe('data-dt-theme → data-dt-mode in HTML attributes', () => {
    it('rewrites data-dt-theme= in HTML attribute', () => {
      const input = `<html data-dt-theme="dp-light">`;
      const expected = `<html data-dt-mode="dp-light">`;
      assert.equal(apply(input), expected);
    });

    it('rewrites data-dt-theme= with single quotes', () => {
      const input = `<section data-dt-theme='dark'>content</section>`;
      const expected = `<section data-dt-mode='dark'>content</section>`;
      assert.equal(apply(input), expected);
    });

    it('does NOT rewrite data-dt-theme-x (longer attribute with same prefix)', () => {
      const input = `<div data-dt-theme-custom="foo">`;
      assert.equal(apply(input), input);
    });

    it('rewrites data-dt-theme= in Vue template binding (static)', () => {
      const input = `<div data-dt-theme="light">`;
      const expected = `<div data-dt-mode="light">`;
      assert.equal(apply(input), expected);
    });
  });

  describe('data-dt-theme in JS setAttribute/getAttribute', () => {
    it('rewrites setAttribute first argument', () => {
      const input = `el.setAttribute('data-dt-theme', 'dark');`;
      const expected = `el.setAttribute('data-dt-mode', 'dark');`;
      assert.equal(apply(input), expected);
    });

    it('rewrites getAttribute first argument', () => {
      const input = `const mode = el.getAttribute('data-dt-theme');`;
      const expected = `const mode = el.getAttribute('data-dt-mode');`;
      assert.equal(apply(input), expected);
    });

    it('rewrites removeAttribute first argument', () => {
      const input = `el.removeAttribute('data-dt-theme');`;
      const expected = `el.removeAttribute('data-dt-mode');`;
      assert.equal(apply(input), expected);
    });

    it('rewrites hasAttribute first argument', () => {
      const input = `if (el.hasAttribute('data-dt-theme')) {`;
      const expected = `if (el.hasAttribute('data-dt-mode')) {`;
      assert.equal(apply(input), expected);
    });
  });

  describe('data-dt-theme in CSS attribute selectors', () => {
    it('rewrites [data-dt-theme] bare selector', () => {
      const input = `[data-dt-theme] { color: red; }`;
      const expected = `[data-dt-mode] { color: red; }`;
      assert.equal(apply(input), expected);
    });

    it('rewrites [data-dt-theme="value"] selector', () => {
      const input = `[data-dt-theme="dp-light"] { background: white; }`;
      const expected = `[data-dt-mode="dp-light"] { background: white; }`;
      assert.equal(apply(input), expected);
    });

    it('rewrites [data-dt-theme=value] selector (unquoted)', () => {
      const input = `[data-dt-theme=light] .d-banner { border: 1px; }`;
      const expected = `[data-dt-mode=light] .d-banner { border: 1px; }`;
      assert.equal(apply(input), expected);
    });
  });

  // ─── Invert handling ──────────────────────────────────────────────────────

  describe('data-dt-theme="invert" handling', () => {
    it('renames data-dt-theme="invert" to data-dt-mode="invert" (grep to find for v-dt-mode review)', () => {
      const input = `<section data-dt-theme="invert">content</section>`;
      const result = apply(input);
      assert.ok(result.includes('data-dt-mode="invert"'), 'attribute renamed');
      assert.ok(!result.includes('data-dt-theme="invert"'), 'old attribute removed');
    });

    it('adds TODO comment before [data-dt-theme="invert"] CSS selector', () => {
      const input = `[data-dt-theme="invert"] .d-card { box-shadow: none; }`;
      const result = apply(input);
      assert.ok(result.includes('[data-dt-mode="invert"]'), 'selector renamed');
      assert.ok(result.includes('TODO: review for v-dt-mode adoption'), 'TODO inserted');
    });

    it('adds TODO comment before [data-dt-theme=invert] unquoted CSS selector', () => {
      const input = `[data-dt-theme=invert] { background: red; }`;
      const result = apply(input);
      assert.ok(result.includes('[data-dt-mode=invert]'), 'selector renamed');
      assert.ok(result.includes('TODO: review for v-dt-mode adoption'), 'TODO inserted');
    });
  });
});
