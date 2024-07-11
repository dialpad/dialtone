import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (app) {
    OverlayScrollbars.plugin(ClickScrollPlugin);
    app.directive('dt-scrollbar', {
      mounted (el, binding) {
        OverlayScrollbars(el, { scrollbars: { autoHide: `${binding.arg || 'leave'}`, clickScroll: true } });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('scrollbar');
      },
    });
  },
};

export default DtScrollbarDirective;
