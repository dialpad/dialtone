<template>
  <img
    :src="`/node_modules/@dialpad/dialtone-icons/dist/svg/${name}.svg`"
    class="injectable-svg d-icon"
  >
</template>

<script>
import SVGInject from '@iconfu/svg-inject';

export default {
  props: {
    name: String,
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
