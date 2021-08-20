import { assert } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import sinon from 'sinon';
import {
  itBehavesLikeEmitsExpectedEvent,
  itBehavesLikeDoesNotEmitEvents,
} from '../../tests/shared_examples/events';
import {
  itBehavesLikeHasValidationClasses,
  itBehavesLikeChecked,
  itBehavesLikeNotChecked,
} from '../../tests/shared_examples/input';
import {
  itBehavesLikeAppliesClassToChild,
  itBehavesLikeAppliesChildProp,
} from '../../tests/shared_examples/extendability';
import { VALIDATION_MESSAGE_TYPES } from '../constants';
import { CHECKBOX_INPUT_VALIDATION_CLASSES } from './checkbox_constants';
import DtCheckbox from './checkbox.vue';

// Constants
const baseValue = 'Value';
const basePropsData = {
  label: 'My Checkbox Label',
  value: baseValue,
};

describe('Checkbox Tests', function () {
  // Wrappers
  let wrapper;
  let input;
  let label;
  let description;

  // Environment
  const value = baseValue;
  let propsData = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};
  let listeners = {};

  // Helpers
  const _setChildWrappers = () => {
    input = wrapper.find('input');
    label = wrapper.find('[data-qa="checkbox-label"]');
    description = wrapper.find('[data-qa="checkbox-description"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtCheckbox, {
      propsData,
      attrs,
      slots,
      provide,
      listeners,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Shared Examples
  const itBehavesLikeHasValidationClassesLocal = (checkboxValidationState) => {
    it('has validation classes', function () {
      itBehavesLikeHasValidationClasses(
        wrapper,
        CHECKBOX_INPUT_VALIDATION_CLASSES,
        checkboxValidationState,
      );
    });
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
    listeners = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    describe('When the checkbox renders', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      it('should exist', function () { assert.exists(wrapper); });
      it('should have checkbox group class', function () { assert.exists(wrapper.find('.d-checkbox-group')); });

      describe('Checkbox Input Tests', function () {
        it('should exist', function () { assert.exists(input); });
        it('should have type checkbox', function () { assert.strictEqual(input.attributes('type'), 'checkbox'); });
        it('should not be checked', function () { itBehavesLikeNotChecked(input); });
      });

      describe('Checkbox Label Tests', function () {
        it('should exist', function () { assert.exists(label); });
        it('should match provided label prop', function () { assert.strictEqual(label.text(), propsData.label); });
      });
    });

    describe('When a description is provided', function () {
      // Test Setup
      beforeEach(function () {
        propsData = { ...basePropsData, description: 'Description' };
        _setWrappers();
      });

      it('should exist', function () { assert.exists(description); });
    });

    describe('When a validation state is provided', function () {
      // Helpers
      const _setupValidationTest = (validationState) => {
        propsData = { ...basePropsData, description: 'Description', validationState };
        _setWrappers();
      };

      describe('When success', function () {
        beforeEach(function () { _setupValidationTest(VALIDATION_MESSAGE_TYPES.SUCCESS); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);
      });

      describe('When warning', function () {
        beforeEach(function () { _setupValidationTest(VALIDATION_MESSAGE_TYPES.WARNING); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.WARNING);
      });

      describe('When error', function () {
        beforeEach(function () { _setupValidationTest(VALIDATION_MESSAGE_TYPES.ERROR); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.ERROR);
      });
    });

    describe('When checked', function () {
      // Test Setup
      beforeEach(function () {
        propsData = { ...basePropsData, checked: true };
        _setWrappers();
      });

      it('should be checked', function () { itBehavesLikeChecked(input); });
    });

    describe('When disabled', function () {
      // Test Setup
      beforeEach(function () {
        propsData = { ...basePropsData, disabled: true };
        _setWrappers();
      });

      it('should disable input', function () { assert.strictEqual(input.element.disabled, true); });
      it('should have disabled class', function () { assert.exists(wrapper.find('.d-checkbox-group--disabled')); });
    });

    describe('When slot(s) are provided', function () {
      // Test Environment
      const slotLabel = 'My Slotted Label';
      const slotDescription = 'My Slotted Description';

      describe('When a slotted label is provided', function () {
        // Test Setup
        beforeEach(function () {
          slots = { default: slotLabel };
          _setWrappers();
        });

        it('should have slotted label', function () { assert.strictEqual(label.text(), slotLabel); });
      });

      describe('When a slotted description is provided', function () {
        // Test Setup
        beforeEach(function () {
          slots = { description: slotDescription };
          _setWrappers();
        });

        it('should have slotted description', function () { assert.strictEqual(description.text(), slotDescription); });
      });

      describe('When slotted label and description are provided', function () {
        // Test Setup
        beforeEach(function () {
          slots = { default: slotLabel, description: slotDescription };
          _setWrappers();
        });

        it('should have slotted label', function () { assert.strictEqual(label.text(), slotLabel); });
        it('should have slotted description', function () { assert.strictEqual(description.text(), slotDescription); });
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('Custom Event Tests', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      describe('When the checkbox is clicked', function () {
        // Test Setup
        beforeEach(function () { input.trigger('click'); });

        it('Should emit an input event', function () {
          itBehavesLikeEmitsExpectedEvent(wrapper, 'input', true);
        });
      });

      describe('When checked', function () {
        // Test Setup
        beforeEach(function () {
          propsData = { ...basePropsData, checked: true };
          _setWrappers();
        });

        describe('When the checkbox is clicked', function () {
          // Test Setup
          beforeEach(function () { input.trigger('click'); });

          it('Should emit an input event', function () {
            itBehavesLikeEmitsExpectedEvent(wrapper, 'input', false);
          });
        });
      });

      describe('When disabled', function () {
        // Test Setup
        beforeEach(function () {
          propsData = { ...basePropsData, disabled: true };
          _setWrappers();
        });

        describe('When the checkbox is clicked', function () {
          // Test Setup
          beforeEach(function () { input.trigger('click'); });

          it('Should not emit an input event', function () {
            itBehavesLikeDoesNotEmitEvents(wrapper);
          });
        });
      });
    });

    describe('Listener Tests', function () {
      describe('When there is a provided input listener', function () {
        // Test Env
        const inputListenerSpy = sinon.spy();

        // Test Setup
        beforeEach(function () {
          listeners = { input: inputListenerSpy };
          _setWrappers();
        });

        describe('When the checkbox is clicked', function () {
          // Test Setup
          beforeEach(function () { input.trigger('click'); });

          it('Should call input handler once', function () {
            assert.strictEqual(inputListenerSpy.callCount, 1);
          });
        });
      });
    });

    describe('Group Context Tests', function () {
      // Test Environment
      const groupName = 'checkboxGroup';

      // Helpers
      const _setGroupContext = (selectedValues, groupDisabled = false, groupValidationState = null) => {
        provide = {
          groupContext: {
            name: groupName,
            selectedValues,
            disabled: groupDisabled,
            validationState: groupValidationState,
          },
        };
        propsData = { ...basePropsData, description: 'Description' };
        _setWrappers();
      };

      describe('When a group name is provided', function () {
        // Test Setup
        beforeEach(function () { _setGroupContext([]); });

        it('sets the input name', function () { assert.strictEqual(input.attributes('name'), groupName); });
      });

      describe('When the group is disabled', function () {
        // Test Setup
        beforeEach(function () { _setGroupContext([], true); });

        it('should disable input', function () { assert.strictEqual(input.element.disabled, true); });
      });

      describe('When the Checkbox value is in checked', function () {
        // Test Setup
        beforeEach(function () { _setGroupContext([value]); });

        it('should be checked', function () { itBehavesLikeChecked(input); });
      });

      describe('When the Checkbox value is not in checked', function () {
        // Test Setup
        beforeEach(function () { _setGroupContext([]); });

        it('should not be checked', function () { itBehavesLikeNotChecked(input); });
      });

      describe('When the checkbox group has a validation state', function () {
        // Test Setup
        beforeEach(function () { _setGroupContext([], false, VALIDATION_MESSAGE_TYPES.SUCCESS); });

        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);

        describe('When the checkbox has a validation state', function () {
          // Test Setup
          beforeEach(function () {
            propsData = { ...propsData, validationState: VALIDATION_MESSAGE_TYPES.WARNING };
            _setWrappers();
          });

          itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);
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
      propsData = { ...basePropsData, label: 'Label', description: 'Description' };
    });

    describe('When an input class is provided', function () {
      beforeEach(function () { _setupChildClassTest('inputClass', 'input'); });
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When an label class is provided', function () {
      beforeEach(function () { _setupChildClassTest('labelClass', '[data-qa="checkbox-label"]'); });
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When an description class is provided', function () {
      beforeEach(function () { _setupChildClassTest('descriptionClass', '[data-qa="checkbox-description"]'); });
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When label child props are provided', function () {
      beforeEach(function () { _setupChildPropsTest('labelChildProps', '[data-qa="checkbox-label"]'); });
      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When description child props are provided', function () {
      beforeEach(function () { _setupChildPropsTest('descriptionChildProps', '[data-qa="checkbox-description"]'); });
      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When attrs are provided', function () {
      // Test Setup
      beforeEach(function () {
        attrs = { some: 'prop' };
        _setWrappers();
        element = input;
      });

      itBehavesLikeAppliesChildPropLocal();
    });
  });
});
