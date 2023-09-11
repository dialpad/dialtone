import { mount } from '@vue/test-utils';
import { INPUT_SIZES } from './input_constants';
import { DtIcon } from '@/components/icon';
import DtInput from './input.vue';

const MOCK_INPUT_STUB = vi.fn();

const baseProps = {
  type: 'text',
  modelValue: 'value',
  label: 'label text',
};
const baseAttrs = {
  placeholder: 'input-placeholder',
  name: 'input-name',
};
const baseSlots = {};

let mockAttrs = {};
let mockProps = {};
let mockSlots = {};

describe('DtInput tests', () => {
  let wrapper;
  let labelWrapper;
  let label;
  let description;
  let nativeInput;
  let nativeTextarea;
  let leftIconWrapper;
  let rightIconWrapper;
  let iconPlus;

  const updateWrapper = () => {
    wrapper = mount(DtInput, {
      propsData: { ...baseProps, ...mockProps },
      global: {
        components: {
          'dt-icon': DtIcon,
        },
      },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
    });

    iconPlus = '<dt-icon name="plus" />';
    labelWrapper = wrapper.find('[data-qa="dt-input-label-wrapper"]');
    label = wrapper.find('[data-qa="dt-input-label"]');
    description = wrapper.find('[data-qa="dt-input-description"]');
    nativeInput = wrapper.find('input');
    nativeTextarea = wrapper.find('textarea');
    leftIconWrapper = wrapper.find('[data-qa="dt-input-left-icon-wrapper"]');
    rightIconWrapper = wrapper.find('[data-qa="dt-input-right-icon-wrapper"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('When type is not textarea', () => {
      it('should render the native input', () => {
        expect(nativeInput.exists()).toBe(true);
      });

      it('should have a type prop', () => {
        expect(nativeInput.attributes('type')).toBe(baseProps.type);
      });

      it('should have a bound value prop', () => {
        expect(nativeInput.element.value).toBe(baseProps.modelValue);
      });

      it('should have input class', () => {
        expect(nativeInput.classes().includes('d-input')).toBe(true);
      });

      it('should display the initial value prop', () => {
        expect(nativeInput.element.value).toBe(wrapper.vm.modelValue);
      });
    });

    describe('When type is textarea', () => {
      beforeEach(() => {
        mockProps = { type: 'textarea' };

        updateWrapper();
      });

      it('should render the native textarea', () => {
        expect(nativeTextarea.exists()).toBe(true);
      });

      it('should not have a type prop', () => {
        expect(nativeTextarea.attributes().type).toBeUndefined();
      });

      it('should not have a bound value prop', () => {
        expect(nativeTextarea.attributes().value).toBeUndefined();
      });

      it('should have textarea class', () => {
        expect(nativeTextarea.classes().includes('d-textarea')).toBe(true);
      });

      it('should display the initial value prop', () => {
        expect(nativeTextarea.element.value).toBe(wrapper.vm.modelValue);
      });
    });

    describe('When a label visible prop is false', () => {
      it('should not render a label', () => {
        mockProps = { labelVisible: false };

        updateWrapper();

        expect(label.exists()).toBe(false);
      });
    });

    describe('When a label is not provided', () => {
      it('should not render a label', () => {
        mockProps = { label: undefined };

        updateWrapper();

        expect(label.exists()).toBe(false);
      });
    });

    describe('When a description is not provided', () => {
      it('should not render a description', () => {
        expect(description.exists()).toBe(false);
      });

      it('should not have aria details defined on label wrapper', () => {
        expect(labelWrapper.attributes('aria-details')).toBeFalsy();
      });
    });

    describe('When a description is provided via prop', () => {
      beforeEach(() => {
        mockProps = { description: 'Description' };

        updateWrapper();
      });

      it('should render the description', () => {
        expect(description.exists()).toBe(true);
      });

      it('should have description class', () => {
        expect(description.classes().includes('d-description')).toBe(true);
      });

      it('should have a generated id', () => {
        expect(description.attributes('id')).toBeTruthy();
      });

      it('should display the correct description', () => {
        expect(description.text()).toBe('Description');
      });

      it('should have aria details defined on label wrapper', () => {
        expect(description.attributes('id')).toBe(labelWrapper.attributes('aria-details'));
      });
    });

    describe('When a description is provided via slot', () => {
      beforeEach(() => {
        mockSlots = { description: 'Description' };

        updateWrapper();
      });

      it('should render the description', () => {
        expect(description.exists()).toBe(true);
      });

      it('should have description class', () => {
        expect(description.classes().includes('d-description')).toBe(true);
      });

      it('should have a generated id', () => {
        expect(description.attributes('id')).toBeTruthy();
      });

      it('should display the correct description', () => {
        expect(description.text()).toBe('Description');
      });

      it('should have aria details defined on label wrapper', () => {
        expect(description.attributes('id')).toBe(labelWrapper.attributes('aria-details'));
      });
    });

    describe('When an inputClass prop is provided', () => {
      it('Should apply the class to the input element.', () => {
        mockProps = { inputClass: 'd-fc-success' };

        updateWrapper();

        expect(nativeInput.classes('d-fc-success')).toBe(true);
      });
    });

    describe('When a left icon is provided', () => {
      beforeEach(() => {
        mockSlots = { leftIcon: iconPlus };

        updateWrapper();
      });

      describe('When a size is not provided', () => {
        it('should render the icon wrapper', () => {
          expect(leftIconWrapper.exists()).toBe(true);
        });

        it('should have input icon class', () => {
          expect(leftIconWrapper.classes().includes('d-input-icon')).toBe(true);
        });

        it('should have input icon side class', () => {
          expect(leftIconWrapper.classes().includes('d-input-icon--left')).toBe(true);
        });

        it('should have input icon size class', () => {
          expect(leftIconWrapper.classes().includes(`d-input-icon--${INPUT_SIZES.DEFAULT}`)).toBe(false);
        });

        it('should render the provided icon', () => {
          expect(wrapper.findComponent(DtIcon).exists()).toBe(true);
        });
      });

      describe('When a size is provided', () => {
        beforeEach(() => {
          mockProps = { size: INPUT_SIZES.EXTRA_LARGE };

          updateWrapper();
        });

        it('should render the icon wrapper', () => {
          expect(leftIconWrapper.exists()).toBe(true);
        });

        it('should have input icon class', () => {
          expect(leftIconWrapper.classes().includes('d-input-icon')).toBe(true);
        });

        it('should have input icon side class', () => {
          expect(leftIconWrapper.classes().includes('d-input-icon--left')).toBe(true);
        });

        it('should have input icon size class', () => {
          expect(leftIconWrapper.classes().includes(`d-input-icon--${INPUT_SIZES.EXTRA_LARGE}`)).toBe(true);
        });

        it('should render the provided icon', () => {
          expect(wrapper.findComponent(DtIcon).exists()).toBe(true);
        });
      });
    });

    describe('When a right icon is provided', () => {
      beforeEach(() => {
        mockSlots = { rightIcon: iconPlus };

        updateWrapper();
      });

      describe('When a size is not provided', () => {
        it('should render the icon wrapper', () => {
          expect(rightIconWrapper.exists()).toBe(true);
        });

        it('should have input icon class', () => {
          expect(rightIconWrapper.classes().includes('d-input-icon')).toBe(true);
        });

        it('should have input icon side class', () => {
          expect(rightIconWrapper.classes().includes('d-input-icon--right')).toBe(true);
        });

        it('should have input icon size class', () => {
          expect(rightIconWrapper.classes().includes(`d-input-icon--${INPUT_SIZES.DEFAULT}`)).toBe(false);
        });

        it('should render the provided icon', () => {
          expect(wrapper.findComponent(DtIcon).exists()).toBe(true);
        });
      });

      describe('When a size is provided', () => {
        beforeEach(() => {
          mockProps = { size: INPUT_SIZES.EXTRA_LARGE };

          updateWrapper();
        });

        it('should render the icon wrapper', () => {
          expect(rightIconWrapper.exists()).toBe(true);
        });

        it('should have input icon class', () => {
          expect(rightIconWrapper.classes().includes('d-input-icon')).toBe(true);
        });

        it('should have input icon side class', () => {
          expect(rightIconWrapper.classes().includes('d-input-icon--right')).toBe(true);
        });

        it('should have input icon size class', () => {
          expect(rightIconWrapper.classes().includes(`d-input-icon--${INPUT_SIZES.EXTRA_LARGE}`)).toBe(true);
        });

        it('should render the provided icon', () => {
          expect(wrapper.findComponent(DtIcon).exists()).toBe(true);
        });
      });
    });

    describe('When no validation message(s) are provided', () => {
      it('should not render any validation messages', () => {
        expect(wrapper.findAll('.d-validation-message').length).toBe(0);
      });

      it('should not have an input state', () => {
        expect(wrapper.vm.inputState).toBeNull();
      });
    });

    describe('When validation message(s) are provided', () => {
      it('should display error messages', async () => {
        const errorMessage1 = 'error message 1';
        const errorMessage2 = 'error message 2';

        await wrapper.setProps({
          showMessages: false,
          messages: [
            errorMessage1,
            { message: errorMessage2, type: 'error' },
          ],
        });

        expect(wrapper.findAll('.d-validation-message').length).toBe(0);
        expect(wrapper.vm.inputState).toBe('error');

        await wrapper.setProps({ showMessages: true });

        const inputErrorMessages = wrapper.findAll('.d-validation-message--error');

        expect(inputErrorMessages.length).toBe(2);
        expect(inputErrorMessages.at(0).text()).toEqual(errorMessage1);
        expect(inputErrorMessages.at(1).text()).toEqual(errorMessage2);
      });

      it('should ignore all other message types if at least 1 error message is present', async () => {
        const strErrorMessage = 'string error message';

        await wrapper.setProps({
          messages: [
            strErrorMessage,
            { message: 'formatted warning message', type: 'warning' },
            { message: 'formatted success message', type: 'success' },
          ],
        });

        expect(wrapper.vm.inputState).toBe('error');

        const inputMessages = wrapper.findAll('.d-validation-message');
        const inputErrorMessages = wrapper.findAll('.d-validation-message--error');

        expect(inputMessages.length).toBe(1);
        expect(inputErrorMessages.length).toBe(1);
        expect(inputErrorMessages.at(0).text()).toEqual(strErrorMessage);
      });

      it('should display warning messages only if no error messages are present', async () => {
        const warningMessage = 'formatted warning message';

        await wrapper.setProps({
          messages: [
            { message: warningMessage, type: 'warning' },
            { message: 'formatted success message', type: 'success' },
          ],
        });

        expect(wrapper.vm.inputState).toBe('warning');

        const inputMessages = wrapper.findAll('.d-validation-message');
        const inputWarningMessages = wrapper.findAll('.d-validation-message--warning');

        expect(inputMessages.length).toBe(1);
        expect(inputWarningMessages.length).toBe(1);
        expect(inputWarningMessages.at(0).text()).toEqual(warningMessage);
      });

      it('should display success messages only if no other types are present', async () => {
        const successMessage1 = 'formatted success message 1';
        const successMessage2 = 'formatted success message 2';

        await wrapper.setProps({
          messages: [
            { message: successMessage1, type: 'success' },
            { message: successMessage2, type: 'success' },
          ],
        });

        expect(wrapper.vm.inputState).toBe('success');

        const inputMessages = wrapper.findAll('.d-validation-message');
        const inputSuccessMessages = wrapper.findAll('.d-validation-message--success');

        expect(inputMessages.length).toBe(2);
        expect(inputSuccessMessages.length).toBe(2);
        expect(inputSuccessMessages.at(0).text()).toEqual(successMessage1);
        expect(inputSuccessMessages.at(1).text()).toEqual(successMessage2);
      });
    });

    describe('When a size is provided', () => {
      describe('When size is EXTRA_SMALL', () => {
        const MOCK_INPUT_SIZE_EXTRA_SMALL = INPUT_SIZES.EXTRA_SMALL;

        beforeEach(() => {
          mockProps = { size: MOCK_INPUT_SIZE_EXTRA_SMALL, label: 'Label', description: 'Description' };

          updateWrapper();
        });

        it('should add input size class', () => {
          expect(nativeInput.classes().includes(`d-input--${MOCK_INPUT_SIZE_EXTRA_SMALL}`)).toBe(true);
        });

        it('should add label size class', () => {
          expect(label.classes().includes(`d-label--${MOCK_INPUT_SIZE_EXTRA_SMALL}`)).toBe(true);
        });

        it('should not add description size class', () => {
          expect(description.classes().includes(`d-description--${MOCK_INPUT_SIZE_EXTRA_SMALL}`)).toBe(false);
        });
      });

      describe('When size is EXTRA_LARGE', () => {
        const MOCK_INPUT_SIZE_EXTRA_LARGE = INPUT_SIZES.EXTRA_LARGE;

        beforeEach(() => {
          mockProps = { size: MOCK_INPUT_SIZE_EXTRA_LARGE, label: 'Label', description: 'Description' };

          updateWrapper();
        });

        it('should add input size class', () => {
          expect(nativeInput.classes().includes(`d-input--${MOCK_INPUT_SIZE_EXTRA_LARGE}`)).toBe(true);
        });

        it('should add label size class', () => {
          expect(label.classes().includes(`d-label--${MOCK_INPUT_SIZE_EXTRA_LARGE}`)).toBe(true);
        });

        it('should add description size class', () => {
          expect(description.classes().includes(`d-description--${MOCK_INPUT_SIZE_EXTRA_LARGE}`)).toBe(true);
        });
      });
    });

    describe('When the length validation props are provided', () => {
      const MOCK_VALIDATE = {
        length: {
          description: 'Max. 20 characters.',
          max: 20,
          warn: 12,
          message: 'Validation message',
        },
      };

      describe('When the input length is below warning threshold and the input is focused', () => {
        beforeEach(() => {
          mockProps = {
            currentLength: 8,
            validate: MOCK_VALIDATE,
          };

          updateWrapper();

          nativeInput.trigger('focus');
        });

        it('should not show the length validation message', () => {
          expect(wrapper.findAll('.d-validation-message').length).toBe(0);
        });

        it('should show the length description', () => {
          expect(wrapper.find('[data-qa="dt-input-length-description"]').text()).toBe(MOCK_VALIDATE.length.description);
        });
      });

      describe('When the input length reaches the maximum length and the input is not focused', () => {
        beforeEach(() => {
          mockProps = {
            currentLength: 20,
            validate: MOCK_VALIDATE,
          };

          updateWrapper();
        });

        it('should not show an error validation message', () => {
          expect(wrapper.find('[data-qa="dt-input-length-validation-message"]').exists()).toBe(false);

          const inputWarningMessages = wrapper.findAll('.d-validation-message--error');

          expect(inputWarningMessages.length).toBe(0);
        });
      });

      describe('When the input has a invalid state', () => {
        beforeEach(() => {
          mockProps = {
            currentLength: 28,
            validate: MOCK_VALIDATE,
          };

          updateWrapper();
        });

        it('should show an error validation message', async () => {
          await wrapper.setProps({ modelValue: 'new value with 28 characters' });

          const inputMessages = wrapper.findAll('.d-validation-message');
          const inputErrorMessages = wrapper.findAll('.d-validation-message--error');

          expect(inputMessages.length).toBe(1);
          expect(inputErrorMessages.length).toBe(1);
        });
      });
    });
  });

  describe('Reactivity Tests', () => {
    describe('User Input Tests', () => {
      const MOCK_USER_TEXT_INPUT_VAL = 'new user input';
      const MOCK_NEW_VALUE = 'new value with more than 20 characters';
      const MOCK_VALIDATE = {
        length: {
          description: 'Max. 20 characters.',
          max: 20,
          warn: 12,
          message: 'Validation message',
        },
      };

      describe('When type is not a textarea', () => {
        beforeEach(() => {
          mockProps = { currentLength: null, validate: MOCK_VALIDATE };
          mockAttrs = { onInput: MOCK_INPUT_STUB };

          updateWrapper();

          nativeInput.setValue(MOCK_USER_TEXT_INPUT_VAL);
        });

        it('should handle input value', () => {
          expect(wrapper.emitted().input[0][0]).toEqual(MOCK_USER_TEXT_INPUT_VAL);
          expect(MOCK_INPUT_STUB).toHaveBeenCalled();
        });

        describe('When a new value is provided', () => {
          it('should update input value', async () => {
            await wrapper.setProps({ modelValue: MOCK_NEW_VALUE });

            expect(nativeInput.element.value).toEqual(MOCK_NEW_VALUE);
          });
        });

        describe('When a new value exceeds the maximum length', () => {
          it('should emit an "update:invalid" event with true', async () => {
            await wrapper.setProps({ modelValue: MOCK_NEW_VALUE });

            expect(wrapper.emitted()['update:invalid'][0][0]).toBe(true);
          });
        });

        describe('When a new value is within the maximum length after exceeding it', () => {
          it('should emit an "update:invalid" event with false', async () => {
            await wrapper.setProps({ modelValue: MOCK_NEW_VALUE });
            await wrapper.setProps({ modelValue: MOCK_USER_TEXT_INPUT_VAL });

            expect(wrapper.emitted()['update:invalid'][1][0]).toBe(false);
          });
        });
      });

      describe('When type is a textarea', () => {
        beforeEach(() => {
          mockProps = { type: 'textarea', currentLength: null, validate: MOCK_VALIDATE };

          updateWrapper();

          nativeTextarea.setValue(MOCK_USER_TEXT_INPUT_VAL);
        });

        it('should handle input value', () => {
          expect(wrapper.emitted().input[0][0]).toEqual(MOCK_USER_TEXT_INPUT_VAL);
          expect(MOCK_INPUT_STUB).toHaveBeenCalled();
        });

        describe('When a new value is provided', () => {
          it('should update input value', async () => {
            await wrapper.setProps({ modelValue: MOCK_NEW_VALUE });

            expect(nativeTextarea.element.value).toEqual(MOCK_NEW_VALUE);
          });
        });

        describe('When a new value exceeds the maximum length', () => {
          it('should emit an "update:invalid" event with true', async () => {
            await wrapper.setProps({ modelValue: MOCK_NEW_VALUE });

            expect(wrapper.emitted()['update:invalid'][0][0]).toBe(true);
          });
        });

        describe('When a new value is within the maximum length after exceeding it', () => {
          it('should emit an "update:invalid" event with false', async () => {
            await wrapper.setProps({ modelValue: MOCK_NEW_VALUE });
            await wrapper.setProps({ modelValue: MOCK_USER_TEXT_INPUT_VAL });

            expect(wrapper.emitted()['update:invalid'][1][0]).toBe(false);
          });
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    it('should handle pass through props/attrs', async () => {
      expect(nativeInput.attributes()).toMatchObject(baseAttrs);
      expect(nativeInput.attributes().disabled).toBeUndefined();

      await wrapper.setProps({ disabled: true });

      expect(nativeInput.element.disabled).toBe(true);
    });
  });
});
