/**
 * Builds and outputs layered css tokens using sd-transforms.
 * This generates separate files for core (non-color) tokens and brand-specific color tokens.
 */

/* eslint-disable complexity */

import { register, getTransforms, expandTypesMap } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { existsSync, promises, readFileSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';

import { registerDialtoneTransforms, registerDialtonePreprocessors, registerRelativeColorWrap, isMaterialNamespaceRef } from './dialtone-transforms.js';
import { buildDocs } from './build-docs.js';
const Root = JSON.parse(readFileSync('./tokens/root.json', 'utf8'));
const BASE_FONT_SIZE = Root.font.size.root.value;

register(StyleDictionary);
registerDialtoneTransforms(StyleDictionary);
registerDialtonePreprocessors(StyleDictionary);
registerRelativeColorWrap(StyleDictionary);

/**
 * Default `outputReferences` policy for layered builds: emit `var(--…)` for
 * most token references, but resolve to literals for cases where the var form
 * is wrong or the consumer expects a numeric:
 *   - avatar.anchor.hue: must be a numeric hue, not a var()
 *   - studio-tokens-modified values + boxShadow colors: rgb-encoded, not refable
 *   - {material.*} refs: belong to the runtime material override, not this output
 */
function defaultLayeredOutputReferences (token) {
  if (token.path?.join('.') === 'avatar.anchor.hue') return false;
  if (token.$extensions?.['studio.tokens']?.modify ||
      (token.$extensions?.['studio.tokens']?.originalType === 'boxShadow' && token.type === 'color')) return false;
  if (isMaterialNamespaceRef(token)) return false;
  return true;
}

// Token filter functions
const isColorToken = (token) => {
  return token.type === 'color' ||
         token.path?.includes('shadow') ||
         token.path?.includes('gradient') ||
         (token.path?.includes('color') && !token.path?.includes('scheme'));
};

const isCoreToken = (token) => {
  // Core tokens are non-color tokens that don't change between themes
  // This includes both base tokens AND component tokens
  return !isColorToken(token) &&
         token.isSource &&
         !token.path?.includes('action') && // Action tokens often have colors
         !token.path?.includes('shell') &&  // Shell tokens often have colors
         !token.path?.includes('theme');    // Theme tokens are brand-specific
};

StyleDictionary.registerAction({
  name: 'buildDocJson',
  do: function (dictionary, config) {
    const platformName = config.files[0].format.name || config.files[0].format;
    const theme = config.theme;
    buildDocs(platformName, theme, dictionary.allTokens);
  },
  undo: function () {},
});

StyleDictionary.registerTransformGroup({
  name: 'custom/css/tokens-studio',
  transforms: [...getTransforms({ platform: 'css' }), 'name/kebab', 'dt/size/pxToRem', 'dt/space/pxToRem', 'dt/lineHeight/percentToDecimal', 'dt/avatar/anchorHue']
    .filter(transform => !['name/camel', 'ts/size/px', 'ts/typography/css/fontFamily'].includes(transform)),
});

/**
 * Build layered tokens for a brand
 * @param {string} brandName - Name of the brand (e.g., 'dp', 'tmo')
 * @param {Array} lightThemeConfig - Configuration for light theme
 * @param {Array} darkThemeConfig - Configuration for dark theme
 */
async function buildLayeredTokensForBrand(brandName, lightThemeConfig, darkThemeConfig) {
  const configs = [];

  // 1. Build core tokens (only once, not brand-specific)
  if (brandName === 'dp') { // Only build core tokens once
    const coreConfig = {
      // Include both base AND dp sources to get all non-color tokens
      source: [...lightThemeConfig.include, ...lightThemeConfig.source],
      preprocessors: ['tokens-studio', 'dt/relative-color/extract'],
      expand: {
        typesMap: expandTypesMap,
      },
      include: [],
      platforms: {
        css: {
          transformGroup: 'custom/css/tokens-studio',
          actions: ['buildDocJson'],
          prefix: 'dt',
          basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
          buildPath: 'dist/css/layered/',
          theme: 'core',
          options: {
            outputReferences: true,
          },
          files: [
            {
              destination: 'tokens-core.css',
              format: 'css/variables',
              filter: isCoreToken,
            },
          ],
        },
      },
      log: {
        warnings: 'disabled',
        verbosity: 'default',
        errors: {
          brokenReferences: 'throw',
        },
      },
    };
    configs.push(coreConfig);
  }

  // 2. Build brand color tokens (light and dark separately, then combine)
  // Build light colors
  const lightColorConfig = {
    source: lightThemeConfig.source,
    preprocessors: ['tokens-studio', 'dt/relative-color/extract'],
    expand: {
      typesMap: expandTypesMap,
    },
    include: lightThemeConfig.include,
    platforms: {
      css: {
        transformGroup: 'custom/css/tokens-studio',
        actions: ['buildDocJson'],
        prefix: 'dt',
        basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
        buildPath: 'dist/css/layered/',
        theme: `${brandName}-light`,
        options: { outputReferences: defaultLayeredOutputReferences },
        files: [
          {
            destination: `tokens-${brandName}-colors-light.css`,
            format: 'css/variables',
            filter: (token) => isColorToken(token) && token.isSource,
          },
        ],
      },
    },
    log: {
      warnings: 'disabled',
      verbosity: 'default',
      errors: {
        brokenReferences: 'throw',
      },
    },
  };

  // Build dark colors
  const darkColorConfig = {
    source: darkThemeConfig.source,
    preprocessors: ['tokens-studio', 'dt/relative-color/extract'],
    expand: {
      typesMap: expandTypesMap,
    },
    include: darkThemeConfig.include,
    platforms: {
      css: {
        transformGroup: 'custom/css/tokens-studio',
        actions: ['buildDocJson'],
        prefix: 'dt',
        basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
        buildPath: 'dist/css/layered/',
        theme: `${brandName}-dark`,
        options: { outputReferences: defaultLayeredOutputReferences },
        files: [
          {
            destination: `tokens-${brandName}-colors-dark.css`,
            format: 'css/variables',
            filter: (token) => isColorToken(token) && token.isSource,
          },
        ],
      },
    },
    log: {
      warnings: 'disabled',
      verbosity: 'default',
      errors: {
        brokenReferences: 'throw',
      },
    },
  };

  configs.push(lightColorConfig, darkColorConfig);

  // Build all configurations
  for (const cfg of configs) {
    const sd = new StyleDictionary(cfg);
    await sd.hasInitialized;
    await sd.cleanAllPlatforms();
    await sd.buildAllPlatforms();
  }

  // Combine the per-mode color files into a single tokens-{brand}-colors.css
  // with [data-dt-mode] selectors. Math expressions get wrapped in calc().
  const lightFile = path.join('dist/css/layered', `tokens-${brandName}-colors-light.css`);
  const darkFile = path.join('dist/css/layered', `tokens-${brandName}-colors-dark.css`);
  const combinedFile = path.join('dist/css/layered', `tokens-${brandName}-colors.css`);

  if (existsSync(lightFile) && existsSync(darkFile)) {
    const lightVars = extractRootVarsWithCalc(readFileSync(lightFile, 'utf8'));
    const darkVars = extractRootVarsWithCalc(readFileSync(darkFile, 'utf8'));

    const indent = (vars) => vars.split('\n').map(line => '  ' + line.trim()).filter(l => l.trim()).join('\n');
    const combined = `/**
 * Do not edit directly, this file was auto-generated.
 */

/* Light mode */
[data-dt-mode="light"] {
  color-scheme: light;
${indent(lightVars)}
}

/* Dark mode */
[data-dt-mode="dark"] {
  color-scheme: dark;
${indent(darkVars)}
}`;

    writeFileSync(combinedFile, combined);
    unlinkSync(lightFile);
    unlinkSync(darkFile);
  }
}

/**
 * Extract `--var: value;` declarations from a `:root { ... }` block, then
 * wrap any math expressions (`var(...) + var(...)`) in `calc()` if they
 * aren't already.
 */
function extractRootVarsWithCalc (content) {
  const match = content.match(/:root\s*{([^}]*)}/s);
  const vars = match ? match[1].trim() : '';
  return vars.replace(/:\s*(var\([^)]+\)\s*[+\-*/][^;]+);/g, (m, expression) =>
    expression.includes('calc(') ? m : `: calc(${expression});`,
  );
}

