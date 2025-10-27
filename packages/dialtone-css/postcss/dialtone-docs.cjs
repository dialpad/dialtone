const fs = require('fs').promises;
const path = require('path');
const { readdirSync } = require('node:fs');

/**
 * Had to duplicate this function to avoid asynchronous issues with postcss plugins
 * TODO: Find a way to avoid duplication of this function from /common/utils/server.mjs
 * Scans recursively through the provided path
 * and gets the valid contained Vue components and recipes.
 * @param {PathLike} folder
 * @returns {PathLike[]}
 */
function getValidFileList (folder) {
  const parentFolderName = folder.split('/').pop();
  const excludedFolderNamesRegex = /(extensions|modules|decorators)$/;
  const validFileNamesRegex = new RegExp(`^${parentFolderName}\\w*\\.vue$`);

  return readdirSync(folder, { withFileTypes: true })
    .filter((item) => {
      return (item.isDirectory() && !excludedFolderNamesRegex.test(item.name)) ||
      validFileNamesRegex.test(item.name);
    })
    .reduce((files, item) => {
      if (item.isDirectory()) files = [...files, ...getValidFileList(`${folder}/${item.name}`)];
      else files.push(`${folder}/${item.name}`);

      return files;
    }, []);
}

/**
 * @returns {RegExp} Regular expression to match excluding class names
 */
function generateExclusionRegex () {
  const dialtoneVue3ComponentsPath = path.resolve(__dirname, '../../dialtone-vue3/components');
  const customList = ['recipe', 'btn', 'zoom', 'select', 'validation-message', 'label', 'description', 'split-btn', 'mention-suggestion', 'suggestion-list', 'context-menu', 'textarea', 'list-group', 'scrollbar']; // Includes special or wrong naming conventions

  const componentList = getValidFileList(dialtoneVue3ComponentsPath);

  return new RegExp([...componentList, ...customList]
    .map(string => {
      const name = string.split('/').pop().replace('.vue', '').replaceAll('_', '-');
      return `d-${name}.*`;
    })
    .join('|'),
  );
}

const documentation = {};
const CSSVarRegex = /var\(([^),]+)\)/g;

/**
 * Metadata rules for utility classes
 * Maps patterns to metadata that should be added to the documentation
 * Based on eslint-plugin-dialtone rules
 */
const metadataRules = [
  // Typography utilities (discouraged per recommend-typography-style.js eslint rule)
  {
    pattern: /^d-(fw-|ff-|fs-|lh-|helper-)/,
    metadata: {
      deprecated: false,
      discouraged: true,
      category: 'typography',
      reason: 'Individual typography utilities are discouraged in favor of composed typography classes',
      alternatives: ['d-headline-*', 'd-body-*', 'd-label-*', 'd-code-*', 'd-helper-*'],
      docs: 'https://dialtone.dialpad.com/design/typography/#api',
    },
  },
  // Base colors (deprecated per deprecated-base-color-classes.js eslint rule)
  {
    pattern: /^d-(bgc|fc|bc|divide)-\w+-\d{2,4}$/,
    metadata: {
      deprecated: true,
      discouraged: true,
      category: 'color',
      reason: 'Base color utilities are deprecated and will be removed in the future',
      alternatives: ['d-fc-primary', 'd-fc-secondary', 'd-fc-tertiary', 'd-bgc-critical', 'd-bgc-success', 'd-bc-default'],
      docs: 'https://dialtone.dialpad.com/utilities/backgrounds/color.html',
    },
  },
  // Flex gap (deprecated per deprecated-flex-gap-classes.js eslint rule)
  {
    pattern: /^d-flg\d{1,2}$/,
    metadata: {
      deprecated: true,
      discouraged: true,
      category: 'flex',
      reason: 'Flex gap utilities are deprecated and will be removed in the future',
      alternatives: ['d-g8', 'd-rg8', 'd-cg8'],
      docs: 'https://dialtone.dialpad.com/utilities/flex/gap.html',
    },
  },
  // Grid gap (deprecated per deprecated-grid-gap-classes.js eslint rule)
  {
    pattern: /^d-(gg|grg|gcg)\d{1,2}$/,
    metadata: {
      deprecated: true,
      discouraged: true,
      category: 'grid',
      reason: 'Grid gap utilities are deprecated and will be removed in the future',
      alternatives: ['d-g8', 'd-rg8', 'd-cg8'],
      docs: 'https://dialtone.dialpad.com/utilities/grid/gap.html',
    },
  },
];

/**
 * Get metadata for a utility class based on pattern matching
 * @param {string} className - The utility class name to check
 * @returns {object|null} Metadata object if a rule matches, null otherwise
 */
function getMetadataForClass (className) {
  for (const rule of metadataRules) {
    if (rule.pattern.test(className)) {
      return rule.metadata;
    }
  }
  return null;
}

/**
 * Generate dialtone-docs.json
 * @param docs
 * @param {import('postcss').Rule} rule
 */
function generateUtilityClassDocumentation (docs, rule) {
  const className = rule.selector.split(/(,|\s)/)[0].replace(/^\.(.+)/, '$1');

  const values = rule.nodes.map(node => {
    const _value = node.value;
    const _important = node.important ? ' !important' : '';

    const result = {
      prop: node.prop,
      value: `${_value}${_important}`,
    };

    // Important to use match instead of test due to we're reusing the regex
    // https://stackoverflow.com/a/21373261/16506300
    if (_value.match(CSSVarRegex)) {
      result.description = replaceVariableValue(docs, _value, 'dp-light');
    }

    return result;
  });

  const metadata = getMetadataForClass(className);

  documentation[className] = {
    values,
    ...(metadata && { metadata }),
  };
}

