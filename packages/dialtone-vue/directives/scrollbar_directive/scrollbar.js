import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';

const VALID_SHOW_SCROLLBAR = new Set(['always', 'enter', 'scroll', 'move']);

function resolveShowScrollbar (value, arg) {
  const mode = value?.showScrollbar ?? arg ?? 'enter';
  if (!VALID_SHOW_SCROLLBAR.has(mode)) {
    console.info(`[v-dt-scrollbar] Unknown showScrollbar value "${mode}". Valid values: ${[...VALID_SHOW_SCROLLBAR].join(', ')}. Falling back to "enter".`);
    return 'leave'; // 'enter' resolved
  }
  // 'always' → OS 'never' (always visible); 'enter' → OS 'leave' (show on enter, hide on leave)
  if (mode === 'always') return 'never';
  if (mode === 'enter') return 'leave';
  return mode;
}

const OFFSET_SIDES = ['block-start', 'block-end', 'inline-start', 'inline-end'];

function toCssLength (val) {
  return typeof val === 'number' ? `${val}px` : val;
}

function setProp (el, prop, val) {
  val != null ? el.style.setProperty(prop, toCssLength(val)) : el.style.removeProperty(prop);
}

function applyOffset (el, offset) {
  if (!offset) {
    for (const s of OFFSET_SIDES) el.style.removeProperty(`--dt-scrollbar-offset-${s}`);
    return;
  }
  setProp(el, '--dt-scrollbar-offset-block-start', offset.blockStart ?? offset.block);
  setProp(el, '--dt-scrollbar-offset-block-end', offset.blockEnd ?? offset.block);
  setProp(el, '--dt-scrollbar-offset-inline-start', offset.inlineStart ?? offset.inline);
  setProp(el, '--dt-scrollbar-offset-inline-end', offset.inlineEnd ?? offset.inline);
}

function applyScrollbarClasses (os, value, prev) {
  const { scrollbarVertical, scrollbarHorizontal } = os.elements();
  if (prev?.blockClasses) scrollbarVertical.scrollbar.classList.remove(...prev.blockClasses.split(' ').filter(Boolean));
  if (prev?.inlineClasses) scrollbarHorizontal.scrollbar.classList.remove(...prev.inlineClasses.split(' ').filter(Boolean));
  if (value?.blockClasses) scrollbarVertical.scrollbar.classList.add(...value.blockClasses.split(' ').filter(Boolean));
  if (value?.inlineClasses) scrollbarHorizontal.scrollbar.classList.add(...value.inlineClasses.split(' ').filter(Boolean));
}

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (app) {
    OverlayScrollbars.plugin(ClickScrollPlugin);
    const instances = new WeakMap();
    app.directive('dt-scrollbar', {
      mounted (el, binding) {
        const autoHide = resolveShowScrollbar(binding.value, binding.arg);
        const noDelay = autoHide === 'never' || autoHide === 'leave'; // OS values, already resolved
        // @property inside a shadow DOM stylesheet doesn't register globally.
        // Without global registration Chrome's WAAPI can't interpolate
        // --os-scroll-percent as a number and the scrollbar thumb never moves.
        try {
          CSS.registerProperty({
            name: '--os-scroll-percent',
            syntax: '<number>',
            inherits: true,
            initialValue: '0',
          });
        } catch (error) {
          // Chrome throws InvalidModificationError when the property is already
          // registered — that's the expected case on non-web-component pages
          // where overlayscrollbars.css is loaded globally. Anything else is a
          // real failure and should not be silently swallowed.
          if (!(error instanceof DOMException) || error.name !== 'InvalidModificationError') {
            throw error;
          }
        }

        const os = OverlayScrollbars({
          target: el,
          elements: {
            viewport: el.children[0],
          },
        }, {
          scrollbars: {
            autoHide,
            clickScroll: true,
            autoHideDelay: noDelay ? 0 : 1300,
          },
        });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('d-scrollbar');
        applyOffset(el, binding.value?.offset);
        applyScrollbarClasses(os, binding.value);
        instances.set(el, os);
      },
      updated (el, binding) {
        const os = instances.get(el);
        if (!os) return;
        const autoHide = resolveShowScrollbar(binding.value, binding.arg);
        const noDelay = autoHide === 'never' || autoHide === 'leave'; // OS values, already resolved
        os.options({
          scrollbars: {
            autoHide,
            autoHideDelay: noDelay ? 0 : 1300,
          },
        });
        applyOffset(el, binding.value?.offset);
        applyScrollbarClasses(os, binding.value, binding.oldValue);
      },
      unmounted (el) {
        const os = instances.get(el);
        if (os) os.destroy();
        instances.delete(el);
      },
    });
  },
};

export default DtScrollbarDirective;