/**
 * Main function to run layered token generation
 */
export async function runLayeredTokens() {
  const $themes = JSON.parse(await promises.readFile('tokens/$themes.json', 'utf-8'));
  const $metadata = JSON.parse(await promises.readFile('tokens/$metadata.json', 'utf-8'));

  // Group themes by brand
  const themesByBrand = {};

  $themes.forEach(theme => {
    const brand = theme.group || 'base';
    if (!themesByBrand[brand]) {
      themesByBrand[brand] = { light: null, dark: null };
    }

    if (theme.name === 'light' || theme.name === 'default') {
      themesByBrand[brand].light = theme;
    } else if (theme.name === 'dark') {
      themesByBrand[brand].dark = theme;
    }
  });

  // Process each brand
  for (const [brandName, themes] of Object.entries(themesByBrand)) {
    // Only process brands that have both light and dark themes
    if (themes.light && themes.dark) {
      console.log(`Building layered tokens for brand: ${brandName}`);

      const lightConfig = prepareLayeredConfig(themes.light, $metadata);
      const darkConfig = prepareLayeredConfig(themes.dark, $metadata);

      await buildLayeredTokensForBrand(brandName, lightConfig, darkConfig);
    }
  }

  // Build high contrast tokens (separate from brand themes)
  console.log('\nBuilding high contrast tokens...');
  const highContrastThemes = $themes.filter(t => t.group === 'contrast' && t.name.includes('high'));
  for (const theme of highContrastThemes) {
    await runOverrideBuild(theme, $metadata, {
      buildPath: 'dist/css/layered/contrast/',
      outputReferences: defaultLayeredOutputReferences,
    });
  }

  // Build per-material override tokens (one CSS file per material per mode).
  // Sandstone is the implicit default and ships in base CSS, so no override file.
  console.log('\nBuilding material override tokens...');
  const materialThemes = $themes.filter(t => t.group === 'material' && t.name !== 'sandstone');
  for (const theme of materialThemes) {
    await runOverrideBuild(theme, $metadata, {
      buildPath: 'dist/css/layered/material/',
      // Resolve {material.*} refs to literal OKLCH values — the runtime injection
      // re-binds --dt-color-black-N from these literals.
      outputReferences: false,
    });
  }

  console.log('Layered token generation complete!');
}

