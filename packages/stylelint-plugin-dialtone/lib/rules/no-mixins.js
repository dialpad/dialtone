const stylelint = require("stylelint");

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@dialpad/stylelint-plugin-dialtone/no-mixins';

const messages = ruleMessages(ruleName, {
  noMixinsRejected: (selector) => `Please avoid using LESS mixins "${selector}"`,
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
    root.walkRules((ruleNode) => {
      const { source } = ruleNode;

      // any line that starts with a period and ends with a semicolon is a LESS mixin.
      const regex = /\.[\S]+;/gm;

      const matches = [...source.input.css.matchAll(regex)];
      for (const match of matches) {
        report({
          result,
          ruleName,
          message: messages.noMixinsRejected(match[0]),
          node: ruleNode,
          word: match[0],
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = createPlugin(ruleName, ruleFunction);
