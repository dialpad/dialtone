<template>
  <aside class="d-bar8 d-of-hidden">
    <header :class="classes">
      <slot />
    </header>
  </aside>
</template>

<script>
export default {
  name: 'CodeWellHeader',
  inheritAttrs: false,
  props: {
    /**
     * Background class color
     */
    bgclass: {
      type: String,
      default: 'd-bgc-secondary',
    },

    /**
     * Used to be able to set only custom classes to the header
     */
    custom: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes () {
      if (this.custom) return this.$attrs.class;
      return [
        'd-fl-center d-fd-column d-p24 d-w100p d-of-auto d-stack8',
        this.bgclass,
        { 'd-ba d-bc-subtle d-btr8 d-baw1': this.isSurfacePrimary },
        this.$attrs.class,
      ];
    },

    isSurfacePrimary () {
      return this.bgclass === 'd-bgc-primary';
    },
  },
};
</script>
