import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (Vue) {
    OverlayScrollbars.plugin(ClickScrollPlugin);
    Vue.directive('dt-scrollbar', {
      inserted (el, binding) {
        OverlayScrollbars(el, { scrollbars: { autoHide: `${binding.arg || 'leave'}`, clickScroll: true } });
        el.setAttribute('data-overlayscrollbars-initialize', true);
        el.classList.add('scrollbar');
      },
    });
  },
};

export default DtScrollbarDirective;
