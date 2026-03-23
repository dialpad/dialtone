const stylelint = require('stylelint');

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@dialpad/stylelint-plugin-dialtone/no-deprecated-size-tokens';

const messages = ruleMessages(ruleName, {
  deprecatedSizeToken:
    '--dt-size-* tokens have been replaced. Use --dt-layout-* for layout (widths/heights) or --dt-spacing-* for spacing (padding/margin). Run "npx dialtone-migration-helper" and select "size-to-layout".',
  deprecatedSpaceToken:
    '--dt-space-* tokens have been replaced by --dt-spacing-*. Run "npx dialtone-migration-helper" and select "space-to-spacing".',
});

const meta = {
  url: 'https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/no-deprecated-size-tokens.md',
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
    });

    if (!validOptions) return;

    root.walkDecls((declaration) => {
      const sizeTokenMatches = declaration.value.match(/var\(--dt-size-[^)]+\)/g);
      if (sizeTokenMatches) {
        sizeTokenMatches.forEach(() => {
          report({
            result,
            ruleName,
            node: declaration,
            message: messages.deprecatedSizeToken,
          });
        });
      }

      const spaceTokenMatches = declaration.value.match(/var\(--dt-space-[^)]+\)/g);
      if (spaceTokenMatches) {
        spaceTokenMatches.forEach(() => {
          report({
            result,
            ruleName,
            node: declaration,
            message: messages.deprecatedSpaceToken,
          });
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = createPlugin(ruleName, ruleFunction);
