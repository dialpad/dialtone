// Private helpers for the DtText `slide` option. Framework-free: nothing here
// touches Vue, so Text.vue only calls into it when `slide` is on.

// What a user points at or tabs to as one item. A container that is only focusable by
// script (popover content with tabindex="-1") is not a host; a roving menu item with
// tabindex="-1" still is, through its role.
const HOST_ROLES = ['button', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'tab', 'treeitem', 'row', 'gridcell'];
const HOST_SELECTOR = ['a[href]', 'button', 'summary', '[tabindex]:not([tabindex="-1"])', ...HOST_ROLES.map((role) => `[role="${role}"]`)].join(',');

const DEFAULT_SPEED = 40; // px per second
const DEFAULT_DELAY = 500; // ms
const DEFAULT_HOLD = { bounce: 1000, loop: 5000 }; // ms
// ms, longest single movement. A reveal (once, bounce) that crawls reads as broken,
// so it is capped at 3 s; a loop is read while it moves and may take up to 5 s
// (the WCAG 2.2.2 limit for motion that starts on its own).
const MAX_MOVEMENT = { once: 3000, bounce: 3000, loop: 5000 };

/**
 * The element whose hover/focus drives the slide: the closest item around
 * the text (button, link, menu item...) or the text itself.
 */
export function getSlideHost (el) {
  return el.closest(HOST_SELECTOR) || el;
}

// Keyboard focus only: a menu that focuses the hovered row, or a clicked button that
// keeps focus, must not keep the label moving after the pointer leaves.
function isKeyboardFocus (target) {
  try {
    return target.matches(':focus-visible');
  } catch {
    return true;
  }
}

/**
 * Listens on the host and calls onEnter when the first of pointer or focus
 * arrives, onLeave when both have left. Returns an unbind function.
 */
export function bindSlide ({ el, moveEl, onEnter, onLeave, onTransitionEnd }) {
  const host = getSlideHost(el);
  const state = { pointer: false, focus: false };
  const set = (key, value) => {
    const was = state.pointer || state.focus;
    state[key] = value;
    const active = state.pointer || state.focus;
    if (active !== was) (active ? onEnter : onLeave)();
  };
  const handlers = {
    pointerenter: () => set('pointer', true),
    pointerleave: () => set('pointer', false),
    focusin: (event) => isKeyboardFocus(event.target) && set('focus', true),
    focusout: (event) => host.contains(event.relatedTarget) || set('focus', false),
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

/**
 * Calls onEscape when Escape is pressed anywhere on the page: a row moving under the
 * pointer may not have focus. Listens in the capture phase so a focused control that
 * stops Escape cannot hide it; the event is not stopped. Returns a remove function.
 */
export function listenForEscape (el, onEscape) {
  const doc = el.ownerDocument;
  const keydown = (event) => event.key === 'Escape' && onEscape();
  doc.addEventListener('keydown', keydown, true);
  return () => doc.removeEventListener('keydown', keydown, true);
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
