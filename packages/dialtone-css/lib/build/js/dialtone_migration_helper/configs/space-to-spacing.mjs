// Lookup table: old --dt-space-{stop} → new --dt-spacing-{suffix}
// Based on px value equivalence (8px base unit). Stops with no equivalent are left unchanged.
const MAP = {
  0: 'spacing-0',     // 0px
  100: 'spacing-1',   // 1px
  200: 'spacing-25',  // 2px
  300: 'spacing-50',  // 4px
  350: 'spacing-75',  // 6px
  400: 'spacing-100', // 8px
  450: 'spacing-150', // 12px
  500: 'spacing-200', // 16px
  525: 'spacing-250', // 20px
  550: 'spacing-300', // 24px
  600: 'spacing-400', // 32px
  625: 'spacing-525', // 42px
  650: 'spacing-600', // 48px
  700: 'spacing-800', // 64px
  // 720 (72px), 730 (84px), 750+ (96px+) have no --dt-spacing-* equivalent.
  // Tokens at these sizes are better expressed as --dt-layout-* tokens.
  // These are left unchanged for manual review — the lint rule will flag them.
};

export default {
  description:
    'Migrates --dt-space-* tokens to --dt-spacing-* tokens (8px base unit scale).\n' +
    'This supersedes the space-to-size migration — run this instead of space-to-size.\n' +
    '- Replaces var(--dt-space-{stop}) with var(--dt-spacing-{newSuffix})\n\t' +
      'eg. var(--dt-space-400) → var(--dt-spacing-100)\n' +
    '- Replaces var(--dt-space-{stop}-negative) with var(--dt-spacing-{newSuffix}-negative)\n\t' +
      'eg. var(--dt-space-400-negative) → var(--dt-spacing-100-negative)\n' +
    '- var(--dt-space-{stop}-percent) is left unchanged — percent tokens live under\n\t' +
      '--dt-layout-*-percent (a different stop axis), so there is no safe automated mapping.\n' +
    '- Tokens with no equivalent (720, 730, 750+) are left unchanged for manual review.\n',
  patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md,js,ts,jsx,tsx}'],
  globbyConfig: {
    ignore: ['**/dialtone_migration_helper/tests/**'],
  },
  expressions: [
    {
      // -percent variants are intentionally excluded: --dt-spacing-*-percent tokens do not
      // exist. Percent tokens live under --dt-layout-*-percent with a different stop axis
      // (0/5/10…100 = percentages) and cannot be automatically mapped from space pixel stops.
      from: /var\(--dt-space-([0-9]+)(-negative)?\)/g,
      to: (match, stop, suffix) => {
        const newSuffix = MAP[Number(stop)];
        if (newSuffix == null) return match;
        return `var(--dt-${newSuffix}${suffix || ''})`;
      },
    },
  ],
};
