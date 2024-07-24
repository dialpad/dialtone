/**
 * Builds and outputs css tokens using sd-transforms.
 */

import { registerTransforms, transforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { promises, readFileSync } from 'fs';

import { registerDialtoneTransforms } from './dialtone-transforms.js';
import { buildDocs } from './build-docs.js';
const Root = JSON.parse(readFileSync('./tokens/root.json', 'utf8'));
const BASE_FONT_SIZE = Root.font.size.root.value;

registerTransforms(StyleDictionary, {
  expand: {
    composition: true,
    typography: true,
    shadow: true,
    border: true,
  },
});

registerDialtoneTransforms(StyleDictionary);

StyleDictionary.registerAction({
  name: 'buildDocJson',
  do: function (dictionary, config) {
    const platformName = config.files[0].format.name;
    const theme = config.theme;
    buildDocs(platformName, theme, dictionary.properties);
  },
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css/tokens-studio',
  transforms: [...transforms, 'name/cti/kebab', 'dt/size/pxToRem', 'dt/space/pxToRem'].filter(transform => !['name/cti/camel', 'ts/size/px', 'ts/typography/css/fontFamily'].includes(transform)),
});

export async function run () {
  const $themes = JSON.parse(await promises.readFile('tokens/$themes.json', 'utf-8'));
  const $metadata = JSON.parse(await promises.readFile('tokens/$metadata.json', 'utf-8'));
  const configs = $themes.map(theme => {
    // use $metadata to iterate through the selected token sets
    // as this contains the correct token set order. The $themes
    // file does not.

    // includes are treated as SOURCE tokens, meaning they
    // will be used as a reference but will not be output.
    const include = $metadata
      .tokenSetOrder
      .filter(set => Object
        .entries(theme.selectedTokenSets)
        .filter(([, val]) => val === 'source')
        .map(([key]) => key).includes(set))
      .map(set => `tokens/${set}.json`);

    // files under the source property will be actually output
    // as part of the theme. Note the naming conflict between
    // style dictionary and tokens studio. Source tokens in
    // tokens studio are reference tokens, but in style dictionary
    // the "source" files are the files that are actually output and
    // "includes" are reference tokens.
    const source = $metadata
      .tokenSetOrder
      .filter(set => Object
        .entries(theme.selectedTokenSets)
        .filter(([, val]) => val === 'enabled')
        .map(([key]) => key).includes(set))
      .map(set => `tokens/${set}.json`);

    const themeName = `${theme.group}-${theme.name}`;

    return {
      source,
      include,
      platforms: {
        css: {
          transformGroup: 'custom/css/tokens-studio',
          actions: ['buildDocJson'],
          prefix: 'dt',
          basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
          buildPath: 'dist/css/',
          theme: themeName,
          files: [
            {
              destination: `tokens-${themeName}.css`,
              format: 'css/variables',
              filter: function (token) {
                if (token.isSource) return true;
                return false;
              },
            },
          ],
        },
        less: {
          transformGroup: 'custom/css/tokens-studio',
          prefix: 'dt',
          actions: ['buildDocJson'],
          basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
          buildPath: 'dist/less/',
          theme: themeName,
          files: [
            {
              destination: `tokens-${themeName}.less`,
              format: 'less/variables',
              filter: function (token) {
                if (token.isSource) return true;
                return false;
              },
            },
          ],
        },
        json: {
          prefix: 'dt',
          theme: themeName,
          buildPath: 'dist/',
          transforms: ['ts/resolveMath', 'dt/size/pxToRem', 'dt/space/pxToRem', 'dt/fonts/transformToStack', 'dt/lineHeight/percentToDecimal', 'name/cti/camel'],
          files: [
            {
              destination: `tokens-${themeName}.json`,
              format: 'json/flat',
              filter: function (token) {
                if (token.isSource) return true;
                return false;
              },
            },
          ],
        },
        android_xml: {
          transforms: ['attribute/cti', 'name/cti/snake', 'dt/android/xml/color', 'size/remToSp', 'size/remToDp'],
          actions: ['buildDocJson'],
          prefix: `dt_${themeName}`,
          theme: themeName,
          buildPath: 'dist/android/res/values/',
          files: [
            {
              destination: `colors-${themeName}.xml`,
              format: 'android/resources',
              resourceType: 'color',
              filter: function (token) {
                return ['color'].includes(token.type);
              },
            },
            {
              destination: 'dimens.xml',
              format: 'android/resources',
              resourceType: 'dimen',
              filter: function (token) {
                return ['sizing', 'borderRadius', 'fontSizes', 'borderWidth', 'spacing'].includes(token.type);
              },
            },
          ],
        },
        android_compose: {
          transforms: ['dt/android/compose/fonts/transformToStack', 'dt/android/compose/fonts/weight', 'dt/android/compose/lineHeight/percentToDecimal', 'dt/android/compose/opacity/percentToFloat', 'dt/android/compose/size/pxToDp', 'dt/android/compose/size/pxToSp', 'dt/android/compose/color', 'dt/stringify', 'attribute/cti', 'name/cti/camel'],
          actions: ['buildDocJson'],
          prefix: 'dt',
          theme: themeName,
          buildPath: 'dist/android/java/',
          options: {
            import: ['androidx.compose.ui.graphics.Color', 'androidx.compose.ui.unit.*', 'androidx.compose.ui.text.font.FontWeight', 'androidx.compose.ui.text.font.FontFamily'],
          },
          files: [
            {
              destination: `tokens-${themeName}.kt`,
              format: 'compose/object',
              packageName: 'dialtone.dialpad',
              className: `DialtoneTokens${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`,
            },
          ],
        },
        ios: {
          transforms: ['dt/ios/fonts/transformToStack', 'attribute/cti', 'name/cti/camel', 'dt/ios/color', 'dt/ios/size/pxToCGFloat', 'dt/ios/lineHeight/percentToDecimal', 'dt/stringify'],
          actions: ['buildDocJson'],
          prefix: 'dt',
          theme: themeName,
          buildPath: 'dist/ios/',
          files: [
            {
              destination: `tokens-${themeName}.swift`,
              format: 'ios-swift/enum.swift',
              className: `DialtoneTokens${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`,
            },
          ],
        },
      },
    };
  });

  configs.forEach(cfg => {
    const sd = StyleDictionary.extend(cfg);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}
