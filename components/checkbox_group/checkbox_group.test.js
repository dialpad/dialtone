import Vue from 'vue';
import { flushPromises } from '@/common/utils';
import {
  createLocalVue,
  shallowMount,
  mount,
} from '@vue/test-utils';
import {
  itBehavesLikeEmitsExpectedEvent,
  itBehavesLikeDoesNotEmitEvents,
} from '../../tests/shared_examples/events';
import {
  itBehavesLikePassesCustomPropValidation,
  itBehavesLikeFailsCustomPropValidation,
} from '../../tests/shared_examples/validation';
import {
  itBehavesLikeAppliesClassToChild,
  itBehavesLikeAppliesChildProp,
} from '../../tests/shared_examples/extendability';
import { DtValidationMessages } from '../validation_messages';
import { DtCheckbox } from '../checkbox';
import CheckboxesFixture from './checkboxes_decorator.vue';
import DtCheckboxGroup from './checkbox_group.vue';

// Constants
const basePropsData = {
  name: 'test-checkbox-group',
};
const baseAttrs = { 'aria-label': 'Test Checkbox Group' };

describe('Checkbox Group Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let checkboxGroup;
  let checkboxGroupLegend;
  let checkboxGroupMessages;

  // Environment
  let propsData = basePropsData;
  let attrs = baseAttrs;
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    checkboxGroup = wrapper.find('[data-qa="checkbox-group"]');
    checkboxGroupLegend = wrapper.find('[data-qa="checkbox-group-legend"]');
    checkboxGroupMessages = wrapper.find('[data-qa="checkbox-group-messages"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtCheckboxGroup, {
      propsData,
      attrs,
      slots,
      provide,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  const _mountWrappers = () => {
    wrapper = mount(DtCheckboxGroup, {
      propsData,
      slots,
      attrs,
      provide,
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
    provide = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    // Test Environment
    const legend = 'My Legend';

    // Shared Examples
    const itBehavesLikeHasLegend = () => {
      it(
        'should have a legend',
        () => { expect(checkboxGroupLegend.exists()).toBe(true); },
      );
      it('should have text matching the provided legend', () => {
        expect(checkboxGroupLegend.text()).toBe(legend);
      });
    };

    describe('When rendered with default content', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it(
        'should have a checkbox group',
        () => { expect(checkboxGroup.exists()).toBe(true); },
      );
      it(
        'should not have a legend',
        () => { expect(checkboxGroupLegend.exists()).toBe(false); },
      );
      it('should not have checkboxes', () => {
        expect(wrapper.findAllComponents(DtCheckbox).length).toBe(0);
      });
      it('should not have validation messages', () => {
        expect(
          wrapper.findComponent(DtValidationMessages)?.props('validationMessages').length,
        ).toBe(0);
      });
    });

    describe('When checkboxes are provided', () => {
      // Test Setup
      beforeEach(() => {
        slots = { default: CheckboxesFixture };
      });

      describe('When the checkbox group renders', () => {
        // Test Setup
        beforeEach(() => { _setWrappers(); });

        it('should have checkboxes', () => {
          expect(wrapper.findAllComponents(DtCheckbox).length).toBe(3);
        });
      });
    });

    describe('When a legend is provided via prop', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, legend };
        _setWrappers();
      });

      itBehavesLikeHasLegend();
    });

    describe('When a legend is provided via slot', () => {
      // Test Setup
      beforeEach(() => {
        slots = { legend };
      });

      describe('When a legend is not provided via prop', () => {
        // Test Setup
        beforeEach(() => { _setWrappers(); });

        itBehavesLikeHasLegend();
      });

      describe('When a legend is also provided via prop', () => {
        // Test Setup
        beforeEach(() => {
          propsData = {
            ...basePropsData,
            legend: 'A legend which should not be displayed',
          };
          _setWrappers();
        });

        itBehavesLikeHasLegend();
      });
    });

    describe('When validation messages are provided', () => {
      // Shared Examples
      const itBehavesLikeHasValidationMessages = (numMessages) => {
        it('should have validation messages', () => {
          expect(checkboxGroupMessages?.props('validationMessages').length).toBe(numMessages);
        });
      };

      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, messages: ['Error'] };
      });

      describe('When the validation messages are shown', () => {
        // Test Setup
        beforeEach(() => { _setWrappers(); });

        itBehavesLikeHasValidationMessages(1);
        it('should show validation messages', () => {
          expect(checkboxGroupMessages?.props('showMessages')).toBe(true);
        });
      });

      describe('When the validation messages are hidden', () => {
        // Test Setup
        beforeEach(() => {
          propsData = { ...propsData, showMessages: false };
          _setWrappers();
        });

        itBehavesLikeHasValidationMessages(1);
        it('should hide validation messages', () => {
          expect(checkboxGroupMessages?.props('showMessages')).toBe(false);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    // Test Environment
    const selectedValue = 'apple';

    // Helpers
    const _selectCheckbox = async (value) => {
      const selectedCheckbox = checkboxGroup.find(`[value="${value}"]`);
      selectedCheckbox.element.checked = true;
      await selectedCheckbox.trigger('change');
      await flushPromises();
    };

    // Shared Examples
    const itBehavesLikeUpdatesProvideObj = (selectedValues) => {
      it('should update provide object', () => {
        selectedValues.forEach(value => {
          expect(wrapper.vm.provideObj?.selectedValues?.includes(value)).toBe(true);
        });
      });
    };

    // Test Setup
    beforeEach(() => {
      slots = { default: CheckboxesFixture };
    });

    describe('When initial selected values are provided', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, selectedValues: [selectedValue] };
        _mountWrappers();
      });

      describe('When another checkbox is not selected', () => {
        itBehavesLikeUpdatesProvideObj([selectedValue]);
      });

      describe('When another checkbox is selected', () => {
        // Test Environment
        const selectedValue2 = 'other';
        const selectedValues = [selectedValue, selectedValue2];

        // Test Setup
        beforeEach(async () => {
          await _selectCheckbox(selectedValue2);
        });

        itBehavesLikeUpdatesProvideObj(selectedValues);
        it('Should emit an input event', () => {
          itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValues);
        });
      });
    });

    describe('When a checkbox is selected', () => {
      // Test Environment
      const selectedValues = [selectedValue];

      // Test Setup
      beforeEach(() => {
        _mountWrappers();
        _selectCheckbox(selectedValue);
      });

      itBehavesLikeUpdatesProvideObj(selectedValues);
      it('should emit an input event', () => {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValues);
      });
    });

    describe('When the checkbox group is disabled', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, disabled: true };
        _mountWrappers();
      });

      describe('When a checkbox is selected', () => {
        // Test Setup
        beforeEach(() => { _selectCheckbox(selectedValue); });

        it(
          'does not emit an input event',
          () => { itBehavesLikeDoesNotEmitEvents(wrapper); },
        );
      });
    });
  });

  describe('Validation Tests', () => {
    // Test Environment
    let previousVueSilentConfig;

    // Test Setup
    beforeAll(() => {
      previousVueSilentConfig = Vue.config.silent;
      Vue.config.silent = true;
    });

    // Test Teardown
    afterAll(() => {
      Vue.config.silent = previousVueSilentConfig;
    });

    describe('value', () => {
      // Test Environment
      const prop = DtCheckboxGroup.props.value;

      describe('When a value is not provided', () => {
        itBehavesLikePassesCustomPropValidation(prop);
      });

      describe('When a value is provided', () => {
        itBehavesLikeFailsCustomPropValidation(prop, 'some value');
      });
    });
  });

  describe('Extendability Tests', () => {
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
      propsData = {
        ...basePropsData,
        legend: 'My Legend',
        messages: ['Error'],
      };
    });

    describe('When a legend class is provided', () => {
      // Test Setup
      beforeEach(
        () => { _setupChildClassTest('legendClass', '[data-qa="checkbox-group-legend"]'); },
      );

      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When a messages class is provided', () => {
      // Test Setup
      beforeEach(
        () => { _setupChildClassTest('messagesClass', '[data-qa="checkbox-group-messages"]'); },
      );

      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When legend child props are provided', () => {
      // Test Setup
      beforeEach(
        () => { _setupChildPropsTest('legendChildProps', '[data-qa="checkbox-group-legend"]'); },
      );

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When messages child props are provided', () => {
      // Test Setup
      beforeEach(
        () => { _setupChildPropsTest('messagesChildProps', '[data-qa="checkbox-group-messages"]'); },
      );

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When attrs are provided', () => {
      // Test Setup
      beforeEach(() => {
        attrs = { ...baseAttrs, some: 'prop' };
        _setWrappers();
        element = checkboxGroup;
      });

      itBehavesLikeAppliesChildPropLocal();
    });
  });
});
