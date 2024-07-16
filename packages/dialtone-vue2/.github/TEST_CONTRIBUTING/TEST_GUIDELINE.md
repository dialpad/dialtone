# Contributing Guideline - Writing Tests for Dialtone-vue Components

## Test Template

This document aims to provide comprehensive information for effectively creating tests that ensure the quality, reliability, and consistency of our components.

To help you get started quickly, we have prepared a standardized test template.

You can also check these tests to get familiar with how it is working now in [checkbox-component-test](../../components/checkbox/checkbox.test.js) or [icon-component-test](../../components/icon/icon.test.js)

This template provides an initial scaffolding and follows the structure we expect for our tests.

This template is also generated by yeoman which creates a new component with `pnpm exec yo @dialpad/dialtone:vue2` script.

## Organizing Variables for Effective Testing:

```js
/**
 * Auxiliary variables
 * These variables will be used inside tests to help readability and DRY
 * @prefix MOCK_
 * @notation MOCK_[NAME]
 */
const MOCK_EXPECTED_VALUE = true;
const MOCK_FIELD_NAME = 'mockFieldName';
const MOCK_FUNCTION = vi.fn();

/**
 * Environment Constants variables
 * Will be always present in every test
 * @prefix base
 * @notation base[NAME]
 */
const baseProps = {};
const baseAttrs = {};
const baseSlots = {};
const baseProvide = {};

/**
 * Environment variables
 * Will be reset after each test
 * @prefix mock
 * @notation mock[NAME]
 */
let mockProps = {};
let mockAttrs = {};
let mockSlots = {};
let mockProvide = {};
```

In our test template, we prioritize the organization of variables to enhance test readability and maintainability. This section explains the three types of variables used in the template:

1. Auxiliary Variables: Auxiliary variables are integral to improving test readability and promoting the "Don't Repeat Yourself" (DRY) principle. They are defined within tests to facilitate their completion. These variables carry a `MOCK_` prefix and serve as helpers to avoid redundant code.
2. Environment Constants Variables: Environment Constants variables persist across all tests ins file. As the name implies, they are utilized to configure the test environment. For instance, if a component requires specific props or slots to function correctly, you can set them up in this section and later update or assert them within the tests. These will have a prefix of `base`.
3. Environment Variables: Environment variables are automatically cleaned after each test execution. They play a crucial role in mocking specific test requirements. By using these variables, you can simulate various scenarios to ensure comprehensive test coverage. These will have a prefix of `mock`.

By carefully organizing these variables, we maintain consistency and clarity throughout the testing process, enabling seamless collaboration among team members and facilitating future test maintenance.

To minimize variable declarations and prevent duplication, we adopt a centralized approach in our testing methodology.

By following this strategy, we can effectively avoid declaring variables in multiple places.

## Core of Our Template:

```js
describe('DtTestComponent Tests', () => {
  /**
   * Wrappers
   * Will contain the component and all its necessary children
   */
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtTestComponent, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        provide: { ...baseProvide, ...mockProvide },
      },
    });
  };

  /**
   * Setup
   * Will prepare the environment for each test
   */
  beforeEach(() => {
    updateWrapper();
  });

  /**
   * Teardown
   * Will reset the environment after each test
   */
  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    mockProvide = {};
  });
```

The core of our test template encompasses the fundamental building blocks necessary for effective testing. Let's explore its key components:

1. Wrappers Section: At the beginning of the test template, we find the `wrappers` section. This is where you can place all the essential wrappers required for the test. You'll define the main wrapper and any child wrappers needed to encapsulate the component under test.There is the case where your component testing require to create a wrapper inside a test, its ok to go with it.
2. updateWrapper Function: Our test template includes the `updateWrapper` function, which plays a pivotal role in mounting the provided component with our environment's constant and variable configurations. This function is highly flexible, allowing you to manipulate it as needed to fulfill specific test requirements.
3. beforeEach Function: In this section, we define the `beforeEach` function, responsible for mounting our wrapper before each test execution. It also ensures that our environment configurations are appropriately set up and that our wrappers are updated accordingly.
4. afterEach Function: The `afterEach` function is located at the end of our test template. Its purpose is to clean up our environment variables after each test run. By doing so, we ensure that every test starts with a clean state, free from any remnants of previous test executions.

Below are some examples that illustrate how the core components of our test template can be utilized to create efficient and comprehensive tests:

### Example 1

```js
describe('DtIcon Tests', () => {
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtIcon, {
      props: { ...baseProps, ...mockProps },
    });
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });
```

