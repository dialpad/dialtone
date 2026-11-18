import { act, cleanup, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import { finishTransitions } from '../../tests/helpers/transition';
import {
  DtFilterPill,
  type DtFilterPillFilter,
  type DtFilterPillLabelScope,
  type DtFilterPillProps,
} from './FilterPill';

const MOCK_OPEN_STUB = vi.fn();
const MOCK_CLEAR_STUB = vi.fn();

const MOCK_LABEL = 'Filter pill label';
const MOCK_CONTENT = 'Popover content';
const MOCK_DEFAULT_SLOT = 'Default slot';
const MOCK_START_TOOLTIP_TEXT = 'Start tooltip text';
const MOCK_END_TOOLTIP_TEXT = 'End tooltip text';

const MOCK_TEST_FILTERS: DtFilterPillFilter[] = [
  { name: 'Test item 1' },
  { name: 'Test item 2' },
];

const baseProps: Partial<DtFilterPillProps> = {
  value: MOCK_TEST_FILTERS,
};
const baseSlots: Partial<DtFilterPillProps> = {};

// Vue's emitted() records what each emit carried; these stand in for it.
const MOCK_VALUE_CHANGE_STUB = vi.fn();
const MOCK_APPLY_STUB = vi.fn();

const baseAttrs: Partial<DtFilterPillProps> = {
  onOpen: MOCK_OPEN_STUB,
  onClear: MOCK_CLEAR_STUB,
  onValueChange: MOCK_VALUE_CHANGE_STUB,
  onApply: MOCK_APPLY_STUB,
};

let mockProps: Partial<DtFilterPillProps> = {};
let mockSlots: Partial<DtFilterPillProps> = {};
let mockAttrs: Partial<DtFilterPillProps> = {};

// Vue Test Utils' attachTo: the component mounts in a new element inside the target.
const attachTo = (target: Element) => target.appendChild(document.createElement('div'));

// Vue's trigger(): dispatches the event and waits for the update.
const click = async (element: Element | null | undefined) => {
  await act(async () => { if (element) fireEvent.click(element); });
};

const lastValue = () => MOCK_VALUE_CHANGE_STUB.mock.lastCall?.[0] as DtFilterPillFilter[] | undefined;

describe('DtFilterPill Tests', function () {
  let result: Pick<RenderResult, 'container' | 'unmount'> | undefined;
  let button: HTMLElement | null;
  let label: HTMLElement | null;
  let icon: HTMLElement | null;
  let clearButton: HTMLElement | null;
  let content: HTMLElement | null;

  const updateWrapper = () => {
    result?.unmount();
    result = render(
      <DtFilterPill
        {...baseProps}
        {...mockProps}
        {...baseSlots}
        {...mockSlots}
        {...baseAttrs}
        {...mockAttrs}
      />,
      { container: attachTo(document.body) },
    );

    button = screen.queryByTestId('dt-filter-pill__button');
    label = button?.querySelector('[data-qa="dt-button-label"]') ?? null;
    icon = screen.queryByTestId('dt-filter-pill__icon');
    clearButton = screen.queryByTestId('dt-filter-pill__clear-button');
  };

  beforeEach(() => { updateWrapper(); });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
    vi.restoreAllMocks();
    MOCK_OPEN_STUB.mockClear();
    MOCK_CLEAR_STUB.mockClear();
    MOCK_VALUE_CHANGE_STUB.mockClear();
    MOCK_APPLY_STUB.mockClear();
    result?.unmount();
    result = undefined;
    cleanup();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('Should render the component', () => {
        expect(screen.getByTestId('dt-filter-pill')).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(icon).toBeInTheDocument();
      });

      it('Should not render clear button', () => {
        expect(clearButton).toBeNull();
      });
    });

    describe('When an active element is passed', () => {
      it('Should have active styling', () => {
        mockProps = { value: [{ name: 'Test item 1', active: true }] };

        updateWrapper();

        expect(button).toHaveClass('d-filter-pill--selected');
      });
    });

    describe('When disabled is set', () => {
      it('Should have disabled attribute', () => {
        mockProps = { disabled: true };

        updateWrapper();

        expect(button).toHaveAttribute('disabled');
      });
    });

    describe('When label is set', () => {
      it('Should render custom label', () => {
        mockProps = { label: MOCK_LABEL };

        updateWrapper();

        expect(label?.innerHTML).toContain(MOCK_LABEL);
      });
    });

    describe('When showClear is false', () => {
      it('Should not render clear button', () => {
        mockProps = {
          value: [{ name: 'Test item 1', active: true }],
          showClear: false,
        };

        updateWrapper();

        expect(clearButton).toBeNull();
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When filter pill is clicked', () => {
      beforeEach(async () => {
        await click(button);
      });

      it('Should call listener once', () => {
        expect(MOCK_OPEN_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit "open" event', () => {
        expect(MOCK_OPEN_STUB).toHaveBeenCalledWith(true);
      });
    });

    describe('When clear button  is clicked', () => {
      beforeEach(async () => {
        mockProps = {
          value: [{ name: 'Test item 1', active: true }],
        };

        updateWrapper();

        await click(clearButton);
      });

      it('Should call listener once', () => {
        expect(MOCK_CLEAR_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit "clear" event', () => {
        expect(MOCK_CLEAR_STUB).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
      });
    });
  });

  describe('Tooltip Prop Tests', () => {
    describe('When startTooltipText is set', () => {
      it('Should bind the tooltip directive on the main button', () => {
        mockProps = { startTooltipText: MOCK_START_TOOLTIP_TEXT };

        updateWrapper();

        expect(button?.getAttribute('data-dt-tooltip-id')).toBeTruthy();
      });
    });

    describe('When endTooltipText is set', () => {
      it('Should use it as clear button aria-label', () => {
        mockProps = {
          value: [{ name: 'Test item 1', active: true }],
          endTooltipText: MOCK_END_TOOLTIP_TEXT,
        };

        updateWrapper();

        expect(clearButton).toHaveAttribute('aria-label', MOCK_END_TOOLTIP_TEXT);
      });

      it('Should bind the tooltip directive on the clear button', () => {
        mockProps = {
          value: [{ name: 'Test item 1', active: true }],
          endTooltipText: MOCK_END_TOOLTIP_TEXT,
        };

        updateWrapper();

        expect(clearButton?.getAttribute('data-dt-tooltip-id')).toBeTruthy();
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When default slot is set', () => {
      it('Should render custom label', () => {
        mockSlots = { children: MOCK_DEFAULT_SLOT };

        updateWrapper();

        expect(result?.container.innerHTML).toContain(MOCK_DEFAULT_SLOT);
      });
    });

    describe('When default slot is set with scoped bindings', () => {
      it('Should provide label, activeFilters, and activeFilterList', () => {
        const slotBindings: Partial<DtFilterPillLabelScope> = {};
        mockProps = {
          label: 'Teams',
          value: [
            { name: 'Team A', active: true },
            { name: 'Team B', active: true },
            { name: 'Team C' },
          ],
        };
        mockSlots = {
          children: (props) => {
            Object.assign(slotBindings, props);
            return 'custom label';
          },
        };

        updateWrapper();

        expect(slotBindings.label).toBe('Teams');
        expect(slotBindings.activeFilters).toEqual(['Team A', 'Team B']);
        expect(slotBindings.activeFilterList).toBe('Team A');
        expect(slotBindings.activeFilterOverflow).toBe('+1');
      });
    });

    describe('When startIcon slot is set', () => {
      it('Should render the start icon', () => {
        mockSlots = {
          startIcon: <svg data-qa="mock-start-icon" />,
        };

        updateWrapper();

        expect(screen.queryByTestId('mock-start-icon')).toBeInTheDocument();
      });
    });

    describe('When content slot is set', () => {
      beforeEach(async () => {
        mockSlots = { content: MOCK_CONTENT };

        updateWrapper();

        await click(button);

        content = document.querySelector('[data-qa="dt-popover-content"]');
      });

      it('Renders the popover content', async () => {
        expect(content).toBeInTheDocument();
      });

      it('Renders the content on the popover', async () => {
        expect(content?.innerHTML).toContain(MOCK_CONTENT);
      });
    });
  });

  describe('Dropdown Mode Tests', () => {
    const MOCK_DROPDOWN_FILTERS: DtFilterPillFilter[] = [
      { name: 'Option A' },
      { name: 'Option B' },
      { name: 'Option C' },
    ];

    const listItems = () => Array.from(
      document.querySelectorAll('[data-qa="dt-dropdown-list-wrapper"] [role="menuitem"]'),
    );

    describe('When useDropdown is true', () => {
      beforeEach(() => {
        mockProps = {
          useDropdown: true,
          value: MOCK_DROPDOWN_FILTERS,
        };

        updateWrapper();
      });

      // Vue finds the DtDropdown component; React looks for what it renders: an anchor that opens a menu.
      it('Should render DtDropdown', () => {
        expect(screen.getByTestId('dt-filter-pill__button')).toHaveAttribute('aria-haspopup', 'menu');
      });

      it('Should render the pill button', () => {
        expect(screen.queryByTestId('dt-filter-pill__button')).toBeInTheDocument();
      });

      it('Should render DtListItem elements when dropdown is open', async () => {
        await click(screen.getByTestId('dt-filter-pill__button'));

        expect(listItems()).toHaveLength(MOCK_DROPDOWN_FILTERS.length);
      });
    });

    describe('When a list item is clicked in dropdown mode', () => {
      it('Should set the clicked filter active and deactivate others', async () => {
        const filters: DtFilterPillFilter[] = [
          { name: 'Option A' },
          { name: 'Option B' },
          { name: 'Option C' },
        ];

        mockProps = {
          useDropdown: true,
          value: filters,
        };

        updateWrapper();

        await click(screen.getByTestId('dt-filter-pill__button'));

        await click(listItems()[1]);

        const updated = lastValue();

        expect(updated?.[0].active).toBe(false);
        expect(updated?.[1].active).toBe(true);
        expect(updated?.[2].active).toBe(false);
      });
    });

    describe('When content slot is used in dropdown mode', () => {
      it('Should render custom content instead of default list items', async () => {
        mockProps = {
          useDropdown: true,
          value: MOCK_DROPDOWN_FILTERS,
        };
        mockSlots = { content: 'Custom dropdown content' };

        updateWrapper();

        await click(screen.getByTestId('dt-filter-pill__button'));

        const dropdownList = document.body.querySelector('[data-qa="dt-dropdown-list-wrapper"]');

        expect(dropdownList?.textContent).toContain('Custom dropdown content');
        expect(listItems()).toHaveLength(0);
      });
    });

    describe('When clear button is clicked in dropdown mode', () => {
      it('Should emit clear event and reset filters', async () => {
        const filters: DtFilterPillFilter[] = [
          { name: 'Option A', active: true },
          { name: 'Option B' },
        ];

        mockProps = {
          useDropdown: true,
          value: filters,
        };

        updateWrapper();

        const clearBtn = screen.getByTestId('dt-filter-pill__clear-button');
        await click(clearBtn);

        expect(MOCK_CLEAR_STUB).toHaveBeenCalled();
        expect(MOCK_VALUE_CHANGE_STUB).toHaveBeenCalledWith([{ name: 'Option A' }, { name: 'Option B' }]);
        expect(lastValue()?.[0].active).toBeUndefined();
      });
    });
  });

  describe('Read Only Tests', () => {
    describe('When readOnly is true', () => {
      beforeEach(() => {
        mockProps = {
          readOnly: true,
          value: [{ name: 'Test item 1', active: true }],
        };

        updateWrapper();
      });

      it('Should add d-filter-pill--read-only class', () => {
        expect(screen.getByTestId('dt-filter-pill')).toHaveClass('d-filter-pill--read-only');
      });

      it('Should not open popover when clicked', async () => {
        await click(button);

        expect(MOCK_OPEN_STUB).not.toHaveBeenCalled();
      });

      it('Should suppress clear button even when filters are active', () => {
        expect(screen.queryByTestId('dt-filter-pill__clear-button')).toBeNull();
      });

      it('Should set aria-disabled on the primary button', () => {
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });
    });
  });

  describe('Deferred Selection Tests', () => {
    const MOCK_DEFERRED_FILTERS: DtFilterPillFilter[] = [
      { name: 'Item A' },
      { name: 'Item B' },
      { name: 'Item C' },
    ];

    describe('When deferSelection is true and popover is opened', () => {
      beforeEach(async () => {
        mockProps = {
          deferSelection: true,
          value: MOCK_DEFERRED_FILTERS.map(f => ({ ...f })),
        };

        updateWrapper();

        button = screen.getByTestId('dt-filter-pill__button');
        await click(button);
      });

      it('Should render footer with Cancel and Apply buttons', () => {
        const footer = document.querySelector('[data-qa="dt-filter-pill__deferred-footer"]');

        expect(footer).not.toBeNull();

        const cancelBtn = document.querySelector('[data-qa="dt-filter-pill__cancel-button"]');
        const applyBtn = document.querySelector('[data-qa="dt-filter-pill__apply-button"]');

        expect(cancelBtn).not.toBeNull();
        expect(applyBtn).not.toBeNull();
      });

      it('Should not emit update:modelValue when checkbox is toggled', async () => {
        const emitCount = MOCK_VALUE_CHANGE_STUB.mock.calls.length;

        const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        await click(checkboxes[0]);

        const newEmitCount = MOCK_VALUE_CHANGE_STUB.mock.calls.length;

        expect(checkboxes[0].checked).toBe(true);
        expect(newEmitCount).toBe(emitCount);
      });

      it('Should commit changes and emit apply when Apply is clicked', async () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        await click(checkboxes[0]);

        const applyBtn = document.querySelector('[data-qa="dt-filter-pill__apply-button"]');
        await click(applyBtn);

        expect(MOCK_APPLY_STUB).toHaveBeenCalled();
        expect(lastValue()?.[0].active).toBe(true);
      });

      it('Should close popover when Apply is clicked', async () => {
        const applyBtn = document.querySelector('[data-qa="dt-filter-pill__apply-button"]');
        await click(applyBtn);

        expect(MOCK_OPEN_STUB.mock.lastCall?.[0]).toBe(false);
      });

      it('Should discard changes and close when Cancel is clicked', async () => {
        const cancelBtn = document.querySelector('[data-qa="dt-filter-pill__cancel-button"]');
        await click(cancelBtn);

        expect(MOCK_OPEN_STUB.mock.lastCall?.[0]).toBe(false);
        expect(MOCK_APPLY_STUB).not.toHaveBeenCalled();
      });

      // React-only: Vue's test cancels without editing, so it can't tell a discarded draft from a kept one.
      it('Should discard an edited selection when Cancel is clicked', async () => {
        await click(document.querySelector('input[type="checkbox"]'));
        await click(document.querySelector('[data-qa="dt-filter-pill__cancel-button"]'));
        await finishTransitions();
        await click(button);

        const checkbox = document.querySelector<HTMLInputElement>('input[type="checkbox"]');

        expect(checkbox?.checked).toBe(false);
        expect(MOCK_VALUE_CHANGE_STUB).not.toHaveBeenCalled();
        expect(MOCK_APPLY_STUB).not.toHaveBeenCalled();
      });

      // Vue's test reads the label without changing anything, so it passes whatever the label shows. This one checks
      // an item first: the pending change mustn't reach the label.
      it('Should show committed state in pill label while popover is open', async () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        await click(checkboxes[0]);

        const labelEl = document.querySelector('.d-filter-pill__label');

        expect(labelEl?.textContent).not.toContain('Item A');
      });
    });

    describe('When deferSelection is false', () => {
      it('Should not render deferred footer', async () => {
        mockProps = {
          deferSelection: false,
          value: MOCK_DEFERRED_FILTERS.map(f => ({ ...f })),
        };

        updateWrapper();

        button = screen.getByTestId('dt-filter-pill__button');
        await click(button);

        const footer = document.querySelector('[data-qa="dt-filter-pill__deferred-footer"]');

        expect(footer).toBeNull();
      });
    });

    describe('When content slot is used with deferSelection', () => {
      it('Should provide apply, cancel, and pendingFilters bindings', async () => {
        const slotBindings: Record<string, unknown> = {};
        mockProps = {
          deferSelection: true,
          value: MOCK_DEFERRED_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          content: (props) => {
            Object.assign(slotBindings, props);
            return 'custom content';
          },
        };

        updateWrapper();

        button = screen.getByTestId('dt-filter-pill__button');
        await click(button);

        expect(slotBindings).toHaveProperty('apply');
        expect(slotBindings).toHaveProperty('cancel');
        expect(slotBindings).toHaveProperty('pendingFilters');
        expect(typeof slotBindings.apply).toBe('function');
        expect(typeof slotBindings.cancel).toBe('function');
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe.each([
      { mode: 'popover', props: {} },
      { mode: 'dropdown', props: { useDropdown: true, value: MOCK_TEST_FILTERS } },
    ])('ARIA attributes on the primary button ($mode mode)', ({ props }) => {
      beforeEach(() => {
        mockProps = props;
        updateWrapper();
      });

      it('Should have aria-haspopup', () => {
        expect(button?.getAttribute('aria-haspopup')).toBeTruthy();
      });

      it('Should have aria-expanded="false" by default', () => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });

      it('Should have aria-expanded="true" when open', async () => {
        await click(button);

        expect(button).toHaveAttribute('aria-expanded', 'true');
      });

      it('Should have aria-controls pointing to an id', () => {
        expect(button?.getAttribute('aria-controls')).toBeTruthy();
      });
    });

    describe('Keyboard navigation', () => {
      it.each(['ArrowDown', 'ArrowUp'])('Should open popover on %s', async (key) => {
        await act(async () => { if (button) fireEvent.keyDown(button, { key }); });

        expect(MOCK_OPEN_STUB.mock.calls[0][0]).toBe(true);
      });
    });

    describe('Checkbox group labelling', () => {
      it('Should have aria-label matching the label prop', async () => {
        mockProps = { label: MOCK_LABEL, value: MOCK_TEST_FILTERS };
        updateWrapper();
        await click(button);

        const checkboxGroup = document.querySelector('[data-qa="checkbox-group"]');

        expect(checkboxGroup?.getAttribute('aria-label')).toBe(MOCK_LABEL);
      });
    });

    describe('Clear button accessible name', () => {
      it('Should fall back to localized "Clear filter" when endTooltipText is empty', () => {
        mockProps = { value: [{ name: 'Test item 1', active: true }] };
        updateWrapper();

        expect(clearButton).toHaveAttribute('aria-label', 'Clear filter');
      });
    });

    describe('Checkbox group name', () => {
      it('Should use label prop as checkbox group name', async () => {
        mockProps = { label: 'Teams', value: MOCK_TEST_FILTERS };
        updateWrapper();
        await click(button);

        const checkbox = document.querySelector('input[type="checkbox"]');

        expect(checkbox?.getAttribute('name')).toBe('Teams');
      });

      it('Should fall back to "filter-pill" when no label is provided', async () => {
        mockProps = { value: MOCK_TEST_FILTERS };
        updateWrapper();
        await click(button);

        const checkbox = document.querySelector('input[type="checkbox"]');

        expect(checkbox?.getAttribute('name')).toBe('filter-pill');
      });
    });
  });

  describe('Overlay Class Props Tests', () => {
    // Vue reads DtPopover's props; React checks the element each one styles, with the popover open and a header and
    // footer to style.
    const POPOVER_ELEMENTS: Record<string, string> = {
      contentClass: '[data-qa="dt-popover-content"]',
      headerWrapperClass: '.d-popover__header',
      footerWrapperClass: '.d-popover__footer',
      dialogClass: '[data-qa="dt-popover"]',
    };

    describe('When popover class props are set', () => {
      it.each([
        ['popoverContentClass', 'contentClass', 'custom-content-class'],
        ['popoverHeaderClass', 'headerWrapperClass', 'custom-header-class'],
        ['popoverFooterClass', 'footerWrapperClass', 'custom-footer-class'],
        ['popoverDialogClass', 'dialogClass', 'custom-dialog-class'],
      ])('Should forward %s to DtPopover', async (propName, popoverPropName, className) => {
        mockProps = { [propName]: className };
        mockSlots = { headerContent: 'Header', footerContent: 'Footer' };

        updateWrapper();
        await click(button);

        expect(document.querySelector(POPOVER_ELEMENTS[popoverPropName])).toHaveClass(className);
      });
    });

    describe('When dropdownListClass is set', () => {
      it('Should forward dropdownListClass to DtDropdown', async () => {
        mockProps = {
          useDropdown: true,
          value: MOCK_TEST_FILTERS,
          dropdownListClass: 'custom-list-class',
        };

        updateWrapper();
        await click(button);

        expect(document.querySelector('[data-qa="dt-dropdown-list-wrapper"]')).toHaveClass('custom-list-class');
      });
    });
  });

  describe('Header and Footer Slot Tests', () => {
    describe('When footerContent slot is provided', () => {
      it('Should render custom footer instead of default Cancel/Apply', async () => {
        mockProps = {
          deferSelection: true,
          value: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          footerContent: 'Custom footer content',
        };

        updateWrapper();

        button = screen.getByTestId('dt-filter-pill__button');
        await click(button);

        const footer = document.querySelector('[data-qa="dt-filter-pill__deferred-footer"]');

        expect(footer).toBeNull();
        expect(document.body.textContent).toContain('Custom footer content');
      });

      it('Should render custom footer even when deferSelection is false', async () => {
        mockProps = {
          deferSelection: false,
          value: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          footerContent: 'Custom footer without defer',
        };

        updateWrapper();

        button = screen.getByTestId('dt-filter-pill__button');
        await click(button);

        expect(document.body.textContent).toContain('Custom footer without defer');
      });

      it('Should provide apply, cancel, and close bindings to footerContent slot', async () => {
        const slotBindings: Record<string, unknown> = {};
        mockProps = {
          deferSelection: true,
          value: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          footerContent: (props) => {
            Object.assign(slotBindings, props);
            return 'scoped footer';
          },
        };

        updateWrapper();

        button = screen.getByTestId('dt-filter-pill__button');
        await click(button);

        expect(typeof slotBindings.apply).toBe('function');
        expect(typeof slotBindings.cancel).toBe('function');
        expect(typeof slotBindings.close).toBe('function');
      });
    });

    describe('When headerContent slot is provided', () => {
      it('Should render header in popover mode', async () => {
        mockProps = {
          value: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          headerContent: 'Custom header content',
        };

        updateWrapper();

        button = screen.getByTestId('dt-filter-pill__button');
        await click(button);

        expect(document.body.textContent).toContain('Custom header content');
      });

      it('Should not render header in dropdown mode', async () => {
        mockProps = {
          useDropdown: true,
          value: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          headerContent: 'Should not appear',
        };

        updateWrapper();
        await click(button);

        expect(document.querySelector('[data-qa="dt-dropdown-list-wrapper"]')).toBeInTheDocument();
        expect(document.body.textContent).not.toContain('Should not appear');
      });
    });
  });

  // React-only: the port's own state, which Vue's tests reach through the emitted v-model.
  describe('Controlled and uncontrolled value', () => {
    it('Should keep its own filters when uncontrolled', async () => {
      mockProps = { value: undefined, defaultValue: [{ name: 'Test item 1', active: true }] };
      updateWrapper();

      await click(clearButton);

      expect(screen.queryByTestId('dt-filter-pill__clear-button')).toBeNull();
      expect(MOCK_VALUE_CHANGE_STUB).toHaveBeenCalledWith([{ name: 'Test item 1' }]);
    });

    it('Should follow the value when controlled', async () => {
      mockProps = { value: [{ name: 'Test item 1', active: true }] };
      updateWrapper();

      await click(clearButton);

      expect(screen.queryByTestId('dt-filter-pill__clear-button')).toBeInTheDocument();
    });

    it('Should close and report it when the popover is closed with Escape', async () => {
      await click(button);
      await finishTransitions();
      const dialog = document.querySelector('[data-qa="dt-popover"]');

      await act(async () => { if (dialog) fireEvent.keyDown(dialog, { key: 'Escape' }); });
      await finishTransitions();
      await act(async () => { await Promise.resolve(); });

      expect(MOCK_OPEN_STUB.mock.lastCall?.[0]).toBe(false);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
