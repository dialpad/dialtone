import { mount, flushPromises } from '@vue/test-utils';
import { createCommentVNode, h, nextTick, ref } from 'vue';
import DtFilterPill from './FilterPill.vue';
import { DtTooltipDirective } from '@/directives/tooltip_directive';
import { DtFocustrapDirective } from '@/directives/focustrap_directive';

const options = Object.freeze([
  Object.freeze({ value: 'sales', label: 'Sales' }),
  Object.freeze({ value: 'support', label: 'Support' }),
  Object.freeze({ value: 'engineering', label: 'Engineering' }),
]);

const reconcile = async () => { await nextTick(); await nextTick(); };

describe('DtFilterPill controlled selection', () => {
  let wrapper;
  let hadScrollLock;
  beforeEach(() => { hadScrollLock = document.documentElement.classList.contains('d-of-hidden'); });
  const updateWrapper = (props = {}, slots = {}, attrs = {}, globalOptions = {}) => {
    if (wrapper?.exists()) wrapper.unmount();
    wrapper = mount(DtFilterPill, {
      props: { options, selected: Object.freeze(['sales']), label: 'Teams', ...props },
      slots,
      attrs,
      global: { plugins: [DtTooltipDirective, DtFocustrapDirective], ...globalOptions },
      attachTo: document.body,
    });
    return wrapper;
  };
  const open = async () => {
    await wrapper.find('[data-qa="dt-filter-pill__button"]').trigger('click');
  };
  const checks = () => [...document.querySelectorAll('[data-qa="dt-filter-pill__checkbox"]')];

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = '';
    document.documentElement.classList.toggle('d-of-hidden', hadScrollLock);
    vi.restoreAllMocks();
  });

  it('restores declined native checkbox intents without mutating frozen consumer data', async () => {
    const selected = Object.freeze(['sales']);
    updateWrapper({ selected });
    await open();
    const inputs = checks();
    expect(inputs.map(input => input.checked)).toEqual([true, false, false]);
    inputs[1].focus();
    inputs[1].click();
    await reconcile();
    expect(wrapper.emitted('update:selected')).toEqual([[['sales', 'support']]]);
    expect(inputs.map(input => input.checked)).toEqual([true, false, false]);
    expect(document.activeElement).toBe(inputs[1]);
    expect(selected).toEqual(['sales']);
  });

  it('derives rapid rejected proposals from committed props and adopts only a later accepted snapshot', async () => {
    updateWrapper();
    await open();
    const inputs = checks();
    inputs[1].click();
    inputs[2].click();
    await reconcile();
    expect(wrapper.emitted('update:selected')).toEqual([
      [['sales', 'support']], [['sales', 'engineering']],
    ]);
    expect(inputs.map(input => input.checked)).toEqual([true, false, false]);
    await wrapper.setProps({ selected: Object.freeze(['sales', 'support']) });
    await reconcile();
    expect(inputs.map(input => input.checked)).toEqual([true, true, false]);
    expect(wrapper.emitted('selection-change')).toHaveLength(2);
  });

  it('uses one controlled single-choice action path with neutral and short labels', async () => {
    const trace = [];
    const scalarOptions = Object.freeze([
      Object.freeze({ value: '', label: 'All Messages', shortLabel: 'All' }),
      Object.freeze({ value: 'calls', label: 'Calls Only', shortLabel: 'Calls' }),
    ]);
    updateWrapper({
      useDropdown: true, options: scalarOptions, selected: '', neutralValue: '', open: false,
    }, { headerContent: 'Teams' }, {
      'onUpdate:selected': value => trace.push(['update', value]),
      onSelectionChange: action => trace.push(['action', action]),
      'onUpdate:open': value => trace.push(['visibility', value]),
      onOpen: value => trace.push(['open', value]),
    });
    expect(wrapper.find('[data-qa="dt-filter-pill__label"]').text()).toContain('All');
    expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(false);
    await open();
    const rows = [...document.querySelectorAll('[data-qa="dt-filter-pill__option"]')];
    expect(rows.map(row => row.getAttribute('role'))).toEqual(['menuitemradio', 'menuitemradio']);
    expect(rows.map(row => row.getAttribute('aria-checked'))).toEqual(['true', 'false']);
    expect(rows.every(row => row.querySelector('[data-qa="dt-item-layout-selected-wrapper"]'))).toBe(true);
    expect(document.querySelector('[role="menu"]').getAttribute('aria-label')).toBe('Teams');
    expect(document.querySelector('[role="menu"]').hasAttribute('aria-labelledby')).toBe(false);
    rows[1].click();
    await reconcile();
    expect(trace).toEqual([
      ['visibility', true], ['open', true], ['update', 'calls'],
      ['action', { value: 'calls', previousValue: '', reason: 'select', changed: true }],
      ['visibility', false], ['open', false],
    ]);
    // The declined proposal leaves the authoritative neutral selection intact.
    expect(wrapper.find('[data-qa="dt-filter-pill__label"]').text()).toContain('All');
    await wrapper.setProps({ selected: 'calls' });
    expect(wrapper.find('[data-qa="dt-filter-pill__label"]').text()).toContain('Calls');
  });

  it('notifies deliberate same-value activation without a redundant selected update', async () => {
    updateWrapper({ useDropdown: true, selected: 'sales' });
    await open();
    document.querySelector('[role="menuitemradio"]').click();
    await reconcile();
    expect(wrapper.emitted('update:selected')).toBeUndefined();
    expect(wrapper.emitted('selection-change')).toEqual([[{
      value: 'sales', previousValue: 'sales', reason: 'select', changed: false,
    }]]);
  });

  it('keeps value IDs and focused rows stable through translated/reordered options', async () => {
    updateWrapper({ useDropdown: true, selected: 'support' }, {}, {}, { stubs: { transition: false } });
    await open();
    await flushPromises();
    const row = document.querySelectorAll('[data-qa="dt-filter-pill__option"]')[1];
    row.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    row.focus();
    expect(document.activeElement).toBe(row);
    const id = row.id;
    await wrapper.setProps({ options: [
      { value: 'support', label: 'Assistance' }, { value: 'sales', label: 'Ventes' },
      { value: 'engineering', label: 'Engineering' },
    ] });
    await reconcile();
    expect(document.getElementById(id)).toBe(row);
    expect(document.activeElement).toBe(row);
    expect(row.textContent).toContain('Assistance');
    expect(row.getAttribute('aria-checked')).toBe('true');
    row.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown', code: 'ArrowDown', bubbles: true, cancelable: true,
    }));
    await reconcile();
    expect(document.activeElement.textContent).toContain('Ventes');
    expect(row.getAttribute('aria-checked')).toBe('true');
    expect(wrapper.emitted('selection-change')).toBeUndefined();
  });

  it.each(['parent-first', 'apply-first'])('rebases a dirty deferred draft before Apply when %s', async order => {
    const selected = ref(['sales']);
    let controls;
    wrapper = mount({
      setup: () => () => h(DtFilterPill, {
        label: 'Teams', options, selected: selected.value, deferSelection: true,
        'onUpdate:selected': value => { selected.value = value; },
      }, { content: bindings => {
        controls = bindings;
        return h('button', { onClick: () => bindings.setSelected(['sales', 'support']) }, 'Edit draft');
      } }),
    }, { global: { plugins: [DtTooltipDirective, DtFocustrapDirective] }, attachTo: document.body });
    await open();
    controls.setSelected(['sales', 'support']);
    await reconcile();
    if (order === 'parent-first') selected.value = ['engineering'];
    const applying = controls.apply();
    if (order === 'apply-first') selected.value = ['engineering'];
    expect(applying).toBeInstanceOf(Promise);
    await applying;
    const pill = wrapper.findComponent(DtFilterPill);
    expect(selected.value).toEqual(['engineering']);
    expect(pill.emitted('update:selected')).toBeUndefined();
    expect(pill.emitted('selection-change')).toEqual([[{
      value: ['engineering'], previousValue: ['engineering'], reason: 'apply', changed: false,
    }]]);
    expect(pill.emitted('apply')).toEqual([[]]);
    expect(pill.emitted('open')).toEqual([[true], [false]]);
  });

  it('preserves dirty draft through option additions, reorder, relabelling and removals', async () => {
    updateWrapper({ deferSelection: true });
    await open();
    checks()[1].click();
    await reconcile();
    await wrapper.setProps({ selected: ['sales'], options: [
      options[1], { value: 'new', label: 'New team' }, options[0], options[2],
    ].map(option => ({ ...option, label: option.label + ' translated' })) });
    expect(checks().map(input => input.checked)).toEqual([true, false, true, false]);
    expect(wrapper.find('[data-qa="dt-filter-pill__label"]').text()).not.toContain('Support');
    // Unrelated removal preserves edits; removing a pending value retains its unknown identity too.
    await wrapper.setProps({ options: [options[0], options[1]] });
    await reconcile();
    expect(checks().map(input => input.checked)).toEqual([true, true]);
    await wrapper.setProps({ options: [options[0]] });
    document.querySelector('[data-qa="dt-filter-pill__apply-button"]').click();
    await reconcile();
    expect(wrapper.emitted('update:selected')).toEqual([[['sales', 'support']]]);
    expect(wrapper.emitted('selection-change')[0][0]).toEqual({
      value: ['sales', 'support'], previousValue: ['sales'], reason: 'apply', changed: true,
    });
  });

  it('coalesces repeated Apply requests for one deferred session', async () => {
    let controls;
    updateWrapper({ deferSelection: true }, { content: bindings => { controls = bindings; return 'Custom'; } });
    await open();
    controls.setSelected(['support']);
    const apply = controls.apply;
    await Promise.all([apply(), apply()]);
    await apply();
    expect(wrapper.emitted('selection-change')).toHaveLength(1);
    expect(wrapper.emitted('apply')).toEqual([[]]);
  });

  it.each(['cancel', 'reopen', 'dispose'])('cancels an in-flight Apply on %s', async boundary => {
    let controls;
    const actions = [];
    const applies = [];
    updateWrapper({ deferSelection: true }, { content: bindings => { controls = bindings; return 'Custom'; } }, {
      onSelectionChange: action => actions.push(action), onApply: () => applies.push('apply'),
    });
    await open();
    controls.setSelected(['engineering']);
    const pendingApply = controls.apply();
    if (boundary === 'dispose') wrapper.unmount();
    else if (boundary === 'cancel') controls.cancel();
    else {
      controls.close();
      wrapper.find('[data-qa="dt-filter-pill__button"]').element.click();
    }
    await pendingApply;
    expect(actions).toEqual([]);
    expect(applies).toEqual([]);
  });

  it('normalizes locked true once without reporting a visibility change and does not reopen on unlock', async () => {
    updateWrapper({ open: true, disabled: true });
    await reconcile();
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
    expect(wrapper.emitted('open')).toBeUndefined();
    await wrapper.setProps({ disabled: false });
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('false');
    await wrapper.setProps({ open: false });
    await wrapper.setProps({ open: true });
    expect(wrapper.emitted('open')).toEqual([[true]]);
    await wrapper.setProps({ readOnly: true });
    expect(wrapper.emitted('update:open')).toEqual([[false], [false]]);
    expect(wrapper.emitted('open')).toEqual([[true], [false]]);
  });

  it('stops Clear follow-up events when its action listener unmounts the instance', async () => {
    const trace = [];
    updateWrapper({}, {}, {
      onSelectionChange: action => { trace.push(['action', action.reason]); wrapper.unmount(); },
      onOpen: value => trace.push(['open', value]),
      onClear: () => trace.push(['clear']),
    });
    await open();
    wrapper.get('[data-qa="dt-filter-pill__clear-button"]').element.click();
    await reconcile();
    expect(trace).toEqual([['open', true], ['action', 'clear']]);
  });

  it('keeps closed-clear focus until actual acceptance removes its button', async () => {
    updateWrapper({ selected: ['sales'] });
    const clear = wrapper.find('[data-qa="dt-filter-pill__clear-button"]').element;
    clear.focus();
    clear.click();
    await reconcile();
    expect(document.activeElement).toBe(clear);
    await wrapper.setProps({ selected: [] });
    await reconcile();
    expect(document.activeElement).toBe(wrapper.find('[data-qa="dt-filter-pill__button"]').element);
    expect(wrapper.emitted('selection-change')[0][0]).toEqual({
      value: [], previousValue: ['sales'], reason: 'clear', changed: true,
    });
  });

  it('keeps unknown selected values active and clearable without exposing raw identifiers', async () => {
    updateWrapper({ selected: ['private-id', 'sales'] });
    expect(wrapper.find('[data-qa="dt-filter-pill__label"]').text()).not.toContain('private-id');
    expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(true);
    await open();
    expect(checks().map(input => input.checked)).toEqual([true, false, false]);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
    checks()[1].click();
    await reconcile();
    expect(wrapper.emitted('update:selected')).toEqual([[['private-id', 'sales', 'support']]]);
    await wrapper.setProps({ selected: ['private-id'] });
    expect(wrapper.find('[data-qa="dt-filter-pill__label-end"]').text()).toBe('Unavailable');
    expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(true);
  });

  it.each([
    [[{ value: 'sales', label: 'Sales' }], ['sales'], 'Sales', ''],
    [options, ['engineering', 'support', 'sales'], 'All', ''],
    [options, ['private-id', 'engineering', 'support', 'sales'], 'Engineering', '+3'],
  ])('separates the dimension and resolved multiple summary for %j', (available, selected, summary, overflow) => {
    updateWrapper({ options: available, selected });
    expect(wrapper.get('[data-qa="dt-filter-pill__accessible-label"]').text()).toContain(summary);
    expect(wrapper.get('[data-qa="dt-filter-pill__label-start"]').text()).toBe('Teams');
    expect(wrapper.get('[data-qa="dt-filter-pill__label-start"]').attributes('aria-hidden')).toBe('true');
    expect(wrapper.get('[data-qa="dt-filter-pill__label-end"]').text()).toBe(summary);
    expect(wrapper.get('[data-qa="dt-filter-pill__label-end"]').attributes('aria-hidden')).toBe('true');
    expect(wrapper.get('[data-qa="dt-filter-pill__accessible-label"]').text()).toContain('Teams');
    expect(wrapper.find('[data-qa="dt-filter-pill__overflow"]').exists()).toBe(Boolean(overflow));
    if (overflow) expect(wrapper.get('[data-qa="dt-filter-pill__overflow"]').text()).toBe(overflow);
  });

  it.each([undefined, ''])('keeps an active summary without an empty dimension when label is %j', label => {
    updateWrapper({ label });
    expect(wrapper.find('[data-qa="dt-filter-pill__label-start"]').exists()).toBe(false);
    expect(wrapper.get('[data-qa="dt-filter-pill__label-end"]').text()).toBe('Sales');
    expect(wrapper.get('[data-qa="dt-filter-pill__accessible-label"]').text()).toBe('Sales');
  });

  it.each([false, true])('updates overlay naming and heading ownership when a parent changes content (dropdown=%s)', async useDropdown => {
    const custom = ref(false);
    const warn = vi.spyOn(console, 'warn');
    wrapper = mount({
      setup: () => () => h(DtFilterPill, {
        label: 'Teams', options, selected: useDropdown ? 'sales' : ['sales'], useDropdown,
      }, {
        headerContent: () => h('span', { 'data-qa': 'fallback-heading' }, 'Built-in heading'),
        ...(custom.value ? { content: () => h(useDropdown ? 'li' : 'div', { role: 'presentation' }, [
          h('h3', { 'data-qa': 'custom-heading' }, 'Custom heading'),
          h('div', { role: 'group', 'aria-label': 'Custom choices' }, 'Custom choices'),
        ]) } : {}),
      }),
    }, { global: { plugins: [DtTooltipDirective, DtFocustrapDirective] }, attachTo: document.body });
    await open();
    const overlay = () => document.querySelector(useDropdown ? '[role="menu"]' : '[role="dialog"]');
    const initial = overlay();
    expect(initial.getAttribute('aria-label')).toBe('Teams');
    expect(initial.querySelectorAll('[data-qa="fallback-heading"]')).toHaveLength(1);
    for (const next of [true, false, true]) {
      custom.value = next;
      await reconcile();
      expect(overlay()).toBe(initial);
      expect(initial.getAttribute('aria-label')).toBe(next ? null : 'Teams');
      expect(initial.querySelectorAll('[data-qa="custom-heading"]')).toHaveLength(next ? 1 : 0);
      expect(initial.querySelectorAll('[data-qa="fallback-heading"]')).toHaveLength(next && useDropdown ? 0 : 1);
      if (next) expect(initial.querySelector('[role="group"]').getAttribute('aria-label')).toBe('Custom choices');
    }
    expect(warn.mock.calls.some(([message]) => String(message).includes('invoked outside of the render function'))).toBe(false);
  });

  it('ignores a supplied legacy model and later legacy edits when controlled', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const modelValue = ref([{ name: 'Legacy', active: true }]);
    updateWrapper({ modelValue: modelValue.value });
    await open();
    checks()[1].click();
    await reconcile();
    expect(wrapper.emitted('update:selected')).toEqual([[['sales', 'support']]]);
    expect(modelValue.value).toEqual([{ name: 'Legacy', active: true }]);
    modelValue.value[0].active = false;
    await reconcile();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('disables selection for duplicate option identities', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({
      options: [{ value: 'sales', label: 'Sales' }, { value: 'sales', label: 'Duplicate' }],
      selected: ['sales', 'support'],
    });
    expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(false);
    expect(wrapper.find('[data-qa="dt-filter-pill__overflow"]').exists()).toBe(false);
    await open();
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').classes()).not.toContain('d-filter-pill--selected');
    expect(warn.mock.calls.some(([message]) => message.includes('unique string values'))).toBe(true);
    expect(checks()).toHaveLength(0);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
  });


  it('isolates selection-change snapshots from synchronous update listeners', async () => {
    const trace = [];
    updateWrapper({}, {}, {
      'onUpdate:selected': proposal => { trace.push([...proposal]); proposal.push('listener-added'); },
      onSelectionChange: action => trace.push(action),
    });
    await open();
    checks()[1].click();
    await reconcile();
    expect(trace).toEqual([
      ['sales', 'support'],
      { value: ['sales', 'support'], previousValue: ['sales'], reason: 'toggle', changed: true },
    ]);
  });

  it('preserves legacy native listeners and ignores controlled open', async () => {
    const useDropdown = false;
    const trace = [];
    const modelValue = [{ name: 'Legacy' }];
    updateWrapper({ options: undefined, modelValue, selected: 'legacy-attr', open: true, useDropdown }, {}, {
      onChange: () => trace.push('change'), onChangeCapture: () => trace.push('capture'),
      onSelect: () => trace.push('select'), onSelectionChange: () => trace.push('selection-change'),
      'onUpdate:selected': () => trace.push('update:selected'),
    });
    const root = wrapper.find('[data-qa="dt-filter-pill"]').element;
    expect(root.getAttribute('selected')).toBe('legacy-attr');
    expect(root.hasAttribute('open')).toBe(true);
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('false');
    await wrapper.find('[data-qa="dt-filter-pill"]').trigger('change');
    await wrapper.find('[data-qa="dt-filter-pill"]').trigger('select');
    await wrapper.find('[data-qa="dt-filter-pill"]').trigger('selection-change');
    await wrapper.find('[data-qa="dt-filter-pill"]').trigger('update:selected');
    expect(trace).toEqual(['capture', 'change', 'select', 'selection-change']);
    await open();
    expect(wrapper.emitted('update:open')).toBeUndefined();
  });

  it.each([
    ['onOpened', 'opened', false, false, ['1:first', '2:first']],
    ['onSelectionChangeOnce', 'selection-change', false, false, ['1:first']],
    ['onOpened', 'opened', true, true, ['1:first', '1:second', '2:first', '2:second']],
    ['onSelectionChangeOnce', 'selection-change', true, true, ['1:first', '1:second']],
  ])('updates legacy %s parent handlers (%s, array=%s, forwarded=%s)', async (key, event, array, forwarded, expected) => {
    const generation = ref(0);
    const trace = [];
    const modelValue = [{ name: 'Legacy' }];
    const ForwardingPill = { setup: (_, { attrs }) => () => h(DtFilterPill, attrs) };
    wrapper = mount({
      setup: () => () => {
        const current = generation.value;
        const first = () => trace.push(`${current}:first`);
        const handler = array ? [first, () => trace.push(`${current}:second`)] : first;
        return h(forwarded ? ForwardingPill : DtFilterPill, { modelValue, label: 'Legacy', [key]: handler });
      },
    }, { global: { plugins: [DtTooltipDirective, DtFocustrapDirective] }, attachTo: document.body });
    generation.value = 1;
    await reconcile();
    await wrapper.find('[data-qa="dt-filter-pill"]').trigger(event);
    generation.value = 2;
    await reconcile();
    await wrapper.find('[data-qa="dt-filter-pill"]').trigger(event);
    expect(trace).toEqual(expected);
  });

  it.each([
    ['onOpenedOnce', 'onSelectionChange', 'selection-change', ['old', 'new', 'new']],
    ['onOpenedOnce', 'onOpened', 'opened', ['old', 'new', 'new']],
    ['onOpened', 'onOpenedOnce', 'opened', ['old', 'new']],
  ])('updates equal-count legacy listener keys from %s to %s', async (before, after, event, expected) => {
    const changed = ref(false);
    const trace = [];
    const modelValue = [{ name: 'Legacy' }];
    wrapper = mount({
      setup: () => () => {
        const current = changed.value;
        return h(DtFilterPill, {
          modelValue, label: 'Legacy', [current ? after : before]: () => trace.push(current ? 'new' : 'old'),
        });
      },
    }, { global: { plugins: [DtTooltipDirective, DtFocustrapDirective] }, attachTo: document.body });
    const root = wrapper.find('[data-qa="dt-filter-pill"]');
    await root.trigger('opened');
    changed.value = true;
    await reconcile();
    await root.trigger(event);
    await root.trigger(event);
    expect(trace).toEqual(expected);
  });

  it('isolates legacy native listener classification from subsequently mounted controlled instances', async () => {
    const legacy = [];
    const controlled = [];
    wrapper = mount({
      setup: () => () => h('div', [
        h(DtFilterPill, { label: 'Legacy', modelValue: [{ name: 'Legacy' }], onSelectionChange: event => legacy.push(event.type) }),
        h(DtFilterPill, { label: 'Teams', options, selected: ['sales'], onSelectionChange: action => controlled.push(action) }),
      ]),
    }, { global: { plugins: [DtTooltipDirective, DtFocustrapDirective] }, attachTo: document.body });
    const [legacyPill, controlledPill] = wrapper.findAllComponents(DtFilterPill);
    await legacyPill.find('[data-qa="dt-filter-pill"]').trigger('selection-change');
    await controlledPill.find('[data-qa="dt-filter-pill"]').trigger('selection-change');
    expect(legacy).toEqual(['selection-change']);
    expect(controlled).toEqual([]);
    await controlledPill.find('[data-qa="dt-filter-pill__button"]').trigger('click');
    checks()[1].click();
    await reconcile();
    expect(controlled).toEqual([{
      value: ['sales', 'support'], previousValue: ['sales'], reason: 'toggle', changed: true,
    }]);
  });

  it.each([undefined, null, 'invalid'])('keeps non-array initial options (%j) on the legacy contract', async initial => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const modelValue = [{ name: 'Legacy' }];
    updateWrapper({ options: initial, modelValue, useDropdown: true });
    await open();
    const row = document.querySelector('[role="menuitem"]');
    expect(row?.textContent).toContain('Legacy');
    row.click();
    await reconcile();
    expect(modelValue[0].active).toBe(true);
    expect(wrapper.emitted('update:selected')).toBeUndefined();
  });

  it.each([null, undefined, 'invalid'])('fails safe when born-controlled options become %j', async invalid => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const modelValue = [{ name: 'Legacy' }];
    updateWrapper({ modelValue, useDropdown: true, selected: 'sales' });
    await open();
    await wrapper.setProps({ options: invalid });
    await open();
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('false');
    expect(document.querySelector('[data-qa="dt-dropdown-list-wrapper"] [role^="menuitem"]')).toBeNull();
    expect(modelValue).toEqual([{ name: 'Legacy' }]);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
  });

  it.each([undefined, createCommentVNode('empty')])('preserves an empty legacy header slot without padding', async content => {
    updateWrapper({ options: undefined, modelValue: [{ name: 'Legacy' }] }, { headerContent: () => content });
    await open();
    expect(document.querySelector('[data-qa="dt-popover-header-footer"]')).toBeNull();
  });

  it('keeps legacy header nodes directly in the existing styled header content', async () => {
    updateWrapper({
      options: undefined, modelValue: [{ name: 'Legacy' }], headerContentClass: 'header-content',
      popoverHeaderClass: 'header-outer',
    }, { headerContent: ({ close }) => [
      h('h2', { 'data-qa': 'header-title' }, 'Teams'),
      h('button', { 'data-qa': 'header-close', onClick: close }, 'Close'),
    ] });
    await open();
    const title = document.querySelector('[data-qa="header-title"]');
    const close = document.querySelector('[data-qa="header-close"]');
    expect(title.parentElement).toBe(document.querySelector('[data-qa="dt-popover-header-footer-content"]'));
    expect(title.parentElement.classList.contains('header-content')).toBe(true);
    expect(close.parentElement).toBe(title.parentElement);
    expect(title.closest('[data-qa="dt-popover-header-footer"]').classList.contains('header-outer')).toBe(true);
    close.click();
    await reconcile();
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('false');
  });

  it.each([
    ['onSelectionChangePassive', 'onSelectionChange', 'onSelectionChangeOnce'],
    ['onSelectionChange', 'onSelectionChangePassive', 'onSelectionChangeOnce'],
    ['onSelectionChangeOnce', 'onSelectionChangePassive', 'onSelectionChange'],
    ['onOpenedPassive', 'onOpened', 'onOpenedOnce'],
  ])('preserves forwarded legacy registration order beginning with %s', async (...keys) => {
    const trace = [];
    const listeners = Object.fromEntries(keys.map(key => [key, () => trace.push(key)]));
    const eventName = keys[0].startsWith('onOpened') ? 'opened' : 'selection-change';
    wrapper = mount({
      setup: (_, { attrs }) => () => h(DtFilterPill, {
        modelValue: [], label: 'Legacy', popoverAppendTo: 'parent', ...attrs,
      }, { content: () => h('button', { 'data-qa': 'legacy-event' }, 'Dispatch') }),
    }, {
      attrs: {
        ...listeners,
        [eventName === 'opened' ? 'onOpenedPassiveCapture' : 'onSelectionChangePassiveCapture']: () => trace.push('capture'),
        class: 'consumer-root', style: { color: 'red' }, 'data-qa': 'consumer-root',
      },
      global: { plugins: [DtTooltipDirective, DtFocustrapDirective] }, attachTo: document.body,
    });
    await open();
    const target = document.querySelector('[data-qa="legacy-event"]');
    target.dispatchEvent(new CustomEvent(eventName, { bubbles: true }));
    target.dispatchEvent(new CustomEvent(eventName, { bubbles: true }));
    expect(trace).toEqual(['capture', ...keys, 'capture', ...keys.filter(key => !key.endsWith('Once'))]);
    expect(wrapper.element.classList.contains('consumer-root')).toBe(true);
    expect(wrapper.element.classList.contains('d-filter-pill')).toBe(true);
    expect(wrapper.element.style.color).toBe('red');
    expect(wrapper.element.getAttribute('data-qa')).toBe('consumer-root');
    expect(wrapper.findComponent(DtFilterPill).emitted('opened')).toBeUndefined();
  });

  it.each([
    ['onSelectionChangePassive', 'onSelectionChange'],
    ['onSelectionChangeOncePassive', 'onSelectionChangeOnce'],
    ['onOpenedPassive', 'onOpened'],
  ])('preserves stopImmediatePropagation from the first legacy listener %s', async (first, second) => {
    const trace = [];
    updateWrapper({ options: undefined, popoverAppendTo: 'parent' }, {
      content: () => h('button', { 'data-qa': 'legacy-event' }, 'Dispatch'),
    }, {
      [first]: event => { trace.push(first); event.stopImmediatePropagation(); },
      [second]: () => trace.push(second),
    });
    await open();
    document.querySelector('[data-qa="legacy-event"]').dispatchEvent(new CustomEvent(
      first.startsWith('onOpened') ? 'opened' : 'selection-change', { bubbles: true },
    ));
    expect(trace).toEqual([first]);
  });

  it('renders nullable optional labels and neutral values as absent without mutating options', async () => {
    const nullableOptions = Object.freeze([Object.freeze({ value: 'sales', label: 'Sales', shortLabel: null })]);
    updateWrapper({ useDropdown: true, options: nullableOptions, selected: 'sales', neutralValue: null });
    expect(wrapper.find('[data-qa="dt-filter-pill__label"]').text()).toContain('Sales');
    expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(true);
    await wrapper.find('[data-qa="dt-filter-pill__clear-button"]').trigger('click');
    expect(wrapper.emitted('update:selected')).toEqual([[null]]);
    expect(nullableOptions[0].shortLabel).toBeNull();
  });

  it.each([false, true])('allows parent removal after completed focus and scroll cleanup (dropdown=%s)', async useDropdown => {
    document.documentElement.classList.remove('d-of-hidden');
    const trace = [];
    const visible = ref(true);
    let controls;
    wrapper = mount({
      setup: () => () => visible.value && h(DtFilterPill, {
        label: 'Teams', options, useDropdown, selected: useDropdown ? 'sales' : ['sales'],
        onOpened: value => {
          trace.push({
            value,
            locked: document.documentElement.classList.contains('d-of-hidden'),
            focused: document.activeElement?.getAttribute('data-qa'),
          });
          if (!value) visible.value = false;
        },
      }, { content: bindings => {
        controls = bindings;
        return h('button', { 'data-qa': 'inside' }, 'Inside');
      } }),
    }, {
      global: { plugins: [DtTooltipDirective, DtFocustrapDirective], stubs: { transition: false } },
      attachTo: document.body,
    });
    const pill = wrapper.findComponent(DtFilterPill);
    await open();
    await vi.waitFor(() => expect(trace).toHaveLength(1));
    expect(trace[0].value).toBe(true);
    expect(trace[0].locked).toBe(true);
    controls.close();
    expect(pill.emitted('open')).toEqual([[true], [false]]);
    expect(trace).toHaveLength(1);
    expect(wrapper.findComponent(DtFilterPill).exists()).toBe(true);
    await vi.waitFor(() => expect(trace).toHaveLength(2));
    expect(trace[1]).toEqual({ value: false, locked: false, focused: 'dt-filter-pill__button' });
    expect(pill.emitted('opened')).toEqual([[true], [false]]);
    expect(wrapper.findComponent(DtFilterPill).exists()).toBe(false);
    expect(document.documentElement.classList.contains('d-of-hidden')).toBe(false);
  });

  it.each([false, true])('keeps the overlay locked through cancelled leave and only reports the final close (dropdown=%s)', async useDropdown => {
    document.documentElement.classList.remove('d-of-hidden');
    let controls;
    const trace = [];
    updateWrapper({ useDropdown, selected: useDropdown ? 'sales' : ['sales'] }, {
      content: bindings => { controls = bindings; return h('button', { 'data-qa': 'inside' }, 'Inside'); },
    }, { onOpened: value => trace.push(value) }, { stubs: { transition: false } });
    await open();
    await vi.waitFor(() => expect(trace).toEqual([true]));
    controls.close();
    await reconcile();
    await open();
    await vi.waitFor(() => expect(trace).toEqual([true, true]));
    expect(document.documentElement.classList.contains('d-of-hidden')).toBe(true);
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('true');
    controls.close();
    await vi.waitFor(() => expect(trace).toEqual([true, true, false]));
    expect(document.documentElement.classList.contains('d-of-hidden')).toBe(false);
  });

  it('keeps a born-legacy pill legacy when array options arrive later', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({ options: undefined, modelValue: [{ name: 'Legacy' }] });
    await wrapper.setProps({ options, useDropdown: true });
    await open();
    expect(document.querySelector('[role="menuitem"]')?.textContent).toContain('Legacy');
    expect(document.querySelector('[role="menuitemradio"]')).toBeNull();
  });

  it('forwards controlled anchor arrows through the dropdown callback and prevents scrolling', async () => {
    updateWrapper({ useDropdown: true, selected: 'sales' });
    const anchor = wrapper.find('[data-qa="dt-filter-pill__button"]');
    let event;
    anchor.element.addEventListener('keydown', nativeEvent => { event = nativeEvent; }, { once: true });
    await anchor.trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
    await reconcile();
    expect(event.defaultPrevented).toBe(true);
    expect(wrapper.emitted('open')).toEqual([[true]]);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
    expect([...document.querySelectorAll('[data-qa="dt-filter-pill__option"]')].map(row => row.getAttribute('aria-checked')))
      .toEqual(['true', 'false', 'false']);
  });

  it('keeps trailing slots inside built-in labels while the default slot replaces anchor content', async () => {
    updateWrapper({ useDropdown: true, selected: 'sales', anchorEndClass: 'anchor-count', optionEndClass: 'choice-count' }, {
      anchorEnd: ({ selected }) => selected === 'sales' ? h('span', '12 items') : createCommentVNode(),
      optionEnd: ({ option, selected }) => h('span', `${option.value}:${selected}`),
    });
    expect(wrapper.find('.anchor-count').text()).toBe('12 items');
    expect(wrapper.find('[data-qa="dt-filter-pill__label"]').text()).toContain('Sales');
    await wrapper.setProps({ selected: 'support' });
    expect(wrapper.find('[data-qa="dt-filter-pill__anchor-end"]').exists()).toBe(false);
    await wrapper.setProps({ selected: 'sales' });
    expect(wrapper.get('.anchor-count').text()).toBe('12 items');
    await open();
    expect(document.querySelector('.choice-count').textContent).toBe('sales:true');
    expect(document.querySelector('[role="menuitemradio"]').textContent).toContain('Sales');
    wrapper.unmount();
    document.body.innerHTML = '';
    updateWrapper({ useDropdown: true, selected: 'hidden', neutralValue: 'hidden' }, {
      default: ({ selected, displayLabel }) => selected === 'hidden' ? 'All contacts' : displayLabel,
      anchorEnd: () => 'Hidden count',
    });
    expect(wrapper.find('[data-qa="dt-filter-pill__label"]').text()).toBe('All contacts');
    expect(wrapper.find('[data-qa="dt-filter-pill__anchor-end"]').exists()).toBe(false);
    expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(false);
  });


  it.each(['modelValue', 'model-value'])('diagnoses an explicitly forwarded legacy %s only once', async spelling => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    wrapper = mount({
      setup: () => () => h(DtFilterPill, { options, selected: ['sales'], label: 'Teams', [spelling]: undefined }),
    }, { global: { plugins: [DtTooltipDirective, DtFocustrapDirective] }, attachTo: document.body });
    await open();
    expect(warn.mock.calls.filter(([message]) => message.includes('modelValue is ignored'))).toHaveLength(1);
  });

  it('keeps controlled diagnostics quiet for a production consumer', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const previous = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      updateWrapper({ options: [null] });
      expect(warn.mock.calls.some(([message]) => message.includes('[Dialtone FilterPill]'))).toBe(false);
    } finally {
      process.env.NODE_ENV = previous;
    }
  });

  it('ignores a legacy listener alone and diagnoses a raw legacy prop added later', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const forwardLegacy = ref(false);
    wrapper = mount({
      setup: () => () => h(DtFilterPill, {
        options, selected: ['sales'], label: 'Teams', 'onUpdate:modelValue': () => {},
        ...(forwardLegacy.value ? { modelValue: undefined } : {}),
      }),
    }, { global: { plugins: [DtTooltipDirective, DtFocustrapDirective] }, attachTo: document.body });
    expect(warn.mock.calls.some(([message]) => message.includes('modelValue'))).toBe(false);
    forwardLegacy.value = true;
    await reconcile();
    expect(warn.mock.calls.filter(([message]) => message.includes('modelValue'))).toHaveLength(1);
  });

  it('supports empty controlled loading without a missing-content warning or corrective action', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({ options: [], selected: ['unknown'] });
    await open();
    expect(checks()).toHaveLength(0);
    expect(warn).not.toHaveBeenCalled();
    await wrapper.setProps({ options });
    expect(checks()).toHaveLength(3);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
  });

  it('keeps punctuation, empty and non-Latin values separate from stable DOM IDs', async () => {
    const special = [
      { value: '', label: 'Duplicate' }, { value: 'a:#[]', label: 'Duplicate' }, { value: '日本語', label: '日本語' },
    ];
    updateWrapper({ useDropdown: true, options: special, selected: '', neutralValue: '' });
    await open();
    const rows = [...document.querySelectorAll('[data-qa="dt-filter-pill__option"]')];
    const ids = rows.map(row => row.id);
    expect(new Set(ids).size).toBe(3);
    ids.forEach((id, index) => expect(document.getElementById(id)).toBe(rows[index]));
    rows[1].click();
    await reconcile();
    expect(wrapper.emitted('update:selected')).toEqual([['a:#[]']]);
    await wrapper.setProps({ selected: '日本語' });
    await open();
    expect([...document.querySelectorAll('[data-qa="dt-filter-pill__option"]')].map(row => row.id)).toEqual(ids);
    expect(document.querySelectorAll('[data-qa="dt-filter-pill__option"]')[2].getAttribute('aria-checked')).toBe('true');
  });

  it('keeps Apply inert in an open immediate session and lets Cancel dismiss without an action', async () => {
    let controls;
    updateWrapper({}, { content: bindings => { controls = bindings; return 'Custom'; } });
    await open();
    await controls.apply();
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('true');
    expect(wrapper.emitted('apply')).toBeUndefined();
    controls.cancel();
    await reconcile();
    expect(wrapper.emitted('open')).toEqual([[true], [false]]);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
  });

  it('discards deferred edits on content close and starts a fresh draft when reopened', async () => {
    let controls;
    updateWrapper({ deferSelection: true }, { content: bindings => { controls = bindings; return 'Custom'; } });
    await open();
    controls.setSelected(['support']);
    await reconcile();
    expect(controls.pendingSelected).toEqual(['support']);
    controls.close();
    await reconcile();
    await open();
    expect(controls.pendingSelected).toEqual(['sales']);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
  });

  it('lets a parent focus destination win when accepting a closed clear', async () => {
    updateWrapper();
    const destination = document.createElement('button');
    document.body.append(destination);
    const clear = wrapper.find('[data-qa="dt-filter-pill__clear-button"]').element;
    clear.focus();
    clear.click();
    const accepted = wrapper.setProps({ selected: [] });
    destination.focus();
    await accepted;
    await reconcile();
    expect(document.activeElement).toBe(destination);
  });


  it('moves focus to the nearest surviving row, then the empty overlay, without changing selection', async () => {
    updateWrapper({ useDropdown: true, selected: 'support' });
    await open();
    document.querySelectorAll('[data-qa="dt-filter-pill__option"]')[1].focus();
    await wrapper.setProps({ options: [options[0], options[2]] });
    await reconcile();
    const remaining = [...document.querySelectorAll('[data-qa="dt-filter-pill__option"]')];
    expect(document.activeElement).toBe(remaining[1]);
    await wrapper.setProps({ options: [] });
    await reconcile();
    expect(document.activeElement).toBe(document.querySelector('[role="menu"]'));
    expect(wrapper.emitted('selection-change')).toBeUndefined();
  });

  it('recovers focus and subsequent navigation after in-place option reorder and removal', async () => {
    const liveOptions = ref(options.map(option => ({ ...option })));
    wrapper = mount({
      setup: () => () => h(DtFilterPill, {
        options: liveOptions.value, selected: 'support', label: 'Teams', useDropdown: true,
      }),
    }, {
      global: { plugins: [DtTooltipDirective, DtFocustrapDirective], stubs: { transition: false } },
      attachTo: document.body,
    });
    await open();
    await flushPromises();
    const row = document.querySelectorAll('[data-qa="dt-filter-pill__option"]')[1];
    row.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    row.focus();
    liveOptions.value.unshift(...liveOptions.value.splice(1, 1));
    await reconcile();
    row.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown', code: 'ArrowDown', bubbles: true, cancelable: true,
    }));
    await reconcile();
    expect(document.activeElement.textContent).toContain('Sales');
    liveOptions.value.splice(1, 1);
    await reconcile();
    expect(document.activeElement.textContent).toContain('Engineering');
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowUp', code: 'ArrowUp', bubbles: true, cancelable: true,
    }));
    await reconcile();
    expect(document.activeElement.textContent).toContain('Support');
    expect(wrapper.findComponent(DtFilterPill).emitted('selection-change')).toBeUndefined();
  });

  it('clears a dirty deferred session immediately in exact action order', async () => {
    const trace = [];
    updateWrapper({ deferSelection: true, open: false }, {}, {
      'onUpdate:selected': value => trace.push(['update', value]),
      onSelectionChange: action => trace.push(['action', action.reason, action.value, action.previousValue]),
      onClear: event => trace.push(['clear', event.type]),
      'onUpdate:open': value => trace.push(['visibility', value]),
      onOpen: value => trace.push(['open', value]),
    });
    await open();
    checks()[1].click();
    await reconcile();
    expect(wrapper.emitted('selection-change')).toBeUndefined();
    await wrapper.find('[data-qa="dt-filter-pill__clear-button"]').trigger('click');
    expect(trace).toEqual([
      ['visibility', true], ['open', true], ['update', []],
      ['action', 'clear', [], ['sales']], ['clear', 'click'], ['visibility', false], ['open', false],
    ]);
    await open();
    expect(checks().map(input => input.checked)).toEqual([true, false, false]);
  });

  it('discards deferred edits on Escape and requires a separately delivered false-to-true reopen', async () => {
    updateWrapper({ deferSelection: true, open: true });
    await reconcile();
    checks()[1].click();
    await reconcile();
    checks()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    await reconcile();
    expect(wrapper.emitted('open')).toEqual([[true], [false]]);
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
    // Ignoring dismissal leaves open=true unchanged, and cannot reopen it.
    await wrapper.setProps({ open: true });
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('false');
    await wrapper.setProps({ open: false });
    await wrapper.setProps({ open: true });
    await reconcile();
    expect(checks().map(input => input.checked)).toEqual([true, false, false]);
    expect(wrapper.emitted('update:open')).toEqual([[false]]);
  });


  it('stops an opening trace when its update listener synchronously closes through retained content', async () => {
    const trace = [];
    let controls;
    let dismissOpening = false;
    updateWrapper({ open: false }, {
      content: bindings => { controls = bindings; return 'Custom content'; },
    }, {
      'onUpdate:open': value => {
        trace.push(['update', value]);
        if (value && dismissOpening) controls.close();
      },
      onOpen: value => trace.push(['open', value]),
    });
    await open();
    controls.close();
    await reconcile();
    trace.length = 0;
    dismissOpening = true;
    await open();
    expect(trace).toEqual([['update', true], ['update', false], ['open', false]]);
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('false');
  });

  it('recovers an open malformed option list when the parent supplies valid records', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({ options: [null] });
    await open();
    expect(checks()).toHaveLength(0);
    await wrapper.setProps({ options });
    await reconcile();
    expect(checks().map(input => input.checked)).toEqual([true, false, false]);
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('true');
    expect(wrapper.emitted('selection-change')).toBeUndefined();
  });

});
