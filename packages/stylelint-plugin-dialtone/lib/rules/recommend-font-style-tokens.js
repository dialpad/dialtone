const stylelint = require("stylelint");

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@dialpad/stylelint-plugin-dialtone/recommend-font-style-tokens';

const messages = ruleMessages(ruleName, {
  recommendFontStyleTokens: (property) => `Instead of setting "${property}" it is
      preferred to set the property Font to a composition token that bundles font-family, font-weight, font-size, and line-height.
      More information can be found here:
      https://dialtone.dialpad.com/design/typography/#api. There can be cases where using these selectors is intentional and valid,
      in which case you can ignore this warning.`,
});

const meta = {
  url: "https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/recommend-font-style-tokens.md",
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  // reject setting font-size, font-family, font-weight, and line-height separately
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
    });

    if (!validOptions) return;

    // This iterates through one selector at a time, so you don't have to worry about checking for nested selectors.
    root.walkDecls((declNode) => {
      const typographyProperties = ['font-family', 'font-weight', 'font-size', 'line-height'];
      if (typographyProperties.includes(declNode.prop)) {
        report({
          result,
          ruleName,
          node: declNode,
          start: declNode.source.start,
          end: declNode.source.end,
          message: messages.recommendFontStyleTokens(declNode.prop),
        });
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = createPlugin(ruleName, ruleFunction);
