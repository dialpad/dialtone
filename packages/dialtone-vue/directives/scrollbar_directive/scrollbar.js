import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';

function resolveShowScrollbar (value, arg) {
  const mode = value?.showScrollbar ?? arg ?? 'enter';
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
        instances.get(el).destroy();
      },
    });
  },
};

export default DtScrollbarDirective;
