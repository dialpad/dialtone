---
type: development
category: development
keywords: [vitest, testing, vue-test-utils, jsdom, coverage, mount, shallowMount, fixtures, assertions, dialtone-vue, co-located, thresholds]
ai_summary: How testing works in dialtone-vue with Vitest and Vue Test Utils — file structure, coverage thresholds, test patterns, and utilities.
last_updated: 2026-03-04
related_packages: [dialtone-vue]
---

# Testing

Tests in `packages/dialtone-vue` use **Vitest** with **@vue/test-utils** and run in a **jsdom** environment. Each component has a co-located test file in the same directory.

## Configuration

**File:** `packages/dialtone-vue/vite.config.js`

Key test settings:

```javascript
test: {
  globals: true,                    // describe, it, expect, vi available globally
  environment: 'jsdom',             // Browser DOM simulation
  setupFiles: './tests/setupTests.js',
  include: ['./{common,components,directives,recipes}/**/*.test.js'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'json'],
    thresholds: {
      global: {
        branches: 80,
        functions: 70,
        lines: 85,
        statements: 85,
      },
    },
  },
}
```

**Coverage thresholds:**
- 80% branch coverage
- 70% function coverage
- 85% line and statement coverage

The build fails if coverage drops below these thresholds. Coverage is measured across all components, so a new component with no tests will pull the averages down.

## Setup File

`tests/setupTests.js` provides mocks for browser APIs that jsdom does not implement:

```javascript
global.IntersectionObserver   // Mocked for components that observe element visibility
global.ResizeObserver         // Mocked for components that observe size changes
global.ClipboardEvent         // Custom class for clipboard testing
global.DataTransfer           // Custom class for data transfer

// Helper for simulating paste events in rich text tests
simulatePaste(content, type, dispatchElement)
```

## File Co-Location

Test files live next to the component they test:

```
components/button/
├── button.vue
├── button.test.js      ← same directory
├── button_constants.js
└── index.js
```

Test file naming: `{component-name}.test.js` (snake_case, matching the component file).

## Standard Test Pattern

Every component test follows this structure:

```javascript
import { mount } from '@vue/test-utils';
import DtButton from './button.vue';

// Constants — uppercase MOCK_ prefix for fixed stubs
const MOCK_CLICK_STUB = vi.fn();

// Base values — always-present props/slots/attrs
const baseProps = {};
const baseSlots = {};
const baseAttrs  = {};

// Mutable per-test overrides
let mockProps = {};
let mockSlots = {};
let mockAttrs  = {};

describe('DtButton Tests', () => {
  let wrapper;
  let button;

  // Recreate the component with current mock values
  const updateWrapper = () => {
    wrapper = mount(DtButton, {
      propsData: { ...baseProps, ...mockProps },
      slots:     { ...baseSlots, ...mockSlots },
      attrs:     { ...baseAttrs, ...mockAttrs },
    });
    button = wrapper.find('[data-qa="dt-button"]');
  };

  beforeEach(() => { updateWrapper(); });

  afterEach(() => {
    // Reset mocks so each test starts clean
    mockProps = {};
    mockSlots = {};
    mockAttrs  = {};
  });

  // ... test suites below
});
```

The `updateWrapper` + spread pattern means each test only declares what it wants to override, and `afterEach` resets everything.

## Test Categories

Tests are organized into four `describe` blocks inside the main suite:

### Presentation Tests

Verify rendering, CSS classes, and DOM structure:

```javascript
describe('Presentation Tests', () => {
  it('Should render the native button', () => {
    expect(wrapper.exists()).toBe(true);
    expect(button.exists()).toBe(true);
  });

  it('Should render primary by default', () => {
    expect(button.classes()).toContain('d-btn--primary');
  });

  describe('When size is xl', () => {
    it('Should apply xl class', async () => {
      await wrapper.setProps({ size: 'xl' });
      expect(button.classes()).toContain('d-btn--xl');
    });
  });
});
```

### Interactivity Tests

Verify event emission and user interaction behavior:

```javascript
describe('Interactivity Tests', () => {
  describe('When button is clicked', () => {
    beforeEach(async () => {
      mockAttrs = { onClick: MOCK_CLICK_STUB };
      updateWrapper();
      await button.trigger('click');
    });

    it('Should call the click listener', () => {
      expect(MOCK_CLICK_STUB).toHaveBeenCalled();
    });

    it('Should emit the click event', () => {
      expect(wrapper.emitted().click).toBeTruthy();
    });
  });
});
```

