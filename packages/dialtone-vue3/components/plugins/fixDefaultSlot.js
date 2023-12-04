export default {
  install (Vue, options) {
    Vue.mixin({
      computed: {
        defaultSlot () {
          return this.$attrs.default;
        },
      },
    });
  },
};
