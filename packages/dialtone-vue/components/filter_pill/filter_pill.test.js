import { mount } from '@vue/test-utils';
import DtFilterPill from './filter_pill.vue';
import { DtPopover } from '@/components/popover';
import { DtDropdown } from '@/components/dropdown';
import { DtListItem } from '@/components/list_item';
import { DtTooltipDirective } from '@/directives/tooltip_directive';

const MOCK_OPEN_STUB = vi.fn();
const MOCK_CLEAR_STUB = vi.fn();

const MOCK_LABEL = 'Filter pill label';
const MOCK_CONTENT = 'Popover content';
const MOCK_DEFAULT_SLOT = 'Default slot';
const MOCK_START_TOOLTIP_TEXT = 'Start tooltip text';
const MOCK_END_TOOLTIP_TEXT = 'End tooltip text';

const MOCK_TEST_FILTERS = [
  { name: 'Test item 1' },
  { name: 'Test item 2' },
];

const baseProps = {
  modelValue: MOCK_TEST_FILTERS,
};
const baseSlots = {};

const baseAttrs = {
  onOpen: MOCK_OPEN_STUB,
  onClear: MOCK_CLEAR_STUB,
};

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};

describe('DtFilterPill Tests', function () {
  let wrapper;
  let button;
  let label;
  let icon;
  let clearButton;
  let content;

  const updateWrapper = () => {
    wrapper = mount(DtFilterPill, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        stubs: {
          transition: false,
        },
        plugins: [DtTooltipDirective],
      },
      attrs: { ...baseAttrs, ...mockAttrs },
      attachTo: document.body,
    });

    button = wrapper.find('[data-qa="dt-filter-pill__button"]');
    label = button.find('[data-qa="dt-button-label"]');
    icon = wrapper.find('[data-qa="dt-filter-pill__icon"]');
    clearButton = wrapper.find('[data-qa="dt-filter-pill__clear-button"]');
  };

  beforeEach(() => { updateWrapper(); });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
    vi.restoreAllMocks();
    wrapper.unmount();
    document.body.innerHTML = '';
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('Should render the component', () => {
        expect(wrapper.exists()).toBe(true);
        expect(button.exists()).toBe(true);
        expect(icon.exists()).toBe(true);
      });

      it('Should not render clear button', () => {
        expect(clearButton.exists()).toBe(false);
      });
    });

    describe('When an active element is passed', () => {
      it('Should have active styling', () => {
        mockProps = { modelValue: [{ name: 'Test item 1', active: true }] };

        updateWrapper();

        expect(button.classes().includes('d-filter-pill--selected')).toBe(true);
      });
    });

    describe('When disabled is set', () => {
      it('Should have disabled attribute', () => {
        mockProps = { disabled: true };

        updateWrapper();

        expect(button.attributes()).toHaveProperty('disabled');
      });
    });

    describe('When label is set', () => {
      it('Should render custom label', () => {
        mockProps = { label: MOCK_LABEL };

        updateWrapper();

        expect(label.html()).toContain(MOCK_LABEL);
      });
    });

    describe('When hide-clear is set', () => {
      it('Should not render clear button', () => {
        mockProps = {
          modelValue: [{ name: 'Test item 1', active: true }],
          hideClear: true,
        };

        updateWrapper();

        expect(clearButton.exists()).toBe(false);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When filter pill is clicked', () => {
      beforeEach(async () => {
        await button.trigger('click');
      });

      it('Should call listener once', () => {
        expect(MOCK_OPEN_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit "open" event', () => {
        expect(wrapper.emitted()).toHaveProperty('open');
      });
    });

    describe('When clear button  is clicked', () => {
      beforeEach(async () => {
        mockProps = {
          modelValue: [{ name: 'Test item 1', active: true }],
        };

        updateWrapper();

        await clearButton.trigger('click');
      });

      it('Should call listener once', () => {
        expect(MOCK_CLEAR_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit "clear" event', () => {
        expect(wrapper.emitted()).toHaveProperty('clear');
      });
    });
  });

  describe('Tooltip Prop Tests', () => {
    describe('When startTooltipText is set', () => {
      it('Should bind the tooltip directive on the main button', () => {
        mockProps = { startTooltipText: MOCK_START_TOOLTIP_TEXT };

        updateWrapper();

        expect(button.attributes('data-dt-tooltip-id')).toBeDefined();
      });
    });

    describe('When endTooltipText is set', () => {
      it('Should use it as clear button aria-label', () => {
        mockProps = {
          modelValue: [{ name: 'Test item 1', active: true }],
          endTooltipText: MOCK_END_TOOLTIP_TEXT,
        };

        updateWrapper();
        clearButton = wrapper.find('[data-qa="dt-filter-pill__clear-button"]');

        expect(clearButton.attributes('aria-label')).toBe(MOCK_END_TOOLTIP_TEXT);
      });

      it('Should bind the tooltip directive on the clear button', () => {
        mockProps = {
          modelValue: [{ name: 'Test item 1', active: true }],
          endTooltipText: MOCK_END_TOOLTIP_TEXT,
        };

        updateWrapper();
        clearButton = wrapper.find('[data-qa="dt-filter-pill__clear-button"]');

        expect(clearButton.attributes('data-dt-tooltip-id')).toBeDefined();
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When default slot is set', () => {
      it('Should render custom label', () => {
        mockSlots = { default: MOCK_DEFAULT_SLOT };

        updateWrapper();

        expect(wrapper.html()).toContain(MOCK_DEFAULT_SLOT);
      });
    });

    describe('When default slot is set with scoped bindings', () => {
      it('Should provide label, activeFilters, and activeFilterList', () => {
        const slotBindings = {};
        mockProps = {
          label: 'Teams',
          modelValue: [
            { name: 'Team A', active: true },
            { name: 'Team B', active: true },
            { name: 'Team C' },
          ],
        };
        mockSlots = {
          default: (props) => {
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
          startIcon: '<svg data-qa="mock-start-icon" />',
        };

        updateWrapper();

        expect(wrapper.find('[data-qa="mock-start-icon"]').exists()).toBe(true);
      });
    });

    describe('When content slot is set', () => {
      beforeEach(async () => {
        mockSlots = { content: MOCK_CONTENT };

        updateWrapper();

        await button.trigger('click');

        content = wrapper
          .findComponent(DtPopover)
          .findComponent({ ref: 'content' });
      });

      it('Renders the popover content', async () => {
        expect(content.exists()).toBe(true);
      });

      it('Renders the content on the popover', async () => {
        expect(content.html()).toContain(MOCK_CONTENT);
      });
    });
  });

  describe('Dropdown Mode Tests', () => {
    const MOCK_DROPDOWN_FILTERS = [
      { name: 'Option A' },
      { name: 'Option B' },
      { name: 'Option C' },
    ];

    describe('When useDropdown is true', () => {
      beforeEach(() => {
        mockProps = {
          useDropdown: true,
          modelValue: MOCK_DROPDOWN_FILTERS,
        };

        updateWrapper();
      });

      it('Should render DtDropdown', () => {
        expect(wrapper.findComponent(DtDropdown).exists()).toBe(true);
      });

      it('Should render the pill button', () => {
        expect(wrapper.find('[data-qa="dt-filter-pill__button"]').exists()).toBe(true);
      });

      it('Should render DtListItem elements when dropdown is open', async () => {
        await wrapper.find('[data-qa="dt-filter-pill__button"]').trigger('click');

        const listItems = wrapper.findAllComponents(DtListItem);

        expect(listItems).toHaveLength(MOCK_DROPDOWN_FILTERS.length);
      });
    });

    describe('When a list item is clicked in dropdown mode', () => {
      it('Should set the clicked filter active and deactivate others', async () => {
        const filters = [
          { name: 'Option A' },
          { name: 'Option B' },
          { name: 'Option C' },
        ];

        mockProps = {
          useDropdown: true,
          modelValue: filters,
        };

        updateWrapper();

        await wrapper.find('[data-qa="dt-filter-pill__button"]').trigger('click');

        const listItems = wrapper.findAllComponents(DtListItem);
        await listItems[1].trigger('click');

        expect(filters[0].active).toBe(false);
        expect(filters[1].active).toBe(true);
        expect(filters[2].active).toBe(false);
      });
    });

    describe('When content slot is used in dropdown mode', () => {
      it('Should render custom content instead of default list items', async () => {
        mockProps = {
          useDropdown: true,
          modelValue: MOCK_DROPDOWN_FILTERS,
        };
        mockSlots = { content: 'Custom dropdown content' };

        updateWrapper();

        await wrapper.find('[data-qa="dt-filter-pill__button"]').trigger('click');

        const dropdownList = document.body.querySelector('[data-qa="dt-dropdown-list-wrapper"]');

        expect(dropdownList.textContent).toContain('Custom dropdown content');
        expect(wrapper.findAllComponents(DtListItem)).toHaveLength(0);
      });
    });

    describe('When clear button is clicked in dropdown mode', () => {
      it('Should emit clear event and reset filters', async () => {
        const filters = [
          { name: 'Option A', active: true },
          { name: 'Option B' },
        ];

        mockProps = {
          useDropdown: true,
          modelValue: filters,
        };

        updateWrapper();

        const clearBtn = wrapper.find('[data-qa="dt-filter-pill__clear-button"]');
        await clearBtn.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('clear');
        expect(filters[0].active).toBeUndefined();
      });
    });
  });
});
