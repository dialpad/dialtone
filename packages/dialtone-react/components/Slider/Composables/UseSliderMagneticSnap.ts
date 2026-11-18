import { useRef } from 'react';
import { generateInterval } from '../utils';
import type { ResolvedSliderProps } from './types';

// Pixel radius around a snap point where the magnetic pull engages — not
// exposed as a prop; a fixed value keeps the API smaller.
const SNAP_THRESHOLD_PX = 10;

// How much wider the release radius is than the entry radius, in units of
// SNAP_THRESHOLD_PX — lets a snapped thumb resist small jitter near the point
// instead of flickering in and out right at the entry boundary.
const SNAP_RELEASE_MULTIPLIER = 2;

/** Per thumb index, the snap point currently held via hysteresis. */
export type ActiveSnapValues = Partial<Record<number, number>>;

export interface SliderMagneticSnap {
  activeSnapValue: { current: ActiveSnapValues };
  findMagneticSnapPoint: (rawVal: number, thumbIndex: number) => number | null;
}

function computeSnapPoints (snapPoints: ResolvedSliderProps['snapPoints'], min: number, max: number): number[] {
  if (snapPoints == null) return [];
  if (typeof snapPoints === 'number') {
    const interval = snapPoints;
    if (!Number.isFinite(interval) || interval <= 0) return [];
    return generateInterval(min, max, interval, 'snapPoints');
  }
  // A point outside [min, max] can never be a value the thumb is allowed to
  // hold, so it must never be offered as a snap target.
  if (!Array.isArray(snapPoints)) return [];
  return snapPoints.filter((point): point is number => (
    typeof point === 'number' && Number.isFinite(point) && point >= min && point <= max
  ));
}

export function useSliderMagneticSnap (
  props: ResolvedSliderProps,
  { controlEl, isVertical }: { controlEl: HTMLElement | null; isVertical: boolean },
): SliderMagneticSnap {
  // Vue's computedSnapPoints: lazily evaluated (only a pointer drag reads it)
  // and cached until snapPoints, min or max change, so its interval-cap
  // notice logs once per change, not on every move.
  const cache = useRef<{ key: [unknown, number, number]; points: number[] } | null>(null);
  function computedSnapPoints (): number[] {
    const key: [unknown, number, number] = [props.snapPoints, props.min, props.max];
    const cached = cache.current;
    if (cached && cached.key.every((part, i) => Object.is(part, key[i]))) return cached.points;
    const points = computeSnapPoints(props.snapPoints, props.min, props.max);
    cache.current = { key, points };
    return points;
  }

  // Tracks, per thumb index, the snap point currently held via hysteresis —
  // cleared once a drag moves far enough past SNAP_RELEASE_MULTIPLIER's radius
  // to release it, or once the drag ends.
  const activeSnapValue = useRef<ActiveSnapValues>({});

  // Magnetic, not restrictive: only overrides the value within SNAP_THRESHOLD_PX
  // of a point (converted to value-space via the control's rendered size, so
  // the pull feels consistent across any min/max range), else returns null
  // and normal step-quantization proceeds.
  function findMagneticSnapPoint (rawVal: number, thumbIndex: number): number | null {
    const points = computedSnapPoints();
    if (!points.length || !controlEl) {
      delete activeSnapValue.current[thumbIndex];
      return null;
    }
    const rect = controlEl.getBoundingClientRect();
    const trackSizePx = isVertical ? rect.height : rect.width;
    if (!trackSizePx) return null;
    const entryThreshold = (SNAP_THRESHOLD_PX / trackSizePx) * (props.max - props.min);

    // Membership check guards a snapPoints change mid-drag — without it, a
    // removed point could stay latched purely because the pointer hadn't yet
    // drifted past its (now-irrelevant) release radius.
    const heldValue = activeSnapValue.current[thumbIndex];
    if (heldValue != null && points.includes(heldValue)) {
      const releaseThreshold = entryThreshold * SNAP_RELEASE_MULTIPLIER;
      if (Math.abs(heldValue - rawVal) <= releaseThreshold) {
        return heldValue;
      }
    }

    let closest: number | null = null;
    let closestDist = Infinity;
    for (const point of points) {
      const dist = Math.abs(point - rawVal);
      if (dist <= entryThreshold && dist < closestDist) {
        closest = point;
        closestDist = dist;
      }
    }

    if (closest == null) {
      delete activeSnapValue.current[thumbIndex];
    } else {
      activeSnapValue.current[thumbIndex] = closest;
    }
    return closest;
  }

  return { activeSnapValue, findMagneticSnapPoint };
}