### Example 2

```js
describe('DtCheckbox Tests', () => {
  let wrapper;
  let checkbox;
  let input;
  let label;
  let description;
  let labelDescriptionContainer;

  const updateWrapper = () => {
    wrapper = mount(DtCheckbox, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        provide: { ...baseProvide, ...mockProvide },
      },
    });

    checkbox = wrapper.findComponent(DtCheckbox);
    input = wrapper.find('input');
    label = wrapper.find('[data-qa="checkbox-label"]');
    description = wrapper.find('[data-qa="checkbox-description"]');
    labelDescriptionContainer = wrapper.find('[data-qa="checkbox-label-description-container"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    mockProvide = {};
  });
```

## Structure:

```js
describe('Presentation Tests', () => {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */
    it('Should render the component', () => {
      expect(wrapper).toBeDefined();
    });
  });

  describe('Accessibility Tests', () => {
    /*
     * Test(s) to ensure that the component is accessible
     */
  });

  describe('Interactivity Tests', () => {
    /*
     * Test(s) to ensure that the component correctly handles user input
     */
  });

  describe('Validation Tests', () => {
    /*
     * Test(s) to ensure that custom validators are working as expected
     */
  });

  describe('Extendability Tests', () => {
    /*
     * Test(s) to ensure that the component can be correctly extended
     */
  });
```

Our test template comprises five distinct sections where you can place your tests, each serving a specific purpose:

1. Presentation Tests: In this section, our focus is on ensuring that specific areas of the component, under specified conditions, render correctly. E.g. verify that it possesses the correct initial classes and expected behaviors. This section also provides functional tests by default.
2. Accessibility Tests: Here, we place all the tests that assert the component's accessibility. This can be how the component interacts with screen readers and keyboard navigation to ensure it meets accessibility standards
3. Interactivity Tests: This section revolves around interaction with the component. We dedicated to testing various functionalities and interactions of the component. Here, we focus on validating how users interact with the component and how it responds to user input.
4. Validation Tests (Optional): Designed to accommodate custom validators. For example, you can use it to test for console errors or validate if the component behaves as expected when provided with specific input values.
5. Extendability Tests (Optional): This section serves the purpose of testing the component's ability to interact or react appropriately with child wrappers. This section helps ensure that the component maintains its integrity when used within a broader context.

## Styling and a few notes:

- It is necessary to remove template comments, this comments are just to guide you while development but they should be removed at the end.
- It is necessary to remove dummy or redundant coments.
- Utilize beforeEach to re-utilize environment configuration on tests. It is not necessary to use it for a single tests.

### Example 1

```js
describe('When the group is disabled', () => {
  // Test Setup
  beforeEach(() => { _setGroupContext([], true); });

  it(
   'should disable input',
  () => { expect(input.element.disabled).toBe(true); },
  );
});
```

### Example 2

```js
describe('When the group is disabled', () => {
  it('should disable input', () => {
    _setGroupContext([], true);

    expect(input.element.disabled).toBe(true);
  });
});
```

- Describe blocks should not be followed with a line break.
- Non related sentences will have a break line.

```js
describe('Interactivity Tests', () => {
  describe('Custom Event Tests', () => { **NO BREAK LINE**
    describe('When the checkbox is clicked', () => { **NO BREAK LINE**
      it('Should emit an input event', async () => { **NO BREAK LINE**
        await input.trigger('change');
                    **BREAK LINE**
        expect(wrapper.emitted('input')).toBeTruthy();
      });
    });
                    **BREAK LINE**
    describe('When checked', () => {
      describe('When the checkbox is clicked', () => {
        it('Should emit an input event', async () => {
          mockProps = { checked: true };
                    **BREAK LINE**
          updateWrapper();
                    **BREAK LINE**
          await input.trigger('change');
                    **BREAK LINE**
          expect(wrapper.emitted('input')).toBeTruthy();
        });
      });
    });
  });
});
```

- `.setProps` `.setValue` `.trigger` etc. should be async/await.
- You can utilize mockProps to set environment configuration to the mounted component, and use `.setProps` method if you want to trigger some component behaviour.

```js
describe('When checked', () => {
  describe('When the checkbox is clicked', () => {
    it('Should emit an input event', async () => {
      mockProps = { checked: true };

      updateWrapper();

      await input.trigger('change');

      expect(wrapper.emitted('input')).toBeTruthy();
    });
  });
});

describe('When disabled', () => {
  describe('When the checkbox is clicked', () => {
    it('Should not emit an input event', async () => {
      await wrapper.setProps({ disabled: true});
      
      await input.trigger('click');

      expect(wrapper.emitted('input')).toBeFalsy();
    });
  });
});
```

