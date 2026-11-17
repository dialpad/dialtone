import { StrictMode, createRef, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useInputGroupContext } from '../../common/input';
import type { InputGroupValue } from '../../common/input-group';
import { InputsDecorator } from './Decorators/Inputs';
import { DtInputGroup, type DtInputGroupProps } from './InputGroup';

const baseProps = {
  name: 'my-input-group',
} satisfies DtInputGroupProps;
type ValueChangeMock = ReturnType<typeof vi.fn<(value: InputGroupValue) => void>>;
const baseAttrs = {
  'aria-label': 'Test Input Group',
};

/**
 * Stands in for Vue's `wrapper.vm.provideObj`: renders what the group provides to the inputs in it, so the tests read
 * it through the DOM.
 */
function ContextProbe () {
  const { groupContext } = useInputGroupContext();
  return (
    <output data-qa="group-context">
      {JSON.stringify({ value: groupContext.value, disabled: groupContext.disabled })}
    </output>
  );
}

const providedContext = () => JSON.parse(screen.getByTestId('group-context').textContent ?? '');

const renderGroup = (props: Partial<DtInputGroupProps> = {}, children?: ReactNode) =>
  render(
    <DtInputGroup {...baseProps} {...baseAttrs} {...props}>
      {children}
    </DtInputGroup>,
  );

const getInputGroup = () => screen.getByTestId('input-group');
const getLegend = () => screen.queryByTestId('input-group-legend');
const getMessagesContainer = () => screen.getByTestId('input-group-messages');
const getMessages = () => screen.queryAllByTestId('validation-message');

