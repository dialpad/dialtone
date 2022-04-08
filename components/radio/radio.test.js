import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
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
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import { RADIO_INPUT_VALIDATION_CLASSES } from './radio_constants';
import DtRadio from './radio.vue';

const baseValue = 'Value';
const baseProps = {
  label: 'My Radio Label',
  value: baseValue,
};

describe('Dialtone Vue Radio Tests', function () {
  // Wrappers
  let wrapper;
  let input;

  // Test Environment
  const value = baseValue;
  let props = baseProps;
  let slots = {};
  let attrs = {};
  let provide = {};

  // Helpers
  const _setWrappers = () => {
    wrapper = shallowMount(DtRadio, {
      props,
      slots,
      attrs,
      global: {
        provide,
      },
    });
    input = wrapper.find('input');
  };

  // Shared Examples
  const itBehavesLikeHasValidationClassesLocal = (checkboxValidationState) => {
    it('has validation classes', function () {
      itBehavesLikeHasValidationClasses(
        wrapper,
        RADIO_INPUT_VALIDATION_CLASSES,
        checkboxValidationState,
      );
    });
  };

  // Test Teardown
  afterEach(function () {
    props = baseProps;
    slots = {};
    attrs = {};
    provide = {};
  });

  describe('Presentation Tests', function () {
    describe('When the radio renders', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      it('should exist', function () { assert.exists(wrapper); });
      it('should have radio group class', function () { assert.exists(wrapper.find('.d-radio-group')); });

      describe('Radio Input Tests', function () {
        it('should exist', function () { assert.exists(input); });
        it('should have type radio', function () { assert.strictEqual(input.attributes('type'), 'radio'); });
        it('should not be checked', function () { itBehavesLikeNotChecked(input); });
      });

      describe('Radio Label Tests', function () {
        // Wrappers
        let radioLabel;

        // Test Setup
        beforeEach(function () {
          radioLabel = wrapper.find('[data-qa="radio-label"]');
        });

        it('should exist', function () { assert.exists(radioLabel); });
        it('should match provided label prop', function () { assert.strictEqual(radioLabel.text(), props.label); });
      });
    });

    describe('When a description is provided', function () {
      // wrappers
      let radioDescription;

      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, description: 'Description' };
        _setWrappers();
        radioDescription = wrapper.find('[data-qa="radio-description"]');
      });

      it('should exist', function () { assert.exists(radioDescription); });
    });

    describe('When a validation state is provided', function () {
      // Helpers
      const _setupValidationTest = (validationState) => {
        props = { ...baseProps, description: 'Description', validationState };
        _setWrappers();
      };

      describe('When warning', function () {
        beforeEach(function () { _setupValidationTest(VALIDATION_MESSAGE_TYPES.WARNING); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.WARNING);
      });

      describe('When error', function () {
        beforeEach(function () { _setupValidationTest(VALIDATION_MESSAGE_TYPES.ERROR); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.ERROR);
      });

      describe('When success', function () {
        beforeEach(function () { _setupValidationTest(VALIDATION_MESSAGE_TYPES.SUCCESS); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);
      });
    });

    describe('When checked', function () {
      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, checked: true };
        _setWrappers();
      });

      it('should be checked', function () { itBehavesLikeChecked(input); });
    });

    describe('When disabled', function () {
      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, disabled: true };
        _setWrappers();
      });

      it('should disable input', function () { assert.strictEqual(input.element.disabled, true); });
      it('should have disabled class', function () { assert.exists(wrapper.find('.d-radio-group--disabled')); });

      describe('When clicked', function () {
        // Test Setup
        beforeEach(function () { wrapper.trigger('click'); });

        it('no events are emitted', function () { itBehavesLikeDoesNotEmitEvents(wrapper); });
      });
    });

    describe('When slot(s) are provided', function () {
      // Wrappers
      let labelSlotContainer;
      let descriptionSlotContainer;

      // Test Environment
      const slotLabel = 'My Slotted Label';
      const slotDescription = 'My Slotted Description';

      // Helpers
      const _setSlotContainers = () => {
        labelSlotContainer = wrapper.find('[data-qa="radio-label"]');
        descriptionSlotContainer = wrapper.find('[data-qa="radio-description"]');
      };

      describe('When a slotted label is provided', function () {
        // Test Setup
        beforeEach(function () {
          slots = { default: slotLabel };
          _setWrappers();
          _setSlotContainers();
        });

        it('should have slotted label', function () { assert.strictEqual(labelSlotContainer.text(), slotLabel); });
      });

      describe('When a slotted description is provided', function () {
        // Test Setup
        beforeEach(function () {
          slots = { description: slotDescription };
          _setWrappers();
          _setSlotContainers();
        });

        it('should have slotted description', function () {
          assert.strictEqual(descriptionSlotContainer.text(), slotDescription);
        });
      });

      describe('When slotted label and description are provided', function () {
        // Test Setup
        beforeEach(function () {
          slots = { default: slotLabel, description: slotDescription };
          _setWrappers();
          _setSlotContainers();
        });

        it('should have slotted label', function () { assert.strictEqual(labelSlotContainer.text(), slotLabel); });
        it('should have slotted description', function () {
          assert.strictEqual(descriptionSlotContainer.text(), slotDescription);
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
        props = { ...baseProps, label: 'Label', description: 'Description' };
      });

      describe('When an input class is provided', function () {
        beforeEach(function () { _setupChildClassTest('inputClass', 'input'); });
        itBehavesLikeAppliesClassToChildLocal();
      });

      describe('When an label class is provided', function () {
        beforeEach(function () { _setupChildClassTest('labelClass', '[data-qa="radio-label"]'); });
        itBehavesLikeAppliesClassToChildLocal();
      });

      describe('When an description class is provided', function () {
        beforeEach(function () { _setupChildClassTest('descriptionClass', '[data-qa="radio-description"]'); });
        itBehavesLikeAppliesClassToChildLocal();
      });

      describe('When label child props are provided', function () {
        beforeEach(function () { _setupChildPropsTest('labelChildProps', '[data-qa="radio-label"]'); });
        itBehavesLikeAppliesChildPropLocal();
      });

      describe('When description child props are provided', function () {
        beforeEach(function () { _setupChildPropsTest('descriptionChildProps', '[data-qa="radio-description"]'); });
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

  describe('Reactivity Tests', function () {
    describe('Custom Event Tests', function () {
      // Test Setup
      beforeEach(function () { _setWrappers(); });

      describe('When the radio is selected', function () {
        // Test Setup
        beforeEach(function () { input.trigger('click'); });

        it('should emit the input event with Value', function () {
          itBehavesLikeEmitsExpectedEvent(wrapper, 'input', value);
        });
      });
    });

    describe('Listener Tests', function () {
      describe('When there is a provided input listener', function () {
        // Test Env
        const inputListenerSpy = sinon.spy();

        // Test Setup
        beforeEach(function () {
          attrs = { onInput: inputListenerSpy };
          _setWrappers();
        });

        describe('When the radio is clicked', function () {
          // Test Setup
          beforeEach(function () { input.trigger('click'); });

          it('Should call input handler once', function () {
            assert.strictEqual(inputListenerSpy.callCount, 1);
          });
        });
      });
    });
  });

  describe('When there is a Radio Group Context', function () {
    // Test Environment
    const groupName = 'radioGroup';

    // Helpers
    const _setGroupContext = (radioGroupValue, groupDisabled = false, groupValidationState = null) => {
      provide = {
        groupContext: {
          name: groupName,
          selectedValue: radioGroupValue,
          disabled: groupDisabled,
          validationState: groupValidationState,
        },
      };
      props = { ...baseProps, description: 'Description' };
      _setWrappers();
    };

    // Shared Examples
    const itBehavesLikeSetsInputName = () => {
      it('sets the input name', function () { assert.strictEqual(input.attributes('name'), groupName); });
    };

    describe('When the value matches the Radio', function () {
      beforeEach(function () { _setGroupContext(value); });

      itBehavesLikeSetsInputName();
      it('should be checked', function () { itBehavesLikeChecked(input); });

      describe('When the radio group is disabled', function () {
        // Test Setup
        beforeEach(function () { _setGroupContext(value, true); });

        describe('When the radio is clicked', function () {
          // Test Setup
          beforeEach(function () { wrapper.trigger('click'); });

          it('no events are emitted', function () { itBehavesLikeDoesNotEmitEvents(wrapper); });
        });
      });

      describe('When the radio group has a validation state', function () {
        beforeEach(function () { _setGroupContext(value, false, VALIDATION_MESSAGE_TYPES.SUCCESS); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);

        describe('When the radio has a validation state', function () {
          // Test Setup
          beforeEach(function () {
            props = { ...props, validationState: VALIDATION_MESSAGE_TYPES.WARNING };
            _setWrappers();
          });

          itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);
        });
      });
    });

    describe('When the value does not match the Radio', function () {
      beforeEach(function () { _setGroupContext(`not${value}`); });

      itBehavesLikeSetsInputName();
      it('should not be checked', function () { itBehavesLikeNotChecked(input); });
    });
  });
});
