/**
 * TOKEN SNAPPING for values the CSS computes.
 *
 * A stylesheet that writes `calc(var(--dt-spacing-150) - var(--button-border-width))` renders 11px,
 * and no variable holds 11, so the sync built it as a literal. Dialtone is happy to use the token
 * the calculation started from (an 8px token that yields 7px is the 8px token), so a config that
 * sets `snapTokens: true` has its computed spacing, corner and minimum-size values moved to the
 * NEAREST token on the right scale, and bound to it. A tie goes to the larger token, which is the
 * one these calculations subtract from (7 -> 8, 11 -> 12, 5 -> 6).
 *
 * The builder snaps what it WRITES and keeps predicting layout from what was MEASURED, so the
 * hug decisions do not change. The verifier snaps what it EXPECTS with the same function, so it
 * still compares every one of these values exactly, now against the token.
 *
 * Scales are the Dialtone library's published values (spacing/*, size/radius/*, layout/*).
 */

export const SPACING = {
  'spacing/1': 1, 'spacing/25': 2, 'spacing/50': 4, 'spacing/75': 6, 'spacing/100': 8, 'spacing/125': 10,
  'spacing/150': 12, 'spacing/175': 14, 'spacing/200': 16, 'spacing/250': 20, 'spacing/300': 24,
  'spacing/350': 28, 'spacing/400': 32, 'spacing/450': 36, 'spacing/500': 40, 'spacing/600': 48,
};
export const RADIUS = {
  'size/radius/100': 1, 'size/radius/200': 2, 'size/radius/300': 4, 'size/radius/350': 6,
  'size/radius/400': 8, 'size/radius/450': 12, 'size/radius/500': 16, 'size/radius/550': 24,
  'size/radius/600': 32,
};
export const LAYOUT = {
  'layout/8px': 8, 'layout/25': 16, 'layout/20px': 20, 'layout/24px': 24, 'layout/50': 32,
  'layout/75': 48, 'layout/100': 64,
};
/** A circle: the CSS radius is 50%, which no pixel token holds. Figma clamps a radius to half the size. */
export const PILL = { name: 'size/radius/pill', value: 102 };

export const SCALES = { spacing: SPACING, radius: RADIUS, layout: LAYOUT };

/** Which scale each Figma field belongs to. */
export const FAMILY_OF = {
  paddingTop: 'spacing', paddingRight: 'spacing', paddingBottom: 'spacing', paddingLeft: 'spacing',
  itemSpacing: 'spacing', counterAxisSpacing: 'spacing',
  topLeftRadius: 'radius', topRightRadius: 'radius', bottomRightRadius: 'radius', bottomLeftRadius: 'radius',
  minWidth: 'layout', minHeight: 'layout',
};

/** { name, value } of the nearest token, or null when there is nothing to snap (zero or negative). */
export function snapNumber (family, v) {
  const scale = SCALES[family];
  if (!scale || !(v > 0)) return null;
  let best = null;
  for (const [name, x] of Object.entries(scale)) {
    const d = Math.abs(x - v);
    if (!best || d < best.d - 1e-9 || (Math.abs(d - best.d) < 1e-9 && x > best.value)) best = { name, value: x, d };
  }
  return { name: best.name, value: best.value };
}

/** The value a field is snapped to, or the value itself when it is not snapped. */
export function snappedValue (field, v) {
  const family = FAMILY_OF[field];
  const s = family ? snapNumber(family, v) : null;
  return s ? s.value : v;
}

/** The scales as the plugin needs them: { spacing: [[name, value], ...], ... } plus every token name. */
export function snapPayload () {
  const out = {};
  for (const [family, scale] of Object.entries(SCALES)) out[family] = Object.entries(scale);
  return out;
}
export const SNAP_TOKEN_NAMES = [...Object.keys(SPACING), ...Object.keys(RADIUS), ...Object.keys(LAYOUT), PILL.name];
