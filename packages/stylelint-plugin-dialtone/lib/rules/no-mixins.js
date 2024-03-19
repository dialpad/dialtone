const stylelint = require("stylelint");

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@dialpad/stylelint-plugin-dialtone/no-mixins';

const messages = ruleMessages(ruleName, {
  noMixinsRejected: (mixinName) => `Please avoid using LESS mixins "${mixinName}"`,
});

const meta = {
  url: "https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/no-mixins.md",
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
    });

    if (!validOptions) return;

    // This iterates through one selector at a time, so you don't have to worry about checking for nested selectors.
    root.walkAtRules((ruleNode) => {
      if (ruleNode.mixin) {
        report({
          result,
          ruleName,
          node: ruleNode,
          start: ruleNode.source.start,
          end: ruleNode.source.end,
          message: messages.noMixinsRejected(ruleNode.name),
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = createPlugin(ruleName, ruleFunction);
