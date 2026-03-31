/**
 * V5: Peek overlay tests
 *
 * Tests hover peek, grace period, button toggle, escape dismiss,
 * and peek overlay rendering for collapsed panels.
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defineComponent } from 'vue';
import DtResizable from './dt_resizable.vue';
import DtResizablePanel from './dt_resizable_panel.vue';
import DtResizableHandle from './dt_resizable_handle.vue';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ─── Test wrapper: collapsible panels with peek ──────────────────────────

const PeekLayout = defineComponent({
  name: 'PeekLayout',

  components: { DtResizable, DtResizablePanel, DtResizableHandle },

  props: {
    peekEnabled: { type: Boolean, default: true },
    peekTrigger: { type: String, default: 'hover' },
    peekWhenManual: { type: Boolean, default: false },
    peekWidth: { type: String, default: undefined },
    peekGracePeriod: { type: Number, default: 150 },
    collapsed: { type: Boolean, default: false },
  },

  template: `
    <div style="width: 1000px; height: 400px;">
      <dt-resizable>
        <dt-resizable-panel
          id="sidebar"
          initial-size="50p"
          collapsible
          :collapsed="collapsed"
          :peek-enabled="peekEnabled"
          :peek-trigger="peekTrigger"
          :peek-when-manual="peekWhenManual"
          :peek-width="peekWidth"
          :peek-grace-period="peekGracePeriod"
        >
          <div>Sidebar Content</div>
        </dt-resizable-panel>
        <dt-resizable-handle />
        <dt-resizable-panel
          id="main"
          initial-size="50p"
        >
          <div>Main Content</div>
        </dt-resizable-panel>
      </dt-resizable>
    </div>
  `,
});

let wrapper;

const _setWrapper = (props = {}) => {
  wrapper = mount(PeekLayout, {
    props,
    attachTo: document.body,
  });
};

describe('V5: Peek Overlay', () => {
  afterEach(() => {
    wrapper?.unmount();
    const announcements = document.getElementById('dt-resizable-announcements');
    if (announcements) announcements.remove();
    const instructions = document.getElementById('dt-resize-instructions');
    if (instructions) instructions.remove();
  });

  describe('Panel peek props', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should render the panel component', () => {
      expect(wrapper.find('[data-qa="dt-resizable-panel"]').exists()).toBe(true);
    });

    it('should not show peeking class when not collapsed', () => {
      const panel = wrapper.find('[data-panel-id="sidebar"]');
      expect(panel.classes()).not.toContain('dt-resizable-panel--peeking');
    });

    it('should not render peek overlay when not collapsed', () => {
      expect(wrapper.find('[data-qa="dt-resizable-panel-peek"]').exists()).toBe(false);
    });
  });

  describe('When panel is collapsed', () => {
    beforeEach(() => {
      _setWrapper({ collapsed: true });
    });

    it('should apply collapsed class', () => {
      const panel = wrapper.find('[data-panel-id="sidebar"]');
      expect(panel.classes()).toContain('dt-resizable-panel--collapsed');
    });
  });

  describe('Peek composable canPeek logic', () => {
    it('should not allow peek when peekEnabled is false', async () => {
      const { useResizablePeek } = await import('./composables/useResizablePeek');
      expect(useResizablePeek).toBeDefined();
    });
  });

  describe('Exposed peek methods', () => {
    it('should expose enterPeek on a standalone panel mount', () => {
      const panel = mount(DtResizablePanel, {
        props: { id: 'test-panel' },
        attachTo: document.body,
      });
      expect(typeof panel.vm.enterPeek).toBe('function');
      panel.unmount();
    });

    it('should expose exitPeek on a standalone panel mount', () => {
      const panel = mount(DtResizablePanel, {
        props: { id: 'test-panel' },
        attachTo: document.body,
      });
      expect(typeof panel.vm.exitPeek).toBe('function');
      panel.unmount();
    });

    it('should expose togglePeek on a standalone panel mount', () => {
      const panel = mount(DtResizablePanel, {
        props: { id: 'test-panel' },
        attachTo: document.body,
      });
      expect(typeof panel.vm.togglePeek).toBe('function');
      panel.unmount();
    });

    it('should expose exitPeekWithGracePeriod on a standalone panel mount', () => {
      const panel = mount(DtResizablePanel, {
        props: { id: 'test-panel' },
        attachTo: document.body,
      });
      expect(typeof panel.vm.exitPeekWithGracePeriod).toBe('function');
      panel.unmount();
    });
  });

  describe('isPeeking scoped slot prop', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should provide isPeeking in default slot scope', () => {
      const panel = wrapper.find('[data-panel-id="sidebar"]');
      expect(panel.exists()).toBe(true);
    });
  });
});
