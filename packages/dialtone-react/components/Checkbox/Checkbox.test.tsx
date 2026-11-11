import { StrictMode, type ReactElement } from 'react';
import { render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DtCheckbox, type DtCheckboxProps } from './Checkbox';
import { TEXT_KIND_MODIFIERS, TEXT_SIZE_MAP, TEXT_STRENGTH_MODIFIERS, TEXT_TONE_MODIFIERS } from '../Text/TextConstants';
import { InputGroupContext, type GroupContext } from '../../common/input';
import { VALIDATION_MESSAGE_TYPES, type ValidationMessageType } from '../../common/constants';
import { CHECKBOX_INPUT_VALIDATION_CLASSES } from './CheckboxConstants';

const MOCK_SLOT_LABEL = 'My Slotted Label';
const MOCK_SLOT_DESCRIPTION = 'My Slotted Description';
const MOCK_GROUP_NAME = 'checkboxGroup';

const MOCK_ROOT_CLASS = 'custom-class';
const MOCK_CUSTOM_CLASS = 'my-custom-class';
const MOCK_PROP_NAME = 'some';
const MOCK_PROP_VALUE = 'prop';
const MOCK_CHILD_PROPS = { [MOCK_PROP_NAME]: MOCK_PROP_VALUE };

const baseProps = {
  label: 'My Checkbox Label',
  value: 'Value',
} satisfies DtCheckboxProps;

const checkboxWith = (props: DtCheckboxProps = {}) => <DtCheckbox {...baseProps} {...props} />;

const inGroup = (ui: ReactElement, groupContext: GroupContext) => (
  <InputGroupContext value={{ groupContext, setGroupValue: () => {} }}>{ui}</InputGroupContext>
);

const renderCheckbox = (props: DtCheckboxProps = {}) => render(checkboxWith(props));

const byQa = (qa: string) => document.querySelector<HTMLElement>(`[data-qa="${qa}"]`);
const getInput = () => screen.getByRole('checkbox');
const getLabel = () => byQa('checkbox-label');
const getDescription = () => byQa('checkbox-description');

