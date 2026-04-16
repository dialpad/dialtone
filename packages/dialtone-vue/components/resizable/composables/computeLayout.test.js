/**
 * computeLayout unit tests
 *
 * Tests the pure layout engine: input → output, no side effects.
 * Adapted from beacon-app tests with Dialtone naming conventions.
 */

import { describe, it, expect } from 'vitest';
import { computeLayout } from './computeLayout';

// ─── HELPERS ────────────────────────────────────────────────────────────────

function panel (id, partial = {}) {
  return { id, ...partial };
}

function getPanel (result, id) {
  const p = result.panels.get(id);
  if (!p) throw new Error(`Panel '${id}' not found in layout result`);
  return p;
}

function totalWidth (result) {
  let sum = 0;
  result.panels.forEach(p => { sum += p.width; });
  return sum;
}

// ─── BASIC LAYOUT ────────────────────────────────────────────────────────────

describe('computeLayout — basic layout', () => {
  it('returns empty result for empty panels array', () => {
    const result = computeLayout({ panels: [], containerSize: 1000 });
    expect(result.panels.size).toBe(0);
    expect(result.handles).toHaveLength(0);
  });

  it('single panel fills the entire container', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '50p' })],
      containerSize: 1000,
    });
    const a = getPanel(result, 'a');
    expect(a.left).toBe(0);
    expect(a.width).toBe(1000);
    expect(a.right).toBe(0);
  });

  it('two panels with equal initialSize split the container 50/50', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '50p' }), panel('b', { initialSize: '50p' })],
      containerSize: 1000,
    });
    const a = getPanel(result, 'a');
    const b = getPanel(result, 'b');

    expect(a.left).toBe(0);
    expect(a.width).toBe(500);
    expect(b.left).toBe(500);
    expect(b.width).toBe(500);
    expect(b.right).toBe(0);
  });

  it('three panels with different initialSizes position correctly', () => {
    const result = computeLayout({
      panels: [
        panel('a', { initialSize: '20p' }),
        panel('b', { initialSize: '30p' }),
        panel('c', { initialSize: '50p' }),
      ],
      containerSize: 1000,
    });

    const a = getPanel(result, 'a');
    const b = getPanel(result, 'b');
    const c = getPanel(result, 'c');

    expect(a.left).toBe(0);
    expect(a.width).toBe(200);
    expect(b.left).toBe(200);
    expect(b.width).toBe(300);
    expect(c.left).toBe(500);
    expect(c.width).toBe(500);
    expect(c.right).toBe(0);
  });

  it('total panel widths fill the container exactly', () => {
    const result = computeLayout({
      panels: [
        panel('a', { initialSize: '33p' }),
        panel('b', { initialSize: '33p' }),
        panel('c', { initialSize: '33p' }),
      ],
      containerSize: 1000,
    });

    expect(totalWidth(result)).toBe(1000);
  });

  it('left + width + right = containerSize for every visible panel', () => {
    const containerSize = 1200;
    const result = computeLayout({
      panels: [
        panel('a', { initialSize: '25p' }),
        panel('b', { initialSize: '50p' }),
        panel('c', { initialSize: '25p' }),
      ],
      containerSize,
    });
    result.panels.forEach(p => {
      if (!p.collapsed) {
        expect(p.left + p.width + p.right).toBe(containerSize);
      }
    });
  });

  it('produces one handle between two panels', () => {
    const result = computeLayout({
      panels: [panel('a'), panel('b')],
      containerSize: 1000,
    });
    expect(result.handles).toHaveLength(1);
    expect(result.handles[0].beforePanelId).toBe('a');
    expect(result.handles[0].afterPanelId).toBe('b');
    expect(result.handles[0].id).toBe('a:b');
  });

  it('produces two handles for three panels', () => {
    const result = computeLayout({
      panels: [panel('a'), panel('b'), panel('c')],
      containerSize: 1000,
    });
    expect(result.handles).toHaveLength(2);
    expect(result.handles[0].id).toBe('a:b');
    expect(result.handles[1].id).toBe('b:c');
  });

  it('handle left position equals before-panel right edge', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '30p' }), panel('b', { initialSize: '70p' })],
      containerSize: 1000,
    });
    const a = getPanel(result, 'a');
    expect(result.handles[0].left).toBe(a.left + a.width);
  });
});

