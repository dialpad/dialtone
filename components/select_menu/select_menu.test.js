import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import Vue from 'vue';
import { itBehavesLikeEmitsExpectedEvent } from '../../tests/shared_examples/events';
import {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikeDoesNotRaiseAnyVueWarnings,
  itBehavesLikeRaisesSingleVueWarning,
} from '../../tests/shared_examples/validation';
import {
  itBehavesLikeAppliesClassToChild,
  itBehavesLikeAppliesChildProp,
} from '../../tests/shared_examples/extendability';
import {
  LABEL_SIZE_MODIFIERS,
  DESCRIPTION_SIZE_MODIFIERS,
} from '@/common/constants';
import {
  SELECT_SIZE_MODIFIERS,
  SELECT_STATE_MODIFIERS,
} from './select_menu_constants';
import DtSelectMenu from './select_menu.vue';

// Constants
const LABEL = 'Label';
const DESCRIPTION = 'Description';
const OPTIONS = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

const basePropsData = {
  label: LABEL,
  options: OPTIONS,
};
const baseAttrs = {
  name: 'select-menu',
};

describe('DtSelectMenu Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let selectWrapper;
  let select;
  let label;
  let description;
  let messages;

  // Environment
  let propsData = basePropsData;
  let attrs = baseAttrs;
  let slots = {};

  // Helpers
  const _setChildWrappers = () => {
    select = wrapper.find('[data-qa="dt-select"]');
    selectWrapper = wrapper.find('[data-qa="dt-select-wrapper"]');
    label = wrapper.find('[data-qa="dt-select-label"]');
    description = wrapper.find('[data-qa="dt-select-description"]');
    messages = wrapper.find('[data-qa="dt-select-messages"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtSelectMenu, {
      propsData,
      attrs,
      slots,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  const _mountWrappers = () => {
    wrapper = mount(DtSelectMenu, {
      propsData,
      attrs,
      slots,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });
  beforeEach(() => {});

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = baseAttrs;
    slots = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('When rendered with required content', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it(
        'should render the provided label',
        () => { expect(label.text()).toBe(LABEL); },
      );
      it('should have no size variant classes on the label', () => {
        expect(label.classes().length).toBe(1);
      });
      it(
        'should not render a description',
        () => { expect(description.exists()).toBe(false); },
      );
      it(
        'should render the select menu',
        () => { expect(select.exists()).toBe(true); },
      );
      it('should have no size variant classes on select menu', () => {
        expect(selectWrapper.classes().length).toBe(1);
      });
      it('should have no kind variant classes on select menu input', () => {
        expect(select.classes().length).toBe(1);
      });
      it('should render the select menu options', () => {
        OPTIONS.forEach(option => {
          expect(select.find(`[value="${option.value}"]`).exists()).toBeTruthy();
        });
      });
      it('should not render any validation messages', () => {
        expect(messages?.props('validationMessages').length).toBe(0);
      });
    });

    describe('When a label is not provided', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { options: OPTIONS };
        _setWrappers();
      });

      it(
        'should not render a label',
        () => { expect(label.exists()).toBe(false); },
      );
    });

    describe('When a label is provided via slot', () => {
      // Test Environment
      const slottedLabel = 'Slotted Label';

      // Test Setup
      beforeEach(() => {
        slots = {
          label: slottedLabel,
        };
        _setWrappers();
      });

      it(
        'should render the slotted label',
        () => { expect(label.text()).toBe(slottedLabel); },
      );
    });

    describe('When a description is provided via prop', () => {
      // Test Setup
      beforeEach(() => {
        propsData = {
          ...basePropsData,
          description: DESCRIPTION,
        };
        _setWrappers();
      });

      it('should render the provided description', () => {
        expect(description.text()).toBe(DESCRIPTION);
      });
      it('should have no size variant classes on the description', () => {
        expect(description.classes().length).toBe(1);
      });
    });

    describe('When a description is provided via slot', () => {
      // Test Environment
      const slottedDescription = 'Slotted Description';

      // Test Setup
      beforeEach(() => {
        slots = {
          description: slottedDescription,
        };
        _setWrappers();
      });

      it('should render the slotted description', () => {
        expect(description.text()).toBe(slottedDescription);
      });
    });

    describe('When options are provided via slot', () => {
      // Test Environment
      const slottedOptions = '<option value="1">Option 1</option><option value="2">Option 2</option>';

      // Test Setup
      beforeEach(() => {
        slots = {
          default: slottedOptions,
        };
        _setWrappers();
      });

      it('should render the select menu options', () => {
        expect(select.findAll('option').length).toBe(2);
      });
    });

    describe('When a size is provided', () => {
      // Test Environment
      const size = 'lg';

      // Test Setup
      beforeEach(() => {
        propsData = {
          ...basePropsData,
          description: DESCRIPTION,
          size,
        };
        _setWrappers();
      });

      it('should have size variant class on the label', () => {
        expect(label.classes(LABEL_SIZE_MODIFIERS[size])).toBe(true);
      });
      it('should have size variant class on the description', () => {
        expect(description.classes(DESCRIPTION_SIZE_MODIFIERS[size])).toBe(true);
      });
      it('should have size variant class on select menu', () => {
        expect(selectWrapper.classes(SELECT_SIZE_MODIFIERS[size])).toBe(true);
      });
    });

    describe('When validation messages are provided', () => {
      // Test Environment
      const message = 'Validation Message';

      // Test Setup
      beforeEach(() => {
        propsData = {
          ...basePropsData,
          messages: [message],
        };
      });

      // Shared Examples
      const itBehavesLikeHasSelectInputStateClass = () => {
        it('should have error state class on select menu', () => {
          expect(select.classes(SELECT_STATE_MODIFIERS.error)).toBe(true);
        });
      };

      describe('When validation messages are shown', () => {
        // Test Setup
        beforeEach(() => {
          _mountWrappers();
        });

        itBehavesLikeHasSelectInputStateClass();
        it('should render validation message', () => {
          expect(messages?.findAll('[data-qa="validation-message"]').length).toBe(1);
        });
      });

      describe('When validation messages are hidden', () => {
        // Test Setup
        beforeEach(() => {
          propsData.showMessages = false;
          _mountWrappers();
        });

        itBehavesLikeHasSelectInputStateClass();
        it('should not render any validation messages', () => {
          expect(messages.exists()).toBe(false);
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a description is provided', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, description: DESCRIPTION };
        _setWrappers();
      });

      it('label aria-details should match the id of the description', () => {
        expect(label.attributes('aria-details')).toBe(description.attributes('id'));
      });
    });

    describe('When a description is not provided', () => {
      describe('When aria-details are not provided', () => {
        // Test Setup
        beforeEach(() => {
          _setWrappers();
        });

        it('label aria-details should not exist', () => {
          expect(label.attributes('aria-details')).toBeFalsy();
        });
      });

      describe('When aria-details are provided', () => {
        // Test Environment
        const ariaDetails = 'some-id';

        // Test Setup
        beforeEach(() => {
          attrs = { ...baseAttrs, 'aria-details': ariaDetails };
          _setWrappers();
        });

        it('label aria-details should match those provided by attrs', () => {
          expect(label.attributes('aria-details')).toBe(ariaDetails);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When select menu value has changed', () => {
      // Test Environment
      const selectedValue = OPTIONS[1].value;

      // Test Setup
      beforeEach(() => {
        _setWrappers();
        select.element.value = selectedValue;
        select.trigger('change');
      });

      it('should emit input event', () => {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValue.toString());
      });
      it('should emit change event', () => {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'change', selectedValue.toString());
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Size Validator', () => {
      // Test Environment
      const prop = DtSelectMenu.props.size;

      describe('When provided size is in SELECT_SIZE_MODIFIERS', () => {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('when provided size is not in SELECT_SIZE_MODIFIERS', () => {
        itBehavesLikeFailsCustomPropValidation(prop, `NOT${SELECT_SIZE_MODIFIERS.md}`);
      });
    });

    describe('Options Validation', () => {
      // Test Environment
      const warningMessage = 'Options are expected to be provided via prop or slot';

      // Test Setup
      beforeAll(() => {
        Vue.config.silent = true;
        vi.spyOn(Vue.util, 'warn').mockClear();
      });

      // Test Teardown
      afterEach(() => {
        Vue.util.warn.mockReset();
      });

      afterAll(() => {
        Vue.util.warn.mockRestore();
        Vue.config.silent = false;
      });

      describe('When options are provided via prop', () => {
        // Test Setup
        beforeEach(() => {
          _mountWrappers();
        });

        itBehavesLikeDoesNotRaiseAnyVueWarnings();

        describe('When updated options are empty', () => {
          // Test Setup
          beforeEach(async () => {
            await wrapper.setProps({ options: [] });
          });

          itBehavesLikeRaisesSingleVueWarning(warningMessage);
        });
      });

      describe('When options are provided via slot', () => {
        // Test Setup
        beforeEach(() => {
          propsData = { ...propsData, options: undefined };
          slots = { default: '<option value="1">Option 1</option><option value="2">Option 2</option>' };
          _mountWrappers();
        });

        itBehavesLikeDoesNotRaiseAnyVueWarnings();
      });

      describe('When options are not provided', () => {
        // Test Setup
        beforeEach(() => {
          propsData = { ...propsData, options: undefined };
          _mountWrappers();
        });

        itBehavesLikeRaisesSingleVueWarning(warningMessage);
      });
    });
  });

  describe('Extendability Tests', () => {
    // Test Environment
    let element;
    const customClass = 'my-custom-class';
    const propName = 'some';
    const propValue = 'prop';
    const childProps = {};

    // Helpers
    const _setupChildClassTest = (childClassName, selector) => {
      propsData[childClassName] = customClass;
      _setWrappers();
      element = wrapper.find(selector);
    };

    const _setupChildPropsTest = (childPropsName, selector) => {
      propsData[childPropsName] = childProps;
      _setWrappers();
      element = wrapper.find(selector);
    };

    // Shared Examples
    const itBehavesLikeAppliesClassToChildLocal = () => {
      it('should apply custom class to child', () => {
        itBehavesLikeAppliesClassToChild(wrapper, '.my-custom-class', element);
      });
    };

    const itBehavesLikeAppliesChildPropLocal = () => {
      it('should have provided child prop', () => {
        itBehavesLikeAppliesChildProp(element, propName, propValue);
      });
    };

    // Test Setup
    beforeAll(() => {
      childProps[propName] = propValue;
    });
    beforeEach(() => {
      propsData = { ...propsData, description: DESCRIPTION };
    });

    describe('When a label class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('labelClass', '[data-qa="dt-select-label"]'); },
      );
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When a description class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('descriptionClass', '[data-qa="dt-select-description"]'); },
      );
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When a select class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('selectClass', '[data-qa="dt-select-wrapper"]'); },
      );
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When an option class is provided', () => {
      // Test Environment
      let options;

      // Test Setup
      beforeEach(() => {
        propsData.optionClass = customClass;
        _setWrappers();
        options = select.findAll('option');
      });

      it('should apply child class to each option', () => {
        options.wrappers.forEach(option => {
          expect(option.classes(customClass)).toBe(true);
        });
      });
    });

    describe('When label child props are provided', () => {
      beforeEach(
        () => { _setupChildPropsTest('labelChildProps', '[data-qa="dt-select-label"]'); },
      );
      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When description child props are provided', () => {
      beforeEach(
        () => { _setupChildPropsTest('descriptionChildProps', '[data-qa="dt-select-description"]'); },
      );
      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When option child props are provided', () => {
      // Test Environment
      let options;

      // Test Setup
      beforeEach(() => {
        propsData.optionChildProps = childProps;
        _setWrappers();
        options = select.findAll('option');
      });

      it('should apply child props to each option', () => {
        options.wrappers.forEach(option => {
          itBehavesLikeAppliesChildProp(option, propName, propValue);
        });
      });
    });

    describe('When attrs are provided', () => {
      // Test Setup
      beforeEach(() => {
        attrs = { some: 'prop' };
        _setWrappers();
        element = select;
      });

      itBehavesLikeAppliesChildPropLocal();
    });
  });
});