describe('DtCheckbox Tests', () => {
  describe('Presentation Tests', () => {
    it('Should render the component', () => {
      renderCheckbox();

      expect(screen.getByRole('checkbox', { name: baseProps.label })).toBeInTheDocument();
    });

    it('should have checkbox group class', () => {
      renderCheckbox();

      expect(getInput().closest('label')).toHaveClass('d-checkbox-group');
    });

    describe('Checkbox Input Tests', () => {
      beforeEach(() => {
        renderCheckbox();
      });

      it('should exist', () => {
        expect(getInput()).toBeInTheDocument();
      });

      it('should have type checkbox', () => {
        expect(getInput()).toHaveAttribute('type', 'checkbox');
      });

      it('should not be checked', () => {
        expect(getInput()).not.toBeChecked();
      });
    });

    describe('Checkbox Label Tests', () => {
      beforeEach(() => {
        renderCheckbox();
      });

      it('should exist', () => {
        expect(getLabel()).toBeInTheDocument();
      });

      it('should match provided label prop', () => {
        expect(getLabel()?.textContent).toBe(baseProps.label);
      });

      it('should render label as DtText with tone="primary"', () => {
        expect(getLabel()).toHaveClass('d-text', TEXT_TONE_MODIFIERS.primary);
      });

      it('should render label DtText with default size 300', () => {
        expect(getLabel()).toHaveClass(`${TEXT_KIND_MODIFIERS.label}--${TEXT_SIZE_MAP[300]}`);
      });
    });

    describe('When labelStrength is provided', () => {
      it('should override the default label strength', () => {
        renderCheckbox({ labelStrength: 'bold' });

        expect(getLabel()).toHaveClass(TEXT_STRENGTH_MODIFIERS.bold);
        expect(getLabel()).not.toHaveClass(TEXT_STRENGTH_MODIFIERS.normal);
      });

      it('should default to normal strength when not provided', () => {
        renderCheckbox();

        expect(getLabel()).toHaveClass(TEXT_STRENGTH_MODIFIERS.normal);
      });
    });

    describe('When labelSize is provided', () => {
      it('should override the default label size', () => {
        renderCheckbox({ labelSize: 'lg' });

        expect(getLabel()).toHaveClass(`${TEXT_KIND_MODIFIERS.label}--lg`);
        expect(getLabel()).not.toHaveClass(`${TEXT_KIND_MODIFIERS.label}--${TEXT_SIZE_MAP[300]}`);
      });
    });

    describe('When showLabel is false', () => {
      beforeEach(() => {
        renderCheckbox({ showLabel: false });
      });

      it('should not render a label', () => {
        expect(getLabel()).toBeNull();
      });

      it('should set aria-label on the input', () => {
        expect(getInput()).toHaveAttribute('aria-label', baseProps.label);
      });
    });

    describe('When showLabel is true', () => {
      it('should not set aria-label on the input', () => {
        renderCheckbox();

        expect(getInput()).not.toHaveAttribute('aria-label');
      });
    });

    describe('When a label prop is provided', () => {
      it('should exist', () => {
        renderCheckbox({ label: 'My Label' });

        expect(getLabel()).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'My Label' })).toBeInTheDocument();
      });
    });

    describe('When a description prop is provided', () => {
      it('should exist', () => {
        renderCheckbox({ description: 'Description' });

        expect(getDescription()).toBeInTheDocument();
        expect(getDescription()?.textContent).toBe('Description');
      });
    });

    describe('When neither a label prop/slot nor a description prop/slot is provided', () => {
      beforeEach(() => {
        renderCheckbox({ label: undefined });
      });

      it('should remove the description wrapper if no description is provided', () => {
        expect(getDescription()).toBeNull();
      });

      it('should remove the label wrapper if no label is provided', () => {
        expect(getLabel()).toBeNull();
      });

      it('should keep the checkbox description/messages container in the DOM', () => {
        expect(byQa('checkbox-description-messages')).toBeInTheDocument();
      });

      it('should keep the input checkbox', () => {
        expect(getInput()).toBeInTheDocument();
      });
    });

    describe('When a validation state is provided', () => {
      it('applies validation classes for positive state', () => {
        renderCheckbox({ description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.POSITIVE });

        expect(getInput()).toHaveClass(CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.POSITIVE]);
      });

      it('applies validation classes for warning state', () => {
        renderCheckbox({ description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.WARNING });

        expect(getInput()).toHaveClass(CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.WARNING]);
      });

      it('applies validation classes for critical state', () => {
        renderCheckbox({ description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.CRITICAL });

        expect(getInput()).toHaveClass(CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.CRITICAL]);
      });
    });

    describe('When checked', () => {
      it('should be checked', () => {
        renderCheckbox({ checked: true });

        expect(getInput()).toBeChecked();
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        renderCheckbox({ disabled: true });
      });

      it('should disable input', () => {
        expect(getInput()).toBeDisabled();
      });

      it('should have disabled class', () => {
        expect(getInput().closest('label')).toHaveClass('d-checkbox-group--disabled');
      });

      it('should render label DtText with tone="disabled"', () => {
        expect(getLabel()).toHaveClass('d-text', TEXT_TONE_MODIFIERS.disabled);
        expect(getLabel()).not.toHaveClass(TEXT_TONE_MODIFIERS.primary);
      });
    });

    describe('When slot(s) are provided', () => {
      describe('When a slotted label is provided', () => {
        it('should have slotted label', () => {
          renderCheckbox({ children: MOCK_SLOT_LABEL });

          expect(getLabel()?.textContent).toBe(MOCK_SLOT_LABEL);
        });
      });

      describe('When a slotted description is provided', () => {
        it('should have slotted description', () => {
          renderCheckbox({ description: <>{MOCK_SLOT_DESCRIPTION}</> });

          expect(getDescription()?.textContent).toBe(MOCK_SLOT_DESCRIPTION);
        });
      });

      describe('When slotted label and description are provided', () => {
        beforeEach(() => {
          renderCheckbox({ children: MOCK_SLOT_LABEL, description: <>{MOCK_SLOT_DESCRIPTION}</> });
        });

        it('should have slotted label', () => {
          expect(getLabel()?.textContent).toBe(MOCK_SLOT_LABEL);
        });

        it('should have slotted description', () => {
          expect(getDescription()?.textContent).toBe(MOCK_SLOT_DESCRIPTION);
        });
      });
    });
  });

  // Vue triggers `change` directly; a click is what a user does, and fires it.
  const customEventTests = () => {
    describe('Custom Event Tests', () => {
      describe('When the checkbox is clicked', () => {
        it('Should emit update:modelValue event', async () => {
          const onCheckedChange = vi.fn();
          renderCheckbox({ onCheckedChange });

          await userEvent.click(getInput());

          expect(onCheckedChange).toHaveBeenCalledWith(true);
        });
      });

      describe('When checked', () => {
        describe('When the checkbox is clicked', () => {
          it('Should emit update:modelValue event', async () => {
            const onCheckedChange = vi.fn();
            renderCheckbox({ checked: true, onCheckedChange });

            await userEvent.click(getInput());

            expect(onCheckedChange).toHaveBeenCalledWith(false);
          });
        });
      });

      describe('When disabled', () => {
        describe('When the checkbox is clicked', () => {
          it('Should not emit update:modelValue event', async () => {
            const onCheckedChange = vi.fn();
            renderCheckbox({ disabled: true, onCheckedChange });

            await userEvent.click(getInput());

            expect(onCheckedChange).not.toHaveBeenCalled();
          });
        });
      });
    });
  };

  describe('Accessibility Tests', () => {
    customEventTests();

    describe('ARIA validation wiring', () => {
      describe('When a critical validation message is provided', () => {
        beforeEach(() => {
          renderCheckbox({ messages: [{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.CRITICAL }] });
        });

        it('should set aria-invalid on the input', () => {
          expect(getInput()).toHaveAttribute('aria-invalid', 'true');
        });

        it('should set aria-describedby on the input pointing to the messages container', () => {
          const messagesContainer = byQa('dt-checkbox-validation-messages');

          expect(messagesContainer?.id).toBeTruthy();
          expect(getInput()).toHaveAttribute('aria-describedby', messagesContainer?.id);
          expect(getInput()).toHaveAccessibleDescription('Error');
        });
      });

      describe('When no validation messages are provided', () => {
        beforeEach(() => {
          renderCheckbox();
        });

        it('should not set aria-invalid on the input', () => {
          expect(getInput()).not.toHaveAttribute('aria-invalid');
        });

        it('should not set aria-describedby on the input', () => {
          expect(getInput()).not.toHaveAttribute('aria-describedby');
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    customEventTests();

    describe('When indeterminate', () => {
      it('shows indeterminate visual state', () => {
        renderCheckbox({ indeterminate: true });

        expect(getInput()).toBePartiallyChecked();
      });

      describe('When clicking on an indeterminate checkbox', () => {
        it('should uncheck', async () => {
          const onCheckedChange = vi.fn();
          renderCheckbox({ indeterminate: true, onCheckedChange });

          await userEvent.click(getInput());

          expect(getInput()).not.toBeChecked();
          expect(getInput()).not.toBePartiallyChecked();
          expect(onCheckedChange).toHaveBeenCalledWith(false);
        });
      });
    });

    describe('Listener Tests', () => {
      describe('When there is a provided input listener', () => {
        describe('When the checkbox is clicked', () => {
          it('Should call input handler once', async () => {
            const onCheckedChange = vi.fn();
            renderCheckbox({ onCheckedChange });

            await userEvent.click(getInput());

            expect(onCheckedChange).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe('Group Context Tests', () => {
      let view: RenderResult | undefined;

      const _setGroupContext = (
        selectedValues: unknown[],
        groupDisabled = false,
        groupValidationState: ValidationMessageType | null = null,
        props: DtCheckboxProps = {},
      ) => {
        const groupContext = {
          name: MOCK_GROUP_NAME,
          selectedValues,
          disabled: groupDisabled,
          validationState: groupValidationState,
        };
        const ui = inGroup(checkboxWith({ description: 'Description', ...props }), groupContext);
        if (view) view.rerender(ui);
        else view = render(ui);
      };

      beforeEach(() => {
        view = undefined;
      });

      describe('When a group name is provided', () => {
        it('sets the input name', () => {
          _setGroupContext([]);

          expect(getInput()).toHaveAttribute('name', MOCK_GROUP_NAME);
        });
      });

      describe('When the group is disabled', () => {
        it('should disable input', () => {
          _setGroupContext([], true);

          expect(getInput()).toBeDisabled();
        });
      });

      describe('When the Checkbox value is in checked', () => {
        it('should be checked', () => {
          _setGroupContext([baseProps.value]);

          expect(getInput()).toBeChecked();
        });
      });

      describe('When the Checkbox value is not in checked', () => {
        it('should not be checked', () => {
          _setGroupContext([]);

          expect(getInput()).not.toBeChecked();
        });
      });

      describe('When the checkbox group has a validation state', () => {
        beforeEach(() => {
          _setGroupContext([], false, VALIDATION_MESSAGE_TYPES.POSITIVE);
        });

        it('has validation classes', () => {
          expect(getInput()).toHaveClass(CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.POSITIVE]);
        });

        describe('When the checkbox has a validation state', () => {
          it('has validation classes', () => {
            _setGroupContext([], false, VALIDATION_MESSAGE_TYPES.POSITIVE, {
              validationState: VALIDATION_MESSAGE_TYPES.WARNING,
            });

            expect(getInput()).toHaveClass(CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.POSITIVE]);
            expect(getInput()).not.toHaveClass(CHECKBOX_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.WARNING]);
          });
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    const extendedProps = { label: 'Label', description: 'Description' } satisfies DtCheckboxProps;

    const _setupChildClassTest = (childClassName: 'inputClass' | 'labelClass' | 'descriptionClass') => {
      const { container } = renderCheckbox({ ...extendedProps, [childClassName]: MOCK_CUSTOM_CLASS });
      return container.querySelector(`.${MOCK_CUSTOM_CLASS}`);
    };

    describe('When an input class is provided', () => {
      it('should apply custom class to child', () => {
        expect(_setupChildClassTest('inputClass')).toBe(getInput());
      });
    });

    describe('When an label class is provided', () => {
      it('should apply custom class to child', () => {
        expect(_setupChildClassTest('labelClass')).toBe(getLabel());
      });
    });

    describe('When an description class is provided', () => {
      it('should apply custom class to child', () => {
        expect(_setupChildClassTest('descriptionClass')).toBe(getDescription());
      });
    });

    describe('When label child props are provided', () => {
      it('should have provided child prop', () => {
        renderCheckbox({ ...extendedProps, labelChildProps: MOCK_CHILD_PROPS });

        expect(getLabel()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When description child props are provided', () => {
      it('should have provided child prop', () => {
        renderCheckbox({ ...extendedProps, descriptionChildProps: MOCK_CHILD_PROPS });

        expect(getDescription()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When attrs are provided', () => {
      it('should have provided child prop', () => {
        // An attribute DtCheckboxProps doesn't declare, as Vue's test passes one its props don't.
        renderCheckbox({ ...extendedProps, ...MOCK_CHILD_PROPS });

        expect(getInput()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When a class is provided', () => {
      it('should include the class', () => {
        const { container } = renderCheckbox({ ...extendedProps, className: MOCK_ROOT_CLASS });

        expect(container.firstElementChild).toHaveClass(MOCK_ROOT_CLASS);
        expect(getInput()).not.toHaveClass(MOCK_ROOT_CLASS);
      });
    });
  });
});

// React-only: where the port had to choose, beyond what Vue's tests check.
describe('DtCheckbox, React only', () => {
  it('runs the consumer\'s onChange and onInput after onCheckedChange, and an indeterminate one already reset', async () => {
    const calls: string[] = [];
    renderCheckbox({
      indeterminate: true,
      onCheckedChange: checked => calls.push(`onCheckedChange ${checked}`),
      onChange: event => calls.push(`onChange ${event.currentTarget.checked}`),
      onInput: event => calls.push(`onInput ${event.currentTarget.checked}`),
    });
    await userEvent.click(getInput());

    expect(calls).toEqual(['onCheckedChange false', 'onChange false', 'onInput false']);
    expect(getInput()).not.toBeChecked();
  });

  it('keeps its own checked state in a group with no selection (InputGroup, RadioGroup)', async () => {
    const onCheckedChange = vi.fn();
    render(inGroup(checkboxWith({ defaultChecked: true, onCheckedChange }), { name: MOCK_GROUP_NAME }));
    expect(getInput()).toBeChecked();

    await userEvent.click(getInput());
    expect(getInput()).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it('shows the description slot when it\'s passed at all, as Vue\'s $slots.description does, but not a null one', () => {
    const { rerender } = renderCheckbox({ description: false });
    expect(getDescription()).not.toBeNull();
    expect(getDescription()).toBeEmptyDOMElement();

    rerender(checkboxWith({ description: null }));
    expect(getDescription()).toBeNull();
  });

  it('falls back to label only when the label slot renders nothing: an empty string stays', () => {
    const { rerender } = render(checkboxWith({ children: '' }));
    expect(getLabel()).toHaveTextContent(/^$/);

    rerender(checkboxWith({ children: false }));
    expect(getLabel()).toHaveTextContent(baseProps.label);
  });

  it('warns about a missing label once per instance, on mount, as Vue does in mounted()', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(<StrictMode><DtCheckbox value="v" /></StrictMode>);
    rerender(<StrictMode><DtCheckbox value="v" label="Labelled" /></StrictMode>);
    rerender(<StrictMode><DtCheckbox value="v" /></StrictMode>);

    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('doesn\'t warn when a label goes away after mount', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = renderCheckbox();
    rerender(<DtCheckbox value="v" label="" />);

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('counts label content passed at all, as Vue\'s $slots.default does', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<DtCheckbox value="v">{null}</DtCheckbox>);

    expect(warn).not.toHaveBeenCalled();
    expect(getLabel()).not.toBeNull();
    warn.mockRestore();
  });
});
