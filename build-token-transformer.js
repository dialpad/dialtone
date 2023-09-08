#!/usr/bin/env node

/**
 * contains all the transforms for non CSS / LESS since these
 * are not yet supported by sd-transforms.
 */

import StyleDictionary from 'style-dictionary';

export const THEMES = ['light', 'dark'];

import { registerDialtoneTransforms } from './dialtone-transforms.js';
import { buildDocs } from './build-docs.js';

registerDialtoneTransforms(StyleDictionary);

StyleDictionary.registerAction({
  name: 'buildDocJson',
  do: function(dictionary, config) {
    const platformName = config.files[0].format.name;
    const theme = config.theme;
    buildDocs(platformName, theme, dictionary.properties);
  },
});

export function run() {
  const configs = THEMES.map((theme) => {
    return {
      source: [`token_transformer/tokens-${theme}.json`],
      platforms: {
        android_xml: {
          transforms: ['attribute/cti', 'name/cti/snake', 'dt/android/xml/color', 'size/remToSp', 'size/remToDp'],
          actions: ['buildDocJson'],
          prefix: `dt_${theme}`,
          theme: theme,
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
          transforms: ['dt/android/compose/fonts/transformToStack', 'dt/android/compose/fonts/weight',  'dt/android/compose/lineHeight/percentToDecimal', 'dt/android/compose/opacity/percentToFloat', 'dt/android/compose/size/pxToDp', 'dt/android/compose/size/pxToSp', 'dt/android/compose/color', 'dt/stringify', 'attribute/cti', 'name/cti/camel'],
          actions: ['buildDocJson'],
          prefix: 'dt',
          theme: theme,
          buildPath: 'dist/android/java/',
          options: {
            import: ['androidx.compose.ui.graphics.Color', 'androidx.compose.ui.unit.*', 'androidx.compose.ui.text.font.FontWeight', 'androidx.compose.ui.text.font.FontFamily'],
          },
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
          theme: theme,
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
          theme: theme,
          buildPath: 'dist/',
          transforms: ['dt/size/pxToRem', 'dt/space/pxToRem', 'dt/fonts/transformToStack', 'dt/lineHeight/percentToDecimal', 'name/cti/camel'],
          files: [
            {
              destination: `tokens-${theme}.json`,
              format: 'json/flat',
            },
          ],
        },
      },
    }
  });

  configs.forEach(cfg => {
    const sd = StyleDictionary.extend(cfg);
    sd.buildAllPlatforms();
  });
}
