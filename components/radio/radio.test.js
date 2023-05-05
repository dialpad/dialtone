import { shallowMount } from '@vue/test-utils';
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

describe('DtRadio Tests', () => {
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
    it('has validation classes', () => {
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

  describe('Presentation Tests', () => {
    describe('When the radio renders', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it('should exist', () => { expect(wrapper.exists()).toBeTruthy(); });
      it(
        'should have radio group class',
        () => { expect(wrapper.find('.d-radio-group').exists()).toBeTruthy(); },
      );

      describe('Radio Input Tests', () => {
        it('should exist', () => { expect(input.exists()).toBeTruthy(); });
        it(
          'should have type radio',
          () => { expect(input.attributes('type')).toBe('radio'); },
        );
        it('should not be checked', () => { itBehavesLikeNotChecked(input); });
      });

      describe('Radio Label Tests', () => {
        // Wrappers
        let radioLabel;

        // Test Setup
        beforeEach(() => {
          radioLabel = wrapper.find('[data-qa="radio-label"]');
        });

        it('should exist', () => { expect(radioLabel.exists()).toBeTruthy(); });
        it(
          'should match provided label prop',
          () => { expect(radioLabel.text()).toBe(props.label); },
        );
      });
    });

    describe('When a description is provided', () => {
      // wrappers
      let radioDescription;

      // Test Setup
      beforeEach(() => {
        props = { ...baseProps, description: 'Description' };
        _setWrappers();
        radioDescription = wrapper.find('[data-qa="radio-description"]');
      });

      it('should exist', () => { expect(radioDescription.exists()).toBeTruthy(); });
    });

    describe('When a validation state is provided', () => {
      // Helpers
      const _setupValidationTest = (validationState) => {
        props = { ...baseProps, description: 'Description', validationState };
        _setWrappers();
      };

      describe('When warning', () => {
        beforeEach(() => { _setupValidationTest(VALIDATION_MESSAGE_TYPES.WARNING); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.WARNING);
      });

      describe('When error', () => {
        beforeEach(() => { _setupValidationTest(VALIDATION_MESSAGE_TYPES.ERROR); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.ERROR);
      });

      describe('When success', () => {
        beforeEach(() => { _setupValidationTest(VALIDATION_MESSAGE_TYPES.SUCCESS); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);
      });
    });

    describe('When checked', () => {
      // Test Setup
      beforeEach(() => {
        props = { ...baseProps, checked: true };
        _setWrappers();
      });

      it('should be checked', () => { itBehavesLikeChecked(input); });
    });

    describe('When disabled', () => {
      // Test Setup
      beforeEach(() => {
        props = { ...baseProps, disabled: true };
        _setWrappers();
      });

      it(
        'should disable input',
        () => { expect(input.element.disabled).toBe(true); },
      );
      it(
        'should have disabled class',
        () => { expect(wrapper.find('.d-radio-group--disabled').exists()).toBeTruthy(); },
      );

      describe('When clicked', () => {
        // Test Setup
        beforeEach(() => { wrapper.trigger('click'); });

        it(
          'no events are emitted',
          () => { itBehavesLikeDoesNotEmitEvents(wrapper); },
        );
      });
    });

    describe('When slot(s) are provided', () => {
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

      describe('When a slotted label is provided', () => {
        // Test Setup
        beforeEach(() => {
          slots = { default: slotLabel };
          _setWrappers();
          _setSlotContainers();
        });

        it(
          'should have slotted label',
          () => { expect(labelSlotContainer.text()).toBe(slotLabel); },
        );
      });

      describe('When a slotted description is provided', () => {
        // Test Setup
        beforeEach(() => {
          slots = { description: slotDescription };
          _setWrappers();
          _setSlotContainers();
        });

        it('should have slotted description', () => {
          expect(descriptionSlotContainer.text()).toBe(slotDescription);
        });
      });

      describe('When slotted label and description are provided', () => {
        // Test Setup
        beforeEach(() => {
          slots = { default: slotLabel, description: slotDescription };
          _setWrappers();
          _setSlotContainers();
        });

        it(
          'should have slotted label',
          () => { expect(labelSlotContainer.text()).toBe(slotLabel); },
        );
        it('should have slotted description', () => {
          expect(descriptionSlotContainer.text()).toBe(slotDescription);
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
        props = { ...baseProps, label: 'Label', description: 'Description' };
      });

      describe('When an input class is provided', () => {
        beforeEach(() => { _setupChildClassTest('inputClass', 'input'); });
        itBehavesLikeAppliesClassToChildLocal();
      });

      describe('When an label class is provided', () => {
        beforeEach(
          () => { _setupChildClassTest('labelClass', '[data-qa="radio-label"]'); },
        );
        itBehavesLikeAppliesClassToChildLocal();
      });

      describe('When an description class is provided', () => {
        beforeEach(
          () => { _setupChildClassTest('descriptionClass', '[data-qa="radio-description"]'); },
        );
        itBehavesLikeAppliesClassToChildLocal();
      });

      describe('When label child props are provided', () => {
        beforeEach(
          () => { _setupChildPropsTest('labelChildProps', '[data-qa="radio-label"]'); },
        );
        itBehavesLikeAppliesChildPropLocal();
      });

      describe('When description child props are provided', () => {
        beforeEach(
          () => { _setupChildPropsTest('descriptionChildProps', '[data-qa="radio-description"]'); },
        );
        itBehavesLikeAppliesChildPropLocal();
      });

      describe('When attrs are provided', () => {
        // Test Setup
        beforeEach(() => {
          attrs = { some: 'prop' };
          _setWrappers();
          element = input;
        });

        itBehavesLikeAppliesChildPropLocal();
      });
    });
  });

  describe('Reactivity Tests', () => {
    describe('Custom Event Tests', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      describe('When the radio is selected', () => {
        // Test Setup
        beforeEach(() => { input.trigger('change'); });

        it('should emit the input event with Value', () => {
          itBehavesLikeEmitsExpectedEvent(wrapper, 'input', value);
        });
      });
    });

    describe('Listener Tests', () => {
      describe('When there is a provided input listener', () => {
        // Test Env
        const inputListenerSpy = vi.fn();

        // Test Setup
        beforeEach(() => {
          attrs = { onInput: inputListenerSpy };
          _setWrappers();
        });

        describe('When the radio is clicked', () => {
          // Test Setup
          beforeEach(async () => { await input.trigger('change'); });

          it('Should call input handler once', () => {
            expect(inputListenerSpy).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });

  describe('When there is a Radio Group Context', () => {
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
      it(
        'sets the input name',
        () => { expect(input.attributes('name')).toBe(groupName); },
      );
    };

    describe('When the value matches the Radio', () => {
      beforeEach(() => { _setGroupContext(value); });

      itBehavesLikeSetsInputName();
      it('should be checked', () => { itBehavesLikeChecked(input); });

      describe('When the radio group is disabled', () => {
        // Test Setup
        beforeEach(() => { _setGroupContext(value, true); });

        describe('When the radio is clicked', () => {
          // Test Setup
          beforeEach(() => { wrapper.trigger('click'); });

          it(
            'no events are emitted',
            () => { itBehavesLikeDoesNotEmitEvents(wrapper); },
          );
        });
      });

      describe('When the radio group has a validation state', () => {
        beforeEach(
          () => { _setGroupContext(value, false, VALIDATION_MESSAGE_TYPES.SUCCESS); },
        );
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);

        describe('When the radio has a validation state', () => {
          // Test Setup
          beforeEach(() => {
            props = { ...baseProps, validationState: VALIDATION_MESSAGE_TYPES.WARNING };
            _setWrappers();
          });

          itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);
        });
      });
    });

    describe('When the value does not match the Radio', () => {
      beforeEach(() => { _setGroupContext(`not${value}`); });

      itBehavesLikeSetsInputName();
      it('should not be checked', () => { itBehavesLikeNotChecked(input); });
    });
  });
});
