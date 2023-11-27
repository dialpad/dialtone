module.exports = {
  plugins: [
    { name: 'convertPathData', params: { transformPrecision: 4 } },
    { name: 'cleanupNumericValues', params: { floatPrecision: 2 } },
    { name: 'removeViewBox', active: false },
    { name: 'removeAttrs', params: { attrs: ['xmlns'] } },
    'collapseGroups',
    'removeTitle',
    'removeUselessStrokeAndFill',
  ],
};
