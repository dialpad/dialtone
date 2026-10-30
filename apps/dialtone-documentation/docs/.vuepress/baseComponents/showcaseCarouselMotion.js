const REFERENCE_FRAME_DURATION = 1000 / 60;

export function getCarouselPeriod (firstOriginal, firstClone) {
  if (!firstOriginal || !firstClone) return 0;
  return firstClone.offsetLeft - firstOriginal.offsetLeft;
}

export function getLoopedScrollPosition (position, period, maxPosition) {
  if (period <= 0) return position;
  if (maxPosition < period * 2) return position;

  const edgeBuffer = period / 2;

  if (position < edgeBuffer) return position + period;
  if (position > maxPosition - edgeBuffer) return position - period;
  return position;
}

// Only a jump larger than this (touch, trackpad, or recentering) counts as an outside scroll;
// smaller differences are the browser rounding scrollLeft.
const SCROLL_RESYNC_THRESHOLD = 1.5;

/**
 * Advances the carousel's floating-point scroll position by `distance`. Safari truncates
 * scrollLeft to whole pixels, so reading it back each frame drops slow sub-pixel progress
 * (0.035px/ms is ~0.58px per frame at 60Hz). The float position carries that progress and
 * only resyncs to scrollLeft after an outside scroll moves it.
 */
export function advanceScrollPosition (position, renderedScrollLeft, distance, period, maxPosition) {
  const start = Math.abs(renderedScrollLeft - position) > SCROLL_RESYNC_THRESHOLD
    ? renderedScrollLeft
    : position;

  return getLoopedScrollPosition(start + distance, period, maxPosition);
}

export function smoothCarouselVelocity (current, target, smoothingFactor, elapsedTime) {
  if (elapsedTime <= 0) return current;

  const frameProgress = elapsedTime / REFERENCE_FRAME_DURATION;
  const interpolation = 1 - Math.pow(1 - smoothingFactor, frameProgress);
  return current + (target - current) * interpolation;
}
