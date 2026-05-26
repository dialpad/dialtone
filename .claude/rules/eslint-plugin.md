---
paths:
  - "packages/eslint-plugin-dialtone/**"
---

# ESLint Plugin Rules

## Test Framework

**Mocha** (not Vitest). Run: `pnpm nx run eslint-plugin-dialtone:test`

Use `RuleTester` from `eslint`. Each rule needs valid and invalid test cases.

## Rule Registration

All files in `lib/rules/` are auto-registered via `requireindex` — no manual registration needed. Adding a new `.js` file to `lib/rules/` is enough.

## Rule Structure

```js
module.exports = {
  meta: {
    type: 'suggestion', // must be 'problem', 'suggestion', or 'layout'
    docs: {
      description: '...',
      recommended: false,
      url: 'https://github.com/dialpad/dialtone/blob/staging/packages/eslint-plugin-dialtone/docs/rules/<rule-name>.md',
    },
    fixable: null, // 'code', 'whitespace', or null
    schema: [],    // options schema if rule has options
    messages: {
      messageKey: 'Message with {{ placeholder }}',
    },
  },
  create(context) { ... },
};
```

- `meta.type` must be one of the three valid values — ESLint ignores rules with invalid types
- Error messages go in `meta.messages`, not inline strings in `context.report()`
- New rule needs a doc page at `docs/rules/<rule-name>.md`
