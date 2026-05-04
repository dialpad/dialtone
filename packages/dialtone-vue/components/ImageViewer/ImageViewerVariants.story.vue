<!-- Use this template story to allow the user control the component's props and slots -->
<template>
  <dt-stack gap="200">
    <dt-image-viewer
      :image-src="test"
      image-alt="Alt Text"
      image-button-class="d-wmn-100 d-hmn-100 d-wmx-500 d-hmx-500"
      aria-label="Click to open image"
    />

    <dt-image-viewer
      :image-src="fry"
      image-alt="Alt Text"
      image-button-class="d-wmn-100 d-hmn-100 d-wmx-500 d-hmx-500"
      aria-label="Click to open image"
    />
  </dt-stack>
</template>

<script>
import DtImageViewer from './ImageViewer.vue';
import { DtStack } from '@/components/stack';
import test from '@/common/assets/test.jpg?url';
import fry from '@/common/assets/fry.gif?url';

export default {
  name: 'DtImageViewerVariants',
  components: { DtImageViewer, DtStack },
  data () {
    return {
      test,
      fry,
    };
  },
};
</script>
