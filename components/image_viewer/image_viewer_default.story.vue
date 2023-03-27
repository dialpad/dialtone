<template>
  <dt-image-viewer
    :image-src="imageSrc"
    :image-alt="imageAlt"
    :close-aria-label="closeAriaLabel"
    :image-button-class="imageButtonClass"
    :aria-label="ariaLabel"
  />
</template>

<script>
import DtImageViewer from './image_viewer';

export default {
  name: 'DtImageViewerDefault',
  components: { DtImageViewer },
};
</script>
