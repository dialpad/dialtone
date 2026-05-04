import { mount } from '@vue/test-utils';
import { INPUT_SIZES } from './InputConstants';
import { DtIcon } from '@/components/icon';
import { DtText } from '@/components/text';
import DtInput from './input.vue';

const MOCK_INPUT_STUB = vi.fn();
const MOCK_ROOT_CLASS = 'custom-class';

const baseProps = {
  type: 'text',
  modelValue: 'value',
  label: 'label text',
};
const baseAttrs = {
  placeholder: 'input-placeholder',
  name: 'input-name',
  autocomplete: 'on',
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
        mockProps = { showLabel: false };

        updateWrapper();

        expect(label.exists()).toBe(false);
      });

      it('should set aria-label on the input', () => {
        mockProps = { showLabel: false };

        updateWrapper();

        expect(nativeInput.attributes('aria-label')).toBe(baseProps.label);
      });

      it('should set aria-label on the textarea', () => {
        mockProps = { showLabel: false, type: 'textarea' };

        updateWrapper();

        nativeTextarea = wrapper.find('textarea');

        expect(nativeTextarea.attributes('aria-label')).toBe(baseProps.label);
      });
    });

    describe('When showLabel is true', () => {
      it('should not set aria-label on the input', () => {
        expect(nativeInput.attributes('aria-label')).toBeUndefined();
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
        mockProps = { inputClass: 'd-fc-positive' };

        updateWrapper();

        expect(nativeInput.classes('d-fc-positive')).toBe(true);
      });
    });

    describe('When a start icon is provided', () => {
      beforeEach(() => {
        mockSlots = { startIcon: iconPlus };

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
        expect(leftIconWrapper.classes().includes(`d-input-icon--${INPUT_SIZES.DEFAULT}`)).toBe(false);
      });

      it('should render the provided icon', () => {
        expect(wrapper.findComponent(DtIcon).exists()).toBe(true);
      });
    });

    describe('When an end icon is provided', () => {
      beforeEach(() => {
        mockSlots = { endIcon: iconPlus };

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
        expect(rightIconWrapper.classes().includes(`d-input-icon--${INPUT_SIZES.DEFAULT}`)).toBe(false);
      });

      it('should render the provided icon', () => {
        expect(wrapper.findComponent(DtIcon).exists()).toBe(true);
      });
    });

    describe('Backward compatibility', () => {
      describe('When leftIcon slot is provided (deprecated)', () => {
        beforeEach(() => {
          mockSlots = { leftIcon: iconPlus };

          updateWrapper();
        });

        it('should render the icon wrapper', () => {
          expect(leftIconWrapper.exists()).toBe(true);
        });

        it('should render the provided icon', () => {
          expect(wrapper.findComponent(DtIcon).exists()).toBe(true);
        });
      });

      describe('When rightIcon slot is provided (deprecated)', () => {
        beforeEach(() => {
          mockSlots = { rightIcon: iconPlus };

          updateWrapper();
        });

        it('should render the icon wrapper', () => {
          expect(rightIconWrapper.exists()).toBe(true);
        });

        it('should render the provided icon', () => {
          expect(wrapper.findComponent(DtIcon).exists()).toBe(true);
        });
      });

      describe('When both startIcon and leftIcon slots are provided', () => {
        it('should render the new startIcon content and suppress the deprecated leftIcon', () => {
          mockSlots = {
            startIcon: '<span>new</span>',
            leftIcon: '<span>old</span>',
          };

          updateWrapper();

          expect(leftIconWrapper.text()).toContain('new');
          expect(leftIconWrapper.text()).not.toContain('old');
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
      it('should display critical messages', async () => {
        const criticalMessage1 = 'critical message 1';
        const criticalMessage2 = 'critical message 2';

        await wrapper.setProps({
          showMessages: false,
          messages: [
            criticalMessage1,
            { message: criticalMessage2, type: 'critical' },
          ],
        });

        expect(wrapper.findAll('.d-validation-message').length).toBe(0);
        expect(wrapper.vm.inputState).toBe('critical');

        await wrapper.setProps({ showMessages: true });

        const inputCriticalMessages = wrapper.findAll('.d-validation-message--critical');

        expect(inputCriticalMessages.length).toBe(2);
        expect(inputCriticalMessages.at(0).text()).toEqual(criticalMessage1);
        expect(inputCriticalMessages.at(1).text()).toEqual(criticalMessage2);
      });

      it('should ignore all other message types if at least 1 critical message is present', async () => {
        const strCriticalMessage = 'string critical message';

        await wrapper.setProps({
          messages: [
            strCriticalMessage,
            { message: 'formatted warning message', type: 'warning' },
            { message: 'formatted positive message', type: 'positive' },
          ],
        });

        expect(wrapper.vm.inputState).toBe('critical');

        const inputMessages = wrapper.findAll('.d-validation-message');
        const inputCriticalMessages = wrapper.findAll('.d-validation-message--critical');

        expect(inputMessages.length).toBe(1);
        expect(inputCriticalMessages.length).toBe(1);
        expect(inputCriticalMessages.at(0).text()).toEqual(strCriticalMessage);
      });

      it('should display warning messages only if no critical messages are present', async () => {
        const warningMessage = 'formatted warning message';

        await wrapper.setProps({
          messages: [
            { message: warningMessage, type: 'warning' },
            { message: 'formatted positive message', type: 'positive' },
          ],
        });

        expect(wrapper.vm.inputState).toBe('warning');

        const inputMessages = wrapper.findAll('.d-validation-message');
        const inputWarningMessages = wrapper.findAll('.d-validation-message--warning');

        expect(inputMessages.length).toBe(1);
        expect(inputWarningMessages.length).toBe(1);
        expect(inputWarningMessages.at(0).text()).toEqual(warningMessage);
      });

      it('should display positive messages only if no other types are present', async () => {
        const positiveMessage1 = 'formatted positive message 1';
        const positiveMessage2 = 'formatted positive message 2';

        await wrapper.setProps({
          messages: [
            { message: positiveMessage1, type: 'positive' },
            { message: positiveMessage2, type: 'positive' },
          ],
        });

        expect(wrapper.vm.inputState).toBe('positive');

        const inputMessages = wrapper.findAll('.d-validation-message');
        const inputPositiveMessages = wrapper.findAll('.d-validation-message--positive');

        expect(inputMessages.length).toBe(2);
        expect(inputPositiveMessages.length).toBe(2);
        expect(inputPositiveMessages.at(0).text()).toEqual(positiveMessage1);
        expect(inputPositiveMessages.at(1).text()).toEqual(positiveMessage2);
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
          expect(label.classes().includes(`d-text-label--${MOCK_INPUT_SIZE_EXTRA_SMALL}`)).toBe(true);
        });

        it('should have DtText description size for xs', () => {
          const descriptionText = description.findComponent(DtText);
          expect(descriptionText.props('size')).toBe('xs');
        });
      });

      describe('When size is numeric', () => {
        it('should add input size class for numeric size 200', () => {
          mockProps = { size: 200 };

          updateWrapper();

          nativeInput = wrapper.find('input');

          expect(nativeInput.classes().includes('d-input--sm')).toBe(true);
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

        it('should add label size class (xl maps to lg)', () => {
          expect(label.classes().includes('d-text-label--lg')).toBe(true);
        });

        it('should have DtText description size for xl', () => {
          const descriptionText = description.findComponent(DtText);
          expect(descriptionText.props('size')).toBe('md');
        });
      });
    });

    describe('When labelSize is provided', () => {
      it('should override the default label size', () => {
        mockProps = { label: 'Label', labelSize: 'xs' };

        updateWrapper();

        const dtText = wrapper.findComponent(DtText);

        expect(dtText.props('size')).toBe('xs');
      });

      it('should override the size-derived label size', () => {
        mockProps = { label: 'Label', size: 'xl', labelSize: 'sm' };

        updateWrapper();

        const dtText = wrapper.findComponent(DtText);

        expect(dtText.props('size')).toBe('sm');
      });
    });

    describe('When labelStrength is provided', () => {
      it('should override the default label strength', () => {
        mockProps = { label: 'Label', labelStrength: 'bold' };

        updateWrapper();

        const dtText = wrapper.findComponent(DtText);

        expect(dtText.props('strength')).toBe('bold');
      });

      it('should not set strength when not provided', () => {
        mockProps = { label: 'Label' };

        updateWrapper();

        const dtText = wrapper.findComponent(DtText);

        expect(dtText.props('strength')).toBeNull();
      });
    });

    describe('When labelClass is provided', () => {
      it('should apply custom class to the label', () => {
        mockProps = { label: 'Label', labelClass: 'd-fc-positive' };

        updateWrapper();

        const labelEl = wrapper.find('[data-qa="dt-input-label"]');

        expect(labelEl.classes('d-fc-positive')).toBe(true);
      });
    });

    describe('When descriptionClass is provided', () => {
      it('should apply custom class to the description', () => {
        mockProps = { description: 'Description', descriptionClass: 'd-bgc-positive' };

        updateWrapper();

        const descriptionEl = wrapper.find('[data-qa="dt-input-description"]');

        expect(descriptionEl.classes('d-bgc-positive')).toBe(true);
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

        it('should not show a critical validation message', () => {
          expect(wrapper.find('[data-qa="dt-input-length-validation-message"]').exists()).toBe(false);

          const inputCriticalMessages = wrapper.findAll('.d-validation-message--critical');

          expect(inputCriticalMessages.length).toBe(0);
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

        it('should show a critical validation message', async () => {
          await wrapper.setProps({ modelValue: 'new value with 28 characters' });

          const inputMessages = wrapper.findAll('.d-validation-message');
          const inputCriticalMessages = wrapper.findAll('.d-validation-message--critical');

          expect(inputMessages.length).toBe(1);
          expect(inputCriticalMessages.length).toBe(1);
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
          expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual(MOCK_USER_TEXT_INPUT_VAL);
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
          expect(wrapper.emitted()['update:modelValue'][0][0]).toEqual(MOCK_USER_TEXT_INPUT_VAL);
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

  describe('IME Composition Tests', () => {
    describe('When type is not a textarea', () => {
      it('should not emit input or update:modelValue while composing', async () => {
        await nativeInput.trigger('compositionstart');
        await nativeInput.trigger('input');

        expect(wrapper.emitted()['update:modelValue']).toBeUndefined();
      });

      it('should emit input and update:modelValue after composition ends', async () => {
        await nativeInput.trigger('compositionstart');
        nativeInput.element.value = 'か';
        await nativeInput.trigger('input'); // Chrome: input fires before compositionend (blocked)
        await nativeInput.trigger('compositionend'); // compositionend emits the committed value

        expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('か');
      });

      it('should not double-emit when input fires after compositionend (Firefox order)', async () => {
        await nativeInput.trigger('compositionstart');
        nativeInput.element.value = 'か';
        // Firefox fires compositionend then input — dispatch both synchronously
        // before the microtask that clears justEndedComposition can run
        nativeInput.element.dispatchEvent(new Event('compositionend', { bubbles: true }));
        nativeInput.element.dispatchEvent(new Event('input', { bubbles: true }));
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted()['update:modelValue']).toHaveLength(1);
        expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('か');
      });

      it('should resume normal emission after composition ends', async () => {
        await nativeInput.trigger('compositionstart');
        await nativeInput.trigger('compositionend');

        nativeInput.element.value = 'hello';
        await nativeInput.trigger('input');

        const inputEmissions = wrapper.emitted()['update:modelValue'];
        expect(inputEmissions[inputEmissions.length - 1][0]).toBe('hello');
      });
    });

    describe('When type is a textarea', () => {
      beforeEach(() => {
        mockProps = { type: 'textarea' };
        updateWrapper();
      });

      it('should not emit input or update:modelValue while composing', async () => {
        await nativeTextarea.trigger('compositionstart');
        await nativeTextarea.trigger('input');

        expect(wrapper.emitted()['update:modelValue']).toBeUndefined();
      });

      it('should emit input and update:modelValue after composition ends', async () => {
        await nativeTextarea.trigger('compositionstart');
        nativeTextarea.element.value = 'か';
        await nativeTextarea.trigger('input'); // Chrome: input fires before compositionend (blocked)
        await nativeTextarea.trigger('compositionend'); // compositionend emits the committed value

        expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('か');
      });

      it('should not double-emit when input fires after compositionend (Firefox order)', async () => {
        await nativeTextarea.trigger('compositionstart');
        nativeTextarea.element.value = 'か';
        nativeTextarea.element.dispatchEvent(new Event('compositionend', { bubbles: true }));
        nativeTextarea.element.dispatchEvent(new Event('input', { bubbles: true }));
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted()['update:modelValue']).toHaveLength(1);
        expect(wrapper.emitted()['update:modelValue'][0][0]).toBe('か');
      });

      it('should not override textarea value via modelValue watcher while composing', async () => {
        nativeTextarea.element.value = 'composing...';
        await nativeTextarea.trigger('compositionstart');

        await wrapper.setProps({ modelValue: 'external update' });

        expect(nativeTextarea.element.value).toBe('composing...');
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

    describe('When a class is provided', () => {
      it('should include the class', () => {
        mockAttrs = { class: MOCK_ROOT_CLASS }

        updateWrapper();

        expect(wrapper.classes().includes(MOCK_ROOT_CLASS)).toBe(true);
      });
    });
  });
});
