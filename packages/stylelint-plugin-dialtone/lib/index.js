import stylelint from 'stylelint';

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = 'foo-org/selector-no-foo';

const messages = ruleMessages(ruleName, {
  rejected: (selector) => `Avoid using LESS mixins "${selector}"`,
});

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true],
    });

    if (!validOptions) return;

    root.walkRules((ruleNode) => {
      const { selector, source } = ruleNode;

      const regex = /(\.[\S]+;)/gm;
      const regexResult = regex.test(source.input.css);
      if (!regexResult) return;

      report({
        result,
        ruleName,
        message: messages.rejected(selector),
        node: ruleNode,
        word: selector,
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);
