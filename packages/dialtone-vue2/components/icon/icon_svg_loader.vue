<template>
  <component
    :is="svgComponent"
  />
</template>

<script>
export default {
  props: {
    name: String,
  },

  data () {
    return {
      svgComponent: null,
    };
  },

  watch: {
    name: {
      immediate: true,
      handler (value) {
        this.loadSvgComponent(value);
      },
    },
  },

  methods: {
    async loadSvgComponent (name) {
      if (!name) return;
      const module = await import(`../../../dialtone-vue2/node_modules/@dialpad/dialtone-icons/dist/svg/${name}.svg`);
      this.svgComponent = module.default;
    },
  },
};
</script>
