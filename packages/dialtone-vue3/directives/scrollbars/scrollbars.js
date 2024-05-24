import { OverlayScrollbars } from 'overlayscrollbars';

export const DtScrollbarsDirective = {
  name: 'dt-scrollbars-directive',
  install (app) {
    app.directive('dt-scrollbars', {
      mounted (el) {
        OverlayScrollbars(el, {});
        el.setAttribute('data-overlayscrollbars-initialize', true);
      },
    });
  },
};

export default DtScrollbarsDirective;
