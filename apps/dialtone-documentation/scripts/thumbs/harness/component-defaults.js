/**
 * component-defaults.js
 *
 * Per-component render config for the thumb harness.
 * Keys are the @dialpad/dialtone-vue export names.
 *
 * Each entry has shape:
 *   { props, slot }                — simple case: pass props, optionally render a slot string
 *   { renderFn (h, ComponentClass) } — full control: return any VNode tree
 *
 * Components not listed fall back to: h(Component, {}, { default: () => 'Label' })
 */
export const COMPONENT_DEFAULTS = {
  DtAvatar: { props: { fullName: 'Ada Everly', size: '500' } },
  DtBadge: { props: {}, slot: 'New' },
  DtBanner: { props: { kind: 'info', titleText: 'Notice Title' }, slot: 'Banner message.' },
  DtBox: { props: { padding: '400' }, slot: 'Content' },
  DtBreadcrumbs: {
    props: {
      breadcrumbs: [
        { href: '#', label: 'Home' },
        { href: '#', label: 'Section' },
        { href: '#', label: 'Current' },
      ],
    },
  },
  DtButton: { props: {}, slot: 'Place Call' },
  DtButtonGroup: {
    renderFn: (h, _Component, lib) => h(lib.DtButtonGroup, {}, {
      default: () => [
        h(lib.DtButton, {}, { default: () => 'Save' }),
        h(lib.DtButton, { importance: 'outlined' }, { default: () => 'Cancel' }),
      ],
    }),
  },
  DtCard: { props: {}, slot: 'Card content' },
  DtCheckbox: { props: { label: 'Option A' } },
  DtCheckboxGroup: {
    renderFn: (h, _Component, lib) => h(lib.DtCheckboxGroup, { name: 'options', groupLabel: 'Options' }, {
      default: () => [
        h(lib.DtCheckbox, { value: 'a', label: 'Option A' }),
        h(lib.DtCheckbox, { value: 'b', label: 'Option B' }),
      ],
    }),
  },
  DtChip: { props: {}, slot: 'Chip Label' },
  DtCodeblock: {
    props: { text: 'const greet = () => "Hello";', language: 'javascript' },
  },
  DtCollapsible: {
    props: { anchorText: 'Show details' },
    slot: 'Collapsible content goes here.',
  },
  DtCombobox: {
    props: {
      label: 'Search',
      placeholder: 'Type to filter…',
    },
  },
  DtDescriptionList: {
    props: {
      items: [
        { id: '1', term: 'Name', details: 'Ada Everly' },
        { id: '2', term: 'Role', details: 'Designer' },
      ],
    },
  },
  DtDropdown: { props: {}, slot: 'Open Menu' },
  DtEmoji: { props: { code: ':smile:', size: '600' } },
  DtEmojiPicker: { props: {} },
  DtEmojiTextWrapper: { props: {}, slot: 'Hello :smile: World' },
  DtEmptyState: { props: { headerText: 'Nothing here yet', bodyText: 'Try adding an item.' } },
  DtFilterPill: { props: { label: 'Filter', content: 'Status' } },
  DtIcon: { props: { name: 'phone', size: '700' } },
  DtInput: { props: { label: 'Full name', placeholder: 'Enter your name…' } },
  DtInputGroup: {
    renderFn: (h, _Component, lib) => h(lib.DtInputGroup, { name: 'contact', label: 'Contact' }, {
      default: () => [
        h(lib.DtInput, { label: 'Email', placeholder: 'name@example.com' }),
      ],
    }),
  },
  DtItemLayout: {
    props: {},
    renderFn: (h, _Component, lib) => h(lib.DtItemLayout, {}, {
      headline: () => 'Call with Team',
      subtitle: () => 'Monday · 10:00 AM',
    }),
  },
  DtKeyboardShortcut: { props: { shortcut: 'cmd+k' } },
  DtLazyShow: { props: { show: true }, slot: 'Content' },
  DtLink: { props: { href: '#' }, slot: 'Link text' },
  DtListItem: { props: {}, slot: 'List item content' },
  DtListItemGroup: {
    renderFn: (h, _Component, lib) => h(lib.DtListItemGroup, { headerLabel: 'Group Header' }, {
      default: () => [
        h(lib.DtListItem, {}, { default: () => 'First item' }),
        h(lib.DtListItem, {}, { default: () => 'Second item' }),
      ],
    }),
  },
  DtLoader: { props: {} },
  DtModeIsland: { props: {}, slot: 'Content' },
  DtMotionText: { props: { text: 'Animated text' } },
  DtNotice: { props: { kind: 'info', headerText: 'Heads up' }, slot: 'Notice message.' },
  DtPagination: { props: { totalPages: 10, activePage: 4, ariaLabel: 'Pagination' } },
  DtPopover: { props: {}, slot: 'Open' },
  DtPresence: { props: { presence: 'active' } },
  DtProgressCircle: { props: { value: 65 } },
  DtProse: { props: {}, slot: '<p>Prose content here.</p>' },
  DtRadio: { props: { value: 'a', label: 'Option A' } },
  DtRadioGroup: {
    renderFn: (h, _Component, lib) => h(lib.DtRadioGroup, { name: 'options', groupLabel: 'Options' }, {
      default: () => [
        h(lib.DtRadio, { value: 'a', label: 'Option A' }),
        h(lib.DtRadio, { value: 'b', label: 'Option B' }),
      ],
    }),
  },
  DtResizable: { props: {} },
  DtResizableHandle: { props: {} },
  DtResizablePanel: { props: { id: 'panel-1' } },
  DtRootLayout: { props: {} },
  DtScroller: {
    props: {
      items: ['One', 'Two', 'Three', 'Four', 'Five'],
      itemSize: 32,
      ariaLabel: 'List',
    },
  },
  DtSegmentedControl: {
    renderFn: (h, _Component, lib) => h(lib.DtSegmentedControl, { modelValue: 'a' }, {
      default: () => [
        h(lib.DtSegmentedControlItem, { value: 'a' }, { default: () => 'Day' }),
        h(lib.DtSegmentedControlItem, { value: 'b' }, { default: () => 'Week' }),
        h(lib.DtSegmentedControlItem, { value: 'c' }, { default: () => 'Month' }),
      ],
    }),
  },
  DtSegmentedControlItem: {
    props: { value: 'a' },
    slot: 'Option',
  },
  DtSelectMenu: {
    props: {
      label: 'Department',
      options: [
        { label: 'Engineering', value: 'eng' },
        { label: 'Design', value: 'design' },
        { label: 'Product', value: 'product' },
      ],
    },
  },
  DtSkeleton: { props: { paragraphOption: { lines: 3 } } },
  DtSplitButton: { props: {}, slot: 'Schedule Call' },
  DtStack: { props: { gap: '400' }, slot: 'Content' },
  DtTab: {
    renderFn: (h, _Component, lib) => h(lib.DtTabGroup, {}, {
      default: () => [
        h(lib.DtTabList, {}, {
          default: () => [
            h(lib.DtTab, { id: 'tab-1', panelId: 'panel-1', selected: true }, { default: () => 'Overview' }),
            h(lib.DtTab, { id: 'tab-2', panelId: 'panel-2' }, { default: () => 'Details' }),
          ],
        }),
        h(lib.DtTabPanel, { id: 'panel-1', tabId: 'tab-1' }, { default: () => 'Overview content' }),
        h(lib.DtTabPanel, { id: 'panel-2', tabId: 'tab-2' }, { default: () => 'Details content' }),
      ],
    }),
  },
  DtTabGroup: {
    renderFn: (h, _Component, lib) => h(lib.DtTabGroup, {}, {
      default: () => [
        h(lib.DtTabList, {}, {
          default: () => [
            h(lib.DtTab, { id: 'tab-1', panelId: 'panel-1', selected: true }, { default: () => 'Overview' }),
            h(lib.DtTab, { id: 'tab-2', panelId: 'panel-2' }, { default: () => 'Details' }),
          ],
        }),
        h(lib.DtTabPanel, { id: 'panel-1', tabId: 'tab-1' }, { default: () => 'Overview content' }),
      ],
    }),
  },
  DtTabPanel: {
    renderFn: (h, _Component, lib) => h(lib.DtTabGroup, {}, {
      default: () => [
        h(lib.DtTabList, {}, {
          default: () => [
            h(lib.DtTab, { id: 'tab-1', panelId: 'panel-1', selected: true }, { default: () => 'Overview' }),
          ],
        }),
        h(lib.DtTabPanel, { id: 'panel-1', tabId: 'tab-1' }, { default: () => 'Panel content goes here.' }),
      ],
    }),
  },
  DtText: { props: { as: 'p' }, slot: 'Typography text' },
  DtToggle: { props: { modelValue: true, label: 'Dark mode' } },
  DtValidationMessages: {
    props: {
      validationMessages: [{ message: 'This field is required.', type: 'critical' }],
    },
  },
};
