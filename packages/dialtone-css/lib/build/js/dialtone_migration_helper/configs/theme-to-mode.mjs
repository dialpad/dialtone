// Migration: deprecated `setTheme()` and `data-dt-theme` attribute → layered API.
//
// - Import paths: @dialpad/dialtone/themes/ → @dialpad/dialtone-tokens/themes/
// - Startup call: setTheme(KnownTheme) → initDialtoneTheme(KnownTheme, 'mode')
// - Dynamic calls: setTheme(expr) → flagged with TODO comment
// - HTML attributes: data-dt-theme= → data-dt-mode=
// - JS attribute methods: setAttribute/getAttribute('data-dt-theme') → 'data-dt-mode'
// - CSS selectors: [data-dt-theme...] → [data-dt-mode...]
// - Invert regions (data-dt-theme="invert") are flagged with a TODO comment
//   rather than auto-rewritten — the v-dt-mode directive uses a live
//   MutationObserver that cannot be replicated with a static replacement.

// Identifiers and their mode extracted from the known legacy theme names.
const KNOWN_LIGHT = ['DpLight', 'TmoLight', 'ExpressiveLight', 'ExpressiveSmLight'];
const KNOWN_DARK = ['DpDark', 'TmoDark', 'ExpressiveDark', 'ExpressiveSmDark'];
const ALL_KNOWN = [...KNOWN_LIGHT, ...KNOWN_DARK];
const KNOWN_PATTERN = ALL_KNOWN.join('|');

export default {
  description:
    'Migrates from the deprecated setTheme() / data-dt-theme API to the layered theming API.\n' +
    '- Import paths: @dialpad/dialtone/themes/* → @dialpad/dialtone-tokens/themes/*\n' +
    '- setTheme(DpLight) → initDialtoneTheme(DpLight, \'light\')\n' +
    '- setTheme(DpDark) → initDialtoneTheme(DpDark, \'dark\')\n' +
    '- Same for TmoLight, TmoDark, ExpressiveLight, ExpressiveDark, ExpressiveSmLight, ExpressiveSmDark\n' +
    '- setTheme(dynamicExpr) → preserved + TODO comment\n' +
    '- data-dt-theme= → data-dt-mode= (HTML attributes, JS attr methods, CSS selectors)\n' +
    '- data-dt-theme="invert" → preserved + TODO comment (review for v-dt-mode directive)\n',

  patterns: ['**/*.{vue,html,js,ts,jsx,tsx,css,less,scss,mjs}'],

  globbyConfig: {
    ignore: [
      '**/dialtone_migration_helper/tests/**',
      '**/guides/migration/theme-to-mode/**',
      '**/guides/theme-and-mode/index.md',
      '**/whats-new/posts/2024-8-1.md',
    ],
  },

  expressions: [
    // 1. Import path: @dialpad/dialtone/themes/ → @dialpad/dialtone-tokens/themes/
    //    Handles all theme JSON and config imports in one expression.
    //    Anchored to quote chars to avoid touching unrelated package names.
    {
      from: /(['"])@dialpad\/dialtone\/themes\//g,
      to: (_match, quote) => `${quote}@dialpad/dialtone-tokens/themes/`,
    },

    // 2. setTheme() call rewrites for known light identifiers.
    //    Must run BEFORE the unknown-call flag expression (3) so these are
    //    fully consumed before the fallthrough regex fires.
    {
      from: new RegExp(
        `(?<!\\.)setTheme\\(\\s*(${KNOWN_LIGHT.join('|')})\\s*\\)`,
        'g',
      ),
      to: (_match, identifier) => `initDialtoneTheme(${identifier}, 'light')`,
    },

    // 3. setTheme() call rewrites for known dark identifiers.
    {
      from: new RegExp(
        `(?<!\\.)setTheme\\(\\s*(${KNOWN_DARK.join('|')})\\s*\\)`,
        'g',
      ),
      to: (_match, identifier) => `initDialtoneTheme(${identifier}, 'dark')`,
    },

    // 4. setTheme() calls with unknown / dynamic arguments → TODO comment.
    //    Negative-lookahead skips the eight known identifiers already rewritten above.
    //    Negative-lookbehind on '.' prevents matching unrelated .setTheme() methods.
    {
      from: new RegExp(
        `(?<!\\.)setTheme\\(\\s*(?!(${KNOWN_PATTERN})\\s*\\))([^)]*)\\)`,
        'g',
      ),
      to: (match) =>
        `// TODO: review for layered API migration — see /guides/migration/theme-to-mode/\n${match}`,
    },

    // 5. Attribute rename: data-dt-theme → data-dt-mode
    //    Covers HTML/Vue/JSX attributes, JS string literals, and CSS selectors.
    //    Negative lookahead (?!-) prevents matching data-dt-theme-x (longer names).
    //    Works correctly with applyConfig's inner match.replace() since the inner
    //    call operates on just the matched text "data-dt-theme" where (?!-) passes
    //    at end-of-string (no "-" follows).
    {
      from: /\bdata-dt-theme(?!-)/g,
      to: () => 'data-dt-mode',
    },

    // 6. CSS selector invert — add TODO comment before the renamed selector.
    //    Expression 5 already renamed [data-dt-theme=...] → [data-dt-mode=...],
    //    so we match on the result.  HTML attribute invert is handled by
    //    expression 5 (just renamed, no comment — inserting HTML comments inside
    //    tags produces invalid markup; consumers grep for data-dt-mode="invert"
    //    to find regions needing v-dt-mode review).
    {
      from: /\[data-dt-mode="invert"\]|\[data-dt-mode=invert\]/g,
      to: (match) =>
        `/* TODO: review for v-dt-mode adoption — see /guides/migration/theme-to-mode/ */\n${match}`,
    },

    // 7. JS attribute methods: setAttribute/getAttribute/etc. on 'data-dt-theme'
    {
      from: /(\.(?:set|get|toggle|remove|has)Attribute\(\s*['"])data-dt-theme(['"])/g,
      to: (_match, prefix, suffix) => `${prefix}data-dt-mode${suffix}`,
    },

    // 9. CSS attribute selectors: [data-dt-theme...] → [data-dt-mode...]
    //    Runs after the invert-flagging expressions to avoid double-processing.
    {
      from: /\[data-dt-theme(\]|=[^\]]*\])/g,
      to: (_match, rest) => `[data-dt-mode${rest}`,
    },
  ],
};
