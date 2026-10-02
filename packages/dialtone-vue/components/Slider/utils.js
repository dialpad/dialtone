// A too-small interval relative to [min, max] (e.g. ticks=0.001 over a
// 0–100 range) would otherwise generate tens of thousands of DOM nodes and an
// equally large per-pointermove scan — cap it and warn instead of silently
// hanging the tab.
export const MAX_GENERATED_POINTS = 1000;

// Shared by computedTickValues (UseSliderMarksAndTicks) and computedSnapPoints
// (UseSliderMagneticSnap) — a number means "evenly spaced", used identically
// by both features.
export function generateInterval(min, max, interval, label) {
  const span = max - min;
  const naturalCount = span > 0 ? Math.floor(span / interval) + 1 : 1;
  let effectiveInterval = interval;
  if (naturalCount > MAX_GENERATED_POINTS) {
    // Too many points for the requested interval to be practical over this
    // range — widen it just enough to fit the cap while still spanning the
    // FULL domain, rather than truncating to a fixed count from `min`. That
    // used to silently cover only the first ~1% of the range (e.g.
    // ticks=0.001 over 0–100 rendered ticks from 0 to 0.999 only) —
    // a plausible-looking but materially false representation of the range.
    effectiveInterval = span / (MAX_GENERATED_POINTS - 1);
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        `[Dialtone] DtSlider: ${label}=${interval} would generate more than ${MAX_GENERATED_POINTS} points over this range — using ${effectiveInterval} instead so coverage still spans the full range.`,
      );
    }
  }
  const values = [];
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
