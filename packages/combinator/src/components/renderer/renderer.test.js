import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { DtPagination } from '@dialpad/dialtone-vue';
import DtcRenderer from './renderer.vue';

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
