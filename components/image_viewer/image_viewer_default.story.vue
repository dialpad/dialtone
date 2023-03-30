<template>
  <dt-image-viewer
    :image-src="imageSrc"
    :image-alt="imageAlt"
    :close-aria-label="closeAriaLabel"
    :image-button-class="imageButtonClass"
    :aria-label="ariaLabel"
    :open.sync="isOpen"
    @opened="onOpened"
  />
</template>

<script>
import DtImageViewer from './image_viewer';

export default {
  name: 'DtImageViewerDefault',
  components: { DtImageViewer },
  data: function () {
    return {
      isOpen: this.open,
    };
  },

  watch: {
    open: function (open) {
      this.isOpen = open;
    },
  },
};
</script>
