const stylelint = require("stylelint");

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@dialpad/stylelint-plugin-dialtone/use-dialtone-tokens';

const messages = ruleMessages(ruleName, {
  useDialtoneTokens: (value) => `Use a Dialtone token instead of "${value}".
    A list of available tokens can be found here: https://dialtone.dialpad.com/tokens.`,
  useRemInsteadOfPx: (value) => `If it's not possible to use a Dialtone token, use rem instead of px for "${value}".`,
});

const meta = {
  url: "https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/use-dialtone-tokens.md",
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  // detects the use of px or rem in properties and suggests to use a Dialtone token
  // or rem instead of px if a Dialtone token is not available
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
    });

    if (!validOptions) return;

    // This iterates through one selector at a time, so you don't have to worry about checking for nested selectors.
    root.walkDecls((declNode) => {
      const hasRemUnit = declNode.value.includes('rem');
      const hasPxUnit = declNode.value.includes('px');
      if (hasRemUnit || hasPxUnit) {
        report({
          result,
          ruleName,
          node: declNode,
          start: declNode.source.start,
          end: declNode.source.end,
          message: messages.useDialtoneTokens(declNode.value),
        });
      }
      if (hasPxUnit) {
        report({
          result,
          ruleName,
          node: declNode,
          start: declNode.source.start,
          end: declNode.source.end,
          message: messages.useRemInsteadOfPx(declNode.value),
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = createPlugin(ruleName, ruleFunction);
