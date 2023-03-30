<template>
  <dt-image-viewer
    v-model:open="isOpen"
    :image-src="$attrs.imageSrc"
    :image-alt="$attrs.imageAlt"
    :close-aria-label="$attrs.closeAriaLabel"
    :image-button-class="$attrs.imageButtonClass"
    :aria-label="$attrs.ariaLabel"
    @opened="$attrs.onOpened"
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
