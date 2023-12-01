<template>
  <dt-image-viewer
    :image-src="$attrs.imageSrc"
    :image-alt="$attrs.imageAlt"
    :close-aria-label="$attrs.closeAriaLabel"
    :image-button-class="$attrs.imageButtonClass"
    :aria-label="$attrs.ariaLabel"
    :open.sync="isOpen"
    @opened="$attrs.onOpened"
  />
</template>

<script>
import DtImageViewer from './image_viewer.vue';

export default {
  name: 'DtImageViewerDefault',
  components: { DtImageViewer },
  data: function () {
    return {
      isOpen: this.$attrs.open,
    };
  },

  watch: {
    open: function (open) {
      this.isOpen = open;
    },
  },
};
</script>
