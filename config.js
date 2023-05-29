const getStyleDictionaryConfig = (theme) => {
  return {
    source: [`tokens/tokens-${theme}.json`],
    platforms: {
      less: {
        transforms: ['dt/size/pxToRem', 'dt/fonts/transformToStack', 'dt/lineHeight/percentToDecimal', 'attribute/cti', 'name/cti/kebab', 'time/seconds', 'content/icon', 'color/hex'],
        prefix: 'dt',
        buildPath: 'dist/less/',
        files: [
          {
            destination: `variables-${theme}.less`,
            format: 'less/variables',
          },
        ],
      },
      css: {
        transforms: ['dt/size/pxToRem', 'dt/fonts/transformToStack', 'dt/lineHeight/percentToDecimal', 'attribute/cti', 'name/cti/kebab', 'time/seconds', 'content/icon', 'size/rem', 'color/css'],
        actions: ['buildDocJson'],
        prefix: 'dt',
        buildPath: 'dist/css/',
        files: [
          {
            destination: `variables-${theme}.css`,
            format: 'css/variables',
            options: {
              selector: `.dialtone-theme-${theme}`
            }
          },
        ],
      },
      android_xml: {
        transforms: ['attribute/cti', 'name/cti/snake', 'dt/android/color', 'size/remToSp', 'size/remToDp'],
        actions: ['buildDocJson'],
        prefix: `dt_${theme}`,
        buildPath: 'dist/android/res/values/',
        files: [
          {
            destination: `colors-${theme}.xml`,
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
        transforms: ['dt/android/compose/fonts/transformToStack', 'dt/android/fonts/weight',  'dt/android/lineHeight/percentToDecimal', 'dt/android/opacity/percentToFloat', 'dt/android/size/pxToDp', 'dt/android/size/pxToSp', 'dt/android/compose/color', 'dt/stringify', 'attribute/cti', 'name/cti/camel'],
        actions: ['buildDocJson'],
        prefix: 'dt',
        buildPath: 'dist/android/java/',
        files: [
          {
            destination: `tokens-${theme}.kt`,
            format: 'compose/object',
            packageName: 'design.dialpad',
            className: `DialtoneTokens${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
          }
        ]
      },
      ios: {
        transforms: ['dt/ios/fonts/transformToStack',  'attribute/cti', 'name/cti/camel', 'dt/ios/color', 'dt/ios/size/pxToCGFloat', 'dt/ios/lineHeight/percentToDecimal', 'dt/stringify'],
        actions: ['buildDocJson'],
        prefix: 'dt',
        buildPath: 'dist/ios/',
        files: [
          {
            destination: `tokens-${theme}.swift`,
            format: 'ios-swift/enum.swift',
            className: `DialtoneTokens${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
          },
        ],
      },
      json: {
        prefix: 'dt',
        buildPath: 'dist/',
        transforms: ['dt/size/pxToRem', 'dt/fonts/transformToStack', 'dt/lineHeight/percentToDecimal', 'name/cti/camel'],
        files: [
          {
            destination: `tokens-${theme}.json`,
            format: 'json/flat',
          },
        ],
      },
    },
  }
};

exports.getStyleDictionaryConfig = getStyleDictionaryConfig;
