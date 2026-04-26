// Migration: deprecated `success` color tokens and utility classes → `positive`.
//
// Suffixes are enumerated and anchored so words like "successful" /
// "successfully" (which start with "success") are NOT matched — matches must
// be followed by `)`, end-of-class boundary, or one of the known suffix tails.

const SUFFIX_ALTERNATION =
  '-subtle-opaque-inverted|' +
  '-subtle-opaque|' +
  '-subtle-inverted|' +
  '-strong-inverted|' +
  '-opaque-inverted|' +
  '-inverted-hover|' +
  '-subtle|' +
  '-strong|' +
  '-opaque|' +
  '-inverted|' +
  '-hover';

const SUCCESS_WITH_SUFFIX = `success((?:${SUFFIX_ALTERNATION})?)`;

// Left-edge boundary: previous character must not be a class-name character.
// Prevents `my-d-fc-success` from being rewritten to `my-d-fc-positive`.
const CLASS_BOUNDARY_START = `(?<![A-Za-z0-9_-])`;

// Right-edge boundary for utility-class matches: end-of-string, whitespace,
// quote, `>`, `<`, `:`, `=`, `,`, `;`, `}`, `)`, `]`, `(`, `[`, `!`, `\``,
// `.`, `/`. Prevents `d-fc-successfoo` and partial extensions.
const CLASS_BOUNDARY_END = `(?=$|[\\s"'><:=,;{}()\\[\\]!\`./])`;

export default {
  description:
    'Renames deprecated `success` color references to `positive`.\n' +
    '- CSS variables: var(--dt-color-{foreground|surface|border|link}-success*) →\n\t' +
      'var(--dt-color-{foreground|surface|border|link}-positive*)\n\t' +
      'eg. var(--dt-color-foreground-success-strong) → var(--dt-color-foreground-positive-strong)\n' +
    '- Component-specific tokens: var(--dt-badge-color-background-success) →\n\t' +
      'var(--dt-badge-color-background-positive); var(--dt-inputs-color-border-success) →\n\t' +
      'var(--dt-inputs-color-border-positive).\n' +
    '- Utility classes: d-{fc|bgc|bc}-success* → d-{fc|bgc|bc}-positive*\n\t' +
      'eg. d-bgc-success-subtle-opaque → d-bgc-positive-subtle-opaque\n' +
    '- Suffix variants covered: -subtle, -strong, -opaque, -subtle-opaque,\n\t' +
      '-inverted, -subtle-inverted, -strong-inverted, -opaque-inverted,\n\t' +
      '-subtle-opaque-inverted, -hover, -inverted-hover.\n' +
    '- The match is anchored so unrelated identifiers like "successful" or\n\t' +
      '"successfully" are NOT touched.\n',
  patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md,js,ts,jsx,tsx}'],
  globbyConfig: {
    ignore: ['**/dialtone_migration_helper/tests/**'],
  },
  expressions: [
    // CSS variable: var(--dt-color-{role}-success{suffix?})
    {
      from: new RegExp(`var\\(--dt-color-(foreground|surface|border|link)-${SUCCESS_WITH_SUFFIX}\\)`, 'g'),
      to: (_match, role, suffix) => `var(--dt-color-${role}-positive${suffix})`,
    },
    // Component-specific tokens that DLT-3331's initial sweep missed (no suffix variants).
    {
      from: /var\(--dt-badge-color-background-success\)/g,
      to: () => 'var(--dt-badge-color-background-positive)',
    },
    {
      from: /var\(--dt-inputs-color-border-success\)/g,
      to: () => 'var(--dt-inputs-color-border-positive)',
    },
    // Utility class: d-{fc|bgc|bc}-success{suffix?}. d-fc-* covers stragglers
    // from the base-to-semantic foreground rename.
    {
      from: new RegExp(`${CLASS_BOUNDARY_START}d-(fc|bgc|bc)-${SUCCESS_WITH_SUFFIX}${CLASS_BOUNDARY_END}`, 'g'),
      to: (_match, prefix, suffix) => `d-${prefix}-positive${suffix}`,
    },
  ],
};
