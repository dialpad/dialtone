import { StrictMode, type ReactElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DtRadio, type DtRadioProps } from './Radio';
import { TEXT_KIND_MODIFIERS, TEXT_SIZE_MAP, TEXT_STRENGTH_MODIFIERS, TEXT_TONE_MODIFIERS } from '../Text/TextConstants';
import { InputGroupContext, type GroupContext } from '../../common/input';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { RADIO_INPUT_VALIDATION_CLASSES } from './RadioConstants';

const MOCK_VALUE = 'Value';
const MOCK_GROUP_NAME = 'radioGroup';
const MOCK_ROOT_CLASS = 'custom-class';
const MOCK_SLOT_LABEL = 'My Slotted Label';
const MOCK_SLOT_DESCRIPTION = 'My Slotted Description';
const MOCK_CUSTOM_CLASS = 'my-custom-class';
const MOCK_PROP_NAME = 'some';
const MOCK_PROP_VALUE = 'prop';
const MOCK_CHILD_PROPS = { [MOCK_PROP_NAME]: MOCK_PROP_VALUE };

const baseProps = {
  label: 'My Radio Label',
  value: MOCK_VALUE,
} satisfies DtRadioProps;

const radioWith = (props: DtRadioProps = {}) => <DtRadio {...baseProps} {...props} />;

const inGroup = (ui: ReactElement, groupContext: GroupContext, setGroupValue: (value: unknown) => void = () => {}) => (
  <InputGroupContext value={{ groupContext, setGroupValue }}>{ui}</InputGroupContext>
);

const renderRadio = (props: DtRadioProps = {}) => render(radioWith(props));

const byQa = (qa: string) => document.querySelector<HTMLElement>(`[data-qa="${qa}"]`);
const getInput = () => screen.getByRole('radio');
const getLabel = () => byQa('radio-label');
const getDescription = () => byQa('radio-description');

