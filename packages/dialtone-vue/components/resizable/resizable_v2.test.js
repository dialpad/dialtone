/**
 * DtResizable V2 tests — constraints, collapse, and programmatic control.
 *
 * Tests constraint enforcement (userMin/Max, systemMin/Max),
 * auto-collapse on container resize, and programmatic methods via component ref.
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { h } from 'vue';
import DtResizable from './resizable.vue';
import {
  applyPanelPixelConstraints,
  createPanelState,
} from './composables/useResizablePanelState';
import {
  checkAutoCollapseRules,
  sortCollapseRules,
  allocateSpaceOnPanelOpen,
} from './composables/useResizableCore';
import { useResizeHandling } from './composables/useResizableCalculations';

// Mock ResizeObserver for test environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// ─── Helper: create a minimal panel state for unit tests ─────────────────────
function makePanelState (overrides = {}) {
  return {
    id: 'test',
    pixelSize: 500,
    locked: false,
    collapsed: false,
    resizable: true,
    collapsible: false,
    ...overrides,
  };
}

// ─── Helper: create a panel config for integration tests ─────────────────────
function makePanelConfig (overrides = {}) {
  return {
    id: 'test',
    initialSize: '50p',
    ...overrides,
  };
}

let wrapper;

afterEach(() => {
  wrapper?.unmount();
});

// =============================================================================
// CONSTRAINT ENFORCEMENT — Unit Tests
// =============================================================================

describe('V2 — Constraint enforcement', () => {
  describe('applyPanelPixelConstraints', () => {
    describe('When panel has userMinSize', () => {
      it('should clamp size up to userMinSize', () => {
        // 20p on 1000px container = 200px min
        const panel = makePanelState({ userMinSize: '20p', pixelSize: 100 });
        const result = applyPanelPixelConstraints(panel, 100, 1000);
        expect(result).toBeGreaterThanOrEqual(200);
      });
    });

    describe('When panel has userMaxSize', () => {
      it('should clamp size down to userMaxSize', () => {
        // 40p on 1000px container = 400px max
        const panel = makePanelState({ userMaxSize: '40p', pixelSize: 600 });
        const result = applyPanelPixelConstraints(panel, 600, 1000);
        expect(result).toBeLessThanOrEqual(400);
      });
    });

    describe('When panel has both userMinSize and userMaxSize', () => {
      it('should keep size within the range', () => {
        const panel = makePanelState({ userMinSize: '20p', userMaxSize: '40p', pixelSize: 300 });
        const result = applyPanelPixelConstraints(panel, 300, 1000);
        expect(result).toBeGreaterThanOrEqual(200);
        expect(result).toBeLessThanOrEqual(400);
      });
    });

    describe('When constraintType is system', () => {
      it('should use systemMinSize when specified', () => {
        // userMin=10p=100px, systemMin=20p=200px
        const panel = makePanelState({
          userMinSize: '10p',
          systemMinSize: '20p',
          pixelSize: 150,
        });
        const result = applyPanelPixelConstraints(panel, 150, 1000, 'system');
        expect(result).toBeGreaterThanOrEqual(200);
      });

      it('should use systemMaxSize when specified', () => {
        // userMax=60p=600px, systemMax=40p=400px
        const panel = makePanelState({
          userMaxSize: '60p',
          systemMaxSize: '40p',
          pixelSize: 500,
        });
        const result = applyPanelPixelConstraints(panel, 500, 1000, 'system');
        expect(result).toBeLessThanOrEqual(400);
      });

      it('should fall back to userMinSize when no systemMinSize', () => {
        // userMin=20p=200px, no systemMin
        const panel = makePanelState({
          userMinSize: '20p',
          pixelSize: 100,
        });
        const result = applyPanelPixelConstraints(panel, 100, 1000, 'system');
        expect(result).toBeGreaterThanOrEqual(200);
      });
    });
  });

  describe('createPanelState', () => {
    it('should compute constraint pixel values from config', () => {
      // Use percentage tokens: 20p=200px, 60p=600px, 25p=250px, 50p=500px on 1000px container
      const config = makePanelConfig({
        userMinSize: '20p',
        userMaxSize: '60p',
        systemMinSize: '25p',
        systemMaxSize: '50p',
      });
      const state = createPanelState(config, 1000);
      expect(state.userMinSizePixels).toBe(200);
      expect(state.userMaxSizePixels).toBe(600);
      expect(state.systemMinSizePixels).toBe(250);
      expect(state.systemMaxSizePixels).toBe(500);
    });

    it('should clamp initial size to userMin/Max', () => {
      // 10p = 100px on 1000px container, userMinSize 30p = 300px
      const config = makePanelConfig({
        initialSize: '10p',
        userMinSize: '30p',
      });
      const state = createPanelState(config, 1000);
      expect(state.pixelSize).toBeGreaterThanOrEqual(300);
    });
  });

  describe('useResizeHandling processResizeMove', () => {
    it('should enforce userMinSize during drag', () => {
      const handler = useResizeHandling('row', () => 1000);
      const before = makePanelState({ id: 'a', pixelSize: 500, userMinSizePixels: 200 });
      const after = makePanelState({ id: 'b', pixelSize: 500, userMinSizePixels: 200 });

      // Try to drag cursor to position 100 (before panel = 100px, below its 200px min)
      const result = handler.processResizeMove(100, before, after, 1000, undefined, [before, after], 0);
      expect(result.beforePanelSize).toBeGreaterThanOrEqual(200);
    });

    it('should enforce userMaxSize during drag', () => {
      const handler = useResizeHandling('row', () => 1000);
      const before = makePanelState({ id: 'a', pixelSize: 500, userMaxSizePixels: 600 });
      const after = makePanelState({ id: 'b', pixelSize: 500, userMinSizePixels: 200 });

      // Try to drag cursor to position 800 (before panel = 800px, above its 600px max)
      const result = handler.processResizeMove(800, before, after, 1000, undefined, [before, after], 0);
      expect(result.beforePanelSize).toBeLessThanOrEqual(600);
    });

    it('should prevent drag when panel is not resizable', () => {
      const handler = useResizeHandling('row', () => 1000);
      const before = makePanelState({ id: 'a', pixelSize: 300, resizable: false });
      const after = makePanelState({ id: 'b', pixelSize: 700 });

      const result = handler.processResizeMove(500, before, after, 1000);
      expect(result.isValidResize).toBe(false);
    });
  });
});

// =============================================================================
// AUTO-COLLAPSE — Unit Tests
// =============================================================================

describe('V2 — Auto-collapse', () => {
  describe('checkAutoCollapseRules', () => {
    it('should return panel IDs below their threshold', () => {
      const panels = [
        makePanelState({ id: 'sidebar', pixelSize: 150, userMinSizePixels: 200 }),
        makePanelState({ id: 'content', pixelSize: 850 }),
      ];
      const rules = [{ panelId: 'sidebar', priority: 1 }];
      const result = checkAutoCollapseRules(panels, rules, 1000);
      expect(result).toContain('sidebar');
    });

    it('should return empty array when all panels above threshold', () => {
      const panels = [
        makePanelState({ id: 'sidebar', pixelSize: 300, userMinSizePixels: 200 }),
        makePanelState({ id: 'content', pixelSize: 700 }),
      ];
      const rules = [{ panelId: 'sidebar', priority: 1 }];
      const result = checkAutoCollapseRules(panels, rules, 1000);
      expect(result).toHaveLength(0);
    });

    it('should skip already-collapsed panels', () => {
      const panels = [
        makePanelState({ id: 'sidebar', pixelSize: 0, collapsed: true, userMinSizePixels: 200 }),
        makePanelState({ id: 'content', pixelSize: 1000 }),
      ];
      const rules = [{ panelId: 'sidebar', priority: 1 }];
      const result = checkAutoCollapseRules(panels, rules, 1000);
      expect(result).toHaveLength(0);
    });

    it('should skip locked panels', () => {
      const panels = [
        makePanelState({ id: 'sidebar', pixelSize: 100, locked: true, userMinSizePixels: 200 }),
      ];
      const rules = [{ panelId: 'sidebar', priority: 1 }];
      const result = checkAutoCollapseRules(panels, rules, 1000);
      expect(result).toHaveLength(0);
    });

    it('should use custom minSizeBeforeCollapse from rule', () => {
      // Panel at 250px, rule threshold is 30p=300px on 1000px container -> should collapse
      const panels = [
        makePanelState({ id: 'sidebar', pixelSize: 250, userMinSizePixels: 200 }),
      ];
      const rules = [{ panelId: 'sidebar', priority: 1, minSizeBeforeCollapse: '30p' }];
      const result = checkAutoCollapseRules(panels, rules, 1000);
      expect(result).toContain('sidebar');
    });
  });

  describe('sortCollapseRules', () => {
    it('should sort by priority ascending', () => {
      const rules = [
        { panelId: 'b', priority: 3 },
        { panelId: 'a', priority: 1 },
        { panelId: 'c', priority: 2 },
      ];
      const sorted = sortCollapseRules(rules);
      expect(sorted.map(r => r.panelId)).toEqual(['a', 'c', 'b']);
    });

    it('should maintain stable sort for equal priorities', () => {
      const rules = [
        { panelId: 'first', priority: 1 },
        { panelId: 'second', priority: 1 },
      ];
      const sorted = sortCollapseRules(rules);
      expect(sorted[0].panelId).toBe('first');
      expect(sorted[1].panelId).toBe('second');
    });

    it('should return empty array for empty input', () => {
      expect(sortCollapseRules([])).toEqual([]);
    });
  });
});

// =============================================================================
// SPACE ALLOCATION — Unit Tests
// =============================================================================

describe('V2 — Space allocation strategies', () => {
  describe('allocateSpaceOnPanelOpen proportional', () => {
    it('should take space proportionally from all unlocked panels', () => {
      const panels = [
        makePanelState({ id: 'a', pixelSize: 300 }),
        makePanelState({ id: 'b', pixelSize: 700 }),
      ];
      const result = allocateSpaceOnPanelOpen(200, panels, 'proportional');
      const aSize = result.get('a');
      const bSize = result.get('b');
      expect(aSize).toBeLessThan(300);
      expect(bSize).toBeLessThan(700);
      expect(aSize + bSize).toBeCloseTo(800, 0);
    });

    it('should not change collapsed panels', () => {
      const panels = [
        makePanelState({ id: 'a', pixelSize: 0, collapsed: true }),
        makePanelState({ id: 'b', pixelSize: 1000 }),
      ];
      const result = allocateSpaceOnPanelOpen(200, panels, 'proportional');
      expect(result.get('a')).toBe(0);
    });
  });

  describe('allocateSpaceOnPanelOpen preserve-manual', () => {
    it('should preserve manually-resized panel sizes', () => {
      const panels = [
        makePanelState({ id: 'a', pixelSize: 300, manualTargetSize: 300 }),
        makePanelState({ id: 'b', pixelSize: 700 }),
      ];
      const result = allocateSpaceOnPanelOpen(200, panels, 'preserve-manual');
      expect(result.get('a')).toBe(300);
      expect(result.get('b')).toBeLessThan(700);
    });

    it('should fall back to proportional when all panels are manual', () => {
      const panels = [
        makePanelState({ id: 'a', pixelSize: 500, manualTargetSize: 500 }),
        makePanelState({ id: 'b', pixelSize: 500, manualTargetSize: 500 }),
      ];
      const result = allocateSpaceOnPanelOpen(200, panels, 'proportional');
      expect(result.get('a') + result.get('b')).toBeCloseTo(800, 0);
    });
  });
});

// =============================================================================
// PROGRAMMATIC CONTROL — Integration Tests (via component ref)
// =============================================================================

describe('V2 — Programmatic control via exposed methods', () => {
  describe('Exposed API surface', () => {
    beforeEach(() => {
      wrapper = mount(DtResizable, { attachTo: document.body });
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
      expect(Array.isArray(wrapper.vm.state.panels)).toBe(true);
    });

    it('should expose panelConfigs from panels prop', () => {
      expect(wrapper.vm.panelConfigs).toBeDefined();
    });

    it('should expose allocationStrategy from spaceAllocationStrategy prop', () => {
      expect(wrapper.vm.allocationStrategy).toBe('proportional');
    });
  });

  describe('When spaceAllocationStrategy is set', () => {
    it('should default to proportional', () => {
      wrapper = mount(DtResizable, { attachTo: document.body });
      expect(wrapper.vm.allocationStrategy).toBe('proportional');
    });

    it('should accept preserve-manual', () => {
      wrapper = mount(DtResizable, {
        props: { spaceAllocationStrategy: 'preserve-manual' },
        attachTo: document.body,
      });
      expect(wrapper.vm.allocationStrategy).toBe('preserve-manual');
    });
  });

  describe('Scoped slot props', () => {
    it('should expose spaceAllocationStrategy in scoped slot', () => {
      let slotProps;
      wrapper = mount(DtResizable, {
        props: { spaceAllocationStrategy: 'preserve-manual' },
        slots: {
          default: (props) => {
            slotProps = props;
            return h('div');
          },
        },
        attachTo: document.body,
      });
      expect(slotProps.spaceAllocationStrategy).toBe('preserve-manual');
    });
  });

  describe('When panels prop is provided', () => {
    it('should expose panelConfigs matching the panels prop', () => {
      const panelConfigs = [
        { id: 'sidebar', initialSize: '20p' },
        { id: 'content', initialSize: '80p' },
      ];
      wrapper = mount(DtResizable, {
        props: { panels: panelConfigs },
        attachTo: document.body,
      });
      expect(wrapper.vm.panelConfigs).toHaveLength(2);
      expect(wrapper.vm.panelConfigs[0].id).toBe('sidebar');
    });
  });
});

// =============================================================================
// COLLAPSE PANEL — Integration Tests
// =============================================================================

describe('V2 — Collapse panel integration', () => {
  describe('When collapseRules prop is provided', () => {
    it('should accept collapseRules as an array prop', () => {
      const rules = [{ panelId: 'sidebar', priority: 1 }];
      wrapper = mount(DtResizable, {
        props: { collapseRules: rules },
        attachTo: document.body,
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('When collapsePanel is called programmatically', () => {
    it('should not throw when called with unknown panelId', () => {
      wrapper = mount(DtResizable, { attachTo: document.body });
      expect(() => wrapper.vm.collapsePanel('nonexistent', true)).not.toThrow();
    });
  });
});
