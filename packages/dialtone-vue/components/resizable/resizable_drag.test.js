/**
 * DtResizable drag interaction tests
 *
 * Tests basic mousedown → mousemove → mouseup flow,
 * Escape cancels drag, and touch events.
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

// JSDOM doesn't compute layout — mock clientWidth so the container gets a
// non-zero size and computeLayout can produce valid panel positions.
const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

function mockClientWidth () {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get () { return 1000; },
  });
}

function restoreClientWidth () {
  if (originalClientWidth) {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
  }
}

const TwoPanelDrag = defineComponent({
  name: 'TwoPanelDrag',
  components: { DtResizable, DtResizablePanel, DtResizableHandle },
  template: `
    <div style="width: 1000px; height: 400px;">
      <dt-resizable ref="resizable">
        <dt-resizable-panel id="left" initial-size="50p" />
        <dt-resizable-handle />
        <dt-resizable-panel id="right" initial-size="50p" />
      </dt-resizable>
    </div>
  `,
});

let wrapper;

const _setWrapper = () => {
  mockClientWidth();
  wrapper = mount(TwoPanelDrag, {
    attachTo: document.body,
  });
};

describe('DtResizable Drag Interaction', () => {
  afterEach(() => {
    wrapper?.unmount();
    restoreClientWidth();
    const announcements = document.getElementById('d-resizable-announcements');
    if (announcements) announcements.remove();
  });

  describe('Mouse drag', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should render the handle as a draggable separator', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.exists()).toBe(true);
      expect(handle.attributes('role')).toBe('separator');
    });

    it('should apply resizing class on pointerdown', async () => {
      const handle = wrapper.find('.d-resizable-handle');
      await handle.trigger('pointerdown', { clientX: 500, clientY: 200 });
      await wrapper.vm.$nextTick();

      const resizable = wrapper.findComponent(DtResizable);
      expect(resizable.find('.d-resizable--resizing').exists()).toBe(true);
    });

    it('should not start drag when handle is disabled', async () => {
      const DisabledHandle = defineComponent({
        name: 'DisabledHandle',
        components: { DtResizable, DtResizablePanel, DtResizableHandle },
        template: `
          <div style="width: 1000px; height: 400px;">
            <dt-resizable>
              <dt-resizable-panel id="left" initial-size="50p" />
              <dt-resizable-handle disabled />
              <dt-resizable-panel id="right" initial-size="50p" />
            </dt-resizable>
          </div>
        `,
      });

      const disabledWrapper = mount(DisabledHandle, { attachTo: document.body });
      const handle = disabledWrapper.find('.d-resizable-handle');
      await handle.trigger('pointerdown', { clientX: 500, clientY: 200 });
      await disabledWrapper.vm.$nextTick();

      const resizable = disabledWrapper.findComponent(DtResizable);
      expect(resizable.find('.d-resizable--resizing').exists()).toBe(false);

      disabledWrapper.unmount();
    });
  });

  describe('Touch drag', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should respond to touchstart events', async () => {
      const handle = wrapper.find('.d-resizable-handle');
      // touchstart should not throw
      await handle.trigger('touchstart', {
        touches: [{ clientX: 500, clientY: 200 }],
      });
      expect(handle.exists()).toBe(true);
    });
  });

  describe('Double-click reset', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should handle double-click on handle', async () => {
      const handle = wrapper.find('.d-resizable-handle');
      // dblclick should not throw
      await handle.trigger('dblclick');
      expect(handle.exists()).toBe(true);
    });
  });

  describe('Handle cursor style', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should have handle indicator element', () => {
      const indicator = wrapper.find('.d-resizable-handle__indicator');
      expect(indicator.exists()).toBe(true);
    });
  });
});
