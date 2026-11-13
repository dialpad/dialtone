import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, markRaw, nextTick } from 'vue';
import { DtButton, DtDropdown, DtFilterPill, DtPagination } from '@dialpad/dialtone-vue';
import allDocs from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import { buildVariantState, computeDisabledMembers, writeUpdateEvent } from '@/src/lib/variant_state';
import filterPillVariants from '@/src/variants/variants_filter_pill';
import DtcRenderer from './renderer.vue';
import DtcRendererSpecSheetCell from './renderer_spec_sheet_cell.vue';


it.each([
  { name: 'single', component: DtcRenderer, preset: 'controlled default', nextPreset: 'default', closing: true },
  { name: 'single', component: DtcRenderer, preset: 'defer selection', nextPreset: 'controlled default' },
  { name: 'specsheet', component: DtcRendererSpecSheetCell, preset: 'use dropdown', nextPreset: 'controlled multiple' },
  {
    name: 'specsheet', component: DtcRendererSpecSheetCell,
    preset: 'controlled deferred', nextPreset: 'default', consumerFocus: true,
  },
])('closes $preset before replacing the $name preview and retains the outgoing scroll context', async ({
  name, component, preset, nextPreset, closing, consumerFocus,
}) => {
  let pill;
  const initiatingControl = closing ? document.createElement('button') : null;
  const consumerControl = consumerFocus ? document.createElement('button') : null;
  const target = markRaw(defineComponent({
    extends: DtFilterPill,
    mounted () {
      pill = this;
      if (consumerControl?.isConnected) consumerControl.focus();
    },
  }));
  const documentation = allDocs.find(doc => doc.displayName === 'DtFilterPill');
  const state = buildVariantState(DtFilterPill, documentation, filterPillVariants, preset);
  state.options.props.popoverAppendTo = 'parent';
  const wrapper = mount(component, {
    attachTo: document.body,
    props: {
      component: target, ...state, library: {},
      ...(name === 'single' ? {
        settings: {},
        disabledMembers: computeDisabledMembers(state.info, state.options.props, state.options.slots),
      } : { name: preset }),
    },
    global: { directives: { 'dt-focustrap': {} } },
  });
  try {
    await flushPromises();
    const anchor = wrapper.get('[data-qa="dt-filter-pill__button"]');
    const originalText = anchor.text();
    await anchor.trigger('click');
    await flushPromises();
    const oldPill = pill;
    const overlay = oldPill.$refs.overlay;
    const popover = overlay.$options.name === 'DtDropdown' ? overlay.$refs.popover : overlay;
    // jsdom stubs CSS transitions; deliver the real owner's transition boundary explicitly.
    await popover.onEnterTransitionComplete();
    expect(document.documentElement.classList.contains('d-of-hidden')).toBe(true);
    if (state.options.props.deferSelection) {
      wrapper.get('input[type="checkbox"]').element.click();
      await flushPromises();
    }
    if (closing) {
      oldPill.cancelSelection();
      await flushPromises();
    }
    if (initiatingControl) {
      document.body.appendChild(initiatingControl);
      initiatingControl.focus();
    } else anchor.element.focus();
    if (consumerControl) document.body.appendChild(consumerControl);
    const next = buildVariantState(DtFilterPill, documentation, filterPillVariants, nextPreset);
    await wrapper.setProps({
      ...next, resetGeneration: 1,
      ...(name === 'single' ? {
        disabledMembers: computeDisabledMembers(next.info, next.options.props, next.options.slots),
      } : {}),
    });
    await flushPromises();
    expect(anchor.element.isConnected).toBe(true);
    expect(anchor.text()).toBe(originalText);
    expect(anchor.attributes('aria-expanded')).toBe('false');
    expect(document.documentElement.classList.contains('d-of-hidden')).toBe(true);
    // A reopen of the retained preview must close again before it can be replaced.
    await anchor.trigger('click');
    await flushPromises();
    expect(anchor.attributes('aria-expanded')).toBe('false');
    await popover.onLeaveTransitionComplete();
    await flushPromises();
    expect(document.documentElement.classList.contains('d-of-hidden')).toBe(false);
    expect(anchor.element.isConnected).toBe(false);
    expect(document.activeElement).toBe(consumerControl || initiatingControl ||
      wrapper.get('[data-qa="dt-filter-pill__button"]').element);
    expect(wrapper.get('[data-qa="dt-filter-pill__button"]').text()).toContain({
      default: 'Option 3', 'controlled default': 'All', 'controlled multiple': 'Phone',
    }[nextPreset]);
    const events = wrapper.findComponent({ name: 'DtcRendererTarget' }).emitted('event') ?? [];
    expect(events.filter(([event]) => event === 'apply' || event === 'update:selected' ||
      event === 'update:modelValue')).toEqual([]);
  } finally {
    wrapper.unmount();
    document.documentElement.classList.remove('d-of-hidden');
    initiatingControl?.remove();
    consumerControl?.remove();
  }
});

