import DtcRendererTarget from './renderer_target.vue';

import { expect } from 'vitest';
import { defineComponent, markRaw, nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import filterPillVariants from '@/src/variants/variants_filter_pill';

const RootClassFixture = markRaw(defineComponent({
  name: 'RootClassFixture',
  props: {
    items: { type: Array, default: () => [] },
    label: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  template: `<div
    class="fixture-root" data-qa="fixture-root"
    @click="$emit('update:modelValue', label)"
  >{{ items[0]?.name }} {{ label }}<slot /></div>`,
}));

describe('renderer_target.vue test', function () {
  it('retains outgoing props until completion, then renders the latest request without stale write-back', async () => {
    let complete;
    const wrapper = mount(DtcRendererTarget, {
      props: {
        component: RootClassFixture,
        bindings: { label: 'First' },
        events: [{ name: 'update:modelValue' }],
        previewIdentity: () => [],
        beforePreviewRemount: () => new Promise(resolve => { complete = resolve; }),
      },
    });
    try {
      await nextTick();
      const first = wrapper.get('[data-qa="fixture-root"]');
      await first.trigger('click');
      await wrapper.setProps({ bindings: { label: 'Second' }, resetGeneration: 1 });
      expect(wrapper.get('[data-qa="fixture-root"]').element).toBe(first.element);
      expect(first.text()).toBe('First');
      await first.trigger('click');
      expect(wrapper.emitted('event')).toEqual([['update:modelValue', 'First']]);
      await wrapper.setProps({ bindings: { label: 'Latest' }, resetGeneration: 2 });
      expect(first.text()).toBe('First');
      complete();
      await flushPromises();
      expect(wrapper.get('[data-qa="fixture-root"]').element).not.toBe(first.element);
      expect(wrapper.get('[data-qa="fixture-root"]').text()).toBe('Latest');
      await wrapper.get('[data-qa="fixture-root"]').trigger('click');
      expect(wrapper.emitted('event')).toEqual([
        ['update:modelValue', 'First'], ['update:modelValue', 'Latest'],
      ]);
    } finally {
      wrapper.unmount();
    }
  });

  it('aborts a pending hook and cannot recreate the target after renderer disposal', async () => {
    let complete;
    let signal;
    const wrapper = mount(DtcRendererTarget, {
      attachTo: document.body,
      props: {
        component: RootClassFixture, bindings: { label: 'First' }, events: [],
        previewIdentity: () => [],
        beforePreviewRemount: (_target, context) => {
          signal = context.signal;
          return new Promise(resolve => { complete = resolve; });
        },
      },
    });
    await nextTick();
    await wrapper.setProps({ bindings: { label: 'Second' }, resetGeneration: 1 });
    const container = wrapper.element;
    expect(signal?.aborted).toBe(false);
    wrapper.unmount();
    expect(signal.aborted).toBe(true);
    complete();
    await flushPromises();
    expect(container.querySelector('.fixture-root')).toBeNull();
  });

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
