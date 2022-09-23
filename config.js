module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    less: {
      transforms: ['dt/size/pxToRem', 'dt/fonts/transformToStack', 'dt/fonts/weight', 'attribute/cti', 'name/cti/kebab', 'time/seconds', 'content/icon', 'color/hex'],
      prefix: 'dt',
      buildPath: 'dist/less/',
      files: [
        {
          destination: 'variables.less',
          format: 'less/variables',
        },
      ],
    },
    css: {
      transforms: ['dt/size/pxToRem', 'dt/fonts/transformToStack', 'dt/fonts/weight', 'attribute/cti', 'name/cti/kebab', 'time/seconds', 'content/icon', 'size/rem', 'color/css'],
      prefix: 'dt',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
    android_xml: {
      transformGroup: 'android',
      prefix: 'dt',
      buildPath: 'dist/android/',
      files: [
        {
          destination: 'colors.xml',
          format: 'android/resources',
          resourceType: 'color',
          filter: function(token) {
            return ['color', 'opacity'].includes(token.type);
          },
        },
        {
          destination: 'dimens.xml',
          format: 'android/resources',
          resourceType: 'dimen',
          filter: function(token) {
              return ['sizing', 'borderRadius', 'fontSizes', 'lineHeights', 'fontWeights', 'borderWidth', 'spacing'].includes(token.type);
          },
        },
      ],
    },
    android_compose: {
      transforms: ['dt/fonts/transformToStack',  'dt/lineHeight/percentToDecimal', 'dt/size/pxToDp', 'dt/size/pxToSp', 'dt/composeColor', 'dt/stringify', 'attribute/cti', 'name/cti/camel'],
      prefix: 'dt',
      buildPath: 'dist/android/',
      files: [
        {
          destination: 'tokens.kt',
          format: 'compose/object',
          packageName: 'design.dialpad',
          className: 'DialtoneTokens',
          filter: function(token) {
            return token.path[0] !== 'tokenSetOrder';
        },
        }
      ]
    },
    ios: {
      transformGroup: 'ios',
      prefix: 'dt',
      buildPath: 'dist/ios/',
      files: [
        {
          destination: 'dialtone.swift',
          format: 'ios-swift/enum.swift',
        },
      ],
    },
    json: {
      prefix: 'dt',
      buildPath: 'dist/',
      transforms: ['dt/size/pxToRem', 'dt/fonts/transformToStack', 'dt/fonts/weight', 'name/cti/camel'],
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },
  },
};
