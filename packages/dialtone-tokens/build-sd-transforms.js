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
    const source = $metadata
      .tokenSetOrder
      .filter(set => Object
        .entries(theme.selectedTokenSets)
        .filter(([, val]) => val !== 'disabled')
        .map(([key]) => key).includes(set))
      .map(set => `tokens/${set}.json`);

    let themeName = theme.name;

    if (theme.group !== 'dp') {
      themeName = `${theme.group}-${theme.name}`;
    }

    return {
      source,
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
              destination: `variables-${themeName}.css`,
              format: 'css/variables',
              options: {
                selector: `.dialtone-theme-${themeName}`,
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
              destination: `variables-${themeName}.less`,
              format: 'less/variables',
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
