import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (app) {
    OverlayScrollbars.plugin(ClickScrollPlugin);
    const instances = new WeakMap();
    app.directive('dt-scrollbar', {
      mounted (el, binding) {
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
            autoHide: `${binding.arg || 'leave'}`,
            clickScroll: true,
            autoHideDelay: `${!binding.arg || binding.arg === 'leave' ? 0 : 1300}`,
          },
        });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('d-scrollbar');
        instances.set(el, os);
      },
      unmounted (el) {
        instances.get(el).destroy();
      },
    });
  },
};

export default DtScrollbarDirective;