it.each([
  { name: 'single', component: DtcRenderer },
  { name: 'specsheet', component: DtcRendererSpecSheetCell },
])('preserves an open controlled menu through selection, options and counts in $name', async ({ name, component }) => {
  const state = buildVariantState(DtFilterPill,
    allDocs.find(doc => doc.displayName === 'DtFilterPill'), filterPillVariants, 'controlled counts');
  state.options.props.open = false;
  const wrapper = mount(component, {
    attachTo: document.body,
    props: {
      component: markRaw(DtFilterPill),
      ...state,
      library: {},
      ...(name === 'single' ? {
        settings: {},
        disabledMembers: computeDisabledMembers(state.info, state.options.props, state.options.slots),
        onEvent: (event, value) => writeUpdateEvent(state.options, event, value),
      } : { name: 'controlled counts' }),
    },
    global: { directives: { 'dt-focustrap': {} } },
  });
  try {
    await flushPromises();
    const anchor = wrapper.get('[data-qa="dt-filter-pill__button"]');
    await anchor.trigger('click');
    await flushPromises();
    const menuId = anchor.attributes('aria-controls');
    const menu = document.getElementById(menuId);
    const row = menu.querySelector('[role="menuitemradio"]');
    row.focus();
    state.options.props.selected = 'mentions';
    state.options.props.options = state.options.props.options.map(option => ({
      ...option, label: option.label + ' translated',
    }));
    state.options.slots.optionEnd = state.options.slots.optionEnd.replaceAll('12', '13');
    await flushPromises();
    expect(anchor.element.isConnected).toBe(true);
    expect(document.getElementById(menuId)).toBe(menu);
    expect(anchor.attributes('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(row);
    expect(row.textContent).toContain('All Messages translated');
    menu.querySelectorAll('[role="menuitemradio"]')[1].click();
    await flushPromises();
    expect(state.options.props.selected).toBe('unread');
    const events = wrapper.findComponent({ name: 'DtcRendererTarget' }).emitted('event');
    expect(events.filter(([event]) => event === 'update:selected')).toEqual([['update:selected', 'unread']]);
    expect(events.filter(([event]) => event === 'update:open')).toEqual([
      ['update:open', true], ['update:open', false],
    ]);
  } finally {
    wrapper.unmount();
  }
});

it.each([
  { name: 'single', component: DtcRenderer },
  { name: 'specsheet', component: DtcRendererSpecSheetCell },
])('updates actual Filter Pill legacy arrays and controlled options in $name', async ({ name, component }) => {
  const warnings = vi.spyOn(console, 'warn');
  const documentation = allDocs.find(doc => doc.displayName === 'DtFilterPill');
  const state = buildVariantState(DtFilterPill, documentation, filterPillVariants, 'controlled default');
  const wrapper = mount(component, {
    attachTo: document.body,
    props: {
      component: markRaw(DtFilterPill),
      ...state,
      library: {},
      ...(name === 'single' ? {
        settings: {},
        disabledMembers: computeDisabledMembers(state.info, state.options.props, state.options.slots),
      } : { name: 'default' }),
    },
    global: { directives: { 'dt-focustrap': {} } },
  });
  try {
    await flushPromises();
    const anchor = () => wrapper.get('[data-qa="dt-filter-pill__button"]');
    expect(wrapper.get('.d-filter-pill__label-start').text()).toBe('All');
    expect(warnings.mock.calls.flat().join(' ')).not.toContain('modelValue is ignored');
    const firstAnchor = anchor().element;
    state.options.props.selected = 'unread';
    state.options.props.options = [
      { value: 'all', label: 'Everything', shortLabel: 'All' },
      { value: 'unread', label: 'Unread messages', shortLabel: 'Unread' },
    ];
    await flushPromises();
    expect(wrapper.get('.d-filter-pill__label-start').text()).toBe('Unread');
    expect(anchor().element).toBe(firstAnchor);

    for (const preset of ['controlled multiple', 'default', 'read only selection', 'controlled default']) {
      const next = buildVariantState(DtFilterPill, documentation, filterPillVariants, preset);
      await wrapper.setProps({
        ...next,
        ...(name === 'single' ? {
          disabledMembers: computeDisabledMembers(next.info, next.options.props, next.options.slots),
        } : {}),
      });
      await flushPromises();
      expect(anchor().text()).toContain({
        'controlled multiple': 'Phone',
        default: 'Option 3',
        'read only selection': 'Headquarters',
        'controlled default': 'All',
      }[preset]);
    }
  } finally {
    wrapper.unmount();
    warnings.mockRestore();
  }
});

it('keeps the preview on the canonical page after an invalid total recovers', async () => {
  const optionsFor = totalPages => ({
    props: { totalPages, activePage: 1, ariaLabel: 'Pages' },
    slots: {},
    bindings: { get: () => ({ totalPages, activePage: 1, ariaLabel: 'Pages' }) },
  });
  const wrapper = mount(DtcRenderer, {
    props: {
      component: DtPagination,
      options: optionsFor(10),
      info: { props: [{ name: 'activePage', slider: { min: 1, maxProp: 'totalPages', step: 1 } }], events: [] },
      settings: {},
      library: {},
    },
  });
  await nextTick();
  await wrapper.setProps({ options: optionsFor(0) });
  await nextTick();
  await wrapper.setProps({ options: optionsFor(10) });
  await nextTick();
  expect(wrapper.get('.d-pagination__item.d-btn--primary').text()).toBe('1');
  wrapper.unmount();
});

it.each([
  { name: 'single', component: DtcRenderer },
  { name: 'specsheet', component: DtcRendererSpecSheetCell },
])('keeps the real Dropdown anchor ARIA state live in the $name preview', async ({ name, component }) => {
  const bindings = { open: null, modal: false, transition: '', appendTo: 'parent' };
  const wrapper = mount(component, {
    attachTo: document.body,
    props: {
      component: DtDropdown,
      library: { DtButton },
      info: {
        props: [],
        events: [],
        slots: [{
          name: 'anchor',
          scopeName: 'anchorAttrs',
          bindings: [{ name: 'ref' }, { name: 'aria-expanded' }, { name: 'aria-controls' }, { name: 'aria-haspopup' }],
        }, { name: 'list' }],
      },
      options: {
        props: bindings,
        slots: {
          anchor: '<dt-button data-qa="dropdown-trigger" :aria-expanded="anchorAttrs[\'aria-expanded\']" ' +
            ':aria-controls="anchorAttrs[\'aria-controls\']" ' +
            ':aria-haspopup="anchorAttrs[\'aria-haspopup\']">Actions</dt-button>',
          list: '<li role="menuitem">Open profile</li>',
        },
        bindings: { get: () => bindings },
      },
      ...(name === 'single' ? { settings: {} } : { name: 'default' }),
    },
  });
  try {
    await flushPromises();
    const trigger = () => wrapper.get('button[data-qa="dropdown-trigger"]');
    expect(trigger().attributes('aria-expanded')).toBe('false');
    expect(trigger().attributes('aria-haspopup')).toBe('menu');
    const popupId = trigger().attributes('aria-controls');
    expect(popupId).toBeTruthy();

    await trigger().trigger('click');
    await flushPromises();
    expect(trigger().attributes('aria-expanded')).toBe('true');
    const popup = document.getElementById(popupId);
    expect(popup?.getAttribute('role')).toBe('menu');
    expect(popup?.textContent).toContain('Open profile');

    await trigger().trigger('click');
    await flushPromises();
    expect(trigger().attributes('aria-expanded')).toBe('false');
    expect(trigger().attributes('aria-controls')).toBe(popupId);
  } finally {
    wrapper.unmount();
  }
});
