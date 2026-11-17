// Added to both parity runs (not to either package's own tests): browser APIs jsdom lacks that change what
// components render, so the Vue goldens match what a browser shows.
/* global HTMLElement */
// The scrollbar (Vue's v-dt-scrollbar and React's useScrollbar) registers a CSS property when it sets up. jsdom's CSS
// has no registerProperty, and dialtone-vue's environment has no CSS at all, so the call would throw and leave the
// element without its scrollbar.
// jsdom has no ResizeObserver. OverlayScrollbars checks for it once, when it's first imported, and only adds its
// size-observer element when it finds one, as in a browser. Both packages' test setups mock it in beforeAll, which can
// come after that import (the Vue run imports v-dt-scrollbar up front), so it's defined here, before any test file loads.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class { observe () {} unobserve () {} disconnect () {} };
}
if (!globalThis.CSS) Object.defineProperty(globalThis, 'CSS', { value: {}, configurable: true, writable: true });
if (typeof globalThis.CSS.registerProperty !== 'function') {
  Object.defineProperty(globalThis.CSS, 'registerProperty', { value: () => {}, configurable: true, writable: true });
}
if (!('innerText' in HTMLElement.prototype)) {
  // Vue's tippy getAnchor() moves a text-only anchor into a span through innerText.
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    configurable: true,
    get () { return this.textContent; },
    set (value) { this.textContent = value; },
  });
}
