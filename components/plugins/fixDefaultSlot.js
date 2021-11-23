export default {
  install (Vue, options) {
    console.log(Vue);
    Vue.mixin({
      computed: {
        defaultSlot () {
          return this.default;
        },
      },
    });
  },
};
