import { act, fireEvent, render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { INPUT_SIZES } from './InputConstants';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { DtIcon } from '../Icon';
import { TEXT_KIND_MODIFIERS, TEXT_STRENGTH_MODIFIERS } from '../Text';
import { DtInput, type DtInputProps } from './Input';

const MOCK_ROOT_CLASS = 'custom-class';

const baseProps = {
  type: 'text',
  value: 'value',
  label: 'label text',
} satisfies DtInputProps;
const baseAttrs = {
  placeholder: 'input-placeholder',
  name: 'input-name',
  autoComplete: 'on',
} satisfies DtInputProps;

const iconPlus = <DtIcon name="plus" />;

describe('DtInput tests', () => {
  let result: RenderResult;
  let props: DtInputProps;

  const inputWith = (extra: DtInputProps = {}) => <DtInput {...baseProps} {...baseAttrs} {...extra} />;

  const updateWrapper = (extra: DtInputProps = {}) => {
    props = extra;
    result?.unmount();
    result = render(inputWith(extra));
  };

  // Vue's setProps: the same props, plus the new ones.
  const setProps = (extra: DtInputProps) => {
    props = { ...props, ...extra };
    result.rerender(inputWith(props));
  };

  const byQa = (qa: string) => document.querySelector<HTMLElement>(`[data-qa="${qa}"]`);
  const root = () => byQa('dt-input');
  const labelWrapper = () => byQa('dt-input-label-wrapper');
  const label = () => byQa('dt-input-label');
  const description = () => byQa('dt-input-description');
  const nativeInput = () => document.querySelector('input');
  const nativeTextarea = () => byQa('dt-input-input') as HTMLInputElement | HTMLTextAreaElement;
  const leftIconWrapper = () => byQa('dt-input-left-icon-wrapper');
  const rightIconWrapper = () => byQa('dt-input-right-icon-wrapper');
  const validationMessages = () => document.querySelectorAll('.d-validation-message');
  const criticalMessages = () => document.querySelectorAll('.d-validation-message--critical');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    result?.unmount();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(root()).toBeInTheDocument();
    });

    describe('When type is not textarea', () => {
      it('should render the native input', () => {
        expect(nativeInput()).toBeInTheDocument();
      });

      it('should have a type prop', () => {
        expect(nativeInput()).toHaveAttribute('type', baseProps.type);
      });

      it('should have a bound value prop', () => {
        expect(nativeInput()?.value).toBe(baseProps.value);
      });

      it('should have input class', () => {
        expect(nativeInput()).toHaveClass('d-input');
      });

      it('should display the initial value prop', () => {
        expect(nativeInput()).toHaveValue(baseProps.value);
      });
    });

    describe('When type is textarea', () => {
      beforeEach(() => {
        updateWrapper({ type: 'textarea' });
      });

      it('should render the native textarea', () => {
        expect(nativeTextarea().tagName).toBe('TEXTAREA');
      });

      it('should not have a type prop', () => {
        expect(nativeTextarea()).not.toHaveAttribute('type');
      });

      it('should not have a bound value prop', () => {
        expect(nativeTextarea()).not.toHaveAttribute('value');
      });

      it('should have textarea class', () => {
        expect(nativeTextarea()).toHaveClass('d-textarea');
      });

      it('should display the initial value prop', () => {
        expect(nativeTextarea().value).toBe(baseProps.value);
      });
    });

    describe('When a label visible prop is false', () => {
      it('should not render a label', () => {
        updateWrapper({ showLabel: false });

        expect(label()).not.toBeInTheDocument();
      });

      it('should set aria-label on the input', () => {
        updateWrapper({ showLabel: false });

        expect(nativeInput()).toHaveAttribute('aria-label', baseProps.label);
      });

      it('should set aria-label on the textarea', () => {
        updateWrapper({ showLabel: false, type: 'textarea' });

        expect(nativeTextarea()).toHaveAttribute('aria-label', baseProps.label);
      });
    });

    describe('When showLabel is true', () => {
      it('should not set aria-label on the input', () => {
        expect(nativeInput()).not.toHaveAttribute('aria-label');
      });
    });

    describe('When a label is not provided', () => {
      it('should not render a label', () => {
        updateWrapper({ label: undefined });

        expect(label()).not.toBeInTheDocument();
      });
    });

    describe('When a description is not provided', () => {
      it('should not render a description', () => {
        expect(description()).not.toBeInTheDocument();
      });

      it('should not have aria details defined on label wrapper', () => {
        expect(labelWrapper()).not.toHaveAttribute('aria-details');
      });
    });

    describe('When a description is provided via prop', () => {
      beforeEach(() => {
        updateWrapper({ description: 'Description' });
      });

      it('should render the description', () => {
        expect(description()).toBeInTheDocument();
      });

      it('should have description class', () => {
        expect(description()).toHaveClass('d-description');
      });

      it('should have a generated id', () => {
        expect(description()?.id).toBeTruthy();
      });

      it('should display the correct description', () => {
        expect(description()).toHaveTextContent('Description');
      });

      it('should have aria details defined on label wrapper', () => {
        expect(description()?.id).toBe(labelWrapper()?.getAttribute('aria-details'));
      });
    });

    describe('When a description is provided via slot', () => {
      beforeEach(() => {
        updateWrapper({ description: <>Description</> });
      });

      it('should render the description', () => {
        expect(description()).toBeInTheDocument();
      });

      it('should have description class', () => {
        expect(description()).toHaveClass('d-description');
      });

      it('should have a generated id', () => {
        expect(description()?.id).toBeTruthy();
      });

      it('should display the correct description', () => {
        expect(description()).toHaveTextContent('Description');
      });

      it('should have aria details defined on label wrapper', () => {
        expect(description()?.id).toBe(labelWrapper()?.getAttribute('aria-details'));
      });
    });

    describe('When an inputClass prop is provided', () => {
      it('Should apply the class to the input element.', () => {
        updateWrapper({ inputClass: 'd-fc-positive' });

        expect(nativeInput()).toHaveClass('d-fc-positive');
      });
    });

    describe('When a start icon is provided', () => {
      beforeEach(() => {
        updateWrapper({ startIcon: iconPlus });
      });

      it('should render the icon wrapper', () => {
        expect(leftIconWrapper()).toBeInTheDocument();
      });

      it('should have input icon class', () => {
        expect(leftIconWrapper()).toHaveClass('d-input-icon');
      });

      it('should have input icon side class', () => {
        expect(leftIconWrapper()).toHaveClass('d-input-icon--left');
      });

      it('should have input icon size class', () => {
        expect(leftIconWrapper()).not.toHaveClass(`d-input-icon--${INPUT_SIZES.DEFAULT}`);
      });

      it('should render the provided icon', () => {
        expect(leftIconWrapper()?.querySelector('[data-qa="dt-icon"]')).toBeInTheDocument();
      });
    });

    describe('When an end icon is provided', () => {
      beforeEach(() => {
        updateWrapper({ endIcon: iconPlus });
      });

      it('should render the icon wrapper', () => {
        expect(rightIconWrapper()).toBeInTheDocument();
      });

      it('should have input icon class', () => {
        expect(rightIconWrapper()).toHaveClass('d-input-icon');
      });

      it('should have input icon side class', () => {
        expect(rightIconWrapper()).toHaveClass('d-input-icon--right');
      });

      it('should have input icon size class', () => {
        expect(rightIconWrapper()).not.toHaveClass(`d-input-icon--${INPUT_SIZES.DEFAULT}`);
      });

      it('should render the provided icon', () => {
        expect(rightIconWrapper()?.querySelector('[data-qa="dt-icon"]')).toBeInTheDocument();
      });
    });

    // The deprecated leftIcon and rightIcon slots aren't ported (skips.json).
    describe('Backward compatibility', () => {
      describe('When leftIcon slot is provided (deprecated)', () => {
        it.skip('should render the icon wrapper', () => {});

        it.skip('should render the provided icon', () => {});
      });

      describe('When rightIcon slot is provided (deprecated)', () => {
        it.skip('should render the icon wrapper', () => {});

        it.skip('should render the provided icon', () => {});
      });

      describe('When both startIcon and leftIcon slots are provided', () => {
        it.skip('should render the new startIcon content and suppress the deprecated leftIcon', () => {});
      });
    });

    describe('When no validation message(s) are provided', () => {
      it('should not render any validation messages', () => {
        expect(validationMessages()).toHaveLength(0);
      });

      // Vue reads vm.inputState; its visible effect is the state class on the input and its wrapper.
      it('should not have an input state', () => {
        for (const state of ['critical', 'warning', 'positive']) {
          expect(nativeInput()).not.toHaveClass(`d-input--${state}`);
          expect(nativeInput()?.parentElement).not.toHaveClass(`d-input--${state}`);
        }
      });
    });

    describe('When validation message(s) are provided', () => {
      it('should display critical messages', () => {
        const criticalMessage1 = 'critical message 1';
        const criticalMessage2 = 'critical message 2';

        setProps({
          showMessages: false,
          messages: [
            criticalMessage1,
            { message: criticalMessage2, type: 'critical' },
          ],
        });

        expect(validationMessages()).toHaveLength(0);
        // The input state is critical (aria-invalid), though hidden messages show no state class.
        expect(nativeInput()).toHaveAttribute('aria-invalid', 'true');

        setProps({ showMessages: true });

        const inputCriticalMessages = criticalMessages();

        expect(inputCriticalMessages).toHaveLength(2);
        expect(inputCriticalMessages[0]).toHaveTextContent(criticalMessage1);
        expect(inputCriticalMessages[1]).toHaveTextContent(criticalMessage2);
      });

      it('should ignore all other message types if at least 1 critical message is present', () => {
        const strCriticalMessage = 'string critical message';

        setProps({
          messages: [
            strCriticalMessage,
            { message: 'formatted warning message', type: 'warning' },
            { message: 'formatted positive message', type: 'positive' },
          ],
        });

        expect(nativeInput()).toHaveClass('d-input--critical');

        const inputCriticalMessages = criticalMessages();

        expect(validationMessages()).toHaveLength(1);
        expect(inputCriticalMessages).toHaveLength(1);
        expect(inputCriticalMessages[0]).toHaveTextContent(strCriticalMessage);
      });

      it('should display warning messages only if no critical messages are present', () => {
        const warningMessage = 'formatted warning message';

        setProps({
          messages: [
            { message: warningMessage, type: 'warning' },
            { message: 'formatted positive message', type: 'positive' },
          ],
        });

        expect(nativeInput()).toHaveClass('d-input--warning');

        const inputWarningMessages = document.querySelectorAll('.d-validation-message--warning');

        expect(validationMessages()).toHaveLength(1);
        expect(inputWarningMessages).toHaveLength(1);
        expect(inputWarningMessages[0]).toHaveTextContent(warningMessage);
      });

      it('should display positive messages only if no other types are present', () => {
        const positiveMessage1 = 'formatted positive message 1';
        const positiveMessage2 = 'formatted positive message 2';

        setProps({
          messages: [
            { message: positiveMessage1, type: 'positive' },
            { message: positiveMessage2, type: 'positive' },
          ],
        });

        expect(nativeInput()).toHaveClass('d-input--positive');

        const inputPositiveMessages = document.querySelectorAll('.d-validation-message--positive');

        expect(validationMessages()).toHaveLength(2);
        expect(inputPositiveMessages).toHaveLength(2);
        expect(inputPositiveMessages[0]).toHaveTextContent(positiveMessage1);
        expect(inputPositiveMessages[1]).toHaveTextContent(positiveMessage2);
      });
    });

    describe('When a size is provided', () => {
      describe('When size is EXTRA_SMALL', () => {
        const MOCK_INPUT_SIZE_EXTRA_SMALL = INPUT_SIZES.EXTRA_SMALL;

        beforeEach(() => {
          updateWrapper({ size: MOCK_INPUT_SIZE_EXTRA_SMALL, label: 'Label', description: 'Description' });
        });

        it('should add input size class', () => {
          expect(nativeInput()).toHaveClass(`d-input--${MOCK_INPUT_SIZE_EXTRA_SMALL}`);
        });

        it('should add label size class', () => {
          expect(label()).toHaveClass(`d-text-label--${MOCK_INPUT_SIZE_EXTRA_SMALL}`);
        });

        it('should have DtText description size for xs', () => {
          expect(description()).toHaveClass(`${TEXT_KIND_MODIFIERS.body}--xs`);
        });
      });

      describe('When size is numeric', () => {
        it('should add input size class for numeric size 200', () => {
          updateWrapper({ size: 200 });

          expect(nativeInput()).toHaveClass('d-input--sm');
        });
      });

      describe('When size is EXTRA_LARGE', () => {
        const MOCK_INPUT_SIZE_EXTRA_LARGE = INPUT_SIZES.EXTRA_LARGE;

        beforeEach(() => {
          updateWrapper({ size: MOCK_INPUT_SIZE_EXTRA_LARGE, label: 'Label', description: 'Description' });
        });

        it('should add input size class', () => {
          expect(nativeInput()).toHaveClass(`d-input--${MOCK_INPUT_SIZE_EXTRA_LARGE}`);
        });

        it('should add label size class (xl maps to lg)', () => {
          expect(label()).toHaveClass('d-text-label--lg');
        });

        it('should have DtText description size for xl', () => {
          expect(description()).toHaveClass(`${TEXT_KIND_MODIFIERS.body}--md`);
        });
      });
    });

    describe('When labelSize is provided', () => {
      it('should override the default label size', () => {
        updateWrapper({ label: 'Label', labelSize: 'xs' });

        expect(label()).toHaveClass(`${TEXT_KIND_MODIFIERS.label}--xs`);
      });

      it('should override the size-derived label size', () => {
        updateWrapper({ label: 'Label', size: 'xl', labelSize: 'sm' });

        expect(label()).toHaveClass(`${TEXT_KIND_MODIFIERS.label}--sm`);
        expect(label()).not.toHaveClass(`${TEXT_KIND_MODIFIERS.label}--lg`);
      });
    });

    describe('When labelStrength is provided', () => {
      it('should override the default label strength', () => {
        updateWrapper({ label: 'Label', labelStrength: 'bold' });

        expect(label()).toHaveClass(TEXT_STRENGTH_MODIFIERS.bold);
      });

      it('should not set strength when not provided', () => {
        updateWrapper({ label: 'Label' });

        for (const strengthClass of Object.values(TEXT_STRENGTH_MODIFIERS)) {
          expect(label()).not.toHaveClass(strengthClass);
        }
      });
    });

    describe('When labelClass is provided', () => {
      it('should apply custom class to the label', () => {
        updateWrapper({ label: 'Label', labelClass: 'd-fc-positive' });

        expect(label()).toHaveClass('d-fc-positive');
      });
    });

    describe('When descriptionClass is provided', () => {
      it('should apply custom class to the description', () => {
        updateWrapper({ description: 'Description', descriptionClass: 'd-bgc-positive' });

        expect(description()).toHaveClass('d-bgc-positive');
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
          updateWrapper({
            currentLength: 8,
            validate: MOCK_VALIDATE,
          });

          act(() => nativeInput()?.focus());
        });

        it('should not show the length validation message', () => {
          expect(validationMessages()).toHaveLength(0);
        });

        it('should show the length description', () => {
          expect(byQa('dt-input-length-description')).toHaveTextContent(MOCK_VALIDATE.length.description);
        });
      });

      describe('When the input length reaches the maximum length and the input is not focused', () => {
        beforeEach(() => {
          updateWrapper({
            currentLength: 20,
            validate: MOCK_VALIDATE,
          });
        });

        it('should not show a critical validation message', () => {
          expect(byQa('dt-input-length-validation-message')).not.toBeInTheDocument();

          expect(criticalMessages()).toHaveLength(0);
          // At the maximum, the length state is a warning, shown only while focused (or with retainWarning).
          expect(validationMessages()).toHaveLength(0);
        });
      });

      describe('When the input has a invalid state', () => {
        beforeEach(() => {
          updateWrapper({
            currentLength: 28,
            validate: MOCK_VALIDATE,
          });
        });

        it('should show a critical validation message', () => {
          setProps({ value: 'new value with 28 characters' });

          expect(validationMessages()).toHaveLength(1);
          expect(criticalMessages()).toHaveLength(1);
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

      let onValueChange: ReturnType<typeof vi.fn<(value: string | string[]) => void>>;
      let onInput: ReturnType<typeof vi.fn<() => void>>;
      let onInvalidChange: ReturnType<typeof vi.fn<(invalid: boolean) => void>>;

      // Vue's setValue: the field ends up holding the value, with an input event.
      const setValue = async (el: HTMLElement, value: string) => {
        const user = userEvent.setup();
        await user.clear(el);
        await user.click(el);
        await user.paste(value);
      };

      describe('When type is not a textarea', () => {
        beforeEach(async () => {
          onValueChange = vi.fn();
          onInput = vi.fn();
          onInvalidChange = vi.fn();
          updateWrapper({ currentLength: null, validate: MOCK_VALIDATE, onValueChange, onInput, onInvalidChange });

          await setValue(nativeTextarea(), MOCK_USER_TEXT_INPUT_VAL);
        });

        it('should handle input value', () => {
          expect(onValueChange).toHaveBeenLastCalledWith(MOCK_USER_TEXT_INPUT_VAL);
          expect(onInput).toHaveBeenCalled();
        });

        describe('When a new value is provided', () => {
          it('should update input value', () => {
            setProps({ value: MOCK_NEW_VALUE });

            expect(nativeInput()?.value).toEqual(MOCK_NEW_VALUE);
          });
        });

        describe('When a new value exceeds the maximum length', () => {
          it('should emit an "update:invalid" event with true', () => {
            setProps({ value: MOCK_NEW_VALUE });

            expect(onInvalidChange.mock.calls[0][0]).toBe(true);
          });
        });

        describe('When a new value is within the maximum length after exceeding it', () => {
          it('should emit an "update:invalid" event with false', () => {
            setProps({ value: MOCK_NEW_VALUE });
            setProps({ value: MOCK_USER_TEXT_INPUT_VAL });

            expect(onInvalidChange.mock.calls[1][0]).toBe(false);
          });
        });
      });

      describe('When type is a textarea', () => {
        beforeEach(async () => {
          onValueChange = vi.fn();
          // Vue's test reads its onInput mock here too without passing it, so it only passes on the calls an earlier
          // test left behind; this one passes its own.
          onInput = vi.fn();
          onInvalidChange = vi.fn();
          updateWrapper({
            type: 'textarea', currentLength: null, validate: MOCK_VALIDATE, onValueChange, onInput, onInvalidChange,
          });

          await setValue(nativeTextarea(), MOCK_USER_TEXT_INPUT_VAL);
        });

        it('should handle input value', () => {
          expect(onValueChange).toHaveBeenLastCalledWith(MOCK_USER_TEXT_INPUT_VAL);
          expect(onInput).toHaveBeenCalled();
        });

        describe('When a new value is provided', () => {
          it('should update input value', () => {
            setProps({ value: MOCK_NEW_VALUE });

            expect(nativeTextarea().value).toEqual(MOCK_NEW_VALUE);
          });
        });

        describe('When a new value exceeds the maximum length', () => {
          it('should emit an "update:invalid" event with true', () => {
            setProps({ value: MOCK_NEW_VALUE });

            expect(onInvalidChange.mock.calls[0][0]).toBe(true);
          });
        });

        describe('When a new value is within the maximum length after exceeding it', () => {
          it('should emit an "update:invalid" event with false', () => {
            setProps({ value: MOCK_NEW_VALUE });
            setProps({ value: MOCK_USER_TEXT_INPUT_VAL });

            expect(onInvalidChange.mock.calls[1][0]).toBe(false);
          });
        });
      });
    });
  });

  // fireEvent sets `value` the way a browser does, past React's own value tracking, so an input event after it is a
  // real change that React reports to onChange: each test below could see an emission it shouldn't.
  describe('IME Composition Tests', () => {
    let onValueChange: ReturnType<typeof vi.fn<(value: string | string[]) => void>>;

    describe('When type is not a textarea', () => {
      beforeEach(() => {
        onValueChange = vi.fn();
        updateWrapper({ onValueChange });
      });

      it('should not emit input or update:modelValue while composing', () => {
        fireEvent.compositionStart(nativeTextarea());
        fireEvent.input(nativeTextarea(), { target: { value: 'k' } });

        expect(onValueChange).not.toHaveBeenCalled();
      });

      it('should emit input and update:modelValue after composition ends', () => {
        fireEvent.compositionStart(nativeTextarea());
        fireEvent.input(nativeTextarea(), { target: { value: 'か' } }); // Chrome: input fires before compositionend (blocked)
        fireEvent.compositionEnd(nativeTextarea()); // compositionend emits the committed value

        expect(onValueChange.mock.calls[0][0]).toBe('か');
      });

      it('should not double-emit when input fires after compositionend (Firefox order)', async () => {
        fireEvent.compositionStart(nativeTextarea());
        // Firefox fires compositionend then input — dispatch both synchronously
        // before the microtask that clears justEndedComposition can run
        fireEvent.compositionEnd(nativeTextarea(), { target: { value: 'か' } });
        fireEvent.input(nativeTextarea());
        await act(async () => {});

        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange.mock.calls[0][0]).toBe('か');
      });

      it('should resume normal emission after composition ends', async () => {
        fireEvent.compositionStart(nativeTextarea());
        fireEvent.compositionEnd(nativeTextarea());
        await act(async () => {});

        fireEvent.input(nativeTextarea(), { target: { value: 'hello' } });

        expect(onValueChange).toHaveBeenLastCalledWith('hello');
      });
    });

    describe('When type is a textarea', () => {
      beforeEach(() => {
        onValueChange = vi.fn();
        updateWrapper({ type: 'textarea', onValueChange });
      });

      it('should not emit input or update:modelValue while composing', () => {
        fireEvent.compositionStart(nativeTextarea());
        fireEvent.input(nativeTextarea(), { target: { value: 'k' } });

        expect(onValueChange).not.toHaveBeenCalled();
      });

      it('should emit input and update:modelValue after composition ends', () => {
        fireEvent.compositionStart(nativeTextarea());
        fireEvent.input(nativeTextarea(), { target: { value: 'か' } }); // Chrome: input fires before compositionend (blocked)
        fireEvent.compositionEnd(nativeTextarea()); // compositionend emits the committed value

        expect(onValueChange.mock.calls[0][0]).toBe('か');
      });

      it('should not double-emit when input fires after compositionend (Firefox order)', async () => {
        fireEvent.compositionStart(nativeTextarea());
        fireEvent.compositionEnd(nativeTextarea(), { target: { value: 'か' } });
        fireEvent.input(nativeTextarea());
        await act(async () => {});

        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange.mock.calls[0][0]).toBe('か');
      });

      it('should not override textarea value via modelValue watcher while composing', () => {
        fireEvent.input(nativeTextarea(), { target: { value: 'composing...' } });
        fireEvent.compositionStart(nativeTextarea());

        setProps({ value: 'external update' });

        expect(nativeTextarea().value).toBe('composing...');
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('ARIA validation wiring', () => {
      describe('When type is input', () => {
        describe('When a critical validation message is provided', () => {
          beforeEach(() => {
            updateWrapper({ messages: [{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.CRITICAL }] });
          });

          it('should set aria-invalid on the input', () => {
            expect(nativeInput()).toHaveAttribute('aria-invalid', 'true');
          });

          it('should set aria-describedby on the input pointing to the messages container', () => {
            const messagesContainer = byQa('dt-input-messages');

            expect(nativeInput()?.getAttribute('aria-describedby')).toBe(messagesContainer?.id);
            expect(messagesContainer?.id).toBeTruthy();
          });
        });

        describe('When no validation messages are provided', () => {
          it('should not set aria-invalid on the input', () => {
            expect(nativeInput()).not.toHaveAttribute('aria-invalid');
          });

          it('should not set aria-describedby on the input', () => {
            expect(nativeInput()).not.toHaveAttribute('aria-describedby');
          });
        });
      });

      describe('When type is textarea', () => {
        describe('When a critical validation message is provided', () => {
          beforeEach(() => {
            updateWrapper({
              type: 'textarea',
              messages: [{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.CRITICAL }],
            });
          });

          it('should set aria-invalid on the textarea', () => {
            expect(nativeTextarea()).toHaveAttribute('aria-invalid', 'true');
          });

          it('should set aria-describedby on the textarea pointing to the messages container', () => {
            const messagesContainer = byQa('dt-input-messages');

            expect(nativeTextarea().getAttribute('aria-describedby')).toBe(messagesContainer?.id);
            expect(messagesContainer?.id).toBeTruthy();
          });
        });

        describe('When no validation messages are provided', () => {
          beforeEach(() => {
            updateWrapper({ type: 'textarea' });
          });

          it('should not set aria-invalid on the textarea', () => {
            expect(nativeTextarea()).not.toHaveAttribute('aria-invalid');
          });

          it('should not set aria-describedby on the textarea', () => {
            expect(nativeTextarea()).not.toHaveAttribute('aria-describedby');
          });
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    it('should handle pass through props/attrs', () => {
      expect(nativeInput()).toHaveAttribute('placeholder', baseAttrs.placeholder);
      expect(nativeInput()).toHaveAttribute('name', baseAttrs.name);
      expect(nativeInput()).toHaveAttribute('autocomplete', baseAttrs.autoComplete);
      expect(nativeInput()).not.toHaveAttribute('disabled');

      setProps({ disabled: true });

      expect(nativeInput()).toBeDisabled();
    });

    describe('When a class is provided', () => {
      it('should include the class', () => {
        updateWrapper({ className: MOCK_ROOT_CLASS });

        expect(root()).toHaveClass(MOCK_ROOT_CLASS);
      });
    });
  });

  // React-only: the API mapping's choices, which Vue's tests don't cover.
  describe('React API', () => {
    it('keeps its own value when uncontrolled', async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      updateWrapper({ value: undefined, defaultValue: 'start', onValueChange });

      await user.type(nativeTextarea(), '!');

      expect(nativeInput()).toHaveValue('start!');
      expect(onValueChange).toHaveBeenLastCalledWith('start!');
    });

    it('passes the endIcon slot a clear function that empties and focuses the input', async () => {
      const user = userEvent.setup();
      const onClear = vi.fn();
      const onValueChange = vi.fn();
      // Uncontrolled: like Vue's :value binding, a controlled value the parent doesn't update is written back.
      updateWrapper({
        value: undefined,
        defaultValue: 'value',
        onClear,
        onValueChange,
        endIcon: ({ clear, iconSize }) => <button type="button" data-size={iconSize} onClick={clear}>clear</button>,
      });

      await user.click(document.querySelector('button')!);

      expect(document.querySelector('button')).toHaveAttribute('data-size', '200');
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenLastCalledWith('');
      expect(nativeInput()).toHaveValue('');
      expect(nativeInput()).toHaveFocus();
    });

    it('reports blur only when focus leaves the component', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      updateWrapper({ onBlur, endIcon: <button type="button">inside</button> });

      await user.click(nativeTextarea());
      await user.tab();
      expect(document.querySelector('button')).toHaveFocus();
      expect(onBlur).not.toHaveBeenCalled();

      await user.tab();
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('reports the length on mount and on change', () => {
      const onLengthChange = vi.fn();
      updateWrapper({ onLengthChange });

      expect(onLengthChange).toHaveBeenCalledWith(baseProps.value.length);

      setProps({ value: '😀😀' });

      expect(onLengthChange).toHaveBeenLastCalledWith(2);
    });

    it('forwards ref to the native input', () => {
      const ref = { current: null as HTMLInputElement | HTMLTextAreaElement | null };
      updateWrapper({ ref });

      expect(ref.current).toBe(nativeInput());
    });

    it('calls the consumer\'s onChange after its own', () => {
      const order: string[] = [];
      updateWrapper({
        onValueChange: () => order.push('value'),
        onChange: () => order.push('change'),
      });

      fireEvent.input(nativeTextarea(), { target: { value: 'x' } });

      expect(order).toEqual(['value', 'change']);
    });
  });
});
