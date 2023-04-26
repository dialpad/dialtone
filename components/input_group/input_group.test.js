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
  itBehavesLikeAppliesClassToChild,
  itBehavesLikeAppliesChildProp,
} from '../../tests/shared_examples/extendability';
import { DtValidationMessages } from '../validation_messages';
import InputFixture from './decorators/input.vue';
import InputsFixture from './decorators/inputs.vue';
import DtInputGroup from './input_group.vue';

// Constants
const basePropsData = {
  name: 'my-input-group',
};
const baseAttrs = { 'aria-label': 'Test Input Group' };

describe('Input Group Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let inputGroup;
  let inputGroupLegend;
  let inputGroupMessages;

  // Environment
  let propsData = basePropsData;
  let attrs = baseAttrs;
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    inputGroup = wrapper.find('[data-qa="input-group"]');
    inputGroupLegend = wrapper.find('[data-qa="input-group-legend"]');
    inputGroupMessages = wrapper.find('[data-qa="input-group-messages"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtInputGroup, {
      propsData,
      attrs,
      slots,
      provide,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  const _mountWrappers = () => {
    wrapper = mount(DtInputGroup, {
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
        () => { expect(inputGroupLegend.exists()).toBe(true); },
      );
      it('should have text matching the provided legend', () => {
        expect(inputGroupLegend.text()).toBe(legend);
      });
    };

    describe('When rendered with default content', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it(
        'should have a input group',
        () => { expect(inputGroup.exists()).toBe(true); },
      );
      it(
        'should not have a legend',
        () => { expect(inputGroupLegend.exists()).toBe(false); },
      );
      it('should not have inputs', () => {
        expect(wrapper.findAllComponents(InputFixture).length).toBe(0);
      });
      it('should not have validation messages', () => {
        expect(
          wrapper.findComponent(DtValidationMessages)?.props('validationMessages').length,
        ).toBe(0);
      });
    });

    describe('When inputs are provided', () => {
      // Test Setup
      beforeEach(() => {
        slots = { default: InputsFixture };
      });

      describe('When the input group renders', () => {
        // Test Setup
        beforeEach(() => { _setWrappers(); });

        it('should have inputs', () => {
          expect(wrapper.findAllComponents(InputFixture).length).toBe(3);
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
          expect(inputGroupMessages?.props('validationMessages').length).toBe(numMessages);
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
          expect(inputGroupMessages?.props('showMessages')).toBe(true);
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
          expect(inputGroupMessages?.props('showMessages')).toBe(false);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    // Wrappers
    let selectedInput;

    // Test Environment
    const selectedValue = 'apple';

    // Helpers
    const _selectInput = (value) => {
      selectedInput = inputGroup.find(`[value="${value}"]`);
      selectedInput.trigger('change');
    };

    // Shared Examples
    const itBehavesLikeUpdatesProvideObj = (value) => {
      it('updates provide object value', async () => {
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.provideObj?.value).toBe(value);
      });
    };

    // Test Setup
    beforeEach(() => {
      slots = { default: InputsFixture };
    });

    describe('When an initial value is provided', () => {
      // Test Environment
      const initialValue = 'other';

      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, value: initialValue };
      });

      describe('When an input is not selected', () => {
        // Test Setup
        beforeEach(() => { _setWrappers(); });

        itBehavesLikeUpdatesProvideObj(initialValue);
      });

      describe('When an input is selected', () => {
        // Test Setup
        beforeEach(() => {
          _mountWrappers();
          _selectInput(selectedValue);
        });

        itBehavesLikeUpdatesProvideObj(selectedValue);
        it('should emit input event', () => {
          itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValue);
        });
      });
    });

    describe('When an input is selected', () => {
      // Test Setup
      beforeEach(() => {
        _mountWrappers();
        _selectInput(selectedValue);
      });

      itBehavesLikeUpdatesProvideObj(selectedValue);
      it('should emit input event', () => {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValue);
      });
    });

    describe('When the input group is disabled', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, disabled: true };
        _mountWrappers();
      });

      it('updates provide object disabled', () => {
        expect(wrapper.vm.provideObj?.disabled).toBe(true);
      });

      describe('When an input is selected', () => {
        // Test Setup
        beforeEach(() => { _selectInput(selectedValue); });

        it(
          'does not emit an input event',
          () => { itBehavesLikeDoesNotEmitEvents(wrapper); },
        );
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
        () => { _setupChildClassTest('legendClass', '[data-qa="input-group-legend"]'); },
      );

      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When a messages class is provided', () => {
      // Test Setup
      beforeEach(
        () => { _setupChildClassTest('messagesClass', '[data-qa="input-group-messages"]'); },
      );

      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When legend child props are provided', () => {
      // Test Setup
      beforeEach(
        () => { _setupChildPropsTest('legendChildProps', '[data-qa="input-group-legend"]'); },
      );

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When messages child props are provided', () => {
      // Test Setup
      beforeEach(
        () => { _setupChildPropsTest('messagesChildProps', '[data-qa="input-group-messages"]'); },
      );

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When attrs are provided', () => {
      // Test Setup
      beforeEach(() => {
        attrs = { ...baseAttrs, some: 'prop' };
        _setWrappers();
        element = inputGroup;
      });

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('QA Label Tests', () => {
      // Test Environment
      const customQaLabel = 'custom-data-qa-label';

      // Helpers
      const _setupQaLabelTest = (qaLabelPropName) => {
        propsData[qaLabelPropName] = customQaLabel;
        _setWrappers();
      };

      // Shared Examples
      const itBehavesLikeAppliesCustomQaLabel = () => {
        it('should have applied custom qa label', () => {
          expect(wrapper.find(`[data-qa="${customQaLabel}"]`).exists()).toBe(true);
        });
      };

      describe('When a custom data-qa group label is provided', () => {
        // Test Setup
        beforeEach(() => { _setupQaLabelTest('dataQaGroup'); });

        itBehavesLikeAppliesCustomQaLabel();
      });

      describe('When a custom data-qa group legend label is provided', () => {
        // Test Setup
        beforeEach(() => { _setupQaLabelTest('dataQaGroupLegend'); });

        itBehavesLikeAppliesCustomQaLabel();
      });

      describe('When a custom data-qa group messages label is provided', () => {
        // Test Setup
        beforeEach(() => { _setupQaLabelTest('dataQaGroupMessages'); });

        itBehavesLikeAppliesCustomQaLabel();
      });
    });
  });
});
