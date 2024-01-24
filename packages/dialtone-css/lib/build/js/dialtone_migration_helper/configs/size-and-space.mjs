export default {
  description:
    'Updates dialtone 7 variables to dialtone 8 design tokens.\n' +
    '- Replaces var(--{size}-{stop}) with var(--dt-size-{stop})\n\t' +
      'eg. var(--size-200) with var(--dt-size-200)\n' +
    '- Replaces @{size}{stop} with var(--dt-size-{stop})\n\t' +
      'eg. @size4 with var(--dt-size-300)\n' +
    '- Replaces @icon{size} with var(--dt-icon-size-{stop})\n\t' +
      'eg. @icon12 with var(--dt-icon-size-100)\n' +
    '- Replaces var(--su{stop}) with var(--dt-size-{stop})\n\t' +
      'eg. var(--su0) with var(--dt-size-0)\n' +
    '- Replaces @su{stop} with var(--dt-size-{stop})\n\t' +
      'eg. @su8 with var(--dt-size-400)\n' +
    '- Replaces var(--sun{stop}) with var(--dt-size-{stop}-negative)\n\t' +
      'eg. var(--sun1) with var(--dt-size-100-negative)\n' +
    '- Replaces var(--br{stop}) with var(--dt-size-radius-{stop})\n\t' +
      'eg. var(--br4) with var(--dt-size-radius-300)\n' +
    '- Replaces @br{stop} with var(--dt-size-radius-{stop})\n\t' +
      'eg. @br-pill with var(--dt-size-radius-pill)\n',
  patterns: ['**/*.{css,less,scss,sass,styl,html,vue,md}'],
  expressions: [
    // ------------------------------------------------------------ //
    //                        Size and Space                        //
    // ------------------------------------------------------------ //
    {
      from: /var\(--(size|space)(-[0-9]+)(-negative)?\)/gi,
      to: 'var(--dt-$1$2$3)',
    },

    // Size LESS variables
    { from: /@size0\b|var\(--size0\)/g, to: 'var(--dt-size-0)' },
    { from: /@size1\b|var\(--size1\)/g, to: 'var(--dt-size-100)' },
    { from: /@size2\b|var\(--size2\)/g, to: 'var(--dt-size-200)' },
    { from: /@size4\b|var\(--size4\)/g, to: 'var(--dt-size-300)' },
    { from: /@size6\b|var\(--size6\)/g, to: 'var(--dt-size-350)' },
    { from: /@size8\b|var\(--size8\)/g, to: 'var(--dt-size-400)' },
    { from: /@size12\b|var\(--size12\)/g, to: 'var(--dt-size-450)' },
    { from: /@size16\b|var\(--size16\)/g, to: 'var(--dt-size-500)' },
    { from: /@size20\b|var\(--size20\)/g, to: 'var(--dt-size-525)' },
    { from: /@size24\b|var\(--size24\)/g, to: 'var(--dt-size-550)' },
    { from: /@size32\b|var\(--size32\)/g, to: 'var(--dt-size-600)' },
    { from: /@size42\b|var\(--size42\)/g, to: 'var(--dt-size-625)' },
    { from: /@size48\b|var\(--size48\)/g, to: 'var(--dt-size-650)' },
    { from: /@size64\b|var\(--size64\)/g, to: 'var(--dt-size-700)' },
    { from: /@size72\b|var\(--size72\)/g, to: 'var(--dt-size-720)' },
    { from: /@size84\b|var\(--size84\)/g, to: 'var(--dt-size-730)' },
    { from: /@size96\b|var\(--size96\)/g, to: 'var(--dt-size-750)' },
    { from: /@size102\b|var\(--size102\)/g, to: 'var(--dt-size-760)' },
    { from: /@size114\b|var\(--size114\)/g, to: 'var(--dt-size-775)' },
    { from: /@size128\b|var\(--size128\)/g, to: 'var(--dt-size-800)' },
    { from: /@size164\b|var\(--size164\)/g, to: 'var(--dt-size-825)' },
    { from: /@size216\b|var\(--size216\)/g, to: 'var(--dt-size-875)' },
    { from: /@size264\b|var\(--size264\)/g, to: 'var(--dt-size-905)' },
    { from: /@size332\b|var\(--size332\)/g, to: 'var(--dt-size-925)' },
    { from: /@size464\b|var\(--size464\)/g, to: 'var(--dt-size-975)' },
    { from: /@size512\b|var\(--size512\)/g, to: 'var(--dt-size-1000)' },
    { from: /@size628\b|var\(--size628\)/g, to: 'var(--dt-size-1020)' },
    { from: /@size764\b|var\(--size764\)/g, to: 'var(--dt-size-1040)' },
    { from: /@size828\b|var\(--size828\)/g, to: 'var(--dt-size-1060)' },
    { from: /@size912\b|var\(--size912\)/g, to: 'var(--dt-size-1080)' },
    { from: /@size1024\b|var\(--size1024\)/g, to: 'var(--dt-size-1100)' },
    { from: /@size1140\b|var\(--size1140\)/g, to: 'var(--dt-size-1115)' },
    { from: /@size1268\b|var\(--size1268\)/g, to: 'var(--dt-size-1120)' },
    { from: /@size1340\b|var\(--size1340\)/g, to: 'var(--dt-size-1130)' },

    // Icon variables
    { from: /@icon12\b|var\(--icon12\)/g, to: 'var(--dt-icon-size-100)' },
    { from: /@icon14\b|var\(--icon14\)/g, to: 'var(--dt-icon-size-200)' },
    { from: /@icon16\b|var\(--icon16\)/g, to: 'var(--dt-size-500)' },
    { from: /@icon18\b|var\(--icon18\)/g, to: 'var(--dt-icon-size-300)' },
    { from: /@icon20\b|var\(--icon20\)/g, to: 'var(--dt-icon-size-400)' },
    { from: /@icon24\b|var\(--icon24\)/g, to: 'var(--dt-icon-size-500)' },
    { from: /@icon32\b|var\(--icon32\)/g, to: 'var(--dt-icon-size-600)' },
    { from: /@icon48\b|var\(--icon48\)/g, to: 'var(--dt-size-650)' },
    { from: /@icon64\b|var\(--icon64\)/g, to: 'var(--dt-size-700)' },
    // Variable prefixed with negative, must go before positive spacing
    { from: /-@su1\b|-var\(--su1\)|[^-]var\(--sun1\)/g, to: 'var(--dt-space-100-negative)' },
    { from: /-@su2\b|-var\(--su2\)|[^-]var\(--sun2\)/g, to: 'var(--dt-space-200-negative)' },
    { from: /-@su4\b|-var\(--su4\)|[^-]var\(--sun4\)/g, to: 'var(--dt-space-300-negative)' },
    { from: /-@su6\b|-var\(--su6\)|[^-]var\(--sun6\)/g, to: 'var(--dt-space-350-negative)' },
    { from: /-@su8\b|-var\(--su8\)|[^-]var\(--sun8\)/g, to: 'var(--dt-space-400-negative)' },
    { from: /-@su12\b|-var\(--su12\)|[^-]var\(--sun12\)/g, to: 'var(--dt-space-450-negative)' },
    { from: /-@su16\b|-var\(--su16\)|[^-]var\(--sun16\)/g, to: 'var(--dt-space-500-negative)' },
    { from: /-@su24\b|-var\(--su24\)|[^-]var\(--sun24\)/g, to: 'var(--dt-space-550-negative)' },
    { from: /-@su32\b|-var\(--su32\)|[^-]var\(--sun32\)/g, to: 'var(--dt-space-600-negative)' },
    { from: /-@su48\b|-var\(--su48\)|[^-]var\(--sun48\)/g, to: 'var(--dt-space-650-negative)' },
    { from: /-@su64\b|-var\(--su64\)|[^-]var\(--sun64\)/g, to: 'var(--dt-space-700-negative)' },
    { from: /-@su72\b|-var\(--su72\)|[^-]var\(--sun72\)/g, to: 'var(--dt-space-720-negative)' },
    { from: /-@su84\b|-var\(--su84\)|[^-]var\(--sun84\)/g, to: 'var(--dt-space-730-negative)' },
    { from: /-@su96\b|-var\(--su96\)|[^-]var\(--sun96\)/g, to: 'var(--dt-space-750-negative)' },
    { from: /-@su102\b|-var\(--su102\)|[^-]var\(--sun102\)/g, to: 'var(--dt-space-760-negative)' },
    { from: /-@su114\b|-var\(--su114\)|[^-]var\(--sun114\)/g, to: 'var(--dt-space-775-negative)' },
    { from: /-@su128\b|-var\(--su128\)|[^-]var\(--sun128\)/g, to: 'var(--dt-space-800-negative)' },
    // Positive spacing
    { from: /@su0\b|var\(--su0\)/g, to: 'var(--dt-space-0)' },
    { from: /@su1\b|var\(--su1\)/g, to: 'var(--dt-space-100)' },
    { from: /@su2\b|var\(--su2\)/g, to: 'var(--dt-space-200)' },
    { from: /@su4\b|var\(--su4\)/g, to: 'var(--dt-space-300)' },
    { from: /@su6\b|var\(--su6\)/g, to: 'var(--dt-space-350)' },
    { from: /@su8\b|var\(--su8\)/g, to: 'var(--dt-space-400)' },
    { from: /@su12\b|var\(--su12\)/g, to: 'var(--dt-space-450)' },
    { from: /@su16\b|var\(--su16\)/g, to: 'var(--dt-space-500)' },
    { from: /@su24\b|var\(--su24\)/g, to: 'var(--dt-space-550)' },
    { from: /@su32\b|var\(--su32\)/g, to: 'var(--dt-space-600)' },
    { from: /@su48\b|var\(--su48\)/g, to: 'var(--dt-space-650)' },
    { from: /@su64\b|var\(--su64\)/g, to: 'var(--dt-space-700)' },
    { from: /@su72\b|var\(--su72\)/g, to: 'var(--dt-space-720)' },
    { from: /@su84\b|var\(--su84\)/g, to: 'var(--dt-space-730)' },
    { from: /@su96\b|var\(--su96\)/g, to: 'var(--dt-space-750)' },
    { from: /@su102\b|var\(--su102\)/g, to: 'var(--dt-space-760)' },
    { from: /@su114\b|var\(--su114\)/g, to: 'var(--dt-space-775)' },
    { from: /@su128\b|var\(--su128\)/g, to: 'var(--dt-space-800)' },
    // Border radius
    { from: /@br-(pill|circle)|var\(--br-(pill|circle)\)/g, to: 'var(--dt-size-radius-$1$2)' },
    { from: /@br0|var\(--br0\)/g, to: 'var(--dt-size-radius-0)' },
    { from: /@br2\b|var\(--br2\)/g, to: 'var(--dt-size-radius-200)' },
    { from: /@br4|var\(--br4\)/g, to: 'var(--dt-size-radius-300)' },
    { from: /@br8|var\(--br8\)/g, to: 'var(--dt-size-radius-400)' },
    { from: /@br12|var\(--br12\)/g, to: 'var(--dt-size-450)' },
    { from: /@br16|var\(--br16\)/g, to: 'var(--dt-size-radius-500)' },
    { from: /@br24|var\(--br24\)/g, to: 'var(--dt-size-550)' },
    { from: /@br32|var\(--br32\)/g, to: 'var(--dt-size-radius-600)' },
  ],
};
