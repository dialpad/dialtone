import { OverlayScrollbars } from 'overlayscrollbars';

export const DtScrollbarsDirective = {
  name: 'dt-scrollbars-directive',
  install (Vue) {
    Vue.directive('dt-scrollbars', {
      inserted (el) {
        OverlayScrollbars(el, {});
        el.setAttribute('data-overlayscrollbars-initialize', true);
      },
    });
  },
};

export default DtScrollbarsDirective;
