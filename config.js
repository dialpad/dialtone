module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    less: {
      transformGroup: 'less',
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
      transformGroup: 'css',
      prefix: 'dt',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
    android: {
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
      transforms: ['name/cti/camel'],
      files: [
        {
          destination: 'tokens.json',
          format: 'json/flat',
        },
      ],
    },
  },
};
