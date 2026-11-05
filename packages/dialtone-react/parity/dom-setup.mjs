// Added to both parity runs (not to either package's own tests): browser APIs jsdom lacks that change what
// components render, so the Vue goldens match what a browser shows.
/* global HTMLElement */
if (!('innerText' in HTMLElement.prototype)) {
  // Vue's tippy getAnchor() moves a text-only anchor into a span through innerText.
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    configurable: true,
    get () { return this.textContent; },
    set (value) { this.textContent = value; },
  });
}