// ─── FIXED (NON-RESIZABLE) PANELS ────────────────────────────────────────────

describe('computeLayout — resizable: false panels', () => {
  it('fixed panel keeps its exact initialSize in pixels', () => {
    const result = computeLayout({
      panels: [panel('fixed', { initialSize: '925', resizable: false }), panel('flex', { initialSize: '50p' })],
      containerSize: 1000,
    });
    const fixed = getPanel(result, 'fixed');
    expect(fixed.width).toBe(332);
  });

  it('flexible panel fills remaining space after fixed panel', () => {
    const result = computeLayout({
      panels: [panel('fixed', { initialSize: '925', resizable: false }), panel('flex', { initialSize: '50p' })],
      containerSize: 1000,
    });
    const flex = getPanel(result, 'flex');
    expect(flex.width).toBe(668);
  });

  it('no handle generated between fixed and flexible panel', () => {
    const result = computeLayout({
      panels: [panel('fixed', { initialSize: '925', resizable: false }), panel('flex', { initialSize: '50p' })],
      containerSize: 1000,
    });
    expect(result.handles).toHaveLength(0);
  });
});

// ─── COLLAPSED PANELS ────────────────────────────────────────────────────────

describe('computeLayout — collapsed panels', () => {
  it('collapsed panel has width 0', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '30p', collapsed: true }), panel('b', { initialSize: '70p' })],
      containerSize: 1000,
    });
    const a = getPanel(result, 'a');
    expect(a.width).toBe(0);
    expect(a.collapsed).toBe(true);
  });

  it('remaining visible panels fill the container when one is collapsed', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '30p', collapsed: true }), panel('b', { initialSize: '70p' })],
      containerSize: 1000,
    });
    const b = getPanel(result, 'b');
    expect(b.width).toBe(1000);
  });

  it('handle is disabled when adjacent to a collapsed panel', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '30p', collapsed: true }), panel('b', { initialSize: '70p' })],
      containerSize: 1000,
    });
    expect(result.handles[0].disabled).toBe(true);
  });

  it('handle is NOT disabled when neither adjacent panel is collapsed', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '30p' }), panel('b', { initialSize: '70p' })],
      containerSize: 1000,
    });
    expect(result.handles[0].disabled).toBe(false);
  });

  it('all panels collapsed — all widths 0, no crash', () => {
    const result = computeLayout({
      panels: [
        panel('a', { initialSize: '50p', collapsed: true }),
        panel('b', { initialSize: '50p', collapsed: true }),
      ],
      containerSize: 1000,
    });
    expect(getPanel(result, 'a').width).toBe(0);
    expect(getPanel(result, 'b').width).toBe(0);
  });
});

// ─── CONSTRAINT ENFORCEMENT ──────────────────────────────────────────────────

