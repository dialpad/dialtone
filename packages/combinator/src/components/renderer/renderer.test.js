import { flushPromises, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { DtButton, DtDropdown, DtPagination } from '@dialpad/dialtone-vue';
import DtcRenderer from './renderer.vue';
import DtcRendererSpecSheetCell from './renderer_spec_sheet_cell.vue';

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