/**
 * Check if a token should have metadata added
 * @param {string} tokenName - The token name to check
 * @returns {object|null} Metadata object if token matches a rule, null otherwise
 */
function getMetadataForToken (tokenName) {
  // Base primitive tokens (--base--*) - not meant for direct use
  if (tokenName.startsWith('--base--')) {
    return {
      deprecated: false,
      discouraged: true,
      category: 'internal',
      reason: 'Base tokens are internal primitive values. Use semantic design tokens or CSS utility classes instead',
      alternatives: [],
      docs: 'https://dialtone.dialpad.com/design/tokens/',
    };
  }

  // Tokens ending with -base or -root (internal primitive values)
  // These are not meant for direct use
  if (tokenName.endsWith('-base') || tokenName.endsWith('-root')) {
    return {
      deprecated: false,
      discouraged: true,
      category: 'internal',
      reason: 'Base and root tokens are internal primitive values. Use semantic design tokens or CSS utility classes instead',
      alternatives: [],
      docs: 'https://dialtone.dialpad.com/design/tokens/',
    };
  }

  // Theme tokens (--dt-theme-*) are deprecated in favor of shell tokens
  if (tokenName.startsWith('--dt-theme-')) {
    return {
      deprecated: true,
      discouraged: true,
      category: 'deprecated',
      reason: 'Theme tokens have been replaced by shell tokens',
      alternatives: ['--dt-shell-*'],
      docs: 'https://dialtone.dialpad.com/design/tokens/',
    };
  }

  return null;
}

function generateTokensDocumentation (documentation) {
  const docs = {};

  for (const theme in documentation) {
    Object.values(documentation[theme])
      .forEach(DocEntry => {
        const CSSVarEntry = DocEntry['css/variables'];
        const token = CSSVarEntry.name.replace(CSSVarRegex, '$1');
        const description = CSSVarEntry.description;
        const value = CSSVarEntry.value;

        docs[token] = {
          ...docs[token],
          [theme]: {
            value,
            description,
          },
        };
      });
  }

  return docs;
}

/**
 * Recursively replaces CSS Variables with its primitive value
 * @param {Object} docs
 * @param {String} variable
 * @param {String} theme
 * @returns {String}
 */
function replaceVariableValue (docs, variable, theme) {
  let value = variable;
  let missingToken = false;
  const baseTheme = theme.replace(/\w+-([\w-]+)/, 'base-$1');

  if (!CSSVarRegex.test(value)) return value;

  do {
    value = value.replace(CSSVarRegex, (match) => {
      const tokenName = match.replace(CSSVarRegex, '$1');

      if (!docs[tokenName]) {
        console.warn(`Missing token value for: ${tokenName}`);
        missingToken = true;
        return match;
      }

      const tokenValue = docs[tokenName][theme] || docs[tokenName][baseTheme];

      if (!tokenValue) {
        console.warn(`Missing ${tokenName} value on themes: [${theme}, ${baseTheme}]`);
        missingToken = true;
        return match;
      }

      return tokenValue.value;
    });
  } while (!missingToken && CSSVarRegex.test(value));

  return value;
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = () => {
  const rawTokensDocumentation = require(path.resolve(__dirname, '../node_modules/@dialpad/dialtone-tokens/dist/doc.json'));
  const tokensDocs = generateTokensDocumentation(rawTokensDocumentation);
  const exclusionRegex = generateExclusionRegex();

  return {
    postcssPlugin: 'postcss-dialtone-documentation',
    async Once (root) {
      // There are many variables that exists only within dialtone-default-theme.css
      // (Should they be included on dialtone-tokens doc.json?)
      // So we need to walk such declaration and add them to the generated tokensDocs;
      root.walkDecls(/^--(.+)/, decl => {
        const token = decl.prop;

        if (tokensDocs[token]) return;

        tokensDocs[token] = {
          'dp-light': {
            value: decl.value,
          },
        };
      });
    },
    async Rule (rule) {
      if (!/^\.(d-|\w{2}\\:)/.test(rule.selector) || exclusionRegex.test(rule.selector)) return;
      generateUtilityClassDocumentation(tokensDocs, rule);
    },
    async OnceExit () {
      // Iterate over tokens documentation to replace reference variables with primitive values
      const docs = Object.keys(tokensDocs).reduce((tokens, token) => {
        const metadata = getMetadataForToken(token);

        tokens[token] = {
          ...Object.keys(tokensDocs[token]).reduce((themes, theme) => {
            const originalValue = tokensDocs[token][theme].value;
            themes[theme] = {
              ...tokensDocs[token][theme],
              value: replaceVariableValue(tokensDocs, originalValue, theme),
            };
            return themes;
          }, {}),
          ...(metadata && { metadata }),
        };
        return tokens;
      }, {});

      // console.log(tokensDocs);

      await fs.writeFile(path.resolve(__dirname, '../lib/dist/dialtone-docs.json'), JSON.stringify(documentation), 'utf-8');
      await fs.writeFile(path.resolve(__dirname, '../lib/dist/tokens-docs.json'), JSON.stringify(docs), 'utf-8');
    },
  };
};

module.exports.postcss = true;
