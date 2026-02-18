---
paths:
  - "packages/dialtone-vue/**/*.test.js"
---

# Vue Component Test Rules

> **Canonical reference**: See [TEST_GUIDELINE.md](../../packages/dialtone-vue/.github/TEST_CONTRIBUTING/TEST_GUIDELINE.md) for the full test contributing guide, including the standardized template, `updateWrapper()` pattern, and the 5 required test sections.

## Framework
- Vitest + @vue/test-utils
- Run all: `pnpm nx run dialtone-vue:test`
- Run single: `pnpm nx run dialtone-vue:test -- --testPathPattern=component_name`

## `_setWrapper` Pattern
Every test file uses a shared `_setWrapper` helper for consistent mounting:

```javascript
const _setWrapper = (props = {}, attrs = {}, slots = {}) => {
  wrapper = mount(DtComponentName, {
    props: { ...baseProps, ...props },
    attrs: { ...baseAttrs, ...attrs },
    slots: { ...baseSlots, ...slots },
  });
};
```

Always include `afterEach(() => { wrapper?.unmount(); })` for cleanup.

## Element Selection
Always use `data-qa` attributes: `wrapper.find('[data-qa="dt-button-icon"]')`.
Never select by CSS class or bare tag name — these are brittle.

## Constants
Import valid values from `*_constants.js`. Never hardcode strings like `'md'` — use `COMPONENT_SIZE_DEFAULT`.

## Required Test Categories
1. **Presentation**: Default rendering, slot content, size/variant classes.
2. **Interactivity**: Event emissions with `wrapper.emitted()`, prop-driven behavior.
3. **Accessibility**: ARIA attributes (`role`, `aria-label`, `aria-expanded`), keyboard navigation (Enter, Space, Escape, Arrow keys), focus management.
## Test Focus

Each `it` block should test one behavior. Multiple assertions are fine when they validate the same concept (e.g., checking both existence and content of an element). If you need a new `describe('When ...')` to explain the setup, it's a separate test.
## Anti-Patterns
- Don't test internal state (`wrapper.vm.internalCounter`) — test observable behavior.
- Don't rely on snapshot tests alone — they don't test behavior.
- Don't skip cleanup — always unmount in `afterEach`.
