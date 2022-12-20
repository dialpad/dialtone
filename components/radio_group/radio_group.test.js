import { assert } from 'chai';
import { config, shallowMount, mount } from '@vue/test-utils';
import { DtValidationMessages } from '../validation_messages';
import { DtRadio } from '../radio';
import DtRadioGroup from './radio_group.vue';
import RadiosFixture from '../../tests/fixtures/radios.vue';
import { itBehavesLikeEmitsExpectedEvent } from '@/tests/shared_examples/events';

// Test Constants
const baseGroupName = 'test-radio-group';
const baseProps = {
  name: baseGroupName,
  value: '',
};
const baseAttrs = { 'aria-label': 'Test Radio Group' };

describe('DtRadioGroup Tests', function () {
  // Wrappers
  let wrapper;
  let radioGroup;
  let radioGroupLegend;

  // Test Environment
  let props = baseProps;
  let attrs = baseAttrs;
  let slots = {};

  // Helpers
  const _setChildWrappers = () => {
    radioGroup = wrapper.find('[data-qa="radio-group"]');
    radioGroupLegend = wrapper.find('[data-qa="radio-group-legend"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtRadioGroup, {
      props,
      slots,
      attrs,
    });
    _setChildWrappers();
  };

  const _mountWrappers = () => {
    wrapper = mount(DtRadioGroup, {
      props,
      slots,
      attrs,
    });
    _setChildWrappers();
  };

  config.global.renderStubDefaultSlot = true;

  // Test Teardown
  afterEach(function () {
    props = baseProps;
    attrs = baseAttrs;
    slots = {};
  });

  after(function () {
    config.global.renderStubDefaultSlot = false;
  });

  describe('Presentation Tests', function () {
    // Test Environment
    let legend;

    // Shared Examples
    const itBehavesLikeHasRadioGroup = () => {
      it('should have a radio group', function () { assert.strictEqual(radioGroup.exists(), true); });
    };

    const itBehavesLikeDoesNotHaveLegend = () => {
      it('should not have a legend', function () { assert.strictEqual(radioGroupLegend.exists(), false); });
    };

    const itBehavesLikeHasLegend = () => {
      it('should have a legend', function () { assert.strictEqual(radioGroupLegend.exists(), true); });
      it('should have text matching the provided legend', function () {
        assert.strictEqual(radioGroupLegend.text(), legend);
      });
    };

    const itBehavesLikeDoesNotHaveRadios = () => {
      it('should not have radios', function () {
        assert.lengthOf(wrapper.findAllComponents(DtRadio), 0);
      });
    };

    const itBehavesLikeHasRadios = (numRadios) => {
      it('should have radios', function () {
        assert.lengthOf(wrapper.findAllComponents(DtRadio), numRadios);
      });
    };

    const itBehavesLikeDoesNotHaveValidationMessages = () => {
      it('should not have validation messages', function () {
        assert.lengthOf(wrapper.findComponent(DtValidationMessages)?.props('validationMessages'), 0);
      });
    };

    const itBehavesLikeHasValidationMessages = (numMessages) => {
      it('should have validation messages', function () {
        assert.lengthOf(wrapper.findComponent(DtValidationMessages)?.props('validationMessages'), numMessages);
      });
    };

    describe('When the radio group renders', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      itBehavesLikeHasRadioGroup();
      itBehavesLikeDoesNotHaveLegend();
      itBehavesLikeDoesNotHaveRadios();
      itBehavesLikeDoesNotHaveValidationMessages();
    });

    describe('When a legend is provided', function () {
      // Test Setup
      beforeEach(function () {
        legend = 'My Legend';
      });

      describe('When the legend is provided via prop', function () {
        // Test Setup
        beforeEach(function () {
          props = { ...baseProps, legend };
        });

        describe('When the radio group renders', function () {
          // Test Setup
          beforeEach(function () { _setWrappers(); });

          itBehavesLikeHasLegend();
        });
      });

      describe('When the legend is provided via slot', function () {
        // Test Setup
        beforeEach(function () {
          slots = { legend };
        });

        describe('When the radio group renders', function () {
          // Test Setup
          beforeEach(function () { _setWrappers(); });

          itBehavesLikeHasLegend();
        });
      });
    });

    describe('When radios are provided', function () {
      // Test Setup
      beforeEach(function () {
        slots = { default: RadiosFixture };
      });

      describe('When the radio group renders', function () {
        // Test Setup
        beforeEach(function () { _mountWrappers(); });

        itBehavesLikeHasRadios(2);
      });
    });

    describe('When validation messages are provided', function () {
      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, messages: ['Error'] };
      });

      describe('When the radio group renders', function () {
        // Test Setup
        beforeEach(function () { _setWrappers(); });

        itBehavesLikeHasValidationMessages(1);
      });
    });
  });

  describe('Reactivity Tests', function () {
    // Wrappers
    let selectedRadio;

    // Test Environment
    const selectedValue = 'kiwi';

    // Helpers
    const _selectRadio = () => {
      selectedRadio = radioGroup.find(`[value="${selectedValue}"]`);
      selectedRadio.trigger('click');
      selectedRadio.trigger('change');
    };

    beforeEach(function () {
      slots = { default: RadiosFixture };
    });

    describe('When an initial value is provided', function () {
      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, value: selectedValue };
        _setWrappers();
      });

      it('updates provide object', function () {
        assert.strictEqual(wrapper.vm.provideObj.value, selectedValue);
      });
    });

    describe('When a radio is selected', function () {
      // Test Setup
      beforeEach(function () {
        _mountWrappers();
        _selectRadio();
      });

      it('emits an input event', function () {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValue);
      });
    });

    describe('When the radio group is disabled', function () {
      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, disabled: true };
        _mountWrappers();
      });

      describe('When a radio is selected', function () {
        // Test Setup
        beforeEach(function () { _selectRadio(); });

        it('does not emit an input event', function () {
          assert.notExists(wrapper.emitted('input'));
        });
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
    const itBehavesLikeAppliesClassToChild = () => {
      it('should apply custom class to child', function () {
        assert.strictEqual(wrapper.find(`.${customClass}`).html(), element.html());
      });
    };

    const itBehavesLikeAppliesChildProp = () => {
      it('should have provided child prop', function () {
        assert.strictEqual(element.attributes(propName), propValue);
      });
    };

    // Test Setup
    before(function () {
      childProps[propName] = propValue;
    });

    beforeEach(function () {
      props = { ...baseProps, legend: 'My Radio Group' };
    });

    describe('When a legend class is provided', function () {
      beforeEach(function () { _setupChildClassTest('legendClass', '[data-qa="radio-group-legend"]'); });
      itBehavesLikeAppliesClassToChild();
    });

    describe('When a messages class is provided', function () {
      beforeEach(function () { _setupChildClassTest('messagesClass', '[data-qa="radio-group-messages"]'); });
      itBehavesLikeAppliesClassToChild();
    });

    describe('When legendChildProps are provided', function () {
      beforeEach(function () { _setupChildPropsTest('legendChildProps', '[data-qa="radio-group-legend"]'); });
      itBehavesLikeAppliesChildProp();
    });

    describe('When messagesChildProps are provided', function () {
      beforeEach(function () { _setupChildPropsTest('messagesChildProps', '[data-qa="radio-group-messages"]'); });
      itBehavesLikeAppliesChildProp();
    });

    describe('When attrs are provided', function () {
      // Test Setup
      beforeEach(function () {
        attrs = { ...baseAttrs, some: 'prop' };
        _setWrappers();
        element = radioGroup;
      });

      itBehavesLikeAppliesChildProp();
    });
  });
});
