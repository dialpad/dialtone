import { StrictMode, createRef, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useInputGroupContext } from '../../common/input';
import { DtRadio } from '../Radio';
import { DtRadioGroup, type DtRadioGroupProps } from './RadioGroup';
import { RadiosDecorator } from './RadiosDecorator';

const MOCK_LEGEND = 'My Legend';
const MOCK_SELECTED_VALUE = 'kiwi';
const MOCK_CUSTOM_CLASS = 'my-custom-class';
const MOCK_PROP_NAME = 'some';
const MOCK_PROP_VALUE = 'prop';

const baseProps = { name: 'test-radio-group' } satisfies DtRadioGroupProps;
const baseAttrs = { 'aria-label': 'Test Radio Group' };

type ValueChangeMock = ReturnType<typeof vi.fn<(value: string | number) => void>>;

/** Stands in for Vue's `radios.vue` fixture, which needs DtRadio: two radios, pear and kiwi. */
function RadiosFixture () {
  return (
    <div>
      <DtRadio value="pear">Pear</DtRadio>
      <DtRadio value="kiwi">Kiwi</DtRadio>
    </div>
  );
}

/**
 * Stands in for Vue's `wrapper.vm.provideObj`: renders what the group provides to the radios in it, so the tests
 * read it through the DOM.
 */
function ContextProbe () {
  const { groupContext } = useInputGroupContext();
  return (
    <output data-qa="group-context">
      {JSON.stringify({
        selectedValue: groupContext.selectedValue,
        disabled: groupContext.disabled,
        value: groupContext.value,
      })}
    </output>
  );
}

const providedContext = () => JSON.parse(screen.getByTestId('group-context').textContent ?? '');

const renderGroup = (props: Partial<DtRadioGroupProps> = {}, children?: ReactNode) =>
  render(
    <DtRadioGroup {...baseProps} {...baseAttrs} {...props}>
      {children}
    </DtRadioGroup>,
  );

const getRadioGroup = () => screen.getByTestId('radio-group');
const getLegend = () => screen.queryByTestId('radio-group-legend');
const getMessagesContainer = () => screen.getByTestId('radio-group-messages');
const getMessages = () => screen.queryAllByTestId('validation-message');

