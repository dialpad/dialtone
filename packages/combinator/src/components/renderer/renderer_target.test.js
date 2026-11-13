import DtcRendererTarget from './renderer_target.vue';

import { expect } from 'vitest';
import { defineComponent, h, markRaw, nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';

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
    let completedTarget;
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
      complete(target => { completedTarget = target.$el; });
      await flushPromises();
      expect(completedTarget).toBe(wrapper.get('[data-qa="fixture-root"]').element);
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

  it.each(['throws', 'rejects'])('keeps the outgoing target when cleanup %s and retries later', async failure => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let fail = true;
    const beforePreviewRemount = () => {
      if (!fail) return undefined;
      const error = new Error('cleanup failed');
      if (failure === 'throws') throw error;
      return Promise.reject(error);
    };
    const wrapper = mount(DtcRendererTarget, {
      props: {
        component: RootClassFixture,
        bindings: { label: 'First' },
        events: [{ name: 'update:modelValue' }],
        previewIdentity: () => [],
        beforePreviewRemount,
      },
    });
    try {
      await nextTick();
      const first = wrapper.get('[data-qa="fixture-root"]');
      await wrapper.setProps({ bindings: { label: 'Second' }, resetGeneration: 1 });
      await flushPromises();
      expect(wrapper.get('[data-qa="fixture-root"]').element).toBe(first.element);
      expect(first.text()).toBe('First');
      expect(warn).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ message: 'cleanup failed' }));
      await first.trigger('click');
      expect(wrapper.emitted('event')).toEqual([['update:modelValue', 'First']]);
      fail = false;
      await wrapper.setProps({ resetGeneration: 2 });
      await flushPromises();
      expect(wrapper.get('[data-qa="fixture-root"]').element).not.toBe(first.element);
      expect(wrapper.get('[data-qa="fixture-root"]').text()).toBe('Second');
    } finally {
      wrapper.unmount();
      warn.mockRestore();
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
    const afterRemount = vi.fn();
    complete(afterRemount);
    await flushPromises();
    expect(afterRemount).not.toHaveBeenCalled();
    expect(container.querySelector('.fixture-root')).toBeNull();
  });

  it('does not run a completion callback for a failed render and recovers on a later update', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const afterRemount = vi.fn();
    const broken = markRaw(defineComponent({ render: () => h('invalid tag') }));
    const wrapper = mount(DtcRendererTarget, {
      props: {
        component: RootClassFixture, bindings: { label: 'First' }, events: [],
        previewIdentity: () => [], beforePreviewRemount: () => Promise.resolve(afterRemount),
      },
    });
    try {
      await nextTick();
      await wrapper.setProps({ component: broken, resetGeneration: 1 });
      await flushPromises();
      expect(wrapper.text()).toContain('Invalid');
      expect(afterRemount).not.toHaveBeenCalled();
      await wrapper.setProps({ component: RootClassFixture, bindings: { label: 'Recovered' }, resetGeneration: 2 });
      await flushPromises();
      expect(wrapper.get('[data-qa="fixture-root"]').text()).toBe('Recovered');
    } finally {
      wrapper.unmount();
      warn.mockRestore();
    }
  });

  it('keeps a successfully replaced preview live when its completion callback throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(DtcRendererTarget, {
      props: {
        component: RootClassFixture, bindings: { label: 'First' },
        events: [{ name: 'update:modelValue' }], previewIdentity: () => [],
        beforePreviewRemount: () => Promise.resolve(() => { throw new Error('focus failed'); }),
      },
    });
    try {
      await nextTick();
      await wrapper.setProps({ bindings: { label: 'Second' }, resetGeneration: 1 });
      await flushPromises();
      expect(wrapper.get('[data-qa="fixture-root"]').text()).toBe('Second');
      await wrapper.get('[data-qa="fixture-root"]').trigger('click');
      expect(wrapper.emitted('event')).toEqual([['update:modelValue', 'Second']]);
      expect(warn).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ message: 'focus failed' }));
      await wrapper.setProps({ bindings: { label: 'Third' }, resetGeneration: 2 });
      await flushPromises();
      expect(wrapper.get('[data-qa="fixture-root"]').text()).toBe('Third');
    } finally {
      wrapper.unmount();
      warn.mockRestore();
    }
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
    await wrapper.setProps({ bindings: { items: [{ name: 'First' }], label: 'Updated' } });
    expect(target().text()).toBe('First Updated');
    expect(target().element).not.toBe(first);
    const second = target().element;
    await wrapper.setProps({ resetGeneration: 1 });
    expect(target().element).not.toBe(second);
    wrapper.unmount();
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
