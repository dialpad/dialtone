import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (Vue) {
    Vue.directive('dt-scrollbar', {
      inserted (el, binding) {
        OverlayScrollbars(el, { scrollbars: { autoHide: `${binding.arg || 'leave'}` } });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('scrollbar');
      },
    });
  },
};

export default DtScrollbarDirective;
