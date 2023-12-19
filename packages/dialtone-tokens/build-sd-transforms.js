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

  const themes = permutateThemes($themes);
  const configs = Object.entries(themes).map(([name, tokensets]) => {
    return {

    source: tokensets.map(tokenset => `tokens/${tokenset}.json`),
    platforms: {
      css: {
        transformGroup: 'custom/css/tokens-studio',
        prefix: 'dt',
        basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
        buildPath: 'dist/css/',
        theme: name,
        files: [
          {
            destination: `variables-${name}.css`,
            format: 'css/variables',
            options: {
              selector: `.dialtone-theme-${name}`
            }
          },
        ],
      },
      less: {
        transformGroup: 'custom/css/tokens-studio',
        prefix: 'dt',
        basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
        buildPath: 'dist/less/',
        theme: name,
        files: [
          {
            destination: `variables-${name}.less`,
            format: 'less/variables',
          },
        ],
      },
    },
  }});

  configs.forEach(cfg => {
    const sd = StyleDictionary.extend(cfg);
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
  });
}
