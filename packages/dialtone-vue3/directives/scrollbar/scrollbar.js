import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (app) {
    OverlayScrollbars.plugin(ClickScrollPlugin);
    app.directive('dt-scrollbar', {
      mounted (el, binding) {
        OverlayScrollbars({
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
        el.classList.add('scrollbar');
      },
    });
  },
};

export default DtScrollbarDirective;
