---
paths:
  - "packages/dialtone-vue/**/*.test.js"
---

# Vue Component Test Rules

> **Canonical reference**: See [TEST_GUIDELINE.md](../../packages/dialtone-vue/.github/TEST_CONTRIBUTING/TEST_GUIDELINE.md) for the full test contributing guide, including the standardized template and the 5 required test sections.

## Framework
- Vitest + @vue/test-utils
- Run all: `pnpm nx run dialtone-vue:test`
- Run single: `pnpm nx run dialtone-vue:test -- --testPathPattern=component_name`

## `updateWrapper` Pattern

Every test file defines `updateWrapper` inside the top-level `describe` block:

```javascript
const baseProps = { /* required props */ };
const baseAttrs = {};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtComponentName Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtComponentName, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...mockSlots },
    });
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
  });
});
```

`beforeEach` remounts fresh for each test. `afterEach` resets mock variables — do NOT call `wrapper?.unmount()`, the remount handles cleanup.

## Element Selection

Always use `data-qa` attributes:
```javascript
wrapper.find('[data-qa="dt-button-icon"]')
```
Never select by CSS class or bare tag name — brittle and tied to implementation.

## `it.each` for Similar Tests

Use `it.each` when multiple inputs produce predictable variations of the same outcome:

```javascript
it.each([
  ['sm', 'd-avatar--size-sm'],
  ['md', 'd-avatar--size-md'],
  ['lg', 'd-avatar--size-lg'],
])('when size is %s, class %s is applied', (size, expectedClass) => {
  mockProps = { size };
  updateWrapper();
  expect(wrapper.classes()).toContain(expectedClass);
});
```

## `beforeEach` for Nested Setup

Use nested `beforeEach` for shared setup within a `describe` block:

```javascript
describe('When image is provided', () => {
  beforeEach(() => {
    mockProps = { imageSrc: 'image.png' };
    updateWrapper();
  });

  it('renders the image', () => { ... });
  it('does not render initials', () => { ... });
});
```

## Constants

Import valid values from `*_constants.js`. Never hardcode strings like `'md'` — use `COMPONENT_SIZE_DEFAULT`.

## Required Test Categories

1. **Presentation**: Default rendering, slot content, size/variant classes.
2. **Interactivity**: Event emissions with `wrapper.emitted()`, prop-driven behavior.
3. **Accessibility**: ARIA attributes (`role`, `aria-label`, `aria-expanded`), keyboard navigation (Enter, Space, Escape, Arrow keys), focus management.

## Test Focus

Each `it` block tests one behavior. Multiple assertions are fine when they validate the same concept. If you need a new `describe('When ...')` to explain the setup, it's a separate test.

## Anti-Patterns
- Don't test internal state (`wrapper.vm.internalCounter`) — test observable behavior.
- Don't rely on snapshot tests alone — they don't test behavior.
- Don't call `wrapper?.unmount()` in `afterEach` — reset mock variables instead.
