import DtcRendererTarget from './renderer_target.vue';

import { expect } from 'vitest';
import { defineComponent, markRaw, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import filterPillVariants from '@/src/variants/variants_filter_pill';

const RootClassFixture = markRaw(defineComponent({
  name: 'RootClassFixture',
  props: {
    items: { type: Array, default: () => [] },
    label: { type: String, default: '' },
  },
  template: '<div class="fixture-root" data-qa="fixture-root">{{ items[0]?.name }} {{ label }}<slot /></div>',
}));

describe('renderer_target.vue test', function () {
  it('recreates opted-in previews for reset and reference changes while preserving ordinary updates', async () => {
    const firstItems = [{ name: 'First' }];
    const wrapper = mount(DtcRendererTarget, {
      props: {
        component: RootClassFixture,
        bindings: { items: firstItems, label: 'Initial' },
        events: [],
        previewIdentity: bindings => [bindings.items],
        resetGeneration: 0,
      },
    });
    await nextTick();
    const target = () => wrapper.get('[data-qa="fixture-root"]');
    const first = target().element;
    await wrapper.setProps({ bindings: { items: firstItems, label: 'Updated' } });
    expect(target().element).toBe(first);
    expect(target().text()).toBe('First Updated');
    await wrapper.setProps({ bindings: { items: [{ name: 'Second' }], label: 'Updated' } });
    expect(target().text()).toBe('Second Updated');
    expect(target().element).not.toBe(first);
    const second = target().element;
    await wrapper.setProps({ resetGeneration: 1 });
    expect(target().element).not.toBe(second);
    wrapper.unmount();
  });

  it('remounts Filter Pill previews only when edits cross the array contract boundary', async () => {
    const wrapper = mount(DtcRendererTarget, {
      props: {
        component: RootClassFixture, events: [],
        bindings: { options: [], modelValue: undefined },
        previewIdentity: filterPillVariants.defaults.metadata.previewIdentity,
      },
    });
    try {
      await nextTick();
      const target = () => wrapper.get('[data-qa="fixture-root"]').element;
      const controlled = target();
      await wrapper.setProps({ bindings: { options: [{ value: 'all', label: 'All' }], modelValue: undefined } });
      expect(target()).toBe(controlled);
      await wrapper.setProps({ bindings: { options: null, modelValue: undefined } });
      const legacy = target();
      expect(legacy).not.toBe(controlled);
      await wrapper.setProps({ bindings: { options: [], modelValue: undefined } });
      expect(target()).not.toBe(legacy);
    } finally {
      wrapper.unmount();
    }
  });

  it('Should pass native class bindings to the rendered component root', async function () {
    const wrapper = mount(DtcRendererTarget, {
      attachTo: document.body,
      props: {
        component: RootClassFixture,
        bindings: {
          class: 'd-w50p',
        },
        events: [],
        disabledMembers: new Set(),
      },
    });

    await nextTick();
    await nextTick();

    expect(wrapper.find('[data-qa="fixture-root"]').classes()).toContain('d-w50p');

    wrapper.unmount();
  });
});
