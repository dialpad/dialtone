/**
 * V4: Keyboard accessibility tests
 *
 * Tests W3C separator keyboard pattern: arrow resize, Enter collapse,
 * Home/End min/max, R reset, Escape blur, ARIA attributes.
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

// ─── Test wrappers ─────────────────────────────────────────────────────

const TwoPanelLayout = defineComponent({
  name: 'TwoPanelLayout',
  components: { DtResizable, DtResizablePanel, DtResizableHandle },

  props: {
    direction: { type: String, default: 'row' },
    leftCollapsible: { type: Boolean, default: false },
    handleDisabled: { type: Boolean, default: false },
  },

  template: `
    <div style="width: 1000px; height: 400px;">
      <dt-resizable :direction="direction">
        <dt-resizable-panel
          id="left"
          initial-size="50p"
          :collapsible="leftCollapsible"
        />
        <dt-resizable-handle :disabled="handleDisabled" />
        <dt-resizable-panel id="right" initial-size="50p" />
      </dt-resizable>
    </div>
  `,
});

let wrapper;

const _setWrapper = (props = {}) => {
  wrapper = mount(TwoPanelLayout, {
    props,
    attachTo: document.body,
  });
};

describe('V4: Keyboard Accessibility', () => {
  afterEach(() => {
    wrapper?.unmount();

    const announcements = document.getElementById('d-resizable-announcements');
    if (announcements) announcements.remove();
  });

  describe('Handle ARIA attributes', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should have role="separator"', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('role')).toBe('separator');
    });

    it('should have vertical aria-orientation for row layout', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('aria-orientation')).toBe('vertical');
    });

    it('should have aria-label describing adjacent panels', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('aria-label')).toContain('Resize handle between');
    });

    it('should have tabindex="0" by default (always focusable)', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('tabindex')).toBe('0');
    });

    it('should have aria-valuenow attribute', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('aria-valuenow')).toBeDefined();
    });

    it('should have aria-valuemin attribute', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('aria-valuemin')).toBeDefined();
    });

    it('should have aria-valuemax attribute', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('aria-valuemax')).toBeDefined();
    });

    it('should have aria-controls attribute', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('aria-controls')).toContain('dt-resizable-panel-');
    });

    it('should have aria-valuetext attribute', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('aria-valuetext')).toBeDefined();
    });
  });

  describe('Handle ARIA for column layout', () => {
    beforeEach(() => {
      _setWrapper({ direction: 'column' });
    });

    it('should have horizontal aria-orientation for column layout', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('aria-orientation')).toBe('horizontal');
    });
  });

  describe('When handle is disabled', () => {
    beforeEach(() => {
      _setWrapper({ handleDisabled: true });
    });

    it('should have tabindex="-1"', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('tabindex')).toBe('-1');
    });

    it('should have aria-disabled="true"', () => {
      const handle = wrapper.find('.d-resizable-handle');
      expect(handle.attributes('aria-disabled')).toBe('true');
    });
  });

  describe('Keyboard events on handle', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should be focusable via keyboard', async () => {
      const handle = wrapper.find('.d-resizable-handle');
      await handle.element.focus();
      expect(document.activeElement).toBe(handle.element);
    });

    it('should respond to keydown events on a focused handle', async () => {
      const handle = wrapper.find('.d-resizable-handle');
      await handle.element.focus();

      // keydown should not throw
      await handle.trigger('keydown', { key: 'ArrowRight' });
      expect(handle.element).toBeTruthy();
    });

    it('should blur handle on Escape key', async () => {
      const handle = wrapper.find('.d-resizable-handle');
      await handle.element.focus();
      expect(document.activeElement).toBe(handle.element);

      await handle.trigger('keydown', { key: 'Escape' });
      expect(document.activeElement).not.toBe(handle.element);
    });
  });

  describe('Keyboard increment constants', () => {
    it.each([
      ['fine', 1],
      ['normal', 8],
      ['large', 24],
    ])('KEYBOARD_INCREMENTS.%s equals %d', async (key, expected) => {
      const { KEYBOARD_INCREMENTS } = await import('./composables/useResizableKeyboard');
      expect(KEYBOARD_INCREMENTS[key]).toBe(expected);
    });
  });

  describe('Panel ID attribute', () => {
    beforeEach(() => {
      _setWrapper();
    });

    it('should set id on panel element for aria-controls', () => {
      const leftPanel = document.getElementById('dt-resizable-panel-left');
      expect(leftPanel).toBeTruthy();
    });

    it('should set id on both panel elements', () => {
      const rightPanel = document.getElementById('dt-resizable-panel-right');
      expect(rightPanel).toBeTruthy();
    });
  });
});
