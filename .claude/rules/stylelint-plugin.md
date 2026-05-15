---
paths:
  - "packages/stylelint-plugin-dialtone/**"
---

# Stylelint Plugin Rules

## Test Framework

**Node test runner** (`node --test`), not Vitest or Mocha. Run: `pnpm nx run stylelint-plugin-dialtone:test`

## Rule Registration

**Manual** — unlike the ESLint plugin, new rules must be explicitly added to `lib/index.js`. A rule file in `lib/rules/` that is not imported in `lib/index.js` will never run.

## Rule Structure

```js
const { createPlugin, utils: { report, ruleMessages, validateOptions } } = require('stylelint');

const ruleName = '@dialpad/stylelint-plugin-dialtone/<rule-name>';
const messages = ruleMessages(ruleName, {
  myMessage: (value) => `Message about "${value}".`,
});
const meta = {
  url: 'https://github.com/dialpad/dialtone/blob/staging/packages/stylelint-plugin-dialtone/docs/rules/<rule-name>.md',
};

const ruleFunction = (primary) => (root, result) => {
  const validOptions = validateOptions(result, ruleName, { actual: primary });
  if (!validOptions) return;

  root.walkDecls((declNode) => {
    report({ result, ruleName, node: declNode, message: messages.myMessage(declNode.value) });
  });
};

module.exports = createPlugin(ruleName, ruleFunction);
module.exports.ruleName = ruleName;
module.exports.messages = messages;
module.exports.meta = meta;
```

- Use `report()` from stylelint utils — never `console.warn()`
- Use `ruleMessages()` for message definitions — not inline strings
- Use `validateOptions()` to validate rule options
- New rule needs a doc page at `docs/rules/<rule-name>.md`
