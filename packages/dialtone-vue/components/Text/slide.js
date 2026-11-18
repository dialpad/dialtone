// Private helpers for the DtText `slide` option. Framework-free: nothing here
// touches Vue, so Text.vue only calls into it when `slide` is on.
import { FOCUSABLE_SELECTOR } from '../../common/utils';

const DEFAULT_SPEED = 40; // px per second
const DEFAULT_DELAY = 500; // ms
const DEFAULT_HOLD = { bounce: 1000, loop: 5000 }; // ms
// ms, longest single movement. A reveal (once, bounce) that crawls reads as broken,
// so it is capped at 3 s; a loop is read while it moves and may take up to 5 s
// (the WCAG 2.2.2 limit for motion that starts on its own).
const MAX_MOVEMENT = { once: 3000, bounce: 3000, loop: 5000 };

/**
 * The element whose hover/focus drives the slide: the closest focusable
 * ancestor (button, link, menu item...) or the text itself.
 */
export function getSlideHost (el) {
  return el.closest(FOCUSABLE_SELECTOR) || el;
}

/**
 * Listens on the host and calls onEnter when the first of pointer or focus
 * arrives, onLeave when both have left. Returns an unbind function.
 */
export function bindSlide ({ el, moveEl, onEnter, onLeave, onEscape, onTransitionEnd }) {
  const host = getSlideHost(el);
  let pointer = false;
  let focus = false;

  const update = (wasActive) => {
    const active = pointer || focus;
    if (active && !wasActive) onEnter();
    if (!active && wasActive) onLeave();
  };
  const handlers = {
    pointerenter: () => {
      const was = pointer || focus;
      pointer = true;
      update(was);
    },
    pointerleave: () => {
      const was = pointer || focus;
      pointer = false;
      update(was);
    },
    focusin: () => {
      const was = pointer || focus;
      focus = true;
      update(was);
    },
    focusout: (event) => {
      if (event.relatedTarget && host.contains(event.relatedTarget)) return;
      const was = pointer || focus;
      focus = false;
      update(was);
    },
    keydown: (event) => {
      if (event.key === 'Escape') onEscape();
    },
  };
  const transitionEnd = (event) => {
    if (event.target === moveEl && event.propertyName === 'transform') onTransitionEnd();
  };

  Object.entries(handlers).forEach(([name, fn]) => host.addEventListener(name, fn));
  moveEl.addEventListener('transitionend', transitionEnd);

  return () => {
    Object.entries(handlers).forEach(([name, fn]) => host.removeEventListener(name, fn));
    moveEl.removeEventListener('transitionend', transitionEnd);
  };
}

function parseTime (value, fallback) {
  const match = /^\s*(-?\d*\.?\d+)\s*(ms|s)?\s*$/.exec(value || '');
  if (!match) return fallback;
  const number = parseFloat(match[1]);
  return match[2] === 's' ? number * 1000 : number;
}

/**
 * Reads the public tuning custom properties from the element.
 */
export function readSlideConfig (el, mode) {
  const style = getComputedStyle(el);
  const speed = parseFloat(style.getPropertyValue('--dt-text-slide-speed'));
  return {
    speed: speed > 0 ? speed : DEFAULT_SPEED,
    delay: Math.max(0, parseTime(style.getPropertyValue('--dt-text-slide-delay'), DEFAULT_DELAY)),
    hold: Math.max(0, parseTime(style.getPropertyValue('--dt-text-slide-hold'), DEFAULT_HOLD[mode] ?? 0)),
  };
}

/**
 * Duration in ms for one movement; long text moves faster instead of slower.
 */
export function getSlideDuration (distance, speed, mode) {
  return Math.min((distance / speed) * 1000, MAX_MOVEMENT[mode]);
}

export function prefersReducedMotion () {
  return typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
