const stylelint = require('stylelint');
const { SPACE_TOKEN_MAP } = require('../generated/migration-guidance.json');

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@dialpad/stylelint-plugin-dialtone/no-deprecated-space-tokens';

const messages = ruleMessages(ruleName, {
  deprecated: (spaceToken, spacingToken) =>
    `"${spaceToken}" is a legacy Dialtone 9 token. For Dialtone 10 spacing properties, use "${spacingToken}" (same value). Run "npx --package @dialpad/dialtone-css dialtone-migration-helper" and select "space-to-spacing". Verify the installed target supports the replacement.`,
  review: (spaceToken) =>
    `"${spaceToken}" is a legacy Dialtone 9 token. Migration to Dialtone 10 requires manual review: no exact spacing equivalent or unsupported property context. Do not preserve the suffix blindly.`,
});

const meta = {
  description: 'Detects legacy space tokens and recommends value-preserving spacing migrations.',
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
        const parts = /^--dt-space-([0-9]+)(-negative)?$/.exec(spaceToken);
        const replacement = parts && SPACE_TOKEN_MAP[parts[1]];
        const spacingContext = /^(?:padding|margin|inset)(?:-|$)|^(?:gap|row-gap|column-gap|top|right|bottom|left)$/.test(declaration.prop);
        const spacingToken = replacement ? `--dt-${replacement}${parts[2] || ''}` : null;

        report({
          result,
          ruleName,
          node: declaration,
          message: spacingToken && spacingContext ? messages.deprecated(spaceToken, spacingToken) : messages.review(spaceToken),
        });
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = createPlugin(ruleName, ruleFunction);
