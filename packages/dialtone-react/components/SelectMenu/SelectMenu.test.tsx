import { cleanup, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Mock, MockInstance } from 'vitest';
import {
  SELECT_SIZE_MODIFIERS,
  SELECT_STATE_MODIFIERS,
} from './SelectMenuConstants';
import { TEXT_STRENGTH_MODIFIERS } from '../Text/TextConstants';
import { DtSelectMenu, type DtSelectMenuProps } from './SelectMenu';

const MOCK_LABEL = 'Label';
const MOCK_DESCRIPTION = 'Description';
const MOCK_OPTIONS = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

const baseProps = {
  label: MOCK_LABEL,
  options: MOCK_OPTIONS,
} satisfies DtSelectMenuProps;
const baseAttrs = {
  name: 'select-menu',
} satisfies DtSelectMenuProps;
const SLOTTED_OPTIONS = (
  <>
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </>
);

let mockProps: DtSelectMenuProps = {};
let mockAttrs: DtSelectMenuProps = {};

const byQa = <T extends HTMLElement = HTMLElement>(qa: string) => document.querySelector<T>(`[data-qa="${qa}"]`);

describe('DtSelectMenu Tests', () => {
  let rerender: (props?: DtSelectMenuProps) => void;
  let onValueChange: Mock<NonNullable<DtSelectMenuProps['onValueChange']>>;
  let root: HTMLElement;
  let selectWrapper: HTMLElement | null;
  let select: HTMLSelectElement;
  let label: HTMLElement | null;
  let description: HTMLElement | null;
  let messages: HTMLElement | null;

  const query = () => {
    select = byQa<HTMLSelectElement>('dt-select')!;
    selectWrapper = byQa('dt-select-wrapper');
    label = byQa('dt-select-label');
    description = byQa('dt-select-description');
    messages = byQa('dt-select-messages');
  };

  const updateWrapper = () => {
    // Vue's updateWrapper mounts a fresh wrapper; unmount the previous one first.
    cleanup();
    onValueChange = vi.fn();
    const ui = (props: DtSelectMenuProps = {}) => (
      <DtSelectMenu
        {...baseProps}
        {...baseAttrs}
        {...mockProps}
        {...mockAttrs}
        {...props}
        onValueChange={onValueChange}
      />
    );
    const result = render(ui());
    root = result.container.firstElementChild as HTMLElement;
    rerender = (props = {}) => {
      result.rerender(ui(props));
      query();
    };
    query();
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with required content', () => {
      it('should render the provided label', () => {
        expect(label?.textContent).toBe(MOCK_LABEL);
      });

      it('should have the default label text class', () => {
        expect(label).toHaveClass('d-text-label--md');
      });

      it('should not render a description', () => {
        expect(description).toBeNull();
      });

      it('should render the select menu', () => {
        expect(select).toBeInTheDocument();
      });

      it('should have no size variant classes on select menu', () => {
        expect(selectWrapper?.classList.length).toBe(1);
      });

      it('should have no kind variant classes on select menu input', () => {
        expect(select.classList.length).toBe(1);
      });

      it('should render the select menu options', () => {
        MOCK_OPTIONS.forEach(option => {
          expect(select.querySelector(`[value="${option.value}"]`)).toBeTruthy();
        });
      });
      it('should not render any validation messages', () => {
        expect(messages?.querySelectorAll('[data-qa="validation-message"]').length).toBe(0);
      });
    });

    describe('When a label is not provided', () => {
      it('should not render a label', () => {
        mockProps = { label: '', options: MOCK_OPTIONS };

        updateWrapper();

        expect(label).toBeNull();
      });
    });

    describe('When showLabel is false', () => {
      beforeEach(() => {
        mockProps = { showLabel: false };

        updateWrapper();
      });

      it('should not render a label', () => {
        expect(label).toBeNull();
      });

      it('should set aria-label on the select', () => {
        expect(select).toHaveAttribute('aria-label', MOCK_LABEL);
      });
    });

    describe('When showLabel is true', () => {
      it('should not set aria-label on the select', () => {
        expect(select).not.toHaveAttribute('aria-label');
      });
    });

    describe('When a label is provided via slot', () => {
      it('should render the slotted label', () => {
        mockProps = { label: <>Slotted Label</> };

        updateWrapper();

        expect(label?.textContent).toBe('Slotted Label');
      });
    });

    describe('When a description is provided via prop', () => {
      beforeEach(() => {
        mockProps = { description: MOCK_DESCRIPTION };

        updateWrapper();
      });

      it('should render the provided description', () => {
        expect(description?.textContent).toBe(MOCK_DESCRIPTION);
      });

      it('should have no size variant classes on the description', () => {
        const sizeClasses = Array.from(description?.classList ?? []).filter(c => c.startsWith('d-description--'));
        expect(sizeClasses.length).toBe(0);
      });
    });

    describe('When a description is provided via slot', () => {
      it('should render the slotted description', () => {
        mockProps = { description: <>Slotted Description</> };

        updateWrapper();

        expect(description?.textContent).toBe('Slotted Description');
      });
    });

    describe('When options are provided via slot', () => {
      it('should render the select menu options', () => {
        mockProps = { children: SLOTTED_OPTIONS };

        updateWrapper();

        expect(select.querySelectorAll('option').length).toBe(2);
      });
    });

    describe('When a size is provided', () => {
      const MOCK_SIZE = 'lg';

      beforeEach(() => {
        mockProps = {
          description: MOCK_DESCRIPTION,
          size: MOCK_SIZE,
        };

        updateWrapper();
      });

      it('should have size variant class on the label', () => {
        expect(label).toHaveClass('d-text-label--lg');
      });

      it('should have DtText size on the description', () => {
        // DtText renders size sm of kind body as d-text-body--sm.
        expect(description).toHaveClass('d-text-body--sm');
      });

      it('should have size variant class on select menu', () => {
        expect(selectWrapper).toHaveClass(SELECT_SIZE_MODIFIERS[MOCK_SIZE]);
      });
    });

    describe('When size is numeric', () => {
      it('should have size variant class on select menu for numeric size 200', () => {
        mockProps = { size: 200 };

        updateWrapper();

        expect(selectWrapper).toHaveClass('d-select--sm');
      });
    });

    describe('When labelSize is provided', () => {
      it('should override the default label size', () => {
        mockProps = { labelSize: 'xs' };

        updateWrapper();

        expect(label).toHaveClass('d-text-label--xs');
        expect(label).not.toHaveClass('d-text-label--md');
      });

      it('should override the size-derived label size', () => {
        mockProps = { size: 'xl', labelSize: 'sm' };

        updateWrapper();

        expect(label).toHaveClass('d-text-label--sm');
        expect(label).not.toHaveClass('d-text-label--lg');
      });
    });

    describe('When labelStrength is provided', () => {
      it('should override the default label strength', () => {
        mockProps = { labelStrength: 'bold' };

        updateWrapper();

        expect(label).toHaveClass(TEXT_STRENGTH_MODIFIERS.bold);
      });

      it('should not set strength when not provided', () => {
        updateWrapper();

        Object.values(TEXT_STRENGTH_MODIFIERS).forEach(strengthClass => {
          expect(label).not.toHaveClass(strengthClass);
        });
      });
    });

    describe('When validation messages are provided', () => {
      beforeEach(() => {
        mockProps = { messages: ['Validation Message'] };

        updateWrapper();
      });

      describe('When validation messages are shown', () => {
        it('should have critical state class on select menu', () => {
          expect(select).toHaveClass(SELECT_STATE_MODIFIERS.critical);
        });

        it('should render validation message', () => {
          expect(messages?.querySelectorAll('[data-qa="validation-message"]').length).toBe(1);
        });

        it('should set aria-invalid on the select element', () => {
          expect(select).toHaveAttribute('aria-invalid', 'true');
        });

        it('should set aria-describedby on the select element pointing to the messages container', () => {
          expect(messages?.id).toBeTruthy();
          expect(select.getAttribute('aria-describedby')).toBe(messages?.id);
        });
      });

      describe('When validation messages are hidden', () => {
        beforeEach(() => {
          mockProps = { ...mockProps, showMessages: false };

          updateWrapper();
        });

        it('should have critical state class on select menu', () => {
          expect(select).toHaveClass(SELECT_STATE_MODIFIERS.critical);
        });

        it('should not render any validation messages', () => {
          expect(messages?.querySelectorAll('[data-qa="validation-message"]').length ?? 0).toBe(0);
        });

        it('should keep aria-invalid on the select element', () => {
          expect(select).toHaveAttribute('aria-invalid', 'true');
        });

        it('should not set aria-describedby on the select element', () => {
          expect(select).not.toHaveAttribute('aria-describedby');
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a description is provided', () => {
      it('label aria-details should match the id of the description', () => {
        mockProps = { description: MOCK_DESCRIPTION };

        updateWrapper();

        expect(description?.id).toBeTruthy();
        expect(label?.getAttribute('aria-details')).toBe(description?.id);
      });
    });

    describe('When a description is not provided', () => {
      describe('When aria-details are not provided', () => {
        it('label aria-details should not exist', () => {
          expect(label?.getAttribute('aria-details')).toBeFalsy();
        });
      });

      describe('When aria-details are provided', () => {
        it('label aria-details should match those provided by attrs', () => {
          mockAttrs = { 'aria-details': 'some-id' };

          updateWrapper();

          expect(label).toHaveAttribute('aria-details', 'some-id');
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When select menu value has changed', () => {
      const MOCK_SELECTED_VALUE = MOCK_OPTIONS[0].value;

      beforeEach(async () => {
        await userEvent.selectOptions(select, String(MOCK_SELECTED_VALUE));
      });

      it('should emit update:modelValue event', () => {
        expect(onValueChange).toHaveBeenCalledTimes(1);
        expect(onValueChange.mock.calls[0][0]).toBe(MOCK_SELECTED_VALUE.toString());
        expect(onValueChange.mock.calls[0][1].target).toBe(select);
      });
    });

    describe('When modelValue prop is set', () => {
      it('should set the select element value', () => {
        const MOCK_MODEL_VALUE = MOCK_OPTIONS[1].value;
        mockProps = { value: MOCK_MODEL_VALUE };

        updateWrapper();

        expect(select.value).toBe(MOCK_MODEL_VALUE.toString());
      });

      it('should update when modelValue prop changes', async () => {
        const INITIAL_VALUE = MOCK_OPTIONS[0].value;
        const UPDATED_VALUE = MOCK_OPTIONS[2].value;

        mockProps = { value: INITIAL_VALUE };
        updateWrapper();

        expect(select.value).toBe(INITIAL_VALUE.toString());

        rerender({ value: UPDATED_VALUE });

        expect(select.value).toBe(UPDATED_VALUE.toString());
      });
    });

    describe('When no option matches the value', () => {
      it('should show a blank select, as Vue does', () => {
        expect(select.value).toBe('');
        expect(select.selectedIndex).toBe(-1);
      });

      it('should keep a user selection when uncontrolled', async () => {
        await userEvent.selectOptions(select, '2');

        expect(select.value).toBe('2');
        expect(select.selectedIndex).toBe(1);
      });
    });

    describe('When a consumer change handler is provided', () => {
      it('should call it after reporting the new value', () => {
        const calls: string[] = [];
        mockAttrs = { onChange: () => calls.push('change') };
        updateWrapper();
        onValueChange.mockImplementation(() => calls.push('valueChange'));

        fireEvent.change(select, { target: { value: '3' } });

        expect(calls).toEqual(['valueChange', 'change']);
      });
    });
  });

  describe('Validation Tests', () => {
    let consoleErrorSpy: MockInstance<typeof console.error>;
    let consoleWarnSpy: MockInstance<typeof console.warn>;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error');
      consoleWarnSpy = vi.spyOn(console, 'warn');
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    describe('Size Validator', () => {
      describe('When provided size is in SELECT_SIZE_MODIFIERS', () => {
        it('passes custom prop validation', () => {
          mockProps = { size: 300 };

          updateWrapper();

          // The default size has no modifier class, and the label keeps its size.
          expect(selectWrapper?.className).toBe('d-select');
          expect(label).toHaveClass('d-text-label--md');
        });
      });

      describe('when provided size is not in SELECT_SIZE_MODIFIERS', () => {
        it('fails custom prop validation', () => {
          // @ts-expect-error an unknown size is rejected, as Vue's validator rejects it
          mockProps = { size: `NOT${SELECT_SIZE_MODIFIERS.md}` };

          updateWrapper();

          // An unknown size gets no modifier class.
          expect(selectWrapper?.className).toBe('d-select');
        });
      });
    });

    describe('Options Validation', () => {
      const MOCK_WARNING_MESSAGE = 'Options are expected to be provided via prop or slot';

      describe('When options are provided via prop', () => {
        it('should not have expected warning message', () => {
          updateWrapper();

          expect(console.warn).not.toBeCalledWith(MOCK_WARNING_MESSAGE);
        });

        describe('When updated options are empty', () => {
          it('should have expected warning message', () => {
            mockProps = { options: [] };

            updateWrapper();

            expect(consoleWarnSpy.mock.calls.length).toBeGreaterThan(0);
            expect(consoleWarnSpy.mock.calls[0]).toContain(MOCK_WARNING_MESSAGE);
          });

          it('should warn when options become empty after mount', () => {
            rerender({ options: [] });

            expect(consoleWarnSpy).toHaveBeenCalledWith(MOCK_WARNING_MESSAGE);
          });
        });
      });

      describe('When options are provided via slot', () => {
        it('should not have expected warning message\'', () => {
          mockProps = { options: undefined, children: SLOTTED_OPTIONS };

          updateWrapper();

          expect(console.warn).not.toBeCalledWith(MOCK_WARNING_MESSAGE);
          expect(select.querySelectorAll('option').length).toBe(2);
        });
      });

      describe('When options are not provided', () => {
        it('should have expected warning message', () => {
          mockProps = { options: undefined };

          updateWrapper();

          expect(consoleWarnSpy.mock.calls.length).toBeGreaterThan(0);
          expect(consoleWarnSpy.mock.calls[0]).toContain(MOCK_WARNING_MESSAGE);
        });
      });

      describe('When an option is invalid', () => {
        it('should warn as Vue\'s prop validator does', () => {
          // @ts-expect-error an option without a label is rejected
          mockProps = { options: [{ value: 1 }] };

          updateWrapper();

          expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid prop: custom validator check failed for prop "options".');
        });

        it('should warn, not throw, when an entry is null', () => {
          // @ts-expect-error a null entry is rejected
          mockProps = { options: [null], children: SLOTTED_OPTIONS };

          updateWrapper();

          expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid prop: custom validator check failed for prop "options".');
          expect(select.querySelectorAll('option').length).toBe(2);
        });
      });

      describe('When options is null', () => {
        it('renders the slotted options without warning, as Vue does', () => {
          mockProps = { options: null, children: SLOTTED_OPTIONS };

          updateWrapper();

          expect(consoleWarnSpy).not.toHaveBeenCalled();
          expect(select.querySelectorAll('option').length).toBe(2);
        });
      });
    });

    describe('Label Validation', () => {
      it('should inform when there is no label or aria-label', () => {
        const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
        mockProps = { label: '' };

        updateWrapper();

        expect(infoSpy).toHaveBeenCalledTimes(1);
        infoSpy.mockRestore();
      });
    });
  });

  describe('Extendability Tests', () => {
    let MOCK_ELEMENT: HTMLElement | null;
    const MOCK_CUSTOM_CLASS = 'my-custom-class';
    const MOCK_PROP_NAME = 'some';
    const MOCK_PROP_VALUE = 'prop';
    const MOCK_ROOT_CLASS = 'custom-class';

    describe('When a label class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { description: MOCK_DESCRIPTION, labelClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = byQa('dt-select-label');

        expect(MOCK_ELEMENT).not.toBeNull();
        expect(document.querySelector('.my-custom-class')).toBe(MOCK_ELEMENT);
      });
    });

    describe('When a description class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { description: MOCK_DESCRIPTION, descriptionClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = byQa('dt-select-description');

        expect(MOCK_ELEMENT).not.toBeNull();
        expect(document.querySelector('.my-custom-class')).toBe(MOCK_ELEMENT);
      });
    });

    describe('When a select class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { description: MOCK_DESCRIPTION, selectClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = byQa('dt-select-wrapper');

        expect(MOCK_ELEMENT).not.toBeNull();
        expect(document.querySelector('.my-custom-class')).toBe(MOCK_ELEMENT);
      });
    });

    describe('When an option class is provided', () => {
      it('should apply child class to each option', () => {
        mockProps = { optionClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        const options = select.querySelectorAll('option');

        expect(options.length).toBe(MOCK_OPTIONS.length);
        options.forEach(option => {
          expect(option).toHaveClass(MOCK_CUSTOM_CLASS);
        });
      });
    });

    describe('When label child props are provided', () => {
      it('should have provided child prop', () => {
        mockProps = { description: MOCK_DESCRIPTION, labelChildProps: { some: 'prop' } };

        updateWrapper();

        MOCK_ELEMENT = byQa('dt-select-label');

        expect(MOCK_ELEMENT).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When description child props are provided', () => {
      it('should have provided child prop', () => {
        mockProps = { description: MOCK_DESCRIPTION, descriptionChildProps: { some: 'prop' } };

        updateWrapper();

        MOCK_ELEMENT = byQa('dt-select-description');

        expect(MOCK_ELEMENT).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When option child props are provided', () => {
      it('should apply child props to each option', () => {
        mockProps = { optionChildProps: { some: 'prop' } };

        updateWrapper();

        const options = select.querySelectorAll('option');

        expect(options.length).toBe(MOCK_OPTIONS.length);
        options.forEach(option => {
          expect(option).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
        });
      });
    });

    describe('When attrs are provided', () => {
      it('attr should be set on element', () => {
        // An attribute DtSelectMenu doesn't declare, as Vue's test passes one.
        mockAttrs = { some: 'prop' } as DtSelectMenuProps;

        updateWrapper();

        MOCK_ELEMENT = select;

        expect(MOCK_ELEMENT).toHaveAttribute(MOCK_PROP_NAME, MOCK_PROP_VALUE);
      });
    });

    describe('When a class is provided', () => {
      it('should include the class', () => {
        mockAttrs = { className: MOCK_ROOT_CLASS };

        updateWrapper();

        expect(root).toHaveClass(MOCK_ROOT_CLASS);
      });
    });

    describe('When a ref is provided', () => {
      it('should point to the native select', () => {
        const ref = { current: null as HTMLSelectElement | null };
        mockAttrs = { ref };

        updateWrapper();

        expect(ref.current).toBe(select);
      });
    });
  });
});
