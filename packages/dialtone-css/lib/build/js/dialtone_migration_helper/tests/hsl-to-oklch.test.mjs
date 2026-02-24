import { describe, it, expect, beforeAll } from 'vitest';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import config from '../configs/hsl-to-oklch.mjs';
import { applyConfig } from './helpers.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apply = (input) => applyConfig(config, input);

// Shorthand tokens used throughout tests
const FP = '--dt-color-foreground-primary';
const SC = '--dt-color-surface-critical';

describe('hsl-to-oklch config', () => {
  describe('expr 0: LESS ~"" stripping', () => {
    const cases = [
      [`~"hsla(var(${FP}-h), var(${FP}-s), var(${FP}-l), 0.5)"`,
        `oklch(from var(${FP}) l c h / 0.5)`, 'separate → expr 3'],
      [`~"hsl(var(${FP}-hsl))"`, `var(${FP})`, 'composite → expr 2'],
      [`~"hsla(var(${FP}-hsla) / 0.5)"`,
        `oklch(from var(${FP}) l c h / 0.5)`, 'composite+alpha → expr 1'],
    ];
    for (const [input, expected, label] of cases) {
      it(label, () => expect(apply(input)).toBe(expected));
    }
  });

  describe('expr 0: ~"" skip cases', () => {
    const cases = [
      ['~"@{step0}"', 'LESS variable'],
      ['~"hsla(137, 100%, 27%, 0.05)"', 'hardcoded HSL'],
      ['~"linear-gradient(red, blue)"', 'no hsl() call'],
    ];
    for (const [input, label] of cases) {
      it(`unchanged: ${label}`, () => expect(apply(input)).toBe(input));
    }
  });

  describe('expr 1: composite -hsl/-hsla + alpha', () => {
    const cases = [
      [`hsla(var(${FP}-hsla) / 0.5)`,
        `oklch(from var(${FP}) l c h / 0.5)`, '-hsla numeric'],
      [`hsl(var(${SC}-hsl) / 50%)`,
        `oklch(from var(${SC}) l c h / 50%)`, '-hsl percent'],
      [`hsla(var(${FP}-hsl) / var(--fco, alpha))`,
        `oklch(from var(${FP}) l c h / var(--fco, alpha))`, 'var() alpha'],
      [`hsla(var(${FP}-hsl) / var(--fco))`,
        `oklch(from var(${FP}) l c h / var(--fco))`, 'var() no fallback'],
      [`hsla( var(${FP}-hsla)  /  0.5 )`,
        `oklch(from var(${FP}) l c h / 0.5)`, 'extra whitespace'],
    ];
    for (const [input, expected, label] of cases) {
      it(label, () => expect(apply(input)).toBe(expected));
    }
  });

  describe('expr 2: composite -hsl/-hsla no alpha', () => {
    const cases = [
      [`hsl(var(${FP}-hsl))`, `var(${FP})`, '-hsl'],
      [`hsla(var(${SC}-hsla))`, `var(${SC})`, '-hsla'],
      [`hsl( var(${FP}-hsl) )`, `var(${FP})`, 'whitespace'],
    ];
    for (const [input, expected, label] of cases) {
      it(label, () => expect(apply(input)).toBe(expected));
    }
  });

  describe('expr 3: separate H,S,L comma + alpha', () => {
    const cases = [
      [`hsla(var(${FP}-h), var(${FP}-s), var(${FP}-l), 0.5)`,
        `oklch(from var(${FP}) l c h / 0.5)`, 'numeric'],
      [`hsla(var(${FP}-h), var(${FP}-s), var(${FP}-l), var(--fco, 0.5))`,
        `oklch(from var(${FP}) l c h / var(--fco, 0.5))`, 'var() alpha'],
      [`hsla(var(${FP}-h), var(${FP}-s), var(${FP}-l), 50%)`,
        `oklch(from var(${FP}) l c h / 50%)`, 'percent'],
      [`hsla(var(${SC}-h), var(${SC}-s), var(${SC}-l), .3)`,
        `oklch(from var(${SC}) l c h / .3)`, 'different token'],
    ];
    for (const [input, expected, label] of cases) {
      it(label, () => expect(apply(input)).toBe(expected));
    }
  });

  describe('expr 4: separate H,S,L space + slash alpha', () => {
    const cases = [
      [`hsl(var(${FP}-h) var(${FP}-s) var(${FP}-l) / 0.5)`,
        `oklch(from var(${FP}) l c h / 0.5)`, 'numeric'],
      [`hsla(var(${FP}-h) var(${FP}-s) var(${FP}-l) / var(--fco, alpha))`,
        `oklch(from var(${FP}) l c h / var(--fco, alpha))`, 'var() alpha'],
    ];
    for (const [input, expected, label] of cases) {
      it(label, () => expect(apply(input)).toBe(expected));
    }
  });

  describe('expr 5: separate H,S,L no alpha', () => {
    const cases = [
      [`hsl(var(${FP}-h), var(${FP}-s), var(${FP}-l))`, `var(${FP})`, 'comma'],
      [`hsl(var(${FP}-h) var(${FP}-s) var(${FP}-l))`, `var(${FP})`, 'space'],
      [`hsl(var(${SC}-h), var(${SC}-s), var(${SC}-l))`, `var(${SC})`, 'diff token'],
    ];
    for (const [input, expected, label] of cases) {
      it(label, () => expect(apply(input)).toBe(expected));
    }
  });

  describe('expr 6: calc() on lightness', () => {
    const cases = [
      [`hsl(var(${FP}-h), var(${FP}-s), calc(var(${FP}-l) + 10%))`,
        `oklch(from var(${FP}) calc(l + 10 / 100) c h)`, 'add 10%'],
      [`hsl(var(${FP}-h), var(${FP}-s), calc(var(${FP}-l) - 5%))`,
        `oklch(from var(${FP}) calc(l - 5 / 100) c h)`, 'subtract 5%'],
      [`hsl(var(${SC}-h), var(${SC}-s), calc(var(${SC}-l) + 2.5%))`,
        `oklch(from var(${SC}) calc(l + 2.5 / 100) c h)`, 'decimal %'],
    ];
    for (const [input, expected, label] of cases) {
      it(label, () => expect(apply(input)).toBe(expected));
    }
  });

  describe('expr 7: desaturation (S → 0)', () => {
    const cases = [
      [`hsl(var(${FP}-h), 0%, var(${FP}-l))`, `oklch(from var(${FP}) l 0 h)`, '0%'],
      [`hsl(var(${FP}-h), 0, var(${FP}-l))`, `oklch(from var(${FP}) l 0 h)`, '0'],
      [`hsl(var(${SC}-h), 0%, var(${SC}-l))`, `oklch(from var(${SC}) l 0 h)`, 'diff token'],
    ];
    for (const [input, expected, label] of cases) {
      it(label, () => expect(apply(input)).toBe(expected));
    }
  });

  describe('skip cases', () => {
    const cases = [
      ['hsla(137, 100%, 27%, 0.05)', 'hardcoded HSL'],
      ['hsl(137, 100%, 27%)', 'hardcoded HSL no alpha'],
      [`oklch(from var(${FP}) l c h / 0.5)`, 'already oklch'],
      [`var(${FP})`, 'no suffix token'],
      [`hsl(var(${FP}-h), var(${SC}-s), var(${FP}-l))`, 'mismatched tokens'],
      [`color-mix(in oklch, var(${FP}) 50%, transparent)`, 'color-mix()'],
    ];
    for (const [input, label] of cases) {
      it(`unchanged: ${label}`, () => expect(apply(input)).toBe(input));
    }
  });

  describe('multi-match in one string', () => {
    it('two composite vars on one line', () => {
      const i = `.a { color: hsl(var(${FP}-hsl)); background: hsla(var(${SC}-hsla) / 0.5); }`;
      const e = `.a { color: var(${FP}); background: oklch(from var(${SC}) l c h / 0.5); }`;
      expect(apply(i)).toBe(e);
    });

    it('mixed patterns in CSS block', () => {
      const BD = '--dt-color-border-default';
      const i = ['.card {', `  color: hsl(var(${FP}-hsl));`,
        `  background: hsla(var(${SC}-h), var(${SC}-s), var(${SC}-l), 0.1);`,
        `  border-color: hsl(var(${BD}-h), 0%, var(${BD}-l));`, '}'].join('\n');
      const e = ['.card {', `  color: var(${FP});`,
        `  background: oklch(from var(${SC}) l c h / 0.1);`,
        `  border-color: oklch(from var(${BD}) l 0 h);`, '}'].join('\n');
      expect(apply(i)).toBe(e);
    });
  });

  describe('example .vue file integration', () => {
    let input;
    beforeAll(async () => {
      input = await readFile(join(__dirname, 'hsl-to-oklch-test-examples.vue'), 'utf8');
    });

    it('transforms all HSL patterns to oklch/var()', () => {
      const output = apply(input);
      const block = (cls) => output.split(`.${cls} {`)[1]?.split('}')[0] || '';
      const oklchFP = `oklch(from var(${FP}) l c h`;

      // Expr 1–2: composite
      expect(block('test-composite-alpha-1')).toContain(`${oklchFP} / 0.5)`);
      expect(block('test-composite-alpha-2')).toContain(`oklch(from var(${SC}) l c h / 50%)`);
      expect(block('test-composite-alpha-3')).toContain(`${oklchFP} / var(--fco, alpha))`);
      expect(block('test-composite-no-alpha-1')).toContain(`var(${FP})`);
      expect(block('test-composite-no-alpha-2')).toContain(`var(${SC})`);
      // Expr 3–5: separate channels
      expect(block('test-separate-comma-alpha')).toContain(`${oklchFP} / 0.5)`);
      expect(block('test-separate-space-alpha')).toContain(`${oklchFP} / 0.5)`);
      expect(block('test-separate-no-alpha-comma')).toContain(`var(${FP})`);
      expect(block('test-separate-no-alpha-space')).toContain(`var(${FP})`);
      // Expr 6–7: calc + desaturation
      expect(block('test-calc-lightness-add')).toContain(`oklch(from var(${FP}) calc(l + 10 / 100) c h)`);
      expect(block('test-calc-lightness-sub')).toContain(`oklch(from var(${FP}) calc(l - 5 / 100) c h)`);
      expect(block('test-desat-percent')).toContain(`oklch(from var(${FP}) l 0 h)`);
      expect(block('test-desat-no-percent')).toContain(`oklch(from var(${FP}) l 0 h)`);
      // Expr 0: LESS ~""
      expect(block('test-less-escape-separate')).toContain(`${oklchFP} / 0.5)`);
      expect(block('test-less-escape-separate')).not.toContain('~"');
      expect(block('test-less-escape-composite')).toContain(`var(${FP})`);
      expect(block('test-less-escape-composite')).not.toContain('~"');
    });

    it('preserves skip cases unchanged', () => {
      const output = apply(input);
      const block = (cls) => output.split(`.${cls} {`)[1]?.split('}')[0] || '';
      expect(output).toContain('hsla(137, 100%, 27%, 0.05)');
      expect(output).toContain('~"@{step0}"');
      expect(block('test-skip-no-suffix')).toContain(`var(${FP})`);
      expect(block('test-skip-mismatch')).toContain(`var(${FP}-h)`);
      expect(block('test-skip-mismatch')).toContain(`var(${SC}-s)`);
    });
  });
});
