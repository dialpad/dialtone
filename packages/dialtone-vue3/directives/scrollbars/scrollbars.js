import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export const DtScrollbarsDirective = {
  name: 'dt-scrollbars-directive',
  install (app) {
    app.directive('dt-scrollbars', {
      mounted (el) {
        OverlayScrollbars(el, { scrollbars: { autoHide: 'scroll' } });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('custom-scrollbars');
      },
    });
  },
};

export default DtScrollbarsDirective;