describe('DtRadio Tests', () => {
  describe('Presentation Tests', () => {
    describe('When the radio renders', () => {
      it('should exist', () => {
        renderRadio();

        expect(screen.getByRole('radio', { name: baseProps.label })).toBeInTheDocument();
      });

      it('should have radio group class', () => {
        renderRadio();

        expect(getInput().closest('label')).toHaveClass('d-radio-group');
      });

      describe('Radio Input Tests', () => {
        beforeEach(() => {
          renderRadio();
        });

        it('should exist', () => {
          expect(getInput()).toBeInTheDocument();
        });

        it('should have type radio', () => {
          expect(getInput()).toHaveAttribute('type', 'radio');
        });

        it('should not be checked', () => {
          expect(getInput()).not.toBeChecked();
        });
      });

      describe('Radio Label Tests', () => {
        beforeEach(() => {
          renderRadio();
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
    });

    describe('When showLabel is false', () => {
      beforeEach(() => {
        renderRadio({ showLabel: false });
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
        renderRadio();

        expect(getInput()).not.toHaveAttribute('aria-label');
      });
    });

    describe('When labelStrength is provided', () => {
      it('should override the default label strength', () => {
        renderRadio({ labelStrength: 'bold' });

        expect(getLabel()).toHaveClass(TEXT_STRENGTH_MODIFIERS.bold);
        expect(getLabel()).not.toHaveClass(TEXT_STRENGTH_MODIFIERS.normal);
      });

      it('should default to normal strength when not provided', () => {
        renderRadio();

        expect(getLabel()).toHaveClass(TEXT_STRENGTH_MODIFIERS.normal);
      });
    });

    describe('When labelSize is provided', () => {
      it('should override the default label size', () => {
        renderRadio({ labelSize: 'lg' });

        expect(getLabel()).toHaveClass(`${TEXT_KIND_MODIFIERS.label}--lg`);
        expect(getLabel()).not.toHaveClass(`${TEXT_KIND_MODIFIERS.label}--${TEXT_SIZE_MAP[300]}`);
      });
    });

    describe('When a description is provided', () => {
      it('should exist', () => {
        renderRadio({ description: 'Description' });

        expect(getDescription()).toBeInTheDocument();
        expect(getDescription()?.textContent).toBe('Description');
      });
    });

    describe('When a validation state is provided', () => {
      describe('When warning', () => {
        it('has validation classes', () => {
          renderRadio({ description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.WARNING });

          expect(getInput()).toHaveClass(RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.WARNING]);
        });
      });

      describe('When Critical', () => {
        it('has validation classes', () => {
          renderRadio({ description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.CRITICAL });

          expect(getInput()).toHaveClass(RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.CRITICAL]);
        });
      });

      describe('When Positive', () => {
        it('has validation classes', () => {
          renderRadio({ description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.POSITIVE });

          expect(getInput()).toHaveClass(RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.POSITIVE]);
        });
      });
    });

    describe('When checked', () => {
      it('should be checked', () => {
        renderRadio({ checked: true });

        expect(getInput()).toBeChecked();
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        renderRadio({ disabled: true });
      });

      it('should disable input', () => {
        expect(getInput()).toBeDisabled();
      });

      it('should have disabled class', () => {
        expect(getInput().closest('label')).toHaveClass('d-radio-group--disabled');
      });

      it('should render label DtText with tone="disabled"', () => {
        expect(getLabel()).toHaveClass('d-text', TEXT_TONE_MODIFIERS.disabled);
        expect(getLabel()).not.toHaveClass(TEXT_TONE_MODIFIERS.primary);
      });

      describe('When clicked', () => {
        // Vue's test clicks the root, which never selects the radio, so it passes enabled too. The input is clicked here.
        it('no events are emitted', async () => {
          cleanup(); // the describe's beforeEach rendered a radio without the handler
          const onChange = vi.fn();
          const { rerender } = renderRadio({ disabled: true, onChange });

          await userEvent.click(getInput());
          expect(onChange).not.toHaveBeenCalled();

          rerender(radioWith({ onChange }));
          await userEvent.click(getInput());
          expect(onChange).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('When slot(s) are provided', () => {
      describe('When a slotted label is provided', () => {
        it('should have slotted label', () => {
          renderRadio({ children: MOCK_SLOT_LABEL });

          expect(getLabel()?.textContent).toBe(MOCK_SLOT_LABEL);
        });
      });

      describe('When a slotted description is provided', () => {
        it('should have slotted description', () => {
          renderRadio({ description: <>{MOCK_SLOT_DESCRIPTION}</> });

          expect(getDescription()?.textContent).toBe(MOCK_SLOT_DESCRIPTION);
        });
      });

      describe('When slotted label and description are provided', () => {
        beforeEach(() => {
          renderRadio({ children: MOCK_SLOT_LABEL, description: <>{MOCK_SLOT_DESCRIPTION}</> });
        });

        it('should have slotted label', () => {
          expect(getLabel()?.textContent).toBe(MOCK_SLOT_LABEL);
        });

        it('should have slotted description', () => {
          expect(getDescription()?.textContent).toBe(MOCK_SLOT_DESCRIPTION);
        });
      });
    });

    describe('Extendability Tests', () => {
      const extendedProps = { label: 'Label', description: 'Description' } satisfies DtRadioProps;

      const _setupChildClassTest = (childClassName: 'inputClass' | 'labelClass' | 'descriptionClass') => {
        const { container } = renderRadio({ ...extendedProps, [childClassName]: MOCK_CUSTOM_CLASS });
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
          renderRadio({ ...extendedProps, labelChildProps: MOCK_CHILD_PROPS });

          expect(getLabel()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
        });
      });

      describe('When description child props are provided', () => {
        it('should have provided child prop', () => {
          renderRadio({ ...extendedProps, descriptionChildProps: MOCK_CHILD_PROPS });

          expect(getDescription()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
        });
      });

      describe('When attrs are provided', () => {
        it('should have provided child prop', () => {
          // An attribute DtRadioProps doesn't declare, as Vue's test passes one its props don't.
          renderRadio({ label: 'Label', ...MOCK_CHILD_PROPS });

          expect(getInput()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
        });
      });
    });
  });

  describe('Reactivity Tests', () => {
    // Vue triggers `change` directly; a click is what a user does, and fires it.
    describe('Custom Event Tests', () => {
      describe('When the radio is selected', () => {
        it('should emit update:modelValue event with Value', async () => {
          const values: string[] = [];
          renderRadio({ onChange: event => values.push(event.target.value) });

          await userEvent.click(getInput());

          expect(values).toEqual([MOCK_VALUE]);
        });
      });
    });

    describe('Listener Tests', () => {
      describe('When there is a provided modelValue listener', () => {
        describe('When the radio is clicked', () => {
          it('Should call update:modelValue handler once', async () => {
            const onChange = vi.fn();
            renderRadio({ onChange });

            await userEvent.click(getInput());

            expect(onChange).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });

  describe('When there is a Radio Group Context', () => {
    const groupContext = (selectedValue: unknown, disabled = false, validationState: GroupContext['validationState'] = null) => ({
      name: MOCK_GROUP_NAME,
      selectedValue,
      disabled,
      validationState,
    });

    describe('When the value matches the Radio', () => {
      it('sets the input name', () => {
        render(inGroup(radioWith({ description: 'Description' }), groupContext(MOCK_VALUE)));

        expect(getInput()).toHaveAttribute('name', MOCK_GROUP_NAME);
      });

      it('should be checked', () => {
        render(inGroup(radioWith({ description: 'Description' }), groupContext(MOCK_VALUE)));

        expect(getInput()).toBeChecked();
      });

      describe('When the radio group is disabled', () => {
        describe('When the radio is clicked', () => {
          it('no update:modelValue events are emitted', async () => {
            const onChange = vi.fn();
            const setGroupValue = vi.fn();
            render(inGroup(
              radioWith({ description: 'Description', onChange }),
              groupContext(`not${MOCK_VALUE}`, true),
              setGroupValue,
            ));

            await userEvent.click(getInput());

            expect(getInput()).toBeDisabled();
            expect(onChange).not.toHaveBeenCalled();
            expect(setGroupValue).not.toHaveBeenCalled();
          });
        });
      });

      describe('When the radio group has a validation state', () => {
        it('has validation classes', () => {
          render(inGroup(
            radioWith({ description: 'Description' }),
            groupContext(MOCK_VALUE, false, VALIDATION_MESSAGE_TYPES.POSITIVE),
          ));

          expect(getInput()).toHaveClass(RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.POSITIVE]);
        });

        describe('When the radio has a validation state', () => {
          it('has validation classes', () => {
            // The radio's own state differs from the group's: the group's wins.
            render(inGroup(
              radioWith({ description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.CRITICAL }),
              groupContext(MOCK_VALUE, false, VALIDATION_MESSAGE_TYPES.WARNING),
            ));

            expect(getInput()).toHaveClass(RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.WARNING]);
            expect(getInput()).not.toHaveClass(RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.CRITICAL]);
          });
        });
      });
    });

    describe('When the value does not match the Radio', () => {
      beforeEach(() => {
        render(inGroup(radioWith({ description: 'Description' }), groupContext(`not${MOCK_VALUE}`)));
      });

      it('sets the input name', () => {
        expect(getInput()).toHaveAttribute('name', MOCK_GROUP_NAME);
      });

      it('should not be checked', () => {
        expect(getInput()).not.toBeChecked();
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('ARIA validation wiring', () => {
      describe('When a critical validation message is provided', () => {
        beforeEach(() => {
          renderRadio({ messages: [{ message: 'Error', type: VALIDATION_MESSAGE_TYPES.CRITICAL }] });
        });

        it('should set aria-invalid on the input', () => {
          expect(getInput()).toHaveAttribute('aria-invalid', 'true');
        });

        it('should set aria-describedby on the input pointing to the messages container', () => {
          const messagesContainer = byQa('dt-radio-validation-messages');

          expect(messagesContainer?.id).toBeTruthy();
          expect(getInput()).toHaveAttribute('aria-describedby', messagesContainer?.id);
          expect(getInput()).toHaveAccessibleDescription('Error');
        });
      });

      describe('When no validation messages are provided', () => {
        beforeEach(() => {
          renderRadio();
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

  describe('Extendability Tests', () => {
    describe('When a class is provided', () => {
      it('should include the class', () => {
        const { container } = renderRadio({ className: MOCK_ROOT_CLASS });

        expect(container.firstElementChild).toHaveClass(MOCK_ROOT_CLASS);
        expect(getInput()).not.toHaveClass(MOCK_ROOT_CLASS);
      });
    });
  });
});

// React-only: where the port had to choose, beyond what Vue's tests check.
describe('DtRadio, React only', () => {
  it('runs the consumer\'s onChange after reporting to the group, with the value in event.target.value', async () => {
    const calls: string[] = [];
    const setGroupValue = (value: unknown) => calls.push(`group ${value}`);
    render(inGroup(
      radioWith({ onChange: event => calls.push(`onChange ${event.target.value}`) }),
      { name: MOCK_GROUP_NAME, selectedValue: 'other' },
      setGroupValue,
    ));
    await userEvent.click(getInput());

    expect(calls).toEqual([`group ${MOCK_VALUE}`, `onChange ${MOCK_VALUE}`]);
  });

  it('keeps a grouped radio with a numeric value checked once the group holds its string', () => {
    render(inGroup(radioWith({ value: 2 }), { name: MOCK_GROUP_NAME, selectedValue: '2' }));

    expect(getInput()).toBeChecked();
  });

  it('passes the consumer\'s onFocus and onBlur to the input, which Vue drops as declared emits', async () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    renderRadio({ onFocus, onBlur });

    await userEvent.tab();
    expect(getInput()).toHaveFocus();
    expect(onFocus).toHaveBeenCalledTimes(1);

    await userEvent.tab();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('keeps a standalone radio checked after a click, and unchecks it when a sibling of its name is picked', async () => {
    render(
      <>
        <DtRadio name="pick" value="a" label="A" />
        <DtRadio name="pick" value="b" label="B" />
      </>,
    );
    const [a, b] = screen.getAllByRole('radio');

    await userEvent.click(a);
    expect(a).toBeChecked();

    await userEvent.click(b);
    expect(b).toBeChecked();
    expect(a).not.toBeChecked();
  });

  it('starts checked from defaultChecked', () => {
    renderRadio({ defaultChecked: true });

    expect(getInput()).toBeChecked();
  });

  it('doesn\'t report to the group when its selected value already equals the radio\'s', async () => {
    const setGroupValue = vi.fn();
    render(inGroup(radioWith(), { name: MOCK_GROUP_NAME, selectedValue: MOCK_VALUE }, setGroupValue));

    await userEvent.click(getInput());

    expect(setGroupValue).not.toHaveBeenCalled();
  });

  it('reports a click inside a group to the group, with the radio\'s value', async () => {
    const setGroupValue = vi.fn();
    render(inGroup(radioWith(), { name: MOCK_GROUP_NAME, selectedValue: 'other' }, setGroupValue));

    await userEvent.click(getInput());

    expect(setGroupValue).toHaveBeenCalledWith(MOCK_VALUE);
  });

  it('doesn\'t put `indeterminate` on the input', () => {
    renderRadio({ indeterminate: true });

    expect(getInput()).not.toHaveAttribute('indeterminate');
  });

  it('reports a missing label once per instance, on mount, as Vue does in mounted()', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    const { rerender } = render(<StrictMode><DtRadio value="v" /></StrictMode>);
    rerender(<StrictMode><DtRadio value="v" label="Labelled" /></StrictMode>);
    rerender(<StrictMode><DtRadio value="v" /></StrictMode>);

    expect(info).toHaveBeenCalledTimes(1);
    info.mockRestore();
  });

  it('doesn\'t report a missing label when an aria-label is passed', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    render(<DtRadio value="v" aria-label="Named" />);

    expect(info).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: 'Named' })).toBeInTheDocument();
    info.mockRestore();
  });

  it('shows the description slot when it\'s passed at all, as Vue\'s $slots.description does, but not a null one', () => {
    const { rerender } = renderRadio({ description: false });
    expect(getDescription()).not.toBeNull();
    expect(getDescription()).toBeEmptyDOMElement();

    rerender(radioWith({ description: null }));
    expect(getDescription()).toBeNull();
  });

  it('falls back to label only when the label slot renders nothing: an empty string stays', () => {
    const { rerender } = render(radioWith({ children: '' }));
    expect(getLabel()).toHaveTextContent(/^$/);

    rerender(radioWith({ children: false }));
    expect(getLabel()).toHaveTextContent(baseProps.label);
  });
});
