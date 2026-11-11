import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
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
  const updateWrapper = (props = {}, slots = {}, attrs = {}, globalOptions = {}) => {
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
  const checks = () => [...document.querySelectorAll('input[type="checkbox"]')];

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = '';
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
    expect(wrapper.find('.d-filter-pill__label').text()).toContain('All');
    expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(false);
    await open();
    const rows = [...document.querySelectorAll('[role="menuitemradio"]')];
    expect(rows.map(row => row.getAttribute('aria-checked'))).toEqual(['true', 'false']);
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
    expect(wrapper.find('.d-filter-pill__label').text()).toContain('All');
    await wrapper.setProps({ selected: 'calls' });
    expect(wrapper.find('.d-filter-pill__label').text()).toContain('Calls');
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
    const row = document.querySelectorAll('[role="menuitemradio"]')[1];
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

  it('rebases a dirty deferred draft on same-tick parent replacement before retained Apply', async () => {
    const selected = ref(['sales']);
    let controls;
    wrapper = mount({
      setup: () => () => h(DtFilterPill, {
        label: 'Teams', options, selected: selected.value, deferSelection: true,
      }, { content: bindings => {
        controls = bindings;
        return h('button', { onClick: () => bindings.setSelected(['sales', 'support']) }, 'Edit draft');
      } }),
    }, { global: { plugins: [DtTooltipDirective, DtFocustrapDirective] }, attachTo: document.body });
    await open();
    controls.setSelected(['sales', 'support']);
    await reconcile();
    selected.value = ['engineering'];
    const applying = controls.apply();
    expect(applying).toBeInstanceOf(Promise);
    await applying;
    const pill = wrapper.findComponent(DtFilterPill);
    expect(pill.emitted('update:selected')).toBeUndefined();
    expect(pill.emitted('selection-change')).toEqual([[{
      value: ['engineering'], previousValue: ['engineering'], reason: 'apply', changed: false,
    }]]);
    expect(pill.emitted('apply')).toEqual([[]]);
    expect(pill.emitted('open')).toEqual([[true], [false]]);
  });

  it('preserves dirty draft for equal membership/labels but rebases option identity changes', async () => {
    updateWrapper({ deferSelection: true });
    await open();
    checks()[1].click();
    await reconcile();
    await wrapper.setProps({ selected: ['sales'], options: options.map(option => ({ ...option, label: option.label + ' translated' })) });
    expect(checks().map(input => input.checked)).toEqual([true, true, false]);
    expect(wrapper.find('.d-filter-pill__label').text()).not.toContain('Support');
    await wrapper.setProps({ options: options.slice(0, 2) });
    await reconcile();
    expect(checks().map(input => input.checked)).toEqual([true, false]);
    document.querySelector('[data-qa="dt-filter-pill__apply-button"]').click();
    await reconcile();
    expect(wrapper.emitted('selection-change')[0][0].changed).toBe(false);
    expect(wrapper.emitted('update:selected')).toBeUndefined();
  });

  it('coalesces repeated Apply and makes retained callbacks inert after dismissal', async () => {
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

  it('stops the action trace when a synchronous listener unmounts the instance', async () => {
    const trace = [];
    updateWrapper({}, {}, {
      onSelectionChange: action => { trace.push(['action', action.reason]); wrapper.unmount(); },
      onOpen: value => trace.push(['open', value]),
      onClear: () => trace.push(['clear']),
    });
    await open();
    checks()[1].click();
    await reconcile();
    expect(trace).toEqual([['open', true], ['action', 'toggle']]);
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
    expect(wrapper.find('.d-filter-pill__label').text()).toContain('Unavailable');
    expect(wrapper.find('.d-filter-pill__label').text()).not.toContain('private-id');
    expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(true);
    await open();
    expect(checks().map(input => input.checked)).toEqual([true, false, false]);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
  });

  it('ignores an explicitly supplied empty legacy modelValue when controlled', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const modelValue = Object.freeze([]);
    updateWrapper({ modelValue });
    await open();
    checks()[1].click();
    await reconcile();
    expect(warn.mock.calls.some(([message]) => message.includes('modelValue'))).toBe(true);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(modelValue).toEqual([]);
  });

  it.each([null, [{ value: 'sales', label: 'Sales' }, { value: 'sales', label: 'Duplicate' }]])(
    'disables selection for malformed options (%j)', async badOptions => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      updateWrapper({ options: badOptions });
      expect(wrapper.find('[data-qa="dt-filter-pill__clear-button"]').exists()).toBe(false);
      await open();
      expect(wrapper.find('.d-filter-pill__primary').classes()).not.toContain('d-filter-pill--selected');
      expect(warn.mock.calls.some(([message]) => message.includes('unique string values'))).toBe(true);
      expect(checks()).toHaveLength(0);
      expect(wrapper.emitted('selection-change')).toBeUndefined();
    },
  );


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

  it.each([false, true])('preserves legacy native listeners and ignores controlled open (dropdown=%s)', async useDropdown => {
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

  it('keeps the creation-time contract in both directions while legacy patterns remain reactive', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const modelValue = [{ name: 'Legacy' }];
    updateWrapper({ options: undefined, modelValue });
    await wrapper.setProps({ options, useDropdown: true });
    await open();
    expect(document.querySelector('[role="menuitem"]')?.textContent).toContain('Legacy');
    expect(document.querySelector('[role="menuitemradio"]')).toBeNull();
    wrapper.unmount();
    document.body.innerHTML = '';
    updateWrapper({ useDropdown: true, selected: 'sales' });
    await open();
    await wrapper.setProps({ options: undefined, modelValue });
    expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('false');
    expect(wrapper.emitted('selection-change')).toBeUndefined();
    expect(modelValue).toEqual([{ name: 'Legacy' }]);
  });

  it('forwards controlled anchor arrows through the dropdown callback and prevents scrolling', async () => {
    updateWrapper({ useDropdown: true, selected: 'sales' });
    const anchor = wrapper.find('[data-qa="dt-filter-pill__button"]').element;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);
    await reconcile();
    expect(event.defaultPrevented).toBe(true);
    expect(wrapper.emitted('open')).toEqual([[true]]);
    expect(wrapper.emitted('selection-change')).toBeUndefined();
    expect([...document.querySelectorAll('[role="menuitemradio"]')].map(row => row.getAttribute('aria-checked')))
      .toEqual(['true', 'false', 'false']);
  });

  it('keeps trailing slots inside built-in labels while the default slot replaces anchor content', async () => {
    updateWrapper({ useDropdown: true, selected: 'sales', anchorEndClass: 'anchor-count', optionEndClass: 'choice-count' }, {
      anchorEnd: ({ selected }) => h('span', selected === 'sales' ? '12 items' : ''),
      optionEnd: ({ option, selected }) => h('span', `${option.value}:${selected}`),
    });
    expect(wrapper.find('.anchor-count').text()).toBe('12 items');
    expect(wrapper.find('.d-filter-pill__label').text()).toContain('Sales');
    await open();
    expect(document.querySelector('.choice-count').textContent).toBe('sales:true');
    expect(document.querySelector('[role="menuitemradio"]').textContent).toContain('Sales');
    wrapper.unmount();
    document.body.innerHTML = '';
    updateWrapper({ useDropdown: true, selected: 'hidden', neutralValue: 'hidden' }, {
      default: ({ selected, displayLabel }) => selected === 'hidden' ? 'All contacts' : displayLabel,
      anchorEnd: () => 'Hidden count',
    });
    expect(wrapper.find('.d-filter-pill__label').text()).toBe('All contacts');
    expect(wrapper.find('.d-filter-pill__anchor-end').exists()).toBe(false);
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

  it('does not diagnose an omitted legacy value or model listener alone', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({}, {}, { 'onUpdate:modelValue': () => {} });
    await open();
    expect(warn.mock.calls.some(([message]) => message.includes('modelValue is ignored'))).toBe(false);
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
    const rows = [...document.querySelectorAll('[role="menuitemradio"]')];
    const ids = rows.map(row => row.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids.every(id => /^dt-filter-pill-option-\d+$/.test(id))).toBe(true);
    rows[1].click();
    await reconcile();
    expect(wrapper.emitted('update:selected')).toEqual([['a:#[]']]);
    await wrapper.setProps({ selected: '日本語' });
    await open();
    expect([...document.querySelectorAll('[role="menuitemradio"]')].map(row => row.id)).toEqual(ids);
    expect(document.querySelectorAll('[role="menuitemradio"]')[2].getAttribute('aria-checked')).toBe('true');
  });

  it('makes Apply a no-op outside an open deferred session and Cancel discards without an action', async () => {
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
    document.querySelectorAll('[role="menuitemradio"]')[1].focus();
    await wrapper.setProps({ options: [options[0], options[2]] });
    await reconcile();
    const remaining = [...document.querySelectorAll('[role="menuitemradio"]')];
    expect(document.activeElement).toBe(remaining[1]);
    await wrapper.setProps({ options: [] });
    await reconcile();
    expect(document.activeElement).toBe(document.querySelector('[role="menu"]'));
    expect(wrapper.emitted('selection-change')).toBeUndefined();
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
