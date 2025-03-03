const fs = require('fs').promises;
const path = require('path');
const tokensDocs = require(path.resolve(__dirname, '../lib/dist/tokens-docs.json'));

/**
 * @returns {RegExp} Regular expresion to match excluding class names
 */
async function generateExclusionRegex () {
  const serverUtilsPath = path.resolve(__dirname, '../../../common/utils/server.mjs');
  const dialtoneVue3ComponentsPath = path.resolve(__dirname, '../../dialtone-vue3/components');
  const customList = ['recipe', 'btn', 'zoom', 'select', 'validation-message', 'label', 'description', 'split-btn', 'mention-suggestion', 'suggestion-list', 'context-menu', 'textarea', 'list-group', 'scrollbar']; // Includes special or wrong naming conventions

  const { getValidFileList } = await import(serverUtilsPath);
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
 *
 * @param {import('postcss').Rule} rule
 */
function generateDocumentation (rule) {
  const className = rule.selector.split(/(,|\s)/)[0].replace(/^\.(.+)/, '$1');

  const values = rule.nodes.map(node => {
    const _value = node.value;
    const _important = node.important ? ' !important' : '';

    if (!CSSVarRegex.test(_value)) {
      return {
        prop: node.prop,
        value: `${_value}${_important}`,
      };
    }

    const _primitiveValue = _value.replace(CSSVarRegex, (match) => replaceVariableValue(match));

    return {
      prop: node.prop,
      value: `${_value}${_important}`,
      description: _primitiveValue,
    };
  });

  documentation[className] = { values };
}

/**
 * Recursively replaces CSS Variables with its primitive value
 * @param {String} variable
 * @returns {String}
 */
function replaceVariableValue (variable) {
  let value = variable;
  let missingToken = false;

  if (!CSSVarRegex.test(value)) return value;

  do {
    value = value.replace(CSSVarRegex, (match) => {
      const tokenName = match.replace(CSSVarRegex, '$1');
      const tokenValue = tokensDocs[tokenName];

      if (!tokenValue) {
        console.warn('Missing token value: ', tokenName);
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
  let exclusionRegex;

  return {
    postcssPlugin: 'postcss-dialtone-documentation',
    async Once (root) {
      exclusionRegex = await Promise.resolve(generateExclusionRegex());

      // There are many variables that exists only within dialtone-default-theme.css
      // (Should they be included on dialtone-tokens doc.json?)
      // So we need to walk such declaration and add them to the generated tokensDocs;
      root.walkDecls(decl => {
        const match = /^--(.+)/;

        if (!match.test(decl.prop) || tokensDocs[decl.prop]) return;

        tokensDocs[decl.prop] = { value: decl.value };
      });
    },
    async Rule (rule) {
      if (!/^\.(d-|\w{2}\\:)/.test(rule.selector) || exclusionRegex.test(rule.selector)) return;
      generateDocumentation(rule);
    },
    async OnceExit () {
      // Iterate over tokens documentation to replace reference variables with primitive values
      const docs = Object.keys(tokensDocs).map(token => {
        const value = replaceVariableValue(tokensDocs[token].value);
        return { [token]: { value } };
      });

      await fs.writeFile(path.resolve(__dirname, '../lib/dist/dialtone-docs.json'), JSON.stringify(documentation), 'utf-8');
      await fs.writeFile(path.resolve(__dirname, '../lib/dist/tokens-docs.json'), JSON.stringify(docs), 'utf-8');
    },
  };
};

module.exports.postcss = true;
