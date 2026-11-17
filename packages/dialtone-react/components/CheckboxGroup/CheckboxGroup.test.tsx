import { StrictMode, createRef, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useInputGroupContext } from '../../common/input';
import { DtCheckbox } from '../Checkbox';
import { CheckboxesDecorator } from './CheckboxesDecorator';
import { DtCheckboxGroup, type DtCheckboxGroupProps } from './CheckboxGroup';

const MOCK_LEGEND = 'My Legend';
const MOCK_SELECTED_VALUE = 'apple';
const MOCK_SELECTED_VALUE2 = 'other';

const baseProps = { name: 'test-checkbox-group' } satisfies DtCheckboxGroupProps;
const baseAttrs = { 'aria-label': 'Test Checkbox Group' };

type ValueChangeMock = ReturnType<typeof vi.fn<(value: unknown[]) => void>>;

/**
 * Stands in for Vue's `wrapper.vm.provideObj`: renders what the group provides to the checkboxes in it, so the tests
 * read it through the DOM.
 */
function ContextProbe () {
  const { groupContext } = useInputGroupContext();
  return (
    <output data-qa="group-context">
      {JSON.stringify({ selectedValues: groupContext.selectedValues, disabled: groupContext.disabled })}
    </output>
  );
}

const providedContext = () => JSON.parse(screen.getByTestId('group-context').textContent ?? '');

const renderGroup = (props: Partial<DtCheckboxGroupProps> = {}, children?: ReactNode) =>
  render(
    <DtCheckboxGroup {...baseProps} {...baseAttrs} {...props}>
      {children}
    </DtCheckboxGroup>,
  );

const getCheckboxGroup = () => screen.getByTestId('checkbox-group');
const getLegend = () => screen.queryByTestId('checkbox-group-legend');
const getMessagesContainer = () => screen.getByTestId('checkbox-group-messages');
const getMessages = () => screen.queryAllByTestId('validation-message');

