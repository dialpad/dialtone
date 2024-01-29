<template>
  <img
    :src="iconSRC"
    class="injectable-svg d-icon"
  >
</template>

<script>
import SVGInject from '@iconfu/svg-inject';

export default {
  props: {
    name: String,
  },

  computed: {
    iconSRC () {
      return `/node_modules/@dialpad/dialtone-icons/dist/svg/${this.name}.svg`;
    },
  },

  watch: {
    name (newValue, oldValue) {
      if (newValue !== oldValue) {
        console.log('name changed');
        this.$nextTick(() => {
          console.log('update svg on name change');
          SVGInject(document.querySelectorAll('.injectable-svg'));
        });
      }
    },
  },

  mounted () {
    this.$nextTick(() => {
      console.log('update svg on mount');
      SVGInject(document.querySelectorAll('.injectable-svg'));
    });
  },
};
</script>
