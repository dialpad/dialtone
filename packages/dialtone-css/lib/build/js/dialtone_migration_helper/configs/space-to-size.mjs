export default {
  description:
    'Migrates space tokens to size tokens (DTCG consolidation).\n' +
    '- Replaces var(--dt-space-{stop}) with var(--dt-size-{stop})\n\t' +
      'eg. var(--dt-space-100) with var(--dt-size-100)\n' +
    '- Replaces var(--dt-space-{stop}-negative) with var(--dt-size-{stop}-negative)\n\t' +
      'eg. var(--dt-space-100-negative) with var(--dt-size-100-negative)\n' +
    '- Replaces var(--dt-space-{stop}-percent) with var(--dt-size-{stop}-percent)\n\t' +
      'eg. var(--dt-space-50-percent) with var(--dt-size-50-percent)\n',
  patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md,js,ts,jsx,tsx}'],
  expressions: [
    // All space tokens → size tokens (including negative and percent variants)
    { from: /var\(--dt-space-([0-9]+)(-negative|-percent)?\)/g, to: 'var(--dt-size-$1$2)' },
  ],
};
