import { ref, computed } from 'vue';
import { generateInterval } from '../utils';

// Pixel radius around a snap point where the magnetic pull engages — not
// exposed as a prop; Brad (PR review) questioned whether consumers would
// ever need to tune this, and a fixed value keeps the API smaller.
const SNAP_THRESHOLD_PX = 10;

// How much wider the release radius is than the entry radius, in units of
// SNAP_THRESHOLD_PX — lets a snapped thumb resist small jitter near the point
// instead of flickering in and out right at the entry boundary.
const SNAP_RELEASE_MULTIPLIER = 2;

export function useSliderMagneticSnap(props, { controlRef, isVertical }) {
  // Mirrors computedTickValues' interval generation — a number means "evenly
  // spaced", an array is used as-is. [] (snapPoints unset) short-circuits
  // findMagneticSnapPoint below, so this is also what keeps the feature a
  // pure no-op — same code path, same result — for every consumer that
  // doesn't set snapPoints.
  const computedSnapPoints = computed(() => {
    if (props.snapPoints == null) return [];
    if (typeof props.snapPoints === 'number') {
      const interval = props.snapPoints;
      if (interval <= 0) return [];
      return generateInterval(props.min, props.max, interval, 'snapPoints');
    }
    // A point outside [min, max] can never be a value the thumb is allowed to
    // hold, so it must never be offered as a snap target — otherwise a drag
    // that lands within the snap radius of it would pull the thumb (and the
    // emitted modelValue) out of the slider's own documented range.
    return props.snapPoints.filter((point) => point >= props.min && point <= props.max);
  });

  // Tracks, per thumb index, the snap point currently held via hysteresis —
  // cleared once a drag moves far enough past SNAP_RELEASE_MULTIPLIER's radius
  // to release it, or once the drag ends.
  const activeSnapValue = ref({});

  // Magnetic, not restrictive: only overrides the value within SNAP_THRESHOLD_PX
  // of a point (converted to value-space via the control's rendered size, so
  // the pull feels consistent across any min/max range), else returns null
  // and normal step-quantization proceeds. A pixel radius is what makes this
  // feel like Figma/Photoshop guide-snapping. Releasing needs a wider radius
  // than entering (SNAP_RELEASE_MULTIPLIER) — the "sticky" half of that feel.
  function findMagneticSnapPoint(rawVal, thumbIndex) {
    const points = computedSnapPoints.value;
    if (!points.length || !controlRef.value) {
      delete activeSnapValue.value[thumbIndex];
      return null;
    }
    const rect = controlRef.value.getBoundingClientRect();
    const trackSizePx = isVertical.value ? rect.height : rect.width;
    if (!trackSizePx) return null;
    const entryThreshold = (SNAP_THRESHOLD_PX / trackSizePx) * (props.max - props.min);

    const heldValue = activeSnapValue.value[thumbIndex];
    if (heldValue != null) {
      const releaseThreshold = entryThreshold * SNAP_RELEASE_MULTIPLIER;
      if (Math.abs(heldValue - rawVal) <= releaseThreshold) {
        return heldValue;
      }
    }

    let closest = null;
    let closestDist = Infinity;
    for (const point of points) {
      const dist = Math.abs(point - rawVal);
      if (dist <= entryThreshold && dist < closestDist) {
        closest = point;
        closestDist = dist;
      }
    }

    if (closest == null) {
      delete activeSnapValue.value[thumbIndex];
    } else {
      activeSnapValue.value[thumbIndex] = closest;
    }
    return closest;
  }

  return {
    computedSnapPoints,
    activeSnapValue,
    findMagneticSnapPoint,
  };
}