### Accessibility Tests

Verify ARIA attributes and keyboard behavior:

```javascript
describe('Accessibility Tests', () => {
  describe('When assertiveOnFocus is true', () => {
    beforeEach(async () => {
      await wrapper.setProps({ assertiveOnFocus: true });
    });

    it('aria-live is assertive when focused', async () => {
      await wrapper.setData({ isInFocus: true });
      expect(wrapper.attributes('aria-live')).toBe('assertive');
    });

    it('aria-live is falsy when not focused', async () => {
      await wrapper.setData({ isInFocus: false });
      expect(wrapper.attributes('aria-live')).toBeFalsy();
    });
  });
});
```

### Extendability Tests

Verify custom class injection and prop passthrough:

```javascript
describe('Extendability Tests', () => {
  it('Should apply custom label class', () => {
    mockProps = { labelClass: 'my-custom-class' };
    mockSlots = { default: 'Click me' };
    updateWrapper();
    expect(wrapper.find('.my-custom-class').exists()).toBe(true);
  });
});
```

## mount vs shallowMount

**`mount`** is the default choice. It renders the component and all child components recursively:

```javascript
wrapper = mount(DtButton, { propsData, slots, attrs });
```

Use `mount` for:
- Testing CSS classes applied by parent/child interaction
- Testing slot rendering with real child components
- Most component tests

**`shallowMount`** stubs all child components — use it when you want to test a component's own logic without caring about what its children render:

```javascript
wrapper = shallowMount(DtNoticeContent, { props, slots });
```

Use `shallowMount` for:
- Testing props and data logic in isolation
- Avoiding render failures from missing child dependencies

## Querying Elements

Always query by `data-qa` attributes, not CSS classes. `data-qa` attributes are stable; CSS classes can be refactored:

```javascript
button = wrapper.find('[data-qa="dt-button"]');
icon   = wrapper.find('[data-qa="dt-button-icon"]');

// Finding a Vue component instance
popover = wrapper.findComponent({ ref: 'popover' });

// Finding multiple elements
items = wrapper.findAll('[data-qa="dt-list-item"]');
```

## Common Assertions

```javascript
expect(wrapper.exists()).toBe(true);                    // Component rendered
expect(element.classes()).toContain('d-btn--primary');  // Has CSS class
expect(element.text()).toBe('Click me');                // Text content
expect(element.attributes('type')).toBe('submit');      // HTML attribute
expect(wrapper.emitted().click).toBeTruthy();           // Event was emitted
expect(wrapper.emitted().click[0]).toEqual([payload]);  // Event payload
expect(fn).toHaveBeenCalled();                          // Function called
expect(fn).toHaveBeenCalledWith(arg);                   // Called with args
```

## Shared Fixtures

**`tests/fixtures/component.vue`** — An empty placeholder component used as a slot stub:

```javascript
import EmptyComponentFixture from '@/tests/fixtures/component.vue';
mockSlots = { icon: EmptyComponentFixture };
```

## Shared Assertion Helpers

`tests/common/` contains reusable assertion functions:

```javascript
// Prop validation helpers
itBehavesLikePassesCustomPropValidation(prop, value)
itBehavesLikeFailsCustomPropValidation(prop, value)

// Vue warning helpers
itBehavesLikeDoesNotRaiseAnyVueWarnings()
itBehavesLikeRaisesSingleVueWarning(message)

// DOM behavior helpers
itBehavesLikeAppliesClassToChild(wrapper, className, element)
```

## Running Tests

```bash
# Run all tests (CI mode, 10-second timeout)
pnpm nx run dialtone-vue:test

# Watch mode during development
cd packages/dialtone-vue
pnpm test:watch

# Run a single test file
cd packages/dialtone-vue
pnpm exec vitest run components/button/button.test.js

# Run with coverage report
pnpm exec vitest run --coverage
```

NX caches test results. If no source files have changed since the last run, `pnpm nx run dialtone-vue:test` returns the cached result immediately. Pass `--skip-nx-cache` to force a fresh run.

## Testing in Other Packages

`dialtone-css` does not have component tests — its correctness is validated through visual regression in Storybook and integration tests in `dialtone-documentation`.

`eslint-plugin-dialtone` and `stylelint-plugin-dialtone` use Mocha for their rule tests, not Vitest.

`dialtone-mcp-server` uses Vitest but with Node environment instead of jsdom.
