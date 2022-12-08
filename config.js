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
      actions: ['buildDocJson'],
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
      transforms: ['attribute/cti', 'name/cti/snake', 'dt/android/color', 'size/remToSp', 'size/remToDp'],
      actions: ['buildDocJson'],
      prefix: 'dt',
      buildPath: 'dist/android/res/values/',
      files: [
        {
          destination: 'colors.xml',
          format: 'android/resources',
          resourceType: 'color',
          filter: function(token) {
            return ['color'].includes(token.type);
          },
        },
        {
          destination: 'dimens.xml',
          format: 'android/resources',
          resourceType: 'dimen',
          filter: function(token) {
              return ['sizing', 'borderRadius', 'fontSizes', 'borderWidth', 'spacing'].includes(token.type);
          },
        },
      ],
    },
    android_compose: {
      transforms: ['dt/android/compose/fonts/transformToStack',  'dt/lineHeight/percentToDecimal', 'dt/android/size/pxToDp', 'dt/android/size/pxToSp', 'dt/android/compose/color', 'dt/stringify', 'attribute/cti', 'name/cti/camel'],
      actions: ['buildDocJson'],
      prefix: 'dt',
      buildPath: 'dist/android/java/',
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
      transforms: ['dt/fonts/transformToStack',  'attribute/cti', 'name/cti/camel', 'dt/ios/color', 'dt/ios/size/pxToCGFloat', 'dt/ios/lineHeight/percentToDecimal', 'dt/stringify'],
      actions: ['buildDocJson'],
      prefix: 'dt',
      buildPath: 'dist/ios/',
      files: [
        {
          destination: 'tokens.swift',
          format: 'ios-swift/enum.swift',
          className: 'DialtoneTokens',
          filter: function(token) {
            return token.path[0] !== 'tokenSetOrder';
          },
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