describe('DtRadioGroup Tests', () => {
  describe('Presentation Tests', () => {
    describe('When the radio group renders', () => {
      it('should have a radio group', () => {
        renderGroup();

        expect(getRadioGroup()).toBeInTheDocument();
      });

      it('should not have a legend', () => {
        renderGroup();

        expect(getLegend()).not.toBeInTheDocument();
      });

      it('should not have radios', () => {
        renderGroup();

        expect(screen.queryAllByRole('radio')).toHaveLength(0);
      });

      it('should not have validation messages', () => {
        renderGroup();

        expect(getMessages()).toHaveLength(0);
      });
    });

    describe('When a legend is provided', () => {
      describe('When the legend is provided via prop', () => {
        describe('When the radio group renders', () => {
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

      // `legend` is Vue's prop and slot in one, so a node is the slot.
      describe('When the legend is provided via slot', () => {
        describe('When the radio group renders', () => {
          beforeEach(() => {
            renderGroup({ legend: <>{MOCK_LEGEND}</> });
          });

          it('should have a legend', () => {
            expect(getLegend()).toBeInTheDocument();
          });

          it('should have text matching the provided legend', () => {
            expect(getLegend()?.textContent?.trim()).toBe(MOCK_LEGEND);
          });
        });
      });
    });

    describe('When radios are provided', () => {
      describe('When the radio group renders', () => {
        it('should have radios', () => {
          renderGroup({}, <RadiosFixture />);

          expect(screen.getAllByRole('radio')).toHaveLength(2);
        });
      });
    });

    describe('When validation messages are provided', () => {
      describe('When the radio group renders', () => {
        it('should have validation messages', () => {
          renderGroup({ messages: ['Error'] });

          expect(getMessages()).toHaveLength(1);
        });
      });
    });
  });

  describe('Reactivity Tests', () => {
    const renderRadios = (props: Partial<DtRadioGroupProps> = {}) =>
      renderGroup(props, (
        <>
          <RadiosFixture />
          <ContextProbe />
        </>
      ));

    describe('When an initial modelValue is provided', () => {
      it('updates provide object', () => {
        renderRadios({ value: MOCK_SELECTED_VALUE });

        expect(providedContext().selectedValue).toBe(MOCK_SELECTED_VALUE);
      });
    });

    describe('When a radio is selected', () => {
      it('emits update:modelValue event', async () => {
        const onValueChange = vi.fn<(value: string | number) => void>();
        renderRadios({ onValueChange });

        await userEvent.click(getRadioGroup().querySelector<HTMLInputElement>(`[value="${MOCK_SELECTED_VALUE}"]`)!);

        expect(onValueChange.mock.calls[0][0]).toBe(MOCK_SELECTED_VALUE);
      });
    });

    describe('When the radio group is disabled', () => {
      describe('When a radio is selected', () => {
        it('does not emit update:modelValue event', async () => {
          const onValueChange: ValueChangeMock = vi.fn<(value: string | number) => void>();
          renderRadios({ disabled: true, onValueChange });

          await userEvent.click(getRadioGroup().querySelector<HTMLInputElement>(`[value="${MOCK_SELECTED_VALUE}"]`)!);

          expect(onValueChange).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    const extendableProps = { legend: 'My Radio Group', messages: ['Error'] };

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

    describe('When legendChildProps are provided', () => {
      it('should have provided child prop', () => {
        renderGroup({ ...extendableProps, legendChildProps: { [MOCK_PROP_NAME]: MOCK_PROP_VALUE } });

        expect(getLegend()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When messagesChildProps are provided', () => {
      it('should have provided child prop', () => {
        renderGroup({ ...extendableProps, messagesChildProps: { [MOCK_PROP_NAME]: MOCK_PROP_VALUE } });

        expect(getMessagesContainer()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When attrs are provided', () => {
      it('should have provided child prop', () => {
        renderGroup({ [MOCK_PROP_NAME]: MOCK_PROP_VALUE } as Partial<DtRadioGroupProps>);

        expect(getRadioGroup()).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });
  });

  describe('React Tests', () => {
    it('checks the radio whose value is selected', () => {
      renderGroup({ value: 'banana' }, <RadiosDecorator />);

      expect(screen.getByRole('radio', { name: 'Apple' })).not.toBeChecked();
      expect(screen.getByRole('radio', { name: 'Banana' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Other' })).not.toBeChecked();
    });

    it('keeps its own selection when uncontrolled and starts from defaultValue', async () => {
      renderGroup({ defaultValue: 'apple' }, (
        <>
          <RadiosDecorator />
          <ContextProbe />
        </>
      ));

      expect(providedContext().selectedValue).toBe('apple');

      await userEvent.click(screen.getByRole('radio', { name: 'Banana' }));

      expect(providedContext().selectedValue).toBe('banana');
      expect(screen.getByRole('radio', { name: 'Banana' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Apple' })).not.toBeChecked();
    });

    it('follows value when controlled, reporting changes through onValueChange', async () => {
      const onValueChange = vi.fn<(value: string | number) => void>();
      renderGroup({ value: 'apple', onValueChange }, <RadiosDecorator />);

      await userEvent.click(screen.getByRole('radio', { name: 'Banana' }));

      expect(onValueChange).toHaveBeenCalledWith('banana');
      expect(screen.getByRole('radio', { name: 'Apple' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Banana' })).not.toBeChecked();
    });

    it('applies the group name and disabled state to the radios in it', () => {
      renderGroup({ disabled: true }, <DtRadio value="a" label="A" />);

      expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('name', baseProps.name);
      expect(screen.getByRole('radio', { name: 'A' })).toBeDisabled();
    });

    it('does not provide the InputGroup value to the radios', () => {
      renderGroup({ value: 'apple' }, <ContextProbe />);

      expect(providedContext()).toEqual({ selectedValue: 'apple', disabled: false });
    });

    it('merges className and passes style and ref to the fieldset', () => {
      const ref = createRef<HTMLFieldSetElement>();
      renderGroup({ className: 'root-class', style: { color: 'red' }, ref });

      expect(getRadioGroup()).toHaveClass('d-input-group__fieldset', 'root-class');
      expect(getRadioGroup().style.color).toBe('red');
      expect(ref.current).toBe(getRadioGroup());
    });

    it('provides the group context to radios in the legend', async () => {
      const onValueChange = vi.fn();
      renderGroup(
        { value: 'apple', onValueChange, legend: <DtRadio value="apple">Apple</DtRadio> },
        <DtRadio value="pear">Pear</DtRadio>,
      );
      expect(screen.getByRole('radio', { name: 'Apple' })).toBeChecked();
      await userEvent.click(screen.getByRole('radio', { name: 'Pear' }));
      expect(onValueChange).toHaveBeenCalledWith('pear');
    });

    describe('QA Label Tests', () => {
      it('uses the data-qa overrides on the fieldset, legend and messages', () => {
        renderGroup({
          legend: MOCK_LEGEND,
          messages: ['Error'],
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
            <DtRadioGroup name="no-label" />
          </StrictMode>,
        );
        rerender(
          <StrictMode>
            <DtRadioGroup name="no-label" messages={['Error']} />
          </StrictMode>,
        );

        expect(warn).toHaveBeenCalledTimes(1);
        expect(warn).toHaveBeenCalledWith('It is expected that an aria-label is provided when there is no legend.');
        warn.mockRestore();
      });
    });
  });
});
