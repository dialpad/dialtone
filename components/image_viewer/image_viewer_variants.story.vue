<!-- Use this template story to allow the user control the component's props and slots -->
<template>
  <div class="d-stack16">
    <dt-image-viewer
      :image-src="require('./test.jpg')"
      image-alt="Alt Text"
      close-aria-label="Close"
      image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
      aria-label="Click to open image"
    />

    <dt-image-viewer
      :image-src="require('@/common/assets/fry.gif')"
      image-alt="Alt Text"
      close-aria-label="Close"
      image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
      aria-label="Click to open image"
    />
  </div>
</template>

<script>
import DtImageViewer from './image_viewer';

export default {
  name: 'DtImageViewerVariants',
  components: { DtImageViewer },
};
</script>