- If you are testing some conditional render of the component, you can create or update a wrapper inside the test to work on it.

```js
describe(...){
    ...
    const updateWrapper = () => {
      ...
      ...
      decorativeSpan = wrapper.find('.d-badge__decorative');
    }
    ...
  describe(...)
     ...
    {
     it(..., () => {
        mockProps = { disabled: true };

        updateWrapper();
    
        expect(decorativeSpan.exists()).toBeTruthy();
     });
     
     it(..., async () => {
         await wrapper.setProps({disabled: true});

         decorativeSpan = wrapper.find('.d-badge__decorative');

         expect(decorativeSpan.exists()).toBeTruthy();
     });
     
     it(..., async () => {
        await wrapper.setProps({disabledSection: false});
      
        const decorativeSection = wrapper.find('.d-badge__decorative-section');
      
        expect(decorativeSection.exists()).toBeTruthy();
      });
    }
}
```

**NOTE**:

- `updateWrapper()` will re-mount the component and update all child wrappers.
- `wrapper.setProps()` will update the component props and re-render it. This will not update child wrappers.

If you need to test more cases of it, it would be better to **trigger this event** and **create the wrapper** inside a beforeEach.

- You can create functions to set environment configuration and avoid repeating code. You can have this kind of utility functions inside the test file or in a test-utils.js file in the same folder as the test file.

```js
describe('Extendability Tests', () => {
    const _setupChildClassTest = (childClassName, selector) => {
      mockProps[childClassName] = MOCK_CUSTOM_CLASS;

      updateWrapper();

      MOCK_ELEMENT = wrapper.find(selector);
    };

    const _setupChildPropsTest = (childPropsName, selector) => {
      mockProps[childPropsName] = MOCK_CHILD_PROPS;

      updateWrapper();

      MOCK_ELEMENT = wrapper.find(selector);
    };

    beforeAll(() => {
      MOCK_CHILD_PROPS[MOCK_PROP_NAME] = MOCK_PROP_VALUE;
    });

    beforeEach(() => {
      mockProps = { label: 'Label', description: 'Description' };

      updateWrapper();
    });

    describe('When an input class is provided', () => {
      it('should apply custom class to child', () => {
        _setupChildClassTest('inputClass', 'input');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });
  });
});
```

- If you are testing with `vi.fn()` mocks it is necessary/recommended to restore it after each test.

For this, vitest provide `.restoreAllMocks()`. [Doc](https://vitest.dev/guide/mocking.html).

```js
const MOCK_SELECT_STUB = vi.fn();

describe(
    ...
    ...    

const updateWrapper = () ...

afterEach(() => {
    mockAttrs = {};
    mockProps = {};
    ...
    vi.restoreAllMocks();
  });

```

## Notes for vue2 test:

- In vue2. props need to be propsData.
- There is no global mounting option, so for example provide should be passed into mount object directly.
- It is necessary to use createLocalVue if you want to mutate the global Vue instance.

```js
let mockProps = {};
let mockAttrs = {};
let mockSlots = {};
let mockProvide = {};
let mockListeners = {};
const testContext = {}; **TEST CONTEXT**

describe('DtCheckbox Tests', () => {
  let wrapper;
  let checkbox;
  let input;
  let label;
  let description;
  let labelDescriptionContainer;

  const updateWrapper = () => {
    wrapper = mount(DtCheckbox, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      provide: { ...baseProvide, ...mockProvide }, **PROVIDE IN MOUNT OBJECT**
      listeners: { ...mockListeners },
      localVue: testContext.localVue, **LOCAL VUE**
    });

    checkbox = wrapper.findComponent(DtCheckbox);
    input = wrapper.find('input');
    label = wrapper.find('[data-qa="checkbox-label"]');
    description = wrapper.find('[data-qa="checkbox-description"]');
    labelDescriptionContainer = wrapper.find('[data-qa="checkbox-label-description-container"]');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue(); **CREATE LOCAL VUE**
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    mockProvide = {}; **RESET PROVIDE**
    mockListeners = {}; **RESET LISTENERS**
  });
```

For further information [Migrating from Vue Test Utils v1 | Vue Test Utils](https://test-utils.vuejs.org/migration/)