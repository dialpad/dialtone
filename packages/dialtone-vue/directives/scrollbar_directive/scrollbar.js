import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';

function resolveShowScrollbar (value, arg) {
  const mode = value?.showScrollbar ?? arg ?? 'leave';
  // 'always' maps to OS autoHide 'never' (always visible); all other values pass through
  return mode === 'always' ? 'never' : mode;
}

const OFFSET_SIDES = ['block-start', 'block-end', 'inline-start', 'inline-end'];

function setProp (el, prop, val) {
  val != null ? el.style.setProperty(prop, val) : el.style.removeProperty(prop);
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

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (app) {
    OverlayScrollbars.plugin(ClickScrollPlugin);
    const instances = new WeakMap();
    app.directive('dt-scrollbar', {
      mounted (el, binding) {
        const autoHide = resolveShowScrollbar(binding.value, binding.arg);
        const noDelay = autoHide === 'never' || autoHide === 'leave';
        const os = OverlayScrollbars({
          target: el,
          elements: {
            viewport: el.children[0],
          },
        }, {
          scrollbars: {
            autoHide,
            clickScroll: true,
            autoHideDelay: `${noDelay ? 0 : 1300}`,
          },
        });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('d-scrollbar');
        applyOffset(el, binding.value?.offset);
        instances.set(el, os);
      },
      updated (el, binding) {
        const os = instances.get(el);
        if (!os) return;
        const autoHide = resolveShowScrollbar(binding.value, binding.arg);
        const noDelay = autoHide === 'never' || autoHide === 'leave';
        os.options({
          scrollbars: {
            autoHide,
            autoHideDelay: noDelay ? 0 : 1300,
          },
        });
        applyOffset(el, binding.value?.offset);
      },
      unmounted (el) {
        instances.get(el).destroy();
      },
    });
  },
};

export default DtScrollbarDirective;
