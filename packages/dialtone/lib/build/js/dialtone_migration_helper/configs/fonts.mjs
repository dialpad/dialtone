export default {
  description:
    'Updates dialtone 7 variables to dialtone 8 design tokens.\n' +
    '- Replaces var(--fs-{stop}) with var(--dt-font-size-{stop})\n\t' +
      'eg. var(--fs-200) with var(--dt-font-size-200)\n' +
    '- Replaces @fs-{stop} with var(--dt-font-size-{stop})\n\t' +
      'eg. @fs-100-tv with var(--dt-font-size-100-tv)\n' +
    '- Replaces var(--fw-{kind}) with var(--dt-font-weight-{kind})\n\t' +
      'eg. var(--fw-medium) with var(--dt-font-weight-medium)\n' +
    '- Replaces @fw-{kind} with var(--dt-font-weight-{kind})\n\t' +
      'eg. @fw-semibold with var(--dt-font-weight-semi-bold)\n' +
    '- Replaces var(--lh-{stop}) with var(--dt-font-line-height-{stop})\n\t' +
      'eg. var(--lh-200) with var(--dt-font-line-height-200)\n' +
    '- Replaces @lh-{stop} with var(--dt-font-line-height-{stop})\n\t' +
      'eg. @lh-100 with var(--dt-font-line-height-100)\n' +
    '- Replaces var(--ff-{kind}) with var(--dt-font-family-{kind})\n\t' +
      'eg. var(--ff-mono) with var(--dt-font-family-mono)',
  patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md,json}'],
  expressions: [
    // ------------------------------------------------------------ //
    //                            Fonts                             //
    // ------------------------------------------------------------ //
    // Size variables
    {
      from: /@fs(-[0-9]+)(-(mobile|tc8|tv))?|var\(--fs(-[0-9]+)(-(mobile|tc8|tv))?\)/g,
      to: 'var(--dt-font-size$1$2$4$5)',
    },
    // Weight variables
    {
      from: /@fw-(normal|medium|bold)|var\(--fw-(normal|medium|bold)\)/g,
      to: 'var(--dt-font-weight-$1$2)',
    },
    // Special weight case
    {
      from: /@fw-semibold|var\(--fw-semibold\)/g,
      to: 'var(--dt-font-weight-semi-bold)',
    },
      // Line heights
    {
      from: /@lh(-[0-9]+)|var\(--lh(-[0-9]+)\)/g,
      to: 'var(--dt-font-line-height$1$2)',
    },
    // Font family
    {
      from: /var\(--ff-(mono)\)/g,
      to: 'var(--dt-font-family-$1)',
    },
  ],
};
