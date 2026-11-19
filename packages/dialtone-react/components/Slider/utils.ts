import { isDevelopment } from '../../common/dev';

/** A mark, as the `showMarks` prop takes it: a bare value, or a value with its own text. */
export type SliderMark = number | { value: number; text?: string };

/** A rect with the four edges the collision math reads. */
export interface EdgeRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

// A too-small interval relative to [min, max] (e.g. showTicks=0.001 over a
// 0–100 range) would otherwise generate tens of thousands of DOM nodes and an
// equally large per-pointermove scan — cap it and warn instead of silently
// hanging the tab.
export const MAX_GENERATED_POINTS = 1000;

export function isValidMark (mark: unknown): mark is SliderMark {
  const value = typeof mark === 'number' ? mark : (mark as { value?: unknown } | null | undefined)?.value;
  return Number.isFinite(value);
}

// Shared by computedTickValues (UseSliderMarksAndTicks) and computedSnapPoints
// (UseSliderMagneticSnap) — a number means "evenly spaced", used identically
// by both features.
export function generateInterval (min: number, max: number, interval: number, label: string): number[] {
  const span = max - min;
  const naturalCount = span > 0 ? Math.floor(span / interval) + 1 : 1;
  let effectiveInterval = interval;
  if (naturalCount > MAX_GENERATED_POINTS) {
    // Too many points for the requested interval to be practical over this
    // range — widen it just enough to fit the cap while still spanning the
    // FULL domain, rather than truncating to a fixed count from `min`.
    effectiveInterval = span / (MAX_GENERATED_POINTS - 1);
    if (isDevelopment()) {
      console.info(
        `[Dialtone] DtSlider: ${label}=${interval} would generate more than ${MAX_GENERATED_POINTS} points over this range — using ${effectiveInterval} instead so coverage still spans the full range.`,
      );
    }
  }
  const values: number[] = [];
  for (
    let v = min;
    v <= max && values.length < MAX_GENERATED_POINTS;
    v = parseFloat((v + effectiveInterval).toFixed(10))
  ) {
    values.push(v);
  }
  // Float accumulation can fall just short of `max` after many increments —
  // make sure the end of the domain is always represented.
  if (values.length && values[values.length - 1] < max - 1e-9) {
    values.push(max);
  }
  return values;
}

// Same length and the same entries in order — cheap enough to run every frame.
export function sameValues (a: readonly unknown[], b: readonly unknown[]): boolean {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

// How far to nudge a mark (UseSliderCollisionAvoidance) inward: however far
// it hangs past controlRect, once that overflow exceeds tolerance.
export function edgeClampOffset (
  leftEdge: number,
  rightEdge: number,
  controlRect: EdgeRect,
  tolerance: number,
): number {
  const startOverflow = controlRect.left - leftEdge; // >0 means it hangs past the start edge
  const endOverflow = rightEdge - controlRect.right; // >0 means it hangs past the end edge
  if (startOverflow > tolerance) return startOverflow - tolerance;
  if (endOverflow > tolerance) return -(endOverflow - tolerance);
  return 0;
}

// pct is measured from insetInlineStart, which the browser mirrors to the
// physical right under dir="rtl" — analytical position math has to mirror
// the same way, or it lands on the wrong physical edge.
export function mirrorPct (pct: number, isRtl: boolean): number {
  return isRtl ? 100 - pct : pct;
}

// A CSS custom property isn't resolved to a used pixel value by
// getComputedStyle on its own — per spec it's an unparsed token stream
// until something concrete (a real layout property) consumes it. Giving a
// disposable child element inline-size: var(--slider-edge-inset) and
// reading its rendered width is the standard way to resolve one without
// hand-reimplementing the calc() it's built from.
// Shared by UseSliderInteraction (pointer-to-value mapping) and
// UseSliderCollisionAvoidance (analytical readout/mark rects).
export function measureEdgeInsetPx (controlEl: HTMLElement): number {
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.inlineSize = 'var(--slider-edge-inset)';
  probe.style.blockSize = '0px';
  controlEl.appendChild(probe);
  const px = probe.getBoundingClientRect().width;
  probe.remove();
  return px;
}
