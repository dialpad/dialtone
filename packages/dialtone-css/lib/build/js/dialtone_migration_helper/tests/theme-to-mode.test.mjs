import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import config from '../configs/theme-to-mode.mjs';
import { applyConfig } from './helpers.mjs';

const apply = (input) => applyConfig(config, input);

describe('theme-to-mode config', () => {
  // ─── setTheme call flagging ───────────────────────────────────────────────

  describe('setTheme() → TODO comment for known identifiers', () => {
    it('flags setTheme(DpLight) with a TODO that includes the light mode hint', () => {
      const input = `setTheme(DpLight);`;
      const result = apply(input);
      assert.ok(result.includes('setTheme(DpLight)'), 'original call preserved');
      assert.ok(result.includes('TODO:'), 'TODO comment inserted');
      assert.ok(result.includes('\'light\''), 'light mode hint present');
    });

    it('flags setTheme(DpDark) with a TODO that includes the dark mode hint', () => {
      const input = `setTheme(DpDark);`;
      const result = apply(input);
      assert.ok(result.includes('setTheme(DpDark)'), 'original call preserved');
      assert.ok(result.includes('TODO:'), 'TODO comment inserted');
      assert.ok(result.includes('\'dark\''), 'dark mode hint present');
    });

    it('flags setTheme(TmoLight) with a light mode hint', () => {
      const result = apply(`setTheme(TmoLight);`);
      assert.ok(result.includes('setTheme(TmoLight)'), 'original call preserved');
      assert.ok(result.includes('\'light\''), 'light mode hint present');
    });

    it('flags setTheme(TmoDark) with a dark mode hint', () => {
      const result = apply(`setTheme(TmoDark);`);
      assert.ok(result.includes('setTheme(TmoDark)'), 'original call preserved');
      assert.ok(result.includes('\'dark\''), 'dark mode hint present');
    });

    it('flags setTheme(ExpressiveLight) with a light mode hint', () => {
      const result = apply(`setTheme(ExpressiveLight);`);
      assert.ok(result.includes('setTheme(ExpressiveLight)'), 'original call preserved');
      assert.ok(result.includes('\'light\''), 'light mode hint present');
    });

    it('flags setTheme(ExpressiveDark) with a dark mode hint', () => {
      const result = apply(`setTheme(ExpressiveDark);`);
      assert.ok(result.includes('setTheme(ExpressiveDark)'), 'original call preserved');
      assert.ok(result.includes('\'dark\''), 'dark mode hint present');
    });

    it('handles whitespace inside setTheme call', () => {
      const result = apply(`setTheme( DpLight );`);
      assert.ok(result.includes('setTheme( DpLight )'), 'original call preserved');
      assert.ok(result.includes('TODO:'), 'TODO comment inserted');
    });

    it('flags setTheme(DpLight) inside an onMounted callback', () => {
      const input = `onMounted(() => { setTheme(DpLight); });`;
      const result = apply(input);
      assert.ok(result.includes('setTheme(DpLight)'), 'original call preserved');
      assert.ok(result.includes('TODO:'), 'TODO comment inserted');
    });

    it('TODO comment mentions both startup (initDialtoneTheme) and per-toggle (setMode) options', () => {
      const result = apply(`setTheme(DpLight);`);
      assert.ok(result.includes('initDialtoneTheme'), 'startup option mentioned');
      assert.ok(result.includes('setMode'), 'toggle option mentioned');
    });

    it('does NOT rewrite setTheme() with a dynamic variable — emits generic TODO comment', () => {
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

    it('does NOT flag myObj.setTheme() — unrelated method', () => {
      const input = `myThemeManager.setTheme(DpLight);`;
      assert.equal(apply(input), input);
    });

    it('is idempotent — re-applying to already-flagged known light call produces no change', () => {
      const once = apply(`setTheme(DpLight);`);
      assert.equal(apply(once), once);
    });

    it('is idempotent — re-applying to already-flagged known dark call produces no change', () => {
      const once = apply(`setTheme(DpDark);`);
      assert.equal(apply(once), once);
    });

    it('is idempotent — re-applying to already-flagged dynamic call produces no change', () => {
      const once = apply(`setTheme(myDynamic);`);
      assert.equal(apply(once), once);
    });
  });

  // ─── Attribute renames ────────────────────────────────────────────────────

  describe('data-dt-theme → data-dt-mode in HTML attributes', () => {
    it('rewrites data-dt-theme= in HTML attribute', () => {
      const input = `<html data-dt-theme="dp-light">`;
      const expected = `<html data-dt-mode="light">`;
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

  describe('data-dt-mode value rewrite — known theme names → light/dark', () => {
    it('rewrites data-dt-theme="dp-light" → data-dt-mode="light"', () => {
      assert.equal(apply(`<html data-dt-theme="dp-light">`), `<html data-dt-mode="light">`);
    });

    it('rewrites data-dt-theme="dp-dark" → data-dt-mode="dark"', () => {
      assert.equal(apply(`<html data-dt-theme="dp-dark">`), `<html data-dt-mode="dark">`);
    });

    it('rewrites data-dt-theme="tmo-light" → data-dt-mode="light"', () => {
      assert.equal(apply(`<html data-dt-theme="tmo-light">`), `<html data-dt-mode="light">`);
    });

    it('rewrites data-dt-theme="tmo-dark" → data-dt-mode="dark"', () => {
      assert.equal(apply(`<section data-dt-theme="tmo-dark">`), `<section data-dt-mode="dark">`);
    });

    it('rewrites data-dt-theme="expressive-light" → data-dt-mode="light"', () => {
      assert.equal(apply(`<html data-dt-theme="expressive-light">`), `<html data-dt-mode="light">`);
    });

    it('rewrites data-dt-theme="expressive-sm-dark" → data-dt-mode="dark"', () => {
      assert.equal(apply(`<html data-dt-theme="expressive-sm-dark">`), `<html data-dt-mode="dark">`);
    });

    it('rewrites [data-dt-theme="dp-light"] CSS selector value', () => {
      assert.equal(
        apply(`[data-dt-theme="dp-light"] { background: white; }`),
        `[data-dt-mode="light"] { background: white; }`,
      );
    });

    it('rewrites unquoted [data-dt-theme=dp-dark] CSS selector value', () => {
      assert.equal(
        apply(`[data-dt-theme=dp-dark] .d-banner { border: 1px; }`),
        `[data-dt-mode=dark] .d-banner { border: 1px; }`,
      );
    });

    it('leaves unknown/custom theme values as-is', () => {
      const input = `<html data-dt-theme="custom-brand">`;
      assert.equal(apply(input), `<html data-dt-mode="custom-brand">`);
    });

    it('does not alter data-dt-mode="light" or data-dt-mode="dark" (already canonical)', () => {
      const light = `<html data-dt-mode="light">`;
      const dark = `<html data-dt-mode="dark">`;
      assert.equal(apply(light), light);
      assert.equal(apply(dark), dark);
    });

    it('rewrites Vue bound :data-dt-theme="\'dp-light\'" → :data-dt-mode="\'light\'"', () => {
      assert.equal(apply(`:data-dt-theme="'dp-light'"`), `:data-dt-mode="'light'"`);
    });

    it('rewrites Vue bound :data-dt-theme="\'dp-dark\'" → :data-dt-mode="\'dark\'"', () => {
      assert.equal(apply(`:data-dt-theme="'dp-dark'"`), `:data-dt-mode="'dark'"`);
    });

    it('rewrites v-bind:data-dt-theme="\'tmo-light\'" → v-bind:data-dt-mode="\'light\'"', () => {
      assert.equal(apply(`v-bind:data-dt-theme="'tmo-light'"`), `v-bind:data-dt-mode="'light'"`);
    });

    it('rewrites Vue bound with reversed quotes :data-dt-theme=\'"dp-dark"\' → :data-dt-mode=\'"dark"\'', () => {
      assert.equal(apply(`:data-dt-theme='"dp-dark"'`), `:data-dt-mode='"dark"'`);
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
      const expected = `[data-dt-mode="light"] { background: white; }`;
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

    it('adds TODO comment before [data-dt-theme=\'invert\'] single-quoted CSS selector', () => {
      const input = `[data-dt-theme='invert'] .d-card { box-shadow: none; }`;
      const result = apply(input);
      assert.ok(result.includes('[data-dt-mode=\'invert\']'), 'selector renamed');
      assert.ok(result.includes('TODO: review for v-dt-mode adoption'), 'TODO inserted');
    });

    it('adds TODO comment before [data-dt-theme=invert] unquoted CSS selector', () => {
      const input = `[data-dt-theme=invert] { background: red; }`;
      const result = apply(input);
      assert.ok(result.includes('[data-dt-mode=invert]'), 'selector renamed');
      assert.ok(result.includes('TODO: review for v-dt-mode adoption'), 'TODO inserted');
    });

    it('is idempotent — re-applying to already-flagged CSS invert selector produces no change', () => {
      const once = apply(`[data-dt-theme="invert"] .d-card { box-shadow: none; }`);
      assert.equal(apply(once), once);
    });
  });
});
