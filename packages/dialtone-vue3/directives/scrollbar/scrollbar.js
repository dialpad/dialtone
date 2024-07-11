import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (app) {
    app.directive('dt-scrollbar', {
      mounted (el) {
        OverlayScrollbars(el, { scrollbars: { autoHide: 'scroll' } });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('scrollbar');
      },
    });
  },
};

export default DtScrollbarDirective;