/**
 * Resolve a Tokens Studio theme entry's `selectedTokenSets` to Style Dictionary
 * `source` (output) and `include` (reference-only) file paths, ordered by the
 * canonical `tokenSetOrder`.
 *
 * The Tokens Studio "source" semantic maps to SD's `include`, and "enabled"
 * maps to SD's `source`. (Tokens Studio "source" = referenced; SD "source" =
 * emitted. Naming collision predates this code.)
 */
function prepareLayeredConfig(theme, $metadata) {
  const roleByPath = new Map(Object.entries(theme.selectedTokenSets));
  const collect = (role) => $metadata.tokenSetOrder
    .filter(set => roleByPath.get(set) === role)
    .map(set => `tokens/${set}.json`);
  return {
    source: collect('enabled'),
    include: collect('source'),
  };
}

/**
 * Build a single override CSS file from a Tokens Studio theme entry.
 * Shared by the high-contrast and material build steps — they differ only in
 * `buildPath` and the `outputReferences` policy passed in by the caller.
 */
async function runOverrideBuild(theme, $metadata, { buildPath, outputReferences }) {
  const { source, include } = prepareLayeredConfig(theme, $metadata);
  const config = {
    source,
    preprocessors: ['tokens-studio', 'dt/relative-color/extract'],
    expand: { typesMap: expandTypesMap },
    include,
    platforms: {
      css: {
        transformGroup: 'custom/css/tokens-studio',
        prefix: 'dt',
        basePxFontSize: Number.parseFloat(BASE_FONT_SIZE),
        buildPath,
        theme: theme.name,
        options: { outputReferences },
        files: [{
          destination: `tokens-${theme.name}.css`,
          format: 'css/variables',
          filter: (token) => isColorToken(token) && token.isSource,
        }],
      },
    },
    log: { warnings: 'disabled', verbosity: 'default', errors: { brokenReferences: 'throw' } },
  };
  const sd = new StyleDictionary(config);
  await sd.hasInitialized;
  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();
}

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runLayeredTokens().catch(console.error);
}
