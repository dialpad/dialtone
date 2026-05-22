/**
 * DtResizable component tests
 *
 * Tests rendering, provide/inject wiring, and basic drag interaction.
 * Uses Vitest + @vue/test-utils following Dialtone test patterns.
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defineComponent, inject, computed, h } from 'vue';
import DtResizable from './Resizable.vue';
import DtResizablePanel from './ResizablePanel.vue';
import DtResizableHandle from './ResizableHandle.vue';
import { RESIZABLE_CONTEXT_KEY, RESIZABLE_HANDLE_CENTER_OFFSET_PX } from './ResizableConstants';

// Mock ResizeObserver for test environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

function mockClientWidth (width) {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get () { return width; },
  });
}

function restoreClientWidth () {
  if (originalClientWidth) {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
  }
}

// ─── Test child component that reads injected values ────────────────────────
const InjectionReader = defineComponent({
  name: 'InjectionReader',
  setup () {
    const ctx = inject(RESIZABLE_CONTEXT_KEY, null);
    const direction = ctx?.direction ?? computed(() => 'none');
    const panels = ctx?.panels ?? computed(() => []);
    const isResizing = ctx?.isResizing ?? computed(() => false);
    const startResize = ctx?.startResize ?? (() => {});
    const layout = ctx?.layout ?? computed(() => ({ panels: new Map(), handles: [] }));

    return { direction, panels, isResizing, startResize, layout };
  },

  render () {
    return h('div', {
      'data-qa': 'injection-reader',
      'data-direction': this.direction,
      'data-panels': JSON.stringify(this.panels),
      'data-is-resizing': String(this.isResizing),
    });
  },
});

let wrapper;

const CONTAINER_WIDTH = 1000;
const PANEL_BOUNDARY = CONTAINER_WIDTH / 2;

const _setWrapper = (props = {}, slots = {}) => {
  wrapper = mount(DtResizable, {
    props: { ...props },
    slots: { ...slots },
    attachTo: document.body,
  });
};

describe('DtResizable Tests', () => {
  afterEach(() => {
    wrapper?.unmount();
    restoreClientWidth();
  });

  describe('Presentation', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render with d-resizable class', () => {
      expect(wrapper.find('.d-resizable').exists()).toBe(true);
    });

    it('should apply row direction class by default', () => {
      expect(wrapper.find('.d-resizable--row').exists()).toBe(true);
    });
  });

  describe('When direction is column', () => {
    beforeEach(() => {
      _setWrapper({ direction: 'column' });
    });

    it('should apply column direction class', () => {
      expect(wrapper.find('.d-resizable--column').exists()).toBe(true);
    });

    it('should not apply row direction class', () => {
      expect(wrapper.find('.d-resizable--row').exists()).toBe(false);
    });
  });

  describe('When storageKey is provided', () => {
    beforeEach(() => {
      _setWrapper({ storageKey: 'test-layout' });
    });

    it('should set data-storage-key attribute', () => {
      expect(wrapper.find('.d-resizable').attributes('data-storage-key')).toBe('test-layout');
    });
  });

  describe('When custom class is provided', () => {
    beforeEach(() => {
      _setWrapper({ class: 'custom-layout' });
    });

    it('should apply custom class alongside component classes', () => {
      const el = wrapper.find('.d-resizable');
      expect(el.classes()).toContain('custom-layout');
      expect(el.classes()).toContain('d-resizable--row');
    });
  });

  describe('Provide/inject wiring', () => {
    it('should provide direction to child components', () => {
      _setWrapper({ direction: 'column' }, {
        default: () => h(InjectionReader),
      });

      const reader = wrapper.find('[data-qa="injection-reader"]');
      expect(reader.attributes('data-direction')).toBe('column');
    });
  });

  describe('Scoped slot props', () => {
    it('should expose panels array in scoped slot', () => {
      let slotProps;
      _setWrapper({}, {
        default: (props) => {
          slotProps = props;
          return h('div');
        },
      });

      expect(slotProps).toBeDefined();
      expect(Array.isArray(slotProps.panels)).toBe(true);
      expect(slotProps.direction).toBe('row');
      expect(slotProps.isResizing).toBe(false);
      expect(typeof slotProps.resizePanel).toBe('function');
      expect(typeof slotProps.collapsePanel).toBe('function');
      expect(typeof slotProps.startResize).toBe('function');
      expect(typeof slotProps.stopResize).toBe('function');
    });
  });

  describe('Exposed methods', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should expose resizePanel method', () => {
      expect(typeof wrapper.vm.resizePanel).toBe('function');
    });

    it('should expose collapsePanel method', () => {
      expect(typeof wrapper.vm.collapsePanel).toBe('function');
    });

    it('should expose resetPanels method', () => {
      expect(typeof wrapper.vm.resetPanels).toBe('function');
    });

    it('should expose readonly state', () => {
      expect(wrapper.vm.state).toBeDefined();
      expect(wrapper.vm.state.direction).toBe('row');
    });
  });

  describe('Event emissions', () => {
    const FullLayout = defineComponent({
      name: 'FullLayout',
      components: { DtResizable, DtResizablePanel, DtResizableHandle },
      template: `
        <div style="width: 1000px; height: 400px;">
          <dt-resizable ref="resizable">
            <dt-resizable-panel id="left" initial-size="50p" collapsible />
            <dt-resizable-handle />
            <dt-resizable-panel id="right" initial-size="50p" />
          </dt-resizable>
        </div>
      `,
    });

    let fullWrapper;

    beforeEach(() => {
      fullWrapper = mount(FullLayout, { attachTo: document.body });
    });

    afterEach(() => {
      fullWrapper?.unmount();
      const announcements = document.getElementById('d-resizable-announcements');
      if (announcements) announcements.remove();
    });

    it('should emit panel-collapse when collapsePanel is called', async () => {
      const resizable = fullWrapper.findComponent(DtResizable);
      resizable.vm.collapsePanel('left', true);
      await fullWrapper.vm.$nextTick();

      const events = resizable.emitted('panel-collapse');
      expect(events).toBeDefined();
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events[events.length - 1]).toEqual(['left', true]);
    });

    it('should emit panel-resize when resizePanel is called', async () => {
      const resizable = fullWrapper.findComponent(DtResizable);
      resizable.vm.resizePanel('left', 300);
      await fullWrapper.vm.$nextTick();

      const events = resizable.emitted('panel-resize');
      expect(events).toBeDefined();
      expect(events.length).toBeGreaterThanOrEqual(1);
    });

    it('should define resize-start and resize-end events', () => {
      const resizable = fullWrapper.findComponent(DtResizable);
      // These events exist in the emits definition
      expect(resizable.vm.$options.emits || resizable.vm.$.type.emits).toContain('resize-start');
      expect(resizable.vm.$options.emits || resizable.vm.$.type.emits).toContain('resize-end');
    });

    it('should define all four event types', () => {
      const resizable = fullWrapper.findComponent(DtResizable);
      const emits = resizable.vm.$options.emits || resizable.vm.$.type.emits;
      expect(emits).toContain('panel-resize');
      expect(emits).toContain('panel-collapse');
      expect(emits).toContain('resize-start');
      expect(emits).toContain('resize-end');
    });
  });

  describe('Handle positioning', () => {
    const CenteredHandleLayout = defineComponent({
      name: 'CenteredHandleLayout',
      components: { DtResizable, DtResizablePanel, DtResizableHandle },
      template: `
        <div style="width: 1000px; height: 400px;">
          <dt-resizable>
            <dt-resizable-panel id="left" initial-size="50p" />
            <dt-resizable-handle />
            <dt-resizable-panel id="right" initial-size="50p" />
          </dt-resizable>
        </div>
      `,
    });

    it('should center the resting handle over the panel boundary', async () => {
      mockClientWidth(CONTAINER_WIDTH);

      wrapper = mount(CenteredHandleLayout, { attachTo: document.body });
      await wrapper.vm.$nextTick();

      const handle = wrapper.find('[data-qa="dt-resizable-handle"]');
      expect(handle.element.style.insetInlineStart).toBe(
        `${PANEL_BOUNDARY - RESIZABLE_HANDLE_CENTER_OFFSET_PX}px`,
      );
    });
  });
});
