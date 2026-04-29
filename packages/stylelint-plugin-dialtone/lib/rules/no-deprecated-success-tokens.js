const stylelint = require('stylelint');

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions },
} = stylelint;

const ruleName = '@dialpad/stylelint-plugin-dialtone/no-deprecated-success-tokens';

const messages = ruleMessages(ruleName, {
  deprecated: (successToken, positiveToken) =>
    `Replace "${successToken}" with "${positiveToken}". Run "npx dialtone-migration-helper --config success-to-positive" to migrate automatically.`,
});

const meta = {
  url: 'https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/no-deprecated-success-tokens.md',
};

// Match var(--dt-color-{role}-success{suffix?}) where role is foreground, surface,
// border, or link, and suffix (if present) is one of the known variants. The
// suffix list mirrors the `success-to-positive` migration helper so flagged
// tokens always have a valid `positive*` replacement.
const SUCCESS_SUFFIX = '(?:-(?:subtle-opaque-inverted|subtle-opaque|subtle-inverted|strong-inverted|opaque-inverted|inverted-hover|subtle|strong|opaque|inverted|hover))?';
const SUCCESS_TOKEN_RE = new RegExp(`var\\(--dt-color-(?:foreground|surface|border|link)-success${SUCCESS_SUFFIX}\\)`, 'g');

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
    });

    if (!validOptions) return;

    root.walkDecls((declaration) => {
      const matches = declaration.value.match(SUCCESS_TOKEN_RE);
      if (!matches) return;

      matches.forEach((match) => {
        const successToken = match.replace('var(', '').replace(/\)$/, '');
        const positiveToken = successToken.replace('-success', '-positive');

        report({
          result,
          ruleName,
          node: declaration,
          message: messages.deprecated(successToken, positiveToken),
        });
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = createPlugin(ruleName, ruleFunction);