describe('Input Group Tests', () => {
  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('should have a input group', () => {
        renderGroup();

        expect(getInputGroup()).toBeInTheDocument();
      });

      it('should not have a legend', () => {
        renderGroup();

        expect(getLegend()).not.toBeInTheDocument();
      });

      it('should not have inputs', () => {
        renderGroup();

        expect(screen.queryAllByRole('radio')).toHaveLength(0);
      });

      it('should not have validation messages', () => {
        renderGroup();

        expect(getMessages()).toHaveLength(0);
      });
    });

    describe('When inputs are provided', () => {
      describe('When the input group renders', () => {
        it('should have inputs', () => {
          renderGroup({}, <InputsDecorator />);

          expect(screen.getAllByRole('radio')).toHaveLength(3);
        });
      });
    });

    describe('When a legend is provided via prop', () => {
      beforeEach(() => {
        renderGroup({ legend: 'My Legend' });
      });

      it('should have a legend', () => {
        expect(getLegend()).toBeInTheDocument();
      });

      it('should have text matching the provided legend', () => {
        expect(getLegend()?.textContent?.trim()).toBe('My Legend');
      });
    });

    describe('When a legend is provided via slot', () => {
      describe('When a legend is not provided via prop', () => {
        beforeEach(() => {
          renderGroup({ legend: 'My Legend' });
        });

        it('should have a legend', () => {
          expect(getLegend()).toBeInTheDocument();
        });

        it('should have text matching the provided legend', () => {
          expect(getLegend()?.textContent?.trim()).toBe('My Legend');
        });
      });

      describe('When a legend is also provided via prop', () => {
        beforeEach(() => {
          renderGroup({ legend: 'A legend which should not be displayed' });
        });

        it('should have a legend', () => {
          expect(getLegend()).toBeInTheDocument();
        });

        it('should have text matching the provided legend', () => {
          expect(getLegend()?.textContent?.trim()).toBe('A legend which should not be displayed');
        });
      });
    });

    describe('When validation messages are provided', () => {
      describe('When the validation messages are shown', () => {
        beforeEach(() => {
          renderGroup({ messages: ['Error'] });
        });

        it('should have validation messages', () => {
          expect(getMessages()).toHaveLength(1);
        });

        it('should show validation messages', () => {
          expect(getMessages()[0]).toBeVisible();
        });
      });

      describe('When the validation messages are hidden', () => {
        beforeEach(() => {
          renderGroup({ messages: ['Error'], showMessages: false });
        });

        // The messages still reach the validation messages component, hidden: they still make the group invalid.
        it('should have validation messages', () => {
          expect(getInputGroup()).toHaveAttribute('aria-invalid', 'true');
          expect(getMessages()).toHaveLength(0);
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a critical validation message is provided', () => {
      beforeEach(() => {
        renderGroup({ messages: ['Error'] });
      });

      it('should set aria-invalid on the fieldset', () => {
        expect(getInputGroup()).toHaveAttribute('aria-invalid', 'true');
      });

      it('should set aria-describedby on the fieldset pointing to the messages container', () => {
        expect(getInputGroup().getAttribute('aria-describedby')).toBe(getMessagesContainer().getAttribute('id'));
      });
    });

    describe('When no validation messages are provided', () => {
      beforeEach(() => {
        renderGroup();
      });

      it('should not set aria-invalid on the fieldset', () => {
        expect(getInputGroup()).not.toHaveAttribute('aria-invalid');
      });

      it('should not set aria-describedby on the fieldset', () => {
        expect(getInputGroup()).not.toHaveAttribute('aria-describedby');
      });
    });
  });

  describe('Interactivity Tests', () => {
    const MOCK_SELECTED_VALUE = 'apple';

    const _selectInput = async (value: string) => {
      await userEvent.click(getInputGroup().querySelector<HTMLInputElement>(`[value="${value}"]`)!);
    };

    const renderInputs = (props: Partial<DtInputGroupProps> = {}) =>
      renderGroup(props, (
        <>
          <InputsDecorator />
          <ContextProbe />
        </>
      ));

    describe('When an initial value is provided', () => {
      describe('When an input is not selected', () => {
        it('updates provide object value', () => {
          renderInputs({ value: 'other' });

          expect(providedContext().value).toBe('other');
        });
      });

      describe('When an input is selected', () => {
        let onValueChange: ValueChangeMock;

        beforeEach(async () => {
          onValueChange = vi.fn<(value: InputGroupValue) => void>();
          renderInputs({ onValueChange });
          await _selectInput(MOCK_SELECTED_VALUE);
        });

        it('updates provide object value', () => {
          expect(providedContext().value).toBe(MOCK_SELECTED_VALUE);
        });

        it('should emit update:modelValue event', () => {
          expect(onValueChange.mock.calls[0][0]).toBe(MOCK_SELECTED_VALUE);
        });
      });
    });

    describe('When an input is selected', () => {
      let onValueChange: ValueChangeMock;

      beforeEach(async () => {
        onValueChange = vi.fn<(value: InputGroupValue) => void>();
        renderInputs({ onValueChange });
        await _selectInput(MOCK_SELECTED_VALUE);
      });

      it('updates provide object value', () => {
        expect(providedContext().value).toBe(MOCK_SELECTED_VALUE);
      });

      it('should emit update:modelValue event', () => {
        expect(onValueChange.mock.calls[0][0]).toBe(MOCK_SELECTED_VALUE);
      });
    });

    describe('When the input group is disabled', () => {
      let onValueChange: ValueChangeMock;

      beforeEach(() => {
        onValueChange = vi.fn<(value: InputGroupValue) => void>();
        renderInputs({ disabled: true, onValueChange });
      });

      it('updates provide object disabled', () => {
        expect(providedContext().disabled).toBe(true);
      });

      describe('When an input is selected', () => {
        it('does not emit update:modelValue event', async () => {
          await _selectInput(MOCK_SELECTED_VALUE);

          expect(onValueChange).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    const MOCK_CUSTOM_CLASS = 'my-custom-class';
    const MOCK_PROP_NAME = 'some';
    const MOCK_PROP_VALUE = 'prop';
    const MOCK_CHILD_PROPS = { [MOCK_PROP_NAME]: MOCK_PROP_VALUE };
    const extendableProps = { legend: 'My Legend', messages: ['Error'] };

    describe('When a legend class is provided', () => {
      it('should apply custom class to child', () => {
        renderGroup({ ...extendableProps, legendClass: MOCK_CUSTOM_CLASS });

        expect(document.querySelector(`.${MOCK_CUSTOM_CLASS}`)).toBe(getLegend());
      });
    });

    describe('When a messages class is provided', () => {
      it('should apply custom class to child', () => {
        renderGroup({ ...extendableProps, messagesClass: MOCK_CUSTOM_CLASS });

        expect(document.querySelector(`.${MOCK_CUSTOM_CLASS}`)).toBe(getMessagesContainer());
      });
    });

    describe('When legend child props are provided', () => {
      it('should have provided child prop', () => {
        renderGroup({ ...extendableProps, legendChildProps: MOCK_CHILD_PROPS });

        expect(getLegend()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When messages child props are provided', () => {
      it('should have provided child prop', () => {
        renderGroup({ ...extendableProps, messagesChildProps: MOCK_CHILD_PROPS });

        expect(getMessagesContainer()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When attrs are provided', () => {
      it('should have provided child prop', () => {
        renderGroup({ ...extendableProps, [MOCK_PROP_NAME]: MOCK_PROP_VALUE } as Partial<DtInputGroupProps>);

        expect(getInputGroup()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('QA Label Tests', () => {
      const MOCK_CUSTOM_QA_LABEL = 'custom-data-qa-label';

      describe('When a custom data-qa group label is provided', () => {
        it('should have applied custom qa label', () => {
          renderGroup({ ...extendableProps, dataQaGroup: MOCK_CUSTOM_QA_LABEL });

          expect(screen.getByTestId(MOCK_CUSTOM_QA_LABEL)).toBeInTheDocument();
        });
      });

      describe('When a custom data-qa group legend label is provided', () => {
        it('should have applied custom qa label', () => {
          renderGroup({ ...extendableProps, dataQaGroupLegend: MOCK_CUSTOM_QA_LABEL });

          expect(screen.getByTestId(MOCK_CUSTOM_QA_LABEL)).toBeInTheDocument();
        });
      });

      describe('When a custom data-qa group messages label is provided', () => {
        it('should have applied custom qa label', () => {
          renderGroup({ ...extendableProps, dataQaGroupMessages: MOCK_CUSTOM_QA_LABEL });

          expect(screen.getByTestId(MOCK_CUSTOM_QA_LABEL)).toBeInTheDocument();
        });
      });
    });
  });

  describe('React Tests', () => {
    it('renders a node passed as legend, as Vue renders the legend slot', () => {
      renderGroup({ legend: <em>Slotted</em> });

      expect(getLegend()).toContainElement(screen.getByText('Slotted'));
    });

    it('does not render a legend for empty content', () => {
      renderGroup({ legend: false });

      expect(getLegend()).not.toBeInTheDocument();
    });

    it('keeps its own value when uncontrolled and starts from defaultValue', async () => {
      renderGroup({ defaultValue: 'other' }, (
        <>
          <InputsDecorator />
          <ContextProbe />
        </>
      ));

      expect(providedContext().value).toBe('other');

      await userEvent.click(getInputGroup().querySelector<HTMLInputElement>('[value="banana"]')!);

      expect(providedContext().value).toBe('banana');
    });

    it('follows value when controlled, reporting changes through onValueChange', async () => {
      const onValueChange = vi.fn<(value: InputGroupValue) => void>();
      renderGroup({ value: 'other', onValueChange }, (
        <>
          <InputsDecorator />
          <ContextProbe />
        </>
      ));

      await userEvent.click(getInputGroup().querySelector<HTMLInputElement>('[value="banana"]')!);

      expect(onValueChange).toHaveBeenCalledWith('banana');
      expect(providedContext().value).toBe('other');
    });

    it('merges className and passes style and ref to the fieldset', () => {
      const ref = createRef<HTMLFieldSetElement>();
      renderGroup({ className: 'root-class', style: { color: 'red' }, ref });

      expect(getInputGroup()).toHaveClass('d-input-group__fieldset', 'root-class');
      expect(getInputGroup().style.color).toBe('red');
      expect(ref.current).toBe(getInputGroup());
    });

    it('does not render the disabled and name props on the fieldset', () => {
      renderGroup({ disabled: true });

      expect(getInputGroup()).not.toHaveAttribute('disabled');
      expect(getInputGroup()).not.toHaveAttribute('name');
    });

    describe('When there is neither a legend nor an aria-label', () => {
      it('warns once, even in StrictMode', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const { rerender } = render(
          <StrictMode>
            <DtInputGroup name="no-label" />
          </StrictMode>,
        );
        rerender(
          <StrictMode>
            <DtInputGroup name="no-label" messages={['Error']} />
          </StrictMode>,
        );

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn).toHaveBeenCalledWith('It is expected that an aria-label is provided when there is no legend.');
        warn.mockRestore();
      });
    });
  });
});
