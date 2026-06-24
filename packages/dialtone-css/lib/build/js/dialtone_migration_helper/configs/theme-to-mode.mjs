// Migration: deprecated `setTheme()` and `data-dt-theme` attribute → layered API.
//
// - All setTheme() calls → flagged with a TODO comment (preserved, not rewritten).
//   setTheme() was a re-entrant setter; initDialtoneTheme() is a one-shot bootstrap
//   that throws if already initialized. The correct replacement depends on call site:
//     • one-time startup  → initDialtoneTheme(brand, 'mode')
//     • per-toggle/switch → setMode('mode')
//   Static analysis cannot distinguish the two, so each call is flagged for manual review.
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
    '- setTheme(KnownTheme) → preserved + TODO comment with mode hint\n' +
    '  (use initDialtoneTheme(brand, mode) once at startup OR setMode(mode) per toggle)\n' +
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
    // 1. setTheme() calls with known light identifiers → TODO comment with mode hint.
    //    Must run BEFORE expression 3 so these are consumed before the fallthrough fires.
    //    setTheme() was re-entrant; initDialtoneTheme() is a one-shot bootstrap that
    //    throws if already initialized — the caller must decide which replacement applies.
    {
      from: new RegExp(
        `(?<!\\.)setTheme\\(\\s*(${KNOWN_LIGHT.join('|')})\\s*\\)`,
        'g',
      ),
      to: (match, identifier) =>
        `// TODO: startup → initDialtoneTheme(${identifier}, 'light')  or  per-toggle → setMode('light') — see /guides/migration/theme-to-mode/\n${match}`,
    },

    // 2. setTheme() calls with known dark identifiers → TODO comment with mode hint.
    {
      from: new RegExp(
        `(?<!\\.)setTheme\\(\\s*(${KNOWN_DARK.join('|')})\\s*\\)`,
        'g',
      ),
      to: (match, identifier) =>
        `// TODO: startup → initDialtoneTheme(${identifier}, 'dark')  or  per-toggle → setMode('dark') — see /guides/migration/theme-to-mode/\n${match}`,
    },

    // 3. setTheme() calls with unknown / dynamic arguments → TODO comment.
    //    Negative-lookahead skips the eight known identifiers already handled above.
    //    Negative-lookbehind on '.' prevents matching unrelated .setTheme() methods.
    {
      from: new RegExp(
        `(?<!\\.)setTheme\\(\\s*(?!(${KNOWN_PATTERN})\\s*\\))([^)]*)\\)`,
        'g',
      ),
      to: (match) =>
        `// TODO: review for layered API migration — see /guides/migration/theme-to-mode/\n${match}`,
    },

    // 4. Attribute rename: data-dt-theme → data-dt-mode
    //    Covers HTML/Vue/JSX attributes, JS string literals, and CSS selectors.
    //    Negative lookahead (?!-) prevents matching data-dt-theme-x (longer names).
    //    Works correctly with applyConfig's inner match.replace() since the inner
    //    call operates on just the matched text "data-dt-theme" where (?!-) passes
    //    at end-of-string (no "-" follows).
    {
      from: /\bdata-dt-theme(?!-)/g,
      to: () => 'data-dt-mode',
    },

    // 5. CSS selector invert — add TODO comment before the renamed selector.
    //    Expression 4 already renamed [data-dt-theme=...] → [data-dt-mode=...],
    //    so we match on the result.  HTML attribute invert is handled by
    //    expression 4 (just renamed, no comment — inserting HTML comments inside
    //    tags produces invalid markup; consumers grep for data-dt-mode="invert"
    //    to find regions needing v-dt-mode review).
    {
      from: /\[data-dt-mode="invert"\]|\[data-dt-mode=invert\]/g,
      to: (match) =>
        `/* TODO: review for v-dt-mode adoption — see /guides/migration/theme-to-mode/ */\n${match}`,
    },

    // 6. JS attribute methods: setAttribute/getAttribute/etc. on 'data-dt-theme'
    {
      from: /(\.(?:set|get|toggle|remove|has)Attribute\(\s*['"])data-dt-theme(['"])/g,
      to: (_match, prefix, suffix) => `${prefix}data-dt-mode${suffix}`,
    },

    // 7. CSS attribute selectors: [data-dt-theme...] → [data-dt-mode...]
    //    Runs after the invert-flagging expressions to avoid double-processing.
    {
      from: /\[data-dt-theme(\]|=[^\]]*\])/g,
      to: (_match, rest) => `[data-dt-mode${rest}`,
    },
  ],
};
