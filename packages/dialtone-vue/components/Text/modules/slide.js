// Private helpers for the DtText `slide` option. Framework-free: nothing here
// touches Vue; only modules/SlideViewport.vue calls into it, and only when `slide` is on.

// The item a user points at or tabs to: a link, a button, or an element with an item
// role. Focusable regions (a scroll area with tabindex="0", popover content with
// tabindex="-1") are not items; a row that should drive the reveal takes an item role.
const HOST_ROLES = ['button', 'link', 'listitem', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'tab', 'treeitem', 'row', 'gridcell'];
const HOST_SELECTOR = ['a[href]', 'button', 'summary', ...HOST_ROLES.map((role) => `[role="${role}"]`)].join(',');

const DEFAULT_SPEED = 40; // px per second
const DEFAULT_DELAY = 500; // ms
// ms, longest single movement. A reveal that crawls reads as broken, so `once` is capped
// at 3 s; a loop is read while it moves and may take up to 5 s per cycle.
const MAX_MOVEMENT = { once: 3000, loop: 5000 };
// A loop pauses 5 s between cycles and stops, resting at the start, after 3 cycles, so the
// whole sequence is bounded (about 25 s at most) as well as each movement.
export const LOOP_HOLD = 5000;
export const MAX_LOOPS = 3;

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

/**
 * Calls onChange while the item is active when the label's width or the room for it
 * changes: the text is edited to a different width, or the viewport is resized. A label
 * that changes at the same width (a running timer) is left alone, and the loop copy is
 * ignored. Returns a stop function.
 */
export function watchSlideChanges (viewport, content, onChange) {
  const copyOf = () => content.querySelector('.d-text__slide-copy');
  const labelWidth = () => content.scrollWidth - (copyOf()?.offsetWidth ?? 0);
  let width = viewport.clientWidth;
  let label = labelWidth();
  const resize = typeof ResizeObserver === 'function' && new ResizeObserver(() => {
    // the copy can widen a shrinkable flex row; loop remeasures before each cycle anyway
    if (copyOf() || viewport.clientWidth === width) return;
    width = viewport.clientWidth;
    onChange();
  });
  // Vue swaps a comment placeholder for the copy; neither is the label changing
  const ignored = (node) => node.nodeType === Node.COMMENT_NODE ||
    Boolean((node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement)?.closest('.d-text__slide-copy'));
  const mutation = new MutationObserver((records) => {
    const changed = records.some((record) => !ignored(record.target) &&
      (record.type === 'characterData' || [...record.addedNodes, ...record.removedNodes].some((node) => !ignored(node))));
    if (!changed || labelWidth() === label) return;
    label = labelWidth();
    onChange();
  });
  resize?.observe(viewport);
  mutation.observe(content, { childList: true, characterData: true, subtree: true });
  return () => {
    resize?.disconnect();
    mutation.disconnect();
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
export function readSlideConfig (el) {
  const style = getComputedStyle(el);
  const speed = parseFloat(style.getPropertyValue('--dt-text-slide-speed'));
  return {
    speed: speed > 0 ? speed : DEFAULT_SPEED,
    delay: Math.max(0, parseTime(style.getPropertyValue('--dt-text-slide-delay'), DEFAULT_DELAY)),
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
