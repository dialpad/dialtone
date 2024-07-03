import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export const DtScrollbarsDirective = {
  name: 'dt-scrollbars-directive',
  install (Vue) {
    Vue.directive('dt-scrollbars', {
      inserted (el) {
        OverlayScrollbars(el, { scrollbars: { autoHide: 'never' } });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('custom-scrollbars');
      },
    });
  },
};

export default DtScrollbarsDirective;
