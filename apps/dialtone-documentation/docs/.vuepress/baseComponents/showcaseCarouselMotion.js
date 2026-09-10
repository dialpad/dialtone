const REFERENCE_FRAME_DURATION = 1000 / 60;

export function canUseHoverSteering (pointerType, supportsFineHover) {
  return pointerType === 'mouse' && supportsFineHover;
}

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

export function getHoverVelocity (relativePosition, deadZone, maxVelocity, curveExponent) {
  const distanceFromCenter = Math.min(Math.abs(relativePosition), 1);
  if (distanceFromCenter <= deadZone) return 0;

  const adjustedPosition = (distanceFromCenter - deadZone) / (1 - deadZone);
  const velocity = Math.pow(adjustedPosition, curveExponent) * maxVelocity;
  return velocity * Math.sign(relativePosition);
}

export function smoothCarouselVelocity (current, target, smoothingFactor, elapsedTime) {
  if (elapsedTime <= 0) return current;

  const frameProgress = elapsedTime / REFERENCE_FRAME_DURATION;
  const interpolation = 1 - Math.pow(1 - smoothingFactor, frameProgress);
  return current + (target - current) * interpolation;
}
