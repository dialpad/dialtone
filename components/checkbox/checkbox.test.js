import { createLocalVue, shallowMount } from '@vue/test-utils';
import {
  itBehavesLikeDoesNotEmitEvents,
  itBehavesLikeEmitsExpectedEvent,
} from '../../tests/shared_examples/events';
import {
  itBehavesLikeAppliesChildProp,
  itBehavesLikeAppliesClassToChild,
} from '../../tests/shared_examples/extendability';
import {
  itBehavesLikeChecked,
  itBehavesLikeHasValidationClasses, itBehavesLikeIndeterminate,
  itBehavesLikeNotChecked,
} from '../../tests/shared_examples/input';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import DtCheckbox from './checkbox.vue';
import { CHECKBOX_INPUT_VALIDATION_CLASSES } from './checkbox_constants';

// Constants
const baseValue = 'Value';
const basePropsData = {
  label: 'My Checkbox Label',
  value: baseValue,
};

describe('DtCheckbox Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let input;
  let label;
  let description;
  let labelDescriptionContainer;

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
    labelDescriptionContainer = wrapper.find('[data-qa="checkbox-label-description-container"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtCheckbox, {
      propsData,
      attrs,
      slots,
      provide,
      listeners,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Shared Examples
  const itBehavesLikeHasValidationClassesLocal = (checkboxValidationState) => {
    it('has validation classes', () => {
      itBehavesLikeHasValidationClasses(
        wrapper,
        CHECKBOX_INPUT_VALIDATION_CLASSES,
        checkboxValidationState,
      );
    });
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });
  beforeEach(() => {});

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
    listeners = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('When the checkbox renders', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it('should exist', () => { expect(wrapper.exists()).toBe(true); });
      it('should have checkbox group class', () => {
        expect(wrapper.find('.d-checkbox-group').exists()).toBe(true);
      });

      describe('Checkbox Input Tests', () => {
        it('should exist', () => { expect(input.exists()).toBe(true); });
        it(
          'should have type checkbox',
          () => { expect(input.attributes('type')).toBe('checkbox'); },
        );
        it('should not be checked', () => { itBehavesLikeNotChecked(input); });
      });

      describe('Checkbox Label Tests', () => {
        it('should exist', () => { expect(label.exists()).toBe(true); });
        it(
          'should match provided label prop',
          () => { expect(label.text()).toBe(propsData.label); },
        );
      });
    });

    describe('When a label prop is provided', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, label: 'My Label' };
        _setWrappers();
      });

      it('should exist', () => { expect(label.exists()).toBe(true); });
    });

    describe('When a description prop is provided', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, description: 'Description' };
        _setWrappers();
      });

      it('should exist', () => { expect(description.exists()).toBe(true); });
    });

    describe('When neither a label prop/slot nor a description prop/slot is provided', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { value: baseValue };
        slots = {};
        _setWrappers();
      });

      it(
        'should remove the description wrapper if no description is provided',
        () => {
          expect(description.exists()).toBe(false);
        },
      );
      it('should remove the label wrapper if no label is provided', () => {
        expect(label.exists()).toBe(false);
      });
      it(
        'should remove the checkbox label/description container if neither is provided',
        () => {
          expect(labelDescriptionContainer.exists()).toBe(false);
        },
      );

      it(
        'should keep the input checkbox',
        () => { expect(input.exists()).toBe(true); },
      );
    });

    describe('When a validation state is provided', () => {
      // Helpers
      const _setupValidationTest = (validationState) => {
        propsData = { ...basePropsData, description: 'Description', validationState };
        _setWrappers();
      };

      describe('When success', () => {
        beforeEach(() => { _setupValidationTest(VALIDATION_MESSAGE_TYPES.SUCCESS); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);
      });

      describe('When warning', () => {
        beforeEach(() => { _setupValidationTest(VALIDATION_MESSAGE_TYPES.WARNING); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.WARNING);
      });

      describe('When error', () => {
        beforeEach(() => { _setupValidationTest(VALIDATION_MESSAGE_TYPES.ERROR); });
        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.ERROR);
      });
    });

    describe('When checked', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, checked: true };
        _setWrappers();
      });

      it('should be checked', () => { itBehavesLikeChecked(input); });
    });

    describe('When disabled', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, disabled: true };
        _setWrappers();
      });

      it(
        'should disable input',
        () => { expect(input.element.disabled).toBe(true); },
      );
      it('should have disabled class', () => {
        expect(wrapper.find('.d-checkbox-group--disabled').exists()).toBe(true);
      });
    });

    describe('When slot(s) are provided', () => {
      // Test Environment
      const slotLabel = 'My Slotted Label';
      const slotDescription = 'My Slotted Description';

      describe('When a slotted label is provided', () => {
        // Test Setup
        beforeEach(() => {
          slots = { default: slotLabel };
          _setWrappers();
        });

        it(
          'should have slotted label',
          () => { expect(label.text()).toBe(slotLabel); },
        );
      });

      describe('When a slotted description is provided', () => {
        // Test Setup
        beforeEach(() => {
          slots = { description: slotDescription };
          _setWrappers();
        });

        it(
          'should have slotted description',
          () => { expect(description.text()).toBe(slotDescription); },
        );
      });

      describe('When slotted label and description are provided', () => {
        // Test Setup
        beforeEach(() => {
          slots = { default: slotLabel, description: slotDescription };
          _setWrappers();
        });

        it(
          'should have slotted label',
          () => { expect(label.text()).toBe(slotLabel); },
        );
        it(
          'should have slotted description',
          () => { expect(description.text()).toBe(slotDescription); },
        );
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Custom Event Tests', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      describe('When the checkbox is clicked', () => {
        // Test Setup
        beforeEach(async () => { await input.trigger('change'); });

        it('Should emit an input event', async () => {
          itBehavesLikeEmitsExpectedEvent(wrapper, 'input', false);
        });
      });

      describe('When checked', () => {
        // Test Setup
        beforeEach(() => {
          propsData = { ...basePropsData, checked: true };
          _setWrappers();
        });

        describe('When the checkbox is clicked', () => {
          // Test Setup
          beforeEach(() => { input.trigger('change'); });

          it('Should emit an input event', () => {
            itBehavesLikeEmitsExpectedEvent(wrapper, 'input', true);
          });
        });
      });

      describe('When disabled', () => {
        // Test Setup
        beforeEach(() => {
          propsData = { ...basePropsData, disabled: true };
          _setWrappers();
        });

        describe('When the checkbox is clicked', () => {
          // Test Setup
          beforeEach(() => { input.trigger('click'); });

          it('Should not emit an input event', () => {
            itBehavesLikeDoesNotEmitEvents(wrapper);
          });
        });
      });
    });

    describe('When indeterminate', () => {
      beforeAll(() => {
        propsData = { ...basePropsData, indeterminate: true };
        _setWrappers();
      });
      it(
        'shows indeterminate visual state',
        () => { itBehavesLikeIndeterminate(input); },
      );

      describe('When clicking on an indeterminate checkbox', () => {
        beforeEach(async () => {
          input.element.value = false;
          await input.trigger('change');
        });
        it('should uncheck', () => { itBehavesLikeNotChecked(input); });
      });
    });

    describe('Listener Tests', () => {
      describe('When there is a provided input listener', () => {
        // Test Env
        const inputListenerSpy = jest.fn();

        // Test Setup
        beforeEach(() => {
          listeners = { input: inputListenerSpy };
          _setWrappers();
        });

        describe('When the checkbox is clicked', () => {
          // Test Setup
          beforeEach(() => { input.trigger('change'); });

          it('Should call input handler once', () => {
            expect(inputListenerSpy).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe('Group Context Tests', () => {
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

      describe('When a group name is provided', () => {
        // Test Setup
        beforeEach(() => { _setGroupContext([]); });

        it(
          'sets the input name',
          () => { expect(input.attributes('name')).toBe(groupName); },
        );
      });

      describe('When the group is disabled', () => {
        // Test Setup
        beforeEach(() => { _setGroupContext([], true); });

        it(
          'should disable input',
          () => { expect(input.element.disabled).toBe(true); },
        );
      });

      describe('When the Checkbox value is in checked', () => {
        // Test Setup
        beforeEach(() => { _setGroupContext([value]); });

        it('should be checked', () => { itBehavesLikeChecked(input); });
      });

      describe('When the Checkbox value is not in checked', () => {
        // Test Setup
        beforeEach(() => { _setGroupContext([]); });

        it('should not be checked', () => { itBehavesLikeNotChecked(input); });
      });

      describe('When the checkbox group has a validation state', () => {
        // Test Setup
        beforeEach(
          () => { _setGroupContext([], false, VALIDATION_MESSAGE_TYPES.SUCCESS); },
        );

        itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);

        describe('When the checkbox has a validation state', () => {
          // Test Setup
          beforeEach(() => {
            propsData = { ...propsData, validationState: VALIDATION_MESSAGE_TYPES.WARNING };
            _setWrappers();
          });

          itBehavesLikeHasValidationClassesLocal(VALIDATION_MESSAGE_TYPES.SUCCESS);
        });
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
      propsData = { ...basePropsData, label: 'Label', description: 'Description' };
    });

    describe('When an input class is provided', () => {
      beforeEach(() => { _setupChildClassTest('inputClass', 'input'); });
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When an label class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('labelClass', '[data-qa="checkbox-label"]'); },
      );
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When an description class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('descriptionClass', '[data-qa="checkbox-description"]'); },
      );
      itBehavesLikeAppliesClassToChildLocal();
    });

    describe('When label child props are provided', () => {
      beforeEach(
        () => { _setupChildPropsTest('labelChildProps', '[data-qa="checkbox-label"]'); },
      );
      itBehavesLikeAppliesChildPropLocal();
    });

    describe('When description child props are provided', () => {
      beforeEach(
        () => { _setupChildPropsTest('descriptionChildProps', '[data-qa="checkbox-description"]'); },
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
