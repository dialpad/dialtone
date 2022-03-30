import { assert } from 'chai';
import {
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
const baseProps = {
  name: 'my-input-group',
};
const baseAttrs = { 'aria-label': 'Test Input Group' };

describe('Input Group Tests', function () {
  // Wrappers
  let wrapper;
  let inputGroup;
  let inputGroupLegend;
  let inputGroupMessages;

  // Environment
  let props = baseProps;
  let attrs = baseAttrs;
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    inputGroup = wrapper.find('[data-qa="input-group"]');
    inputGroupLegend = wrapper.find('[data-qa="input-group-legend"]');
    inputGroupMessages = wrapper.findComponent('[data-qa="input-group-messages"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtInputGroup, {
      props,
      attrs,
      slots,
      provide,
    });
    _setChildWrappers();
  };

  const _mountWrappers = () => {
    wrapper = mount(DtInputGroup, {
      props,
      slots,
      attrs,
      provide,
    });
    _setChildWrappers();
  };

  // Setup
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = baseAttrs;
    slots = {};
    provide = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    // Test Environment
    const legend = 'My Legend';

    // Shared Examples
    const itBehavesLikeHasLegend = () => {
      it('should have a legend', function () { assert.strictEqual(inputGroupLegend.exists(), true); });
      it('should have text matching the provided legend', function () {
        assert.strictEqual(inputGroupLegend.text(), legend);
      });
    };

    describe('When rendered with default content', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      it('should have a input group', function () { assert.strictEqual(inputGroup.exists(), true); });
      it('should not have a legend', function () { assert.strictEqual(inputGroupLegend.exists(), false); });
      it('should not have inputs', function () {
        assert.lengthOf(wrapper.findAllComponents(InputFixture), 0);
      });
      it('should not have validation messages', function () {
        assert.lengthOf(wrapper.findComponent(DtValidationMessages)?.props('validationMessages'), 0);
      });
    });

    describe('When inputs are provided', function () {
      // Test Setup
      beforeEach(function () {
        slots = { default: InputsFixture };
      });

      describe('When the input group renders', function () {
        // Test Setup
        beforeEach(function () { _mountWrappers(); });

        it('should have inputs', function () {
          assert.lengthOf(wrapper.findAllComponents(InputFixture), 3);
        });
      });
    });

    describe('When a legend is provided via prop', function () {
      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, legend };
        _setWrappers();
      });

      itBehavesLikeHasLegend();
    });

    describe('When a legend is provided via slot', function () {
      // Test Setup
      beforeEach(function () {
        slots = { legend };
      });

      describe('When a legend is not provided via prop', function () {
        // Test Setup
        beforeEach(function () { _setWrappers(); });

        itBehavesLikeHasLegend();
      });

      describe('When a legend is also provided via prop', function () {
        // Test Setup
        beforeEach(function () {
          props = {
            ...baseProps,
            legend: 'A legend which should not be displayed',
          };
          _setWrappers();
        });

        itBehavesLikeHasLegend();
      });
    });

    describe('When validation messages are provided', function () {
      // Shared Examples
      const itBehavesLikeHasValidationMessages = (numMessages) => {
        it('should have validation messages', function () {
          assert.lengthOf(inputGroupMessages?.props('validationMessages'), numMessages);
        });
      };

      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, messages: ['Error'] };
      });

      describe('When the validation messages are shown', function () {
        // Test Setup
        beforeEach(function () { _setWrappers(); });

        itBehavesLikeHasValidationMessages(1);
        it('should show validation messages', function () {
          assert.strictEqual(inputGroupMessages?.props('showMessages'), true);
        });
      });

      describe('When the validation messages are hidden', function () {
        // Test Setup
        beforeEach(function () {
          props = { ...props, showMessages: false };
          _setWrappers();
        });

        itBehavesLikeHasValidationMessages(1);
        it('should hide validation messages', function () {
          assert.strictEqual(inputGroupMessages?.props('showMessages'), false);
        });
      });
    });
  });

  describe('Interactivity Tests', function () {
    // Wrappers
    let selectedInput;

    // Test Environment
    const selectedValue = 'apple';

    // Helpers
    const _selectInput = (value) => {
      selectedInput = inputGroup.find(`[value="${value}"]`);
      selectedInput.trigger('click');
    };

    // Shared Examples
    const itBehavesLikeUpdatesProvideObj = (value) => {
      it('updates provide object value', async function () {
        await wrapper.vm.$nextTick();
        assert.strictEqual(wrapper.vm.provideObj?.value, value);
      });
    };

    // Test Setup
    beforeEach(function () {
      slots = { default: InputsFixture };
    });

    describe('When an initial value is provided', function () {
      // Test Environment
      const initialValue = 'other';

      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, value: initialValue };
      });

      describe('When an input is not selected', function () {
        // Test Setup
        beforeEach(function () { _setWrappers(); });

        itBehavesLikeUpdatesProvideObj(initialValue);
      });

      describe('When an input is selected', function () {
        // Test Setup
        beforeEach(function () {
          _mountWrappers();
          _selectInput(selectedValue);
        });

        itBehavesLikeUpdatesProvideObj(selectedValue);
        it('should emit input event', function () {
          itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValue);
        });
      });
    });

    describe('When an input is selected', function () {
      // Test Setup
      beforeEach(function () {
        _mountWrappers();
        _selectInput(selectedValue);
      });

      itBehavesLikeUpdatesProvideObj(selectedValue);
      it('should emit input event', function () {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValue);
      });
    });

    describe('When the input group is disabled', function () {
      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, disabled: true };
        _mountWrappers();
      });

      it('updates provide object disabled', function () {
        assert.strictEqual(wrapper.vm.provideObj?.disabled, true);
      });

      describe('When an input is selected', function () {
        // Test Setup
        beforeEach(function () { _selectInput(selectedValue); });

        it('does not emit an input event', function () { itBehavesLikeDoesNotEmitEvents(wrapper); });
      });
    });
  });

  describe('Extendability Tests', function () {
    let element;
    const customClass = 'my-custom-class';
    const propName = 'some';
    const propValue = 'prop';
    const childProps = {};

    // Helpers
    const _setupChildClassTest = (childClassName, selector) => {
      props[childClassName] = customClass;
      _setWrappers();
      element = wrapper.find(selector);
    };

    const _setupChildPropsTest = (childPropsName, selector) => {
      props[childPropsName] = childProps;
      _setWrappers();
      element = wrapper.find(selector);
    };

    // Shared Examples
    const itBehavesLikeAppliesClassToChildLocal = () => {
      it('should apply custom class to child', function () {
        itBehavesLikeAppliesClassToChild(wrapper, '.my-custom-class', element);
      });
    };

    const itBehavesLikeAppliesChildPropLocal = () => {
      it('should have provided child prop', function () {
        itBehavesLikeAppliesChildProp(element, propName, propValue);
      });
    };

    // Test Setup
    before(function () {
      childProps[propName] = propValue;
    });

    beforeEach(function () {
      props = {
        ...baseProps,
        legend: 'My Legend',
        messages: ['Error'],
      };
    });

    describe('When a legend class is provided', function () {
      // Test Setup
      beforeEach(function () { _setupChildClassTest('legendClass', '[data-qa="input-group-legend"]'); });

      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When a messages class is provided', function () {
      // Test Setup
      beforeEach(function () { _setupChildClassTest('messagesClass', '[data-qa="input-group-messages"]'); });

      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When legend child props are provided', function () {
      // Test Setup
      beforeEach(function () { _setupChildPropsTest('legendChildProps', '[data-qa="input-group-legend"]'); });

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When messages child props are provided', function () {
      // Test Setup
      beforeEach(function () { _setupChildPropsTest('messagesChildProps', '[data-qa="input-group-messages"]'); });

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When attrs are provided', function () {
      // Test Setup
      beforeEach(function () {
        attrs = { ...baseAttrs, some: 'prop' };
        _setWrappers();
        element = inputGroup;
      });

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('QA Label Tests', function () {
      // Test Environment
      const customQaLabel = 'custom-data-qa-label';

      // Helpers
      const _setupQaLabelTest = (qaLabelPropName) => {
        props[qaLabelPropName] = customQaLabel;
        _setWrappers();
      };

      // Shared Examples
      const itBehavesLikeAppliesCustomQaLabel = () => {
        it('should have applied custom qa label', function () {
          assert.strictEqual(wrapper.find(`[data-qa="${customQaLabel}"]`).exists(), true);
        });
      };

      describe('When a custom data-qa group label is provided', function () {
        // Test Setup
        beforeEach(function () { _setupQaLabelTest('dataQaGroup'); });

        itBehavesLikeAppliesCustomQaLabel();
      });

      describe('When a custom data-qa group legend label is provided', function () {
        // Test Setup
        beforeEach(function () { _setupQaLabelTest('dataQaGroupLegend'); });

        itBehavesLikeAppliesCustomQaLabel();
      });

      describe('When a custom data-qa group messages label is provided', function () {
        // Test Setup
        beforeEach(function () { _setupQaLabelTest('dataQaGroupMessages'); });

        itBehavesLikeAppliesCustomQaLabel();
      });
    });
  });
});
