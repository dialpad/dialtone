import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (Vue) {
    Vue.directive('dt-scrollbar', {
      inserted (el) {
        OverlayScrollbars(el, { scrollbars: { autoHide: 'scroll' } });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('custom-scrollbars');
      },
    });
  },
};

export default DtScrollbarDirective;
