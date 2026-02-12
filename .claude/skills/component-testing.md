---
description: "Vue component testing best practices with Vitest and @vue/test-utils. Auto-activated when creating or editing test files. Covers test structure, patterns, and anti-patterns."
---

# Component Testing for Dialtone

## Framework

- **Vitest** as the test runner.
- **@vue/test-utils** for mounting and interacting with Vue components.
- Run all component tests: `pnpm nx run dialtone-vue:test`
- Run a single component's tests: `pnpm nx run dialtone-vue:test -- --testPathPattern=component_name`

## Test File Structure

Every component test file follows this pattern:

```javascript
import { mount } from '@vue/test-utils';
import DtComponentName from './component_name.vue';
import {
  COMPONENT_SIZE_DEFAULT,
  COMPONENT_SIZES,
  COMPONENT_VARIANTS,
} from './component_name_constants.js';

// Base configuration — shared across all tests
const baseProps = {
  size: COMPONENT_SIZE_DEFAULT,
  label: 'Test label',
};

const baseAttrs = {
  'data-qa': 'dt-component-name',
};

const baseSlots = {
  default: 'Default slot content',
};

describe('DtComponentName Tests', () => {
  let wrapper;

  const _setWrapper = (props = {}, attrs = {}, slots = {}) => {
    wrapper = mount(DtComponentName, {
      props: { ...baseProps, ...props },
      attrs: { ...baseAttrs, ...attrs },
      slots: { ...baseSlots, ...slots },
    });
  };

  afterEach(() => {
    wrapper?.unmount();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      _setWrapper();
      expect(wrapper.exists()).toBe(true);
    });

    it('should render default slot content', () => {
      _setWrapper();
      expect(wrapper.text()).toContain('Default slot content');
    });

    it('should apply correct size class', () => {
      Object.values(COMPONENT_SIZES).forEach((size) => {
        _setWrapper({ size });
        expect(wrapper.classes()).toContain(`d-component--${size}`);
        wrapper.unmount();
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('should emit update:modelValue on click', async () => {
      _setWrapper();
      await wrapper.find('[data-qa="dt-component-trigger"]').trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([expectedValue]);
    });

    it('should emit update:open when toggled', async () => {
      _setWrapper({ open: false });
      await wrapper.find('[data-qa="dt-component-trigger"]').trigger('click');
      expect(wrapper.emitted('update:open')[0]).toEqual([true]);
    });
  });

  describe('Accessibility Tests', () => {
    it('should have correct ARIA role', () => {
      _setWrapper();
      expect(wrapper.attributes('role')).toBe('button');
    });

    it('should be keyboard navigable', async () => {
      _setWrapper();
      await wrapper.trigger('keydown.enter');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('should have aria-label when no visible label', () => {
      _setWrapper({ hideLabel: true, ariaLabel: 'Action' });
      expect(wrapper.attributes('aria-label')).toBe('Action');
    });
  });
});
```

## Patterns

### Element Selection

Always use `data-qa` attributes for selecting elements in tests. This decouples tests from CSS classes and DOM structure.

```javascript
// GOOD
wrapper.find('[data-qa="dt-button-icon"]');
wrapper.find('[data-qa="dt-input-field"]');

// BAD — brittle, breaks on class or structure changes
wrapper.find('.d-btn__icon');
wrapper.find('input');
```

### Prop Testing

Test ALL props: the default value, each valid value, and edge cases.

```javascript
// Import constants — never hardcode valid values
import { COMPONENT_SIZES, COMPONENT_SIZE_DEFAULT } from './component_name_constants.js';

it('should default to md size', () => {
  _setWrapper();
  expect(wrapper.props('size')).toBe(COMPONENT_SIZE_DEFAULT);
});

it('should apply each valid size', () => {
  Object.values(COMPONENT_SIZES).forEach((size) => {
    _setWrapper({ size });
    expect(wrapper.classes()).toContain(`d-component--${size}`);
    wrapper.unmount();
  });
});
```

### Event Testing

Use `wrapper.emitted()` to assert on event emissions.

```javascript
it('should emit the correct event with payload', async () => {
  _setWrapper();
  await wrapper.find('[data-qa="dt-component-trigger"]').trigger('click');

  const emitted = wrapper.emitted('update:modelValue');
  expect(emitted).toBeTruthy();
  expect(emitted).toHaveLength(1);
  expect(emitted[0]).toEqual(['expected-value']);
});
```

### Slot Testing

Test default content, named slots, and scoped slots.

```javascript
it('should render named slot content', () => {
  _setWrapper({}, {}, {
    headerContent: '<h2>Custom Header</h2>',
  });
  expect(wrapper.find('[data-qa="dt-component-header"]').html()).toContain('Custom Header');
});

it('should render scoped slot with provided data', () => {
  _setWrapper({}, {}, {
    default: `<template #default="{ item }">{{ item.name }}</template>`,
  });
  expect(wrapper.text()).toContain('Expected Name');
});
```

### Mocking

Mock external dependencies to isolate the component under test.

```javascript
// Mock a composable
vi.mock('./composables/useFeature', () => ({
  useFeature: () => ({
    isEnabled: ref(true),
    toggle: vi.fn(),
  }),
}));

// Mock a child Dialtone component
const MockDtIcon = { template: '<span />' };
_setWrapper({}, {}, {}, {
  global: {
    stubs: { DtIcon: MockDtIcon },
  },
});
```

## Anti-Patterns

### Do NOT Test Implementation Details

```javascript
// BAD — testing internal state
expect(wrapper.vm.internalCounter).toBe(5);
expect(wrapper.vm.isProcessing).toBe(true);

// GOOD — test observable behavior
expect(wrapper.find('[data-qa="dt-counter"]').text()).toBe('5');
expect(wrapper.find('[data-qa="dt-spinner"]').exists()).toBe(true);
```

### Do NOT Rely on Snapshot Tests Alone

Snapshot tests break on any change and do not test behavior. Use them sparingly (e.g., for complex SVG rendering), never as the sole test for a component.

### Do NOT Hardcode Values That Have Constants

```javascript
// BAD
expect(wrapper.props('size')).toBe('md');

// GOOD
expect(wrapper.props('size')).toBe(COMPONENT_SIZE_DEFAULT);
```

### Do NOT Skip Cleanup

Always include `afterEach` with `wrapper?.unmount()` to prevent test leakage.

### Do NOT Skip Accessibility Tests

Every interactive component must test:

- ARIA attributes (`role`, `aria-label`, `aria-expanded`, `aria-disabled`)
- Keyboard navigation (Enter, Space, Escape, Arrow keys as applicable)
- Focus management (focus trapping in modals, focus return after close)
