/**
 * Builds and outputs css tokens using sd-transforms.
 */

import { registerTransforms, permutateThemes, transforms } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { promises } from 'fs';

import { registerDialtoneTransforms } from './dialtone-transforms.js';
import { buildDocs } from './build-docs.js';
import Root from './tokens/root.json' assert {
  type: 'json',
};
const BASE_FONT_SIZE = Root.font.size.root.value;

registerTransforms(StyleDictionary, {
  expand: {
    composition: true,
    typography: true,
    shadow: true,
    border: true,
  }
});

registerDialtoneTransforms(StyleDictionary);

StyleDictionary.registerAction({
  name: 'buildDocJson',
  do: function(dictionary, config) {
    const platformName = config.files[0].format.name;
    const theme = config.theme;
    buildDocs(platformName, theme, dictionary.properties);
  },
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css/tokens-studio',
  transforms: [...transforms, 'name/cti/kebab', 'dt/size/pxToRem', 'dt/space/pxToRem'].filter(transform => !transform.includes('name/cti/camel', 'ts/size/px')),
});

export async function run() {
  const $themes = JSON.parse(await promises.readFile('tokens/$themes.json', 'utf-8'));
  const $metadata = JSON.parse(await promises.readFile('tokens/$metadata.json', 'utf-8'));
  const configs = $themes.slice(0, 2).map(theme => ({

    // use $metadata to iterate through the selected token sets
    // as this contains the correct token set order. The $themes
    // file does not.
    source: $metadata.tokenSetOrder.filter(set => {
        return Object.entries(theme.selectedTokenSets).filter(([, val]) => val !== 'disabled').map(([key, val]) => key).includes(set);
      }).map(set => `tokens/${set}.json`),
    platforms: {
      css: {
        transformGroup: 'custom/css/tokens-studio',
        actions: ['buildDocJson'],
        prefix: 'dt',
        basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
        buildPath: 'dist/css/',
        theme: theme.name,
        files: [
          {
            destination: `variables-${theme.name}.css`,
            format: 'css/variables',
            options: {
              selector: `.dialtone-theme-${theme.name}`
            }
          },
        ],
      },
      less: {
        transformGroup: 'custom/css/tokens-studio',
        prefix: 'dt',
        actions: ['buildDocJson'],
        basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
        buildPath: 'dist/less/',
        theme: theme.name,
        files: [
          {
            destination: `variables-${theme.name}.less`,
            format: 'less/variables',
          },
        ],
      },
    },
  }));

  configs.forEach(cfg => {
    const sd = StyleDictionary.extend(cfg);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}
