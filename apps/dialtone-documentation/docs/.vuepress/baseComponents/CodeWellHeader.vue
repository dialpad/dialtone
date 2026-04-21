<template>
  <aside>
    <dt-stack
      as="header"
      gap="100"
      align="center"
      justify="center"
      class="d-bar-400"
      :class="classes"
    >
      <slot />
    </dt-stack>
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
        'd-p-400 d-w100p d-of-auto',
        this.bgclass,
        { 'd-ba d-bc-subtle d-bbsr-400 d-baw1': this.isSurfacePrimary },
        this.$attrs.class,
      ];
    },

    isSurfacePrimary () {
      return this.bgclass === 'd-bgc-primary';
    },
  },
};
</script>
