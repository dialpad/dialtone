<template>
  <dt-image-viewer
    :image-src="$attrs.imageSrc"
    :image-alt="$attrs.imageAlt"
    :close-aria-label="$attrs.closeAriaLabel"
    :image-button-class="$attrs.imageButtonClass"
    :aria-label="$attrs.ariaLabel"
  />
</template>

<script>
import DtImageViewer from './image_viewer';

export default {
  name: 'DtImageViewerDefault',
  components: { DtImageViewer },
};
</script>