describe('Checkbox Group Tests', () => {
  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('should have a checkbox group', () => {
        renderGroup();

        expect(getCheckboxGroup()).toBeInTheDocument();
      });

      it('should not have a legend', () => {
        renderGroup();

        expect(getLegend()).not.toBeInTheDocument();
      });

      it('should not have checkboxes', () => {
        renderGroup();

        expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
      });

      it('should not have validation messages', () => {
        renderGroup();

        expect(getMessages()).toHaveLength(0);
      });
    });

    describe('When checkboxes are provided', () => {
      describe('When the checkbox group renders', () => {
        it('should have checkboxes', () => {
          renderGroup({}, <CheckboxesDecorator />);

          expect(screen.getAllByRole('checkbox')).toHaveLength(3);
        });
      });
    });

    describe('When a legend is provided via prop', () => {
      beforeEach(() => {
        renderGroup({ legend: MOCK_LEGEND });
      });

      it('should have a legend', () => {
        expect(getLegend()).toBeInTheDocument();
      });

      it('should have text matching the provided legend', () => {
        expect(getLegend()?.textContent?.trim()).toBe(MOCK_LEGEND);
      });
    });

    describe('When a legend is provided via slot', () => {
      describe('When a legend is not provided via prop', () => {
        beforeEach(() => {
          renderGroup({ legend: MOCK_LEGEND });
        });

        it('should have a legend', () => {
          expect(getLegend()).toBeInTheDocument();
        });

        it('should have text matching the provided legend', () => {
          expect(getLegend()?.textContent?.trim()).toBe(MOCK_LEGEND);
        });
      });

      // `legend` is Vue's prop and slot in one, so there's only one to show.
      describe('When a legend is also provided via prop', () => {
        beforeEach(() => {
          renderGroup({ legend: MOCK_LEGEND });
        });

        it('should have a legend', () => {
          expect(getLegend()).toBeInTheDocument();
        });

        it('should have text matching the provided legend', () => {
          expect(getLegend()?.textContent?.trim()).toBe(MOCK_LEGEND);
        });
      });
    });

    describe('When validation messages are provided', () => {
      describe('When the validation messages are shown', () => {
        it('should show validation messages', () => {
          renderGroup({ messages: ['Error'] });

          expect(getMessagesContainer()).toBeInTheDocument();
        });
      });

      describe('When the validation messages are hidden', () => {
        it('should hide validation messages', () => {
          renderGroup({ messages: ['Error'], showMessages: false });

          expect(getMessages()).toHaveLength(0);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    const selectCheckbox = async (value: string) => {
      await userEvent.click(getCheckboxGroup().querySelector<HTMLInputElement>(`[value="${value}"]`)!);
    };

    const renderCheckboxes = (props: Partial<DtCheckboxGroupProps> = {}) =>
      renderGroup(props, (
        <>
          <CheckboxesDecorator />
          <ContextProbe />
        </>
      ));

    describe('When initial selected values are provided', () => {
      describe('When another checkbox is not selected', () => {
        it('should update provide object', () => {
          renderCheckboxes({ value: [MOCK_SELECTED_VALUE] });

          expect(providedContext().selectedValues).toContain(MOCK_SELECTED_VALUE);
        });
      });

      describe('When another checkbox is selected', () => {
        let onValueChange: ValueChangeMock;

        beforeEach(async () => {
          onValueChange = vi.fn<(value: unknown[]) => void>();
          // Vue's `modelValue` follows the group's own changes through its internal state; `defaultValue` does the same.
          renderCheckboxes({ defaultValue: [MOCK_SELECTED_VALUE], onValueChange });
          await selectCheckbox(MOCK_SELECTED_VALUE2);
        });

        it('should update provide object', () => {
          expect(providedContext().selectedValues).toEqual([MOCK_SELECTED_VALUE, MOCK_SELECTED_VALUE2]);
        });

        it('should emit update:modelValue event', () => {
          expect(onValueChange.mock.calls[0][0]).toEqual([MOCK_SELECTED_VALUE, MOCK_SELECTED_VALUE2]);
        });
      });
    });

    describe('When a checkbox is selected', () => {
      let onValueChange: ValueChangeMock;

      beforeEach(async () => {
        onValueChange = vi.fn<(value: unknown[]) => void>();
        renderCheckboxes({ onValueChange });
        await selectCheckbox(MOCK_SELECTED_VALUE);
      });

      it('should update provide object', () => {
        expect(providedContext().selectedValues).toContain(MOCK_SELECTED_VALUE);
      });

      it('should emit update:modelValue event', () => {
        expect(onValueChange.mock.calls[0][0]).toEqual([MOCK_SELECTED_VALUE]);
      });
    });

    describe('When the checkbox group is disabled', () => {
      describe('When a checkbox is selected', () => {
        it('does not emit update:modelValue event', async () => {
          const onValueChange = vi.fn<(value: unknown[]) => void>();
          renderCheckboxes({ disabled: true, onValueChange });

          await selectCheckbox(MOCK_SELECTED_VALUE);

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
    const extendableProps = { legend: MOCK_LEGEND, messages: ['Error'] };

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
        renderGroup({ ...extendableProps, [MOCK_PROP_NAME]: MOCK_PROP_VALUE } as Partial<DtCheckboxGroupProps>);

        expect(getCheckboxGroup()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });
  });

  describe('React Tests', () => {
    it('renders a node passed as legend, as Vue renders the legend slot', () => {
      renderGroup({ legend: <em>Slotted</em> });

      expect(getLegend()).toContainElement(screen.getByText('Slotted'));
    });

    it('checks the checkboxes whose value is selected', () => {
      renderGroup({ value: [MOCK_SELECTED_VALUE, MOCK_SELECTED_VALUE2] }, <CheckboxesDecorator />);

      expect(screen.getByRole('checkbox', { name: 'Apple' })).toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Banana' })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Other' })).toBeChecked();
    });

    it('keeps its own selection when uncontrolled and starts from defaultValue', async () => {
      renderGroup({ defaultValue: [MOCK_SELECTED_VALUE] }, (
        <>
          <CheckboxesDecorator />
          <ContextProbe />
        </>
      ));

      expect(providedContext().selectedValues).toEqual([MOCK_SELECTED_VALUE]);

      await userEvent.click(screen.getByRole('checkbox', { name: 'Banana' }));
      await userEvent.click(screen.getByRole('checkbox', { name: 'Apple' }));

      expect(providedContext().selectedValues).toEqual(['banana']);
    });

    it('follows value when controlled, reporting changes through onValueChange', async () => {
      const onValueChange = vi.fn<(value: unknown[]) => void>();
      renderGroup({ value: [MOCK_SELECTED_VALUE], onValueChange }, (
        <>
          <CheckboxesDecorator />
          <ContextProbe />
        </>
      ));

      await userEvent.click(screen.getByRole('checkbox', { name: 'Banana' }));

      expect(onValueChange).toHaveBeenCalledWith([MOCK_SELECTED_VALUE, 'banana']);
      expect(providedContext().selectedValues).toEqual([MOCK_SELECTED_VALUE]);
    });

    it('removes a value when its checkbox is unchecked', async () => {
      const onValueChange = vi.fn<(value: unknown[]) => void>();
      renderGroup({ defaultValue: [MOCK_SELECTED_VALUE, 'banana'], onValueChange }, <CheckboxesDecorator />);

      await userEvent.click(screen.getByRole('checkbox', { name: 'Apple' }));

      expect(onValueChange).toHaveBeenCalledWith(['banana']);
    });

    it('applies the group name and disabled state to the checkboxes in it', () => {
      renderGroup({ disabled: true }, <DtCheckbox value="a" label="A" />);

      expect(screen.getByRole('checkbox', { name: 'A' })).toHaveAttribute('name', baseProps.name);
      expect(screen.getByRole('checkbox', { name: 'A' })).toBeDisabled();
    });

    it('merges className and passes style and ref to the fieldset', () => {
      const ref = createRef<HTMLFieldSetElement>();
      renderGroup({ className: 'root-class', style: { color: 'red' }, ref });

      expect(getCheckboxGroup()).toHaveClass('d-input-group__fieldset', 'root-class');
      expect(getCheckboxGroup().style.color).toBe('red');
      expect(ref.current).toBe(getCheckboxGroup());
    });

    describe('QA Label Tests', () => {
      it('uses the data-qa overrides on the fieldset, legend and messages', () => {
        renderGroup({
          ...{ legend: MOCK_LEGEND, messages: ['Error'] },
          dataQaGroup: 'qa-group',
          dataQaGroupLegend: 'qa-legend',
          dataQaGroupMessages: 'qa-messages',
        });

        expect(screen.getByTestId('qa-group')).toBeInTheDocument();
        expect(screen.getByTestId('qa-legend')).toBeInTheDocument();
        expect(screen.getByTestId('qa-messages')).toBeInTheDocument();
      });
    });

    describe('When there is neither a legend nor an aria-label', () => {
      it('warns once, even in StrictMode', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const { rerender } = render(
          <StrictMode>
            <DtCheckboxGroup name="no-label" />
          </StrictMode>,
        );
        rerender(
          <StrictMode>
            <DtCheckboxGroup name="no-label" messages={['Error']} />
          </StrictMode>,
        );

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn).toHaveBeenCalledWith('It is expected that an aria-label is provided when there is no legend.');
        warn.mockRestore();
      });
    });
  });
});
