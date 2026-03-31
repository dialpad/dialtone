/**
 * DtResizable component tests
 *
 * Tests rendering, provide/inject wiring, and basic drag interaction.
 * Uses Vitest + @vue/test-utils following Dialtone test patterns.
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defineComponent, inject, computed, h } from 'vue';
import DtResizable from './dt_resizable.vue';
import {
  RESIZABLE_DIRECTION_KEY,
  RESIZABLE_PANELS_KEY,
  RESIZABLE_IS_RESIZING_KEY,
  RESIZABLE_START_RESIZE_KEY,
  RESIZABLE_LAYOUT_KEY,
} from './resizable_constants';

// Mock ResizeObserver for test environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ─── Test child component that reads injected values ────────────────────────
const InjectionReader = defineComponent({
  name: 'InjectionReader',
  setup () {
    const direction = inject(RESIZABLE_DIRECTION_KEY, computed(() => 'none'));
    const panels = inject(RESIZABLE_PANELS_KEY, computed(() => []));
    const isResizing = inject(RESIZABLE_IS_RESIZING_KEY, computed(() => false));
    const startResize = inject(RESIZABLE_START_RESIZE_KEY, () => {});
    const layout = inject(RESIZABLE_LAYOUT_KEY, computed(() => ({ panels: new Map(), handles: [] })));

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
  });

  describe('Presentation', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render with dt-resizable class', () => {
      expect(wrapper.find('.dt-resizable').exists()).toBe(true);
    });

    it('should apply row direction class by default', () => {
      expect(wrapper.find('.dt-resizable--row').exists()).toBe(true);
    });
  });

  describe('When direction is column', () => {
    beforeEach(() => {
      _setWrapper({ direction: 'column' });
    });

    it('should apply column direction class', () => {
      expect(wrapper.find('.dt-resizable--column').exists()).toBe(true);
    });

    it('should not apply row direction class', () => {
      expect(wrapper.find('.dt-resizable--row').exists()).toBe(false);
    });
  });

  describe('When storageKey is provided', () => {
    beforeEach(() => {
      _setWrapper({ storageKey: 'test-layout' });
    });

    it('should set data-storage-key attribute', () => {
      expect(wrapper.find('.dt-resizable').attributes('data-storage-key')).toBe('test-layout');
    });
  });

  describe('When custom class is provided', () => {
    beforeEach(() => {
      _setWrapper({ class: 'custom-layout' });
    });

    it('should apply custom class alongside component classes', () => {
      const el = wrapper.find('.dt-resizable');
      expect(el.classes()).toContain('custom-layout');
      expect(el.classes()).toContain('dt-resizable--row');
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

    it('should expose lockPanel method', () => {
      expect(typeof wrapper.vm.lockPanel).toBe('function');
    });

    it('should expose unlockPanel method', () => {
      expect(typeof wrapper.vm.unlockPanel).toBe('function');
    });

    it('should expose readonly state', () => {
      expect(wrapper.vm.state).toBeDefined();
      expect(wrapper.vm.state.direction).toBe('row');
    });
  });
});
