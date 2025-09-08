export default {
  install (Vue) {
    Vue.mixin({
      computed: {
        defaultSlot () {
          return this.$attrs.default;
        },
      },
    });
  },
};
