import Vue from 'vue';
import { assert } from 'chai';
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

describe('Checkbox Group Tests', function () {
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
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  const _mountWrappers = () => {
    wrapper = mount(DtCheckboxGroup, {
      propsData,
      slots,
      attrs,
      provide,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
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
      it('should have a legend', function () { assert.strictEqual(checkboxGroupLegend.exists(), true); });
      it('should have text matching the provided legend', function () {
        assert.strictEqual(checkboxGroupLegend.text(), legend);
      });
    };

    describe('When rendered with default content', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      it('should have a checkbox group', function () { assert.strictEqual(checkboxGroup.exists(), true); });
      it('should not have a legend', function () { assert.strictEqual(checkboxGroupLegend.exists(), false); });
      it('should not have checkboxes', function () {
        assert.lengthOf(wrapper.findAllComponents(DtCheckbox), 0);
      });
      it('should not have validation messages', function () {
        assert.lengthOf(wrapper.findComponent(DtValidationMessages)?.props('validationMessages'), 0);
      });
    });

    describe('When checkboxes are provided', function () {
      // Test Setup
      beforeEach(function () {
        slots = { default: CheckboxesFixture };
      });

      describe('When the checkbox group renders', function () {
        // Test Setup
        beforeEach(function () { _setWrappers(); });

        it('should have checkboxes', function () {
          assert.lengthOf(wrapper.findAllComponents(DtCheckbox), 3);
        });
      });
    });

    describe('When a legend is provided via prop', function () {
      // Test Setup
      beforeEach(function () {
        propsData = { ...basePropsData, legend };
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
          propsData = {
            ...basePropsData,
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
          assert.lengthOf(checkboxGroupMessages?.props('validationMessages'), numMessages);
        });
      };

      // Test Setup
      beforeEach(function () {
        propsData = { ...basePropsData, messages: ['Error'] };
      });

      describe('When the validation messages are shown', function () {
        // Test Setup
        beforeEach(function () { _setWrappers(); });

        itBehavesLikeHasValidationMessages(1);
        it('should show validation messages', function () {
          assert.strictEqual(checkboxGroupMessages?.props('showMessages'), true);
        });
      });

      describe('When the validation messages are hidden', function () {
        // Test Setup
        beforeEach(function () {
          propsData = { ...propsData, showMessages: false };
          _setWrappers();
        });

        itBehavesLikeHasValidationMessages(1);
        it('should hide validation messages', function () {
          assert.strictEqual(checkboxGroupMessages?.props('showMessages'), false);
        });
      });
    });
  });

  describe('Interactivity Tests', function () {
    // Test Environment
    const selectedValue = 'apple';

    // Helpers
    const _selectCheckbox = (value) => {
      const selectedCheckbox = checkboxGroup.find(`[value="${value}"]`);
      selectedCheckbox.trigger('click');
    };

    // Shared Examples
    const itBehavesLikeUpdatesProvideObj = (selectedValues) => {
      it('should update provide object', function () {
        selectedValues.forEach(value => {
          assert.strictEqual(wrapper.vm.provideObj?.selectedValues?.includes(value), true);
        });
      });
    };

    // Test Setup
    beforeEach(function () {
      slots = { default: CheckboxesFixture };
    });

    describe('When initial selected values are provided', function () {
      // Test Setup
      beforeEach(function () {
        propsData = { ...basePropsData, selectedValues: [selectedValue] };
        _mountWrappers();
      });

      describe('When another checkbox is not selected', function () {
        itBehavesLikeUpdatesProvideObj([selectedValue]);
      });

      describe('When another checkbox is selected', function () {
        // Test Environment
        const selectedValue2 = 'other';
        const selectedValues = [selectedValue, selectedValue2];

        // Test Setup
        beforeEach(function () {
          _selectCheckbox(selectedValue2);
        });

        itBehavesLikeUpdatesProvideObj(selectedValues);
        it('Should emit an input event', function () {
          itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValues);
        });
      });
    });

    describe('When a checkbox is selected', function () {
      // Test Environment
      const selectedValues = [selectedValue];

      // Test Setup
      beforeEach(function () {
        _mountWrappers();
        _selectCheckbox(selectedValue);
      });

      itBehavesLikeUpdatesProvideObj(selectedValues);
      it('should emit an input event', function () {
        itBehavesLikeEmitsExpectedEvent(wrapper, 'input', selectedValues);
      });
    });

    describe('When the checkbox group is disabled', function () {
      // Test Setup
      beforeEach(function () {
        propsData = { ...basePropsData, disabled: true };
        _mountWrappers();
      });

      describe('When a checkbox is selected', function () {
        // Test Setup
        beforeEach(function () { _selectCheckbox(selectedValue); });

        it('does not emit an input event', function () { itBehavesLikeDoesNotEmitEvents(wrapper); });
      });
    });
  });

  describe('Validation Tests', function () {
    // Test Environment
    let previousVueSilentConfig;

    // Test Setup
    before(function () {
      previousVueSilentConfig = Vue.config.silent;
      Vue.config.silent = true;
    });

    // Test Teardown
    after(function () {
      Vue.config.silent = previousVueSilentConfig;
    });

    describe('value', function () {
      // Test Environment
      const prop = DtCheckboxGroup.props.value;

      describe('When a value is not provided', function () {
        itBehavesLikePassesCustomPropValidation(prop);
      });

      describe('When a value is provided', function () {
        itBehavesLikeFailsCustomPropValidation(prop, 'some value');
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
      propsData = {
        ...basePropsData,
        legend: 'My Legend',
        messages: ['Error'],
      };
    });

    describe('When a legend class is provided', function () {
      // Test Setup
      beforeEach(function () { _setupChildClassTest('legendClass', '[data-qa="checkbox-group-legend"]'); });

      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When a messages class is provided', function () {
      // Test Setup
      beforeEach(function () { _setupChildClassTest('messagesClass', '[data-qa="checkbox-group-messages"]'); });

      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When legend child props are provided', function () {
      // Test Setup
      beforeEach(function () { _setupChildPropsTest('legendChildProps', '[data-qa="checkbox-group-legend"]'); });

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When messages child props are provided', function () {
      // Test Setup
      beforeEach(function () { _setupChildPropsTest('messagesChildProps', '[data-qa="checkbox-group-messages"]'); });

      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When attrs are provided', function () {
      // Test Setup
      beforeEach(function () {
        attrs = { ...baseAttrs, some: 'prop' };
        _setWrappers();
        element = checkboxGroup;
      });

      itBehavesLikeAppliesChildPropLocal();
    });
  });
});
