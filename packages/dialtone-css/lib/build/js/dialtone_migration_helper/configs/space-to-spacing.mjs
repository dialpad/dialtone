// Lookup table: old --dt-space-{stop} → new --dt-spacing-{suffix}
// Based on px value equivalence (8px base unit). Stops with no equivalent are left unchanged.
import guidance from '../migration-guidance.cjs';
const { SPACE_TOKEN_MAP: MAP } = guidance;

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
