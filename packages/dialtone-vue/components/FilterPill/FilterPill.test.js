import { mount } from '@vue/test-utils';
import { h, nextTick, toRaw } from 'vue';
import { LocaleManager, RawBundleSource, MemoryStorageWrapper } from '@dialpad/i18n';
import { DialtoneLocalization } from '@/localization';
import enUS from '@/localization/en-US.ftl?raw';
import DtFilterPill from './FilterPill.vue';
import { DtPopover } from '@/components/Popover';
import { DtDropdown } from '@/components/Dropdown';
import { DtListItem } from '@/components/ListItem';
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

    describe('When showClear is false', () => {
      it('Should not render clear button', () => {
        mockProps = {
          modelValue: [{ name: 'Test item 1', active: true }],
          showClear: false,
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

        expect(clearButton.attributes('aria-label')).toBe(MOCK_END_TOOLTIP_TEXT);
      });

      it('Should bind the tooltip directive on the clear button', () => {
        mockProps = {
          modelValue: [{ name: 'Test item 1', active: true }],
          endTooltipText: MOCK_END_TOOLTIP_TEXT,
        };

        updateWrapper();

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

  describe('Read Only Tests', () => {
    describe('When readOnly is true', () => {
      beforeEach(() => {
        mockProps = {
          readOnly: true,
          modelValue: [{ name: 'Test item 1', active: true }],
        };

        updateWrapper();
      });

      it('Should add d-filter-pill--read-only class', () => {
        expect(wrapper.find('[data-qa="dt-filter-pill"]').classes()).toContain('d-filter-pill--read-only');
      });

      it('Should not open popover when clicked', async () => {
        await button.trigger('click');

        expect(wrapper.emitted()).not.toHaveProperty('open');
      });

      it('Should suppress clear button even when filters are active', () => {
        expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(false);
      });

      it('Should set aria-disabled on the primary button', () => {
        expect(button.attributes('aria-disabled')).toBe('true');
      });
    });
  });

  describe('Deferred Selection Tests', () => {
    const MOCK_DEFERRED_FILTERS = [
      { name: 'Item A' },
      { name: 'Item B' },
      { name: 'Item C' },
    ];

    describe('When deferSelection is true and popover is opened', () => {
      beforeEach(async () => {
        mockProps = {
          deferSelection: true,
          modelValue: MOCK_DEFERRED_FILTERS.map(f => ({ ...f })),
        };

        updateWrapper();

        button = wrapper.find('[data-qa="dt-filter-pill__button"]');
        await button.trigger('click');
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
        wrapper.vm.$emit('update:modelValue');
        await nextTick();
        const emitCount = wrapper.emitted('update:modelValue')?.length ?? 0;

        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        await checkboxes[0]?.click();
        await nextTick();

        const newEmitCount = wrapper.emitted('update:modelValue')?.length ?? 0;

        expect(newEmitCount).toBe(emitCount);
      });

      it('Should commit changes and emit apply when Apply is clicked', async () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        await checkboxes[0]?.click();
        await nextTick();

        const applyBtn = document.querySelector('[data-qa="dt-filter-pill__apply-button"]');
        await applyBtn.click();
        await nextTick();

        expect(wrapper.emitted()).toHaveProperty('apply');
      });

      it('Should close popover when Apply is clicked', async () => {
        const applyBtn = document.querySelector('[data-qa="dt-filter-pill__apply-button"]');
        await applyBtn.click();
        await nextTick();

        expect(wrapper.emitted('open').pop()[0]).toBe(false);
      });

      it('Should discard changes and close when Cancel is clicked', async () => {
        const cancelBtn = document.querySelector('[data-qa="dt-filter-pill__cancel-button"]');
        await cancelBtn.click();
        await nextTick();

        expect(wrapper.emitted('open').pop()[0]).toBe(false);
        expect(wrapper.emitted()).not.toHaveProperty('apply');
      });

      it('Should show committed state in pill label while popover is open', () => {
        const labelEl = wrapper.find('.d-filter-pill__label');

        expect(labelEl.text()).not.toContain('Item A');
      });
    });

    describe('When deferSelection is false', () => {
      it('Should not render deferred footer', async () => {
        mockProps = {
          deferSelection: false,
          modelValue: MOCK_DEFERRED_FILTERS.map(f => ({ ...f })),
        };

        updateWrapper();

        button = wrapper.find('[data-qa="dt-filter-pill__button"]');
        await button.trigger('click');

        const footer = document.querySelector('[data-qa="dt-filter-pill__deferred-footer"]');

        expect(footer).toBeNull();
      });
    });

    describe('When content slot is used with deferSelection', () => {
      it('Should provide apply, cancel, and pendingFilters bindings', async () => {
        const slotBindings = {};
        mockProps = {
          deferSelection: true,
          modelValue: MOCK_DEFERRED_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          content: (props) => {
            Object.assign(slotBindings, props);
            return 'custom content';
          },
        };

        updateWrapper();

        button = wrapper.find('[data-qa="dt-filter-pill__button"]');
        await button.trigger('click');

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
      { mode: 'dropdown', props: { useDropdown: true, modelValue: MOCK_TEST_FILTERS } },
    ])('ARIA attributes on the primary button ($mode mode)', ({ props }) => {
      beforeEach(() => {
        mockProps = props;
        updateWrapper();
      });

      it('Should have aria-haspopup', () => {
        expect(button.attributes('aria-haspopup')).toBeTruthy();
      });

      it('Should have aria-expanded="false" by default', () => {
        expect(button.attributes('aria-expanded')).toBe('false');
      });

      it('Should have aria-expanded="true" when open', async () => {
        await button.trigger('click');

        expect(button.attributes('aria-expanded')).toBe('true');
      });

      it('Should have aria-controls pointing to an id', () => {
        expect(button.attributes('aria-controls')).toBeTruthy();
      });
    });

    describe('Keyboard navigation', () => {
      it.each(['ArrowDown', 'ArrowUp'])('Should open popover on %s', async (key) => {
        await button.trigger('keydown', { key });

        expect(wrapper.emitted('open')[0][0]).toBe(true);
      });
    });

    describe('Checkbox group labelling', () => {
      it('Should have aria-label matching the label prop', async () => {
        mockProps = { label: MOCK_LABEL, modelValue: MOCK_TEST_FILTERS };
        updateWrapper();
        await button.trigger('click');

        const checkboxGroup = document.querySelector('[data-qa="checkbox-group"]');

        expect(checkboxGroup.getAttribute('aria-label')).toBe(MOCK_LABEL);
      });
    });

    describe('Clear button accessible name', () => {
      it('Should fall back to localized "Clear filter" when endTooltipText is empty', () => {
        mockProps = { modelValue: [{ name: 'Test item 1', active: true }] };
        updateWrapper();

        expect(clearButton.attributes('aria-label')).toBe('Clear filter');
      });
    });

    describe('Checkbox group name', () => {
      it('Should use label prop as checkbox group name', async () => {
        mockProps = { label: 'Teams', modelValue: MOCK_TEST_FILTERS };
        updateWrapper();
        await button.trigger('click');

        const checkbox = document.querySelector('input[type="checkbox"]');

        expect(checkbox.getAttribute('name')).toBe('Teams');
      });

      it('Should fall back to "filter-pill" when no label is provided', async () => {
        mockProps = { modelValue: MOCK_TEST_FILTERS };
        updateWrapper();
        await button.trigger('click');

        const checkbox = document.querySelector('input[type="checkbox"]');

        expect(checkbox.getAttribute('name')).toBe('filter-pill');
      });
    });
  });

  describe('Overlay Class Props Tests', () => {
    describe('When popover class props are set', () => {
      it.each([
        ['popoverContentClass', 'contentClass', 'custom-content-class'],
        ['popoverHeaderClass', 'headerWrapperClass', 'custom-header-class'],
        ['popoverFooterClass', 'footerWrapperClass', 'custom-footer-class'],
        ['popoverDialogClass', 'dialogClass', 'custom-dialog-class'],
      ])('Should forward %s to DtPopover', (propName, popoverPropName, className) => {
        mockProps = { [propName]: className };

        updateWrapper();

        const popover = wrapper.findComponent(DtPopover);

        expect(popover.props(popoverPropName)).toBe(className);
      });
    });

    describe('When dropdownListClass is set', () => {
      it('Should forward dropdownListClass to DtDropdown', () => {
        mockProps = {
          useDropdown: true,
          modelValue: MOCK_TEST_FILTERS,
          dropdownListClass: 'custom-list-class',
        };

        updateWrapper();

        const dropdown = wrapper.findComponent(DtDropdown);

        expect(dropdown.props('listClass')).toBe('custom-list-class');
      });
    });
  });

  describe('Header and Footer Slot Tests', () => {
    describe('When footerContent slot is provided', () => {
      it('Should render custom footer instead of default Cancel/Apply', async () => {
        mockProps = {
          deferSelection: true,
          modelValue: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          footerContent: 'Custom footer content',
        };

        updateWrapper();

        button = wrapper.find('[data-qa="dt-filter-pill__button"]');
        await button.trigger('click');

        const footer = document.querySelector('[data-qa="dt-filter-pill__deferred-footer"]');

        expect(footer).toBeNull();
        expect(document.body.textContent).toContain('Custom footer content');
      });

      it('Should render custom footer even when deferSelection is false', async () => {
        mockProps = {
          deferSelection: false,
          modelValue: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          footerContent: 'Custom footer without defer',
        };

        updateWrapper();

        button = wrapper.find('[data-qa="dt-filter-pill__button"]');
        await button.trigger('click');

        expect(document.body.textContent).toContain('Custom footer without defer');
      });

      it('Should provide apply, cancel, and close bindings to footerContent slot', async () => {
        const slotBindings = {};
        mockProps = {
          deferSelection: true,
          modelValue: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          footerContent: (props) => {
            Object.assign(slotBindings, props);
            return 'scoped footer';
          },
        };

        updateWrapper();

        button = wrapper.find('[data-qa="dt-filter-pill__button"]');
        await button.trigger('click');

        expect(typeof slotBindings.apply).toBe('function');
        expect(typeof slotBindings.cancel).toBe('function');
        expect(typeof slotBindings.close).toBe('function');
      });
    });

    describe('When headerContent slot is provided', () => {
      it('Should render header in popover mode', async () => {
        mockProps = {
          modelValue: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          headerContent: 'Custom header content',
        };

        updateWrapper();

        button = wrapper.find('[data-qa="dt-filter-pill__button"]');
        await button.trigger('click');

        expect(document.body.textContent).toContain('Custom header content');
      });

      it('Should not render header in dropdown mode', () => {
        mockProps = {
          useDropdown: true,
          modelValue: MOCK_TEST_FILTERS.map(f => ({ ...f })),
        };
        mockSlots = {
          headerContent: 'Should not appear',
        };

        updateWrapper();

        expect(document.body.textContent).not.toContain('Should not appear');
      });
    });
  });
});

describe('DtFilterPill custom content and localized display', () => {
  let wrapper;
  let originalI18n;
  const missingContentWarning = 'Please provide content through the v-model or the "content" slot.';
  const updateWrapper = (props = {}, slots = {}, errorHandler) => {
    wrapper = mount(DtFilterPill, {
      props: { modelValue: [], label: 'Teams', ...props },
      slots,
      global: { plugins: [DtTooltipDirective], stubs: { transition: false }, config: { errorHandler } },
      attachTo: document.body,
    });
  };

  beforeEach(() => {
    originalI18n = new DialtoneLocalization().i18n;
  });

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = '';
    new DialtoneLocalization().i18n = originalI18n;
    vi.restoreAllMocks();
  });

  describe.each([false, true])('Custom content (useDropdown=%s)', useDropdown => {
    it('mounts an empty model with a destructured scoped slot and closes the real overlay', async () => {
      const errors = vi.fn();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const content = ({ close }) => h('button', {
        'data-qa': 'custom-close', onClick: close,
      }, 'Close custom content');
      updateWrapper({ useDropdown }, { content }, errors);

      expect(errors).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalledWith(missingContentWarning);
      await wrapper.find('[data-qa="dt-filter-pill__button"]').trigger('click');
      expect(document.querySelector('[data-qa="custom-close"]')).not.toBeNull();
      document.querySelector('[data-qa="custom-close"]').click();
      await nextTick();
      expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('false');
    });
  });

  it.each([
    { content: 'an empty content slot', props: {}, slots: { content: () => undefined }, warns: false },
    { content: 'a nonempty model', props: { modelValue: [{ name: 'Support' }] }, slots: {}, warns: false },
    { content: 'no model and no content slot', props: {}, slots: {}, warns: true },
  ])('warns about missing content only when absent ($content → $warns)', ({ props, slots, warns }) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper(props, slots);
    expect(warn.mock.calls.some(([message]) => message === missingContentWarning)).toBe(warns);
  });

  const useLocale = (locale, frenchResource = `DIALTONE_FILTER_PILL_ALL_LABEL = Tous
DIALTONE_FILTER_PILL_OVERFLOW_TITLE =
  { $count ->
    [one] plus { $count } autre
   *[other] plus { $count } autres
  }`) => {
    const manager = new LocaleManager({
      bundleSource: new RawBundleSource({
        resources: RawBundleSource.builtResources([
          ['en-US', 'filter-pill-test', enUS],
          ['fr-FR', 'filter-pill-test', frenchResource],
        ]),
      }),
      allowedLocales: ['en-US', 'fr-FR'],
      fallbackLocale: 'en-US',
      preferredLocale: locale,
      namespaces: ['filter-pill-test'],
      storageWrapper: new MemoryStorageWrapper(),
    });
    new DialtoneLocalization().i18n = manager.useI18N('filter-pill-test');
  };

  it('uses English fallback when the locale resource lacks the new keys', () => {
    useLocale('fr-FR', 'TEST_ONLY_MESSAGE = Fixture without FilterPill keys');
    updateWrapper({ modelValue: [
      { name: 'Support', active: true }, { name: 'Sales', active: true }, { name: 'Engineering' },
    ] });
    expect(wrapper.find('.d-filter-pill__label-end-overflow').attributes('title')).toBe('plus \u20681\u2069 other');
  });

  it('renders one selected option without an aggregate or overflow', () => {
    updateWrapper({ modelValue: [{ name: 'Support', active: true }] });
    expect(wrapper.find('.d-filter-pill__label-end').text()).toBe('Support');
    expect(wrapper.find('.d-filter-pill__label-end-overflow').exists()).toBe(false);
  });

  it('preserves an option literally named All in a translated subset summary', () => {
    useLocale('fr-FR');
    updateWrapper({ modelValue: ['All', 'Support', 'Sales'].map((name, index) => ({
      name, active: index < 2,
    })) });
    expect(wrapper.find('.d-filter-pill__label-end').text()).toBe('All');
    expect(wrapper.find('.d-filter-pill__label-end').attributes('title')).toBe('All');
  });

  describe.each([
    { locale: 'en-US', all: 'All', singular: 'plus \u20681\u2069 other', plural: 'plus \u20682\u2069 others' },
    { locale: 'fr-FR', all: 'Tous', singular: 'plus \u20681\u2069 autre', plural: 'plus \u20682\u2069 autres' },
  ])('Built-in display with real Fluent resources ($locale)', ({ locale, all, singular, plural }) => {
    beforeEach(() => {
      // French is a test-only translated resource, separate from the missing-key fallback case above.
      useLocale(locale);
    });

    it('localizes aggregate display while preserving literal All and model references in slot bindings', () => {
      const modelValue = [{ name: 'Support', active: true }, { name: 'Sales', active: true }];
      updateWrapper({ modelValue });
      expect(wrapper.find('.d-filter-pill__label-end').text()).toBe(all);
      expect(wrapper.find('.d-filter-pill__label-end').attributes('title')).toBe(all);
      wrapper.unmount();
      let bindings;
      updateWrapper({ modelValue }, { default: data => { bindings = data; return data.activeFilterList; } });
      expect(bindings.activeFilterList).toBe('All');
      expect(toRaw(bindings.filters)).toBe(modelValue);
      expect(bindings.activeFilters).toEqual(['Support', 'Sales']);
      expect(bindings.activeFilterOverflow).toBe('');
    });

    it.each([
      { selected: 2, overflow: '+1', title: singular },
      { selected: 3, overflow: '+2', title: plural },
    ])('renders $selected selected options with Fluent plural and isolation', ({ selected, overflow, title }) => {
      updateWrapper({ modelValue: ['Support', 'Sales', 'Engineering', 'Marketing'].map((name, index) => ({
        name, active: index < selected,
      })) });
      const extra = wrapper.find('.d-filter-pill__label-end-overflow');
      expect(extra.text()).toBe(overflow);
      expect(extra.attributes('title')).toBe(title);
    });
  });
});
