export default {
  description:
    'Updates dialtone 7 variables to dialtone 8 design tokens.\n' +
    '- Replaces var(--bs-{kind}) with var(--dt-shadow-{kind})\n\t' +
      'eg. var(--bs-sm) with var(--dt-shadow-small)\n' +
    '- Replaces @bs-{kind} with var(--dt-shadow-{kind})\n\t' +
      'eg. @bs-card with var(--dt-shadow-card)\n',
  patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md}'],
  expressions: [
    // CSS variables
    { from: /@bs-sm|var\(--bs-sm\)/gi, to: 'var(--dt-shadow-small)' },
    { from: /@bs-md|var\(--bs-md\)/gi, to: 'var(--dt-shadow-medium)' },
    { from: /@bs-lg|var\(--bs-lg\)/gi, to: 'var(--dt-shadow-large)' },
    { from: /@bs-xl|var\(--bs-xl\)/gi, to: 'var(--dt-shadow-extra-large)' },
    { from: /@bs-card|var\(--bs-card\)/gi, to: 'var(--dt-shadow-card)' },
    { from: /@bs-focus-ring|var\(--bs-focus-ring\)/gi, to: 'var(--dt-shadow-focus)' },
    { from: /@bs-focus-ring-inset|var\(--bs-focus-ring-inset\)/gi, to: 'var(--dt-shadow-focus-inset)' },
  ],
};
