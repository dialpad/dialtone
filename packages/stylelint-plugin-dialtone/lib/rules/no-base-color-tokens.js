const stylelint = require('stylelint');

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@dialpad/stylelint-plugin-dialtone/no-base-color-tokens';

const messages = ruleMessages(ruleName, {
  noBaseColorsRejected: (colorToken) => `Please avoid using base color tokens: "${colorToken}"`,
});

const meta = {
  url: 'https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/no-base-color-tokens.md',
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
    });

    if (!validOptions) return;

    // This iterates through one selector at a time, so you don't have to worry about checking for nested selectors.
    root.walkDecls((declaration) => {
      if (!declaration.value.match(/var\(--dt-color-\w+-\d{2,4}\)/)) return;

      const tokenName = declaration.value.replace('var(', '').replace(')', '');

      report({
        result,
        ruleName,
        node: declaration,
        start: declaration.source.start,
        end: declaration.source.end,
        message: messages.noBaseColorsRejected(tokenName),
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = createPlugin(ruleName, ruleFunction);
