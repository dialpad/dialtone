/**
 * V6: Offset positioning tests
 *
 * Tests useResizableOffset composable and handle offset props.
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defineComponent } from 'vue';
import DtResizable from './resizable.vue';
import DtResizablePanel from './resizable_panel.vue';
import DtResizableHandle from './resizable_handle.vue';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock MutationObserver (used by useDOMCache)
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
}));

const OffsetLayout = defineComponent({
  name: 'OffsetLayout',

  components: { DtResizable, DtResizablePanel, DtResizableHandle },

  props: {
    offsetElement: { type: String, default: undefined },
    offsetAmount: { type: Number, default: 0 },
    offsetDirection: { type: String, default: 'both' },
  },

  template: `
    <div style="width: 1000px; height: 400px;">
      <div id="toolbar" style="height: 48px;">Toolbar</div>
      <dt-resizable>
        <dt-resizable-panel
          id="left"
          initial-size="50p"
        />
        <dt-resizable-handle
          :offset-element="offsetElement"
          :offset-amount="offsetAmount"
          :offset-direction="offsetDirection"
        />
        <dt-resizable-panel
          id="right"
          initial-size="50p"
        />
      </dt-resizable>
    </div>
  `,
});

let wrapper;

const _setWrapper = (props = {}) => {
  wrapper = mount(OffsetLayout, {
    props,
    attachTo: document.body,
  });
};

describe('V6: Offset Positioning', () => {
  afterEach(() => {
    wrapper?.unmount();
    const announcements = document.getElementById('dt-resizable-announcements');
    if (announcements) announcements.remove();
  });

  describe('Handle without offset', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should render handle', () => {
      expect(wrapper.find('.dt-resizable-handle').exists()).toBe(true);
    });

    it('should not add offset styles when no offsetElement', () => {
      const handle = wrapper.find('.dt-resizable-handle');
      expect(handle.attributes('style')).not.toContain('padding');
    });
  });

  describe('Handle with offset props', () => {
    beforeEach(() => {
      _setWrapper({ offsetElement: '#toolbar', offsetAmount: 8 });
    });

    it('should render handle with offset element configured', () => {
      expect(wrapper.find('.dt-resizable-handle').exists()).toBe(true);
    });
  });

  describe('useResizableOffset composable', () => {
    it('should export the composable', async () => {
      const mod = await import('./composables/useResizableOffset');
      expect(typeof mod.useResizableOffset).toBe('function');
    });
  });

  describe('Offset direction prop', () => {
    it.each([
      ['start'],
      ['end'],
      ['both'],
    ])('should accept %s direction', (direction) => {
      _setWrapper({ offsetElement: '#toolbar', offsetDirection: direction });
      expect(wrapper.find('.dt-resizable-handle').exists()).toBe(true);
    });
  });
});
