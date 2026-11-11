import { shallowMount } from '@vue/test-utils';
import DtcCodePanel from './code_panel.vue';

it('shows configuration snapshot responsibilities only for a bank that declares them', async () => {
  const wrapper = shallowMount(DtcCodePanel, {
    props: {
      info: { metadata: { copyNotice: 'Bind v-model:selected for interaction.' } },
      options: {},
      settings: { root: { theme: 'light' }, code: { scheme: 'mono', verbose: false, indent: 2 } },
    },
    global: {
      directives: { 'dt-scrollbar': {} },
      stubs: { DtcOverlay: { template: '<div><slot name="content" /></div>' } },
    },
  });
  expect(wrapper.text()).toContain('Bind v-model:selected for interaction.');
  await wrapper.setProps({ info: {} });
  expect(wrapper.text()).not.toContain('Bind v-model:selected for interaction.');
  wrapper.unmount();
});