describe('computeLayout — constraint enforcement', () => {
  it('panel with userMinSize is clamped UP when initial percentage is too small', () => {
    const result = computeLayout({
      panels: [panel('small', { initialSize: '10p', userMinSize: '925' }), panel('large', { initialSize: '90p' })],
      containerSize: 1000,
    });
    const small = getPanel(result, 'small');
    expect(small.width).toBeGreaterThanOrEqual(332);
  });

  it('panel with userMaxSize is clamped DOWN when initial percentage exceeds it', () => {
    const result = computeLayout({
      panels: [panel('big', { initialSize: '90p', userMaxSize: '925' }), panel('small', { initialSize: '10p' })],
      containerSize: 1000,
    });
    const big = getPanel(result, 'big');
    expect(big.width).toBeLessThanOrEqual(332);
  });

  it('systemMinSize is applied during layout', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '5p', systemMinSize: '10p' }), panel('b', { initialSize: '95p' })],
      containerSize: 400,
    });
    const a = getPanel(result, 'a');
    expect(a.width).toBeGreaterThanOrEqual(40);
  });

  it('constraint overflow is redistributed — total still equals containerSize', () => {
    const containerSize = 1000;
    const result = computeLayout({
      panels: [
        panel('a', { initialSize: '10p', systemMinSize: '30p' }),
        panel('b', { initialSize: '10p', systemMinSize: '30p' }),
        panel('c', { initialSize: '80p' }),
      ],
      containerSize,
    });
    expect(totalWidth(result)).toBe(containerSize);
    expect(getPanel(result, 'a').width).toBeGreaterThanOrEqual(300);
    expect(getPanel(result, 'b').width).toBeGreaterThanOrEqual(300);
  });

  it('constraints stored in PanelPosition.constraints match resolved values', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '50p', userMinSize: '800' })],
      containerSize: 1000,
    });
    const a = getPanel(result, 'a');
    expect(a.constraints.userMinSizePixels).toBe(128);
  });
});

// ─── PROPORTIONAL SCALING ────────────────────────────────────────────────────

describe('computeLayout — proportional scaling', () => {
  it('panels scale proportionally when containerSize changes', () => {
    const r1 = computeLayout({
      panels: [panel('a', { initialSize: '30p' }), panel('b', { initialSize: '70p' })],
      containerSize: 1000,
    });
    const r2 = computeLayout({
      panels: [panel('a', { initialSize: '30p' }), panel('b', { initialSize: '70p' })],
      containerSize: 2000,
    });
    const a1 = getPanel(r1, 'a').width;
    const a2 = getPanel(r2, 'a').width;
    expect(a2).toBeCloseTo(a1 * 2, 0);
  });

  it('panel with manualTargetRatio maintains ratio when container changes', () => {
    const savedState = [
      { id: 'a', pixelSize: 400, manualTargetRatio: 0.4 },
      { id: 'b', pixelSize: 600 },
    ];

    const r1 = computeLayout({
      panels: [panel('a', { initialSize: '30p' }), panel('b', { initialSize: '70p' })],
      containerSize: 1000,
      savedState,
    });
    const r2 = computeLayout({
      panels: [panel('a', { initialSize: '30p' }), panel('b', { initialSize: '70p' })],
      containerSize: 1500,
      savedState,
    });

    expect(getPanel(r1, 'a').width).toBeCloseTo(400, 0);
    expect(getPanel(r2, 'a').width).toBeCloseTo(600, 0);
  });

  it('fixed panel (resizable: false) does NOT scale with container', () => {
    const r1 = computeLayout({
      panels: [panel('fixed', { initialSize: '925', resizable: false }), panel('flex', { initialSize: '50p' })],
      containerSize: 1000,
    });
    const r2 = computeLayout({
      panels: [panel('fixed', { initialSize: '925', resizable: false }), panel('flex', { initialSize: '50p' })],
      containerSize: 2000,
    });
    expect(getPanel(r1, 'fixed').width).toBe(332);
    expect(getPanel(r2, 'fixed').width).toBe(332);
  });
});

// ─── DIRECTION ──────────────────────────────────────────────────────────────

describe('computeLayout — direction', () => {
  it('row direction (default) positions panels with left/right', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '50p' }), panel('b', { initialSize: '50p' })],
      containerSize: 1000,
      direction: 'row',
    });
    const a = getPanel(result, 'a');
    expect(a.left).toBe(0);
    expect(a.width).toBe(500);
  });

  it('column direction produces same numeric positions as row', () => {
    const result = computeLayout({
      panels: [panel('a', { initialSize: '50p' }), panel('b', { initialSize: '50p' })],
      containerSize: 1000,
      direction: 'column',
    });
    const a = getPanel(result, 'a');
    expect(a.left).toBe(0);
    expect(a.width).toBe(500);
  });
});
