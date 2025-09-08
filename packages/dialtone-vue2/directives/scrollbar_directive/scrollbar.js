import { OverlayScrollbars, ClickScrollPlugin } from 'overlayscrollbars';

export const DtScrollbarDirective = {
  name: 'dt-scrollbar-directive',
  install (Vue) {
    OverlayScrollbars.plugin(ClickScrollPlugin);
    const instances = new WeakMap();
    Vue.directive('dt-scrollbar', {
      inserted (el, binding) {
        const os = OverlayScrollbars({
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
        el.classList.add('d-scrollbar');
        instances.set(el, os);
      },
      unbind (el) {
        instances.get(el).destroy();
      },
    });
  },
};

export default DtScrollbarDirective;
