import { mount } from '@vue/test-utils';
import DtCheckbox from './checkbox.vue';
import { DtText } from '@/components/text';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import { CHECKBOX_INPUT_VALIDATION_CLASSES } from '@/components/checkbox/checkbox_constants.js';

const MOCK_SLOT_LABEL = 'My Slotted Label';
const MOCK_SLOT_DESCRIPTION = 'My Slotted Description';
const MOCK_INPUT_LISTENER_SPY = vi.fn();
const MOCK_GROUP_NAME = 'checkboxGroup';

let MOCK_ELEMENT = null;
const MOCK_ROOT_CLASS = 'custom-class';
const MOCK_CUSTOM_CLASS = 'my-custom-class';
const MOCK_PROP_NAME = 'some';
const MOCK_PROP_VALUE = 'prop';
const MOCK_CHILD_PROPS = {};

const baseProps = {
  label: 'My Checkbox Label',
  value: 'Value',
};
const baseAttrs = {};
const baseSlots = {};
const baseProvide = {};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};
let mockProvide = {};

describe('DtCheckbox Tests', () => {
  let wrapper;
  let checkbox;
  let input;
  let label;
  let description;
  let descriptionMessagesContainer;

  const updateWrapper = () => {
    wrapper = mount(DtCheckbox, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        provide: { ...baseProvide, ...mockProvide },
      },
    });

    checkbox = wrapper.findComponent(DtCheckbox);
    input = wrapper.find('input');
    label = wrapper.find('[data-qa="checkbox-label"]');
    description = wrapper.find('[data-qa="checkbox-description"]');
    descriptionMessagesContainer = wrapper.find('[data-qa="checkbox-description-messages"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
    mockProvide = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the component', () => {
      expect(wrapper).toBeDefined();
      expect(checkbox).toBeDefined();
    });

    it('should have checkbox group class', () => {
      expect(wrapper.find('.d-checkbox-group').exists()).toBe(true);
    });

    describe('Checkbox Input Tests', () => {
      it('should exist', () => {
        expect(input.exists()).toBe(true);
      });

      it('should have type checkbox', () => {
        expect(input.attributes('type')).toBe('checkbox');
      });

      it('should not be checked', () => {
        expect(input.element.checked).toBe(false);
      });
    });

    describe('Checkbox Label Tests', () => {
      it('should exist', () => {
        expect(label.exists()).toBe(true);
      });

      it('should match provided label prop', () => {
        expect(label.text()).toBe(baseProps.label);
      });

      it('should render label as DtText with tone="primary"', () => {
        const dtText = wrapper.findComponent(DtText);

        expect(dtText.exists()).toBe(true);
        expect(dtText.props('tone')).toBe('primary');
      });

      it('should render label DtText with default size 300', () => {
        const dtText = wrapper.findComponent(DtText);

        expect(dtText.props('size')).toBe(300);
      });
    });

    describe('When labelStrength is provided', () => {
      it('should override the default label strength', () => {
        mockProps = { labelStrength: 'bold' };

        updateWrapper();

        const dtText = wrapper.findComponent(DtText);

        expect(dtText.props('strength')).toBe('bold');
      });

      it('should default to normal strength when not provided', () => {
        updateWrapper();

        const dtText = wrapper.findComponent(DtText);

        expect(dtText.props('strength')).toBe('normal');
      });
    });

    describe('When labelSize is provided', () => {
      it('should override the default label size', () => {
        mockProps = { labelSize: 'lg' };

        updateWrapper();

        const dtText = wrapper.findComponent(DtText);

        expect(dtText.props('size')).toBe('lg');
      });
    });

    describe('When labelVisible is false', () => {
      beforeEach(() => {
        mockProps = { labelVisible: false };

        updateWrapper();
      });

      it('should not render a label', () => {
        label = wrapper.find('[data-qa="checkbox-label"]');

        expect(label.exists()).toBe(false);
      });

      it('should set aria-label on the input', () => {
        expect(input.attributes('aria-label')).toBe(baseProps.label);
      });
    });

    describe('When labelVisible is true', () => {
      it('should not set aria-label on the input', () => {
        expect(input.attributes('aria-label')).toBeUndefined();
      });
    });

    describe('When a label prop is provided', () => {
      it('should exist', () => {
        mockProps = { label: 'My Label' };

        updateWrapper();

        expect(label.exists()).toBe(true);
      });
    });

    describe('When a description prop is provided', () => {
      it('should exist', () => {
        mockProps = { description: 'Description' };

        updateWrapper();

        expect(description.exists()).toBe(true);
      });
    });

    describe('When neither a label prop/slot nor a description prop/slot is provided', () => {
      beforeEach(() => {
        mockProps = { label: undefined };

        updateWrapper();
      });

      it('should remove the description wrapper if no description is provided', () => {
        expect(description.exists()).toBe(false);
      });

      it('should remove the label wrapper if no label is provided', () => {
        expect(label.exists()).toBe(false);
      });

      it('should remove the checkbox description/messages container if neither is provided', () => {
        expect(descriptionMessagesContainer.exists()).toBe(false);
      });

      it('should keep the input checkbox', () => {
        expect(input.exists()).toBe(true);
      });
    });

    describe('When a validation state is provided', () => {
      it('applies validation classes for positive state', () => {
        mockProps = { description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.POSITIVE };

        updateWrapper();

        expect(wrapper.find(`.${CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.POSITIVE]}`).exists())
          .toBe(true);
      });

      it('applies validation classes for warning state', () => {
        mockProps = { description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.WARNING };

        updateWrapper();

        expect(wrapper.find(`.${CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.WARNING]}`).exists())
          .toBe(true);
      });

      it('applies validation classes for critical state', () => {
        mockProps = { description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.CRITICAL };

        updateWrapper();

        expect(wrapper.find(`.${CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.CRITICAL]}`).exists())
          .toBe(true);
      });
    });

    describe('When checked', () => {
      it('should be checked', () => {
        mockProps = { modelValue: true };

        updateWrapper();

        expect(input.element.checked).toBe(true);
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true };

        updateWrapper();
      });

      it('should disable input', () => {
        expect(input.element.disabled).toBe(true);
      });

      it('should have disabled class', () => {
        expect(wrapper.find('.d-checkbox-group--disabled').exists()).toBe(true);
      });

      it('should render label DtText with tone="disabled"', () => {
        const dtText = wrapper.findComponent(DtText);

        expect(dtText.exists()).toBe(true);
        expect(dtText.props('tone')).toBe('disabled');
      });
    });

    describe('When slot(s) are provided', () => {
      describe('When a slotted label is provided', () => {
        it('should have slotted label', () => {
          mockSlots = { default: MOCK_SLOT_LABEL };

          updateWrapper();

          expect(label.text()).toBe(MOCK_SLOT_LABEL);
        });
      });

      describe('When a slotted description is provided', () => {
        it('should have slotted description', () => {
          mockSlots = { description: MOCK_SLOT_DESCRIPTION };

          updateWrapper();

          expect(description.text()).toBe(MOCK_SLOT_DESCRIPTION);
        });
      });

      describe('When slotted label and description are provided', () => {
        beforeEach(() => {
          mockSlots = { default: MOCK_SLOT_LABEL, description: MOCK_SLOT_DESCRIPTION };

          updateWrapper();
        });

        it('should have slotted label', () => {
          expect(label.text()).toBe(MOCK_SLOT_LABEL);
        });

        it('should have slotted description', () => {
          expect(description.text()).toBe(MOCK_SLOT_DESCRIPTION);
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('Custom Event Tests', () => {
      describe('When the checkbox is clicked', () => {
        it('Should emit an input event', async () => {
          await input.trigger('change');

          expect(wrapper.emitted('input')).toBeTruthy();
        });
      });

      describe('When checked', () => {
        describe('When the checkbox is clicked', () => {
          it('Should emit an input event', async () => {
            mockProps = { modelValue: true };

            updateWrapper();

            await input.trigger('change');

            expect(wrapper.emitted('input')).toBeTruthy();
          });
        });
      });

      describe('When disabled', () => {
        describe('When the checkbox is clicked', () => {
          it('Should not emit an input event', async () => {
            mockProps = { disabled: true };

            updateWrapper();

            await input.trigger('click');

            expect(wrapper.emitted('input')).toBeFalsy();
          });
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('Custom Event Tests', () => {
      describe('When the checkbox is clicked', () => {
        it('Should emit an input event', async () => {
          await input.trigger('change');

          expect(wrapper.emitted('input')).toBeTruthy();
        });
      });

      describe('When checked', () => {
        describe('When the checkbox is clicked', () => {
          it('Should emit an input event', async () => {
            mockProps = { modelValue: true };

            updateWrapper();

            await input.trigger('change');

            expect(wrapper.emitted('input')).toBeTruthy();
          });
        });
      });

      describe('When disabled', () => {
        describe('When the checkbox is clicked', () => {
          it('Should not emit an input event', async () => {
            mockProps = { disabled: true };

            updateWrapper();

            await input.trigger('click');

            expect(wrapper.emitted('input')).toBeFalsy();
          });
        });
      });
    });

    describe('When indeterminate', () => {
      beforeAll(() => {
        mockProps = { indeterminate: true };

        updateWrapper();
      });

      it('shows indeterminate visual state', () => {
        expect(input.element.indeterminate).toBe(true);
      });

      describe('When clicking on an indeterminate checkbox', () => {
        it('should uncheck', async () => {
          input.element.value = false;

          await input.trigger('change');

          expect(input.element.checked).toBe(false);
        });
      });
    });

    describe('Listener Tests', () => {
      describe('When there is a provided input listener', () => {
        describe('When the checkbox is clicked', () => {
          it('Should call input handler once', async () => {
            mockAttrs = { onInput: MOCK_INPUT_LISTENER_SPY };

            updateWrapper();

            await input.trigger('change');

            expect(MOCK_INPUT_LISTENER_SPY).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe('Group Context Tests', () => {
      const _setGroupContext = (selectedValues, groupDisabled = false, groupValidationState = null) => {
        mockProvide = {
          groupContext: {
            name: MOCK_GROUP_NAME,
            selectedValues,
            disabled: groupDisabled,
            validationState: groupValidationState,
          },
        };
        mockProps = { description: 'Description' };

        updateWrapper();
      };

      describe('When a group name is provided', () => {
        it('sets the input name', () => {
          _setGroupContext([]);

          expect(input.attributes('name')).toBe(MOCK_GROUP_NAME);
        });
      });

      describe('When the group is disabled', () => {
        it('should disable input', () => {
          _setGroupContext([], true);

          expect(input.element.disabled).toBe(true);
        });
      });

      describe('When the Checkbox value is in checked', () => {
        it('should be checked', () => {
          _setGroupContext([baseProps.value]);

          expect(input.element.checked).toBe(true);
        });
      });

      describe('When the Checkbox value is not in checked', () => {
        it('should not be checked', () => {
          _setGroupContext([]);

          expect(input.element.checked).toBe(false);
        });
      });

      describe('When the checkbox group has a validation state', () => {
        beforeEach(() => {
          _setGroupContext([], false, VALIDATION_MESSAGE_TYPES.POSITIVE);
        });

        it('has validation classes', () => {
          expect(wrapper.find(`.${CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.POSITIVE]}`).exists())
            .toBe(true);
        });

        describe('When the checkbox has a validation state', () => {
          it('has validation classes', () => {
            mockProps = { validationState: VALIDATION_MESSAGE_TYPES.WARNING };

            updateWrapper();

            expect(wrapper.find(`.${CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.POSITIVE]}`).exists())
              .toBe(true);
          });
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    const _setupChildClassTest = (childClassName, selector) => {
      mockProps[childClassName] = MOCK_CUSTOM_CLASS;

      updateWrapper();

      MOCK_ELEMENT = wrapper.find(selector);
    };

    const _setupChildPropsTest = (childPropsName, selector) => {
      mockProps[childPropsName] = MOCK_CHILD_PROPS;

      updateWrapper();

      MOCK_ELEMENT = wrapper.find(selector);
    };

    beforeAll(() => {
      MOCK_CHILD_PROPS[MOCK_PROP_NAME] = MOCK_PROP_VALUE;
    });

    beforeEach(() => {
      mockProps = { label: 'Label', description: 'Description' };

      updateWrapper();
    });

    describe('When an input class is provided', () => {
      it('should apply custom class to child', () => {
        _setupChildClassTest('inputClass', 'input');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When an label class is provided', () => {
      it('should apply custom class to child', () => {
        _setupChildClassTest('labelClass', '[data-qa="checkbox-label"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When an description class is provided', () => {
      it('should apply custom class to child', () => {
        _setupChildClassTest('descriptionClass', '[data-qa="checkbox-description"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When label child props are provided', () => {
      it('should have provided child prop', () => {
        _setupChildPropsTest('labelChildProps', '[data-qa="checkbox-label"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When description child props are provided', () => {
      it('should have provided child prop', () => {
        _setupChildPropsTest('descriptionChildProps', '[data-qa="checkbox-description"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When attrs are provided', () => {
      it('should have provided child prop', () => {
        mockAttrs = { some: 'prop' };

        updateWrapper();

        MOCK_ELEMENT = input;

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When a class is provided', () => {
      it('should include the class', () => {
        mockAttrs = { class: MOCK_ROOT_CLASS }

        updateWrapper();

        expect(wrapper.classes().includes(MOCK_ROOT_CLASS)).toBe(true);
      });
    });
  });
});
