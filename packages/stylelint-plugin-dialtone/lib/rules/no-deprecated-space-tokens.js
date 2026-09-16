const stylelint = require('stylelint');

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@dialpad/stylelint-plugin-dialtone/no-deprecated-space-tokens';

const messages = ruleMessages(ruleName, {
  deprecated: (spaceToken, sizeToken) =>
    `"${spaceToken}" is deprecated. Use "${sizeToken}" instead. Run "npx dialtone-migration-helper" to migrate automatically.`,
});

const meta = {
  description: 'Detects legacy space tokens that use the older space-to-size migration path.',
  url: 'https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/no-deprecated-space-tokens.md',
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
    });

    if (!validOptions) return;

    root.walkDecls((declaration) => {
      // Match var(--dt-space-*) pattern
      const spaceTokenMatch = declaration.value.match(/var\(--dt-space-[^)]+\)/g);
      if (!spaceTokenMatch) return;

      spaceTokenMatch.forEach((match) => {
        const spaceToken = match.replace('var(', '').replace(')', '');
        const sizeToken = spaceToken.replace('--dt-space-', '--dt-size-');

        report({
          result,
          ruleName,
          node: declaration,
          message: messages.deprecated(spaceToken, sizeToken),
        });
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = createPlugin(ruleName, ruleFunction);
