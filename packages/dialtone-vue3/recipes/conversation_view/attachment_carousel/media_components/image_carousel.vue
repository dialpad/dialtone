<template>
  <li
    class="d-recipe-attachment-carousel__image"
  >
    <dt-image-viewer
      image-button-class="d-recipe-attachment-carousel__image-viewer"
      :image-src="mediaItem.path"
      :image-alt="mediaItem.altText"
      :close-aria-label="closeAriaLabel"
      :aria-label="clickToOpenAriaLabel"
    />

    <!-- Loader / Close button -->
    <div
      class="d-recipe-attachment-carousel__image-top-right"
    >
      <dt-progress-bar
        v-if="mediaItem.isUploading"
        class="d-recipe-attachment-carousel__image-progress-bar"
        :progress="mediaItem.progress"
        :progressbar-aria-label="progressbarAriaLabel"
      />
      <dt-button
        :id="`closeButton-${index}`"
        tabindex="0"
        class="d-recipe-attachment-carousel__image-close-button"
        circle
        size="xs"
        importance="clear"
        :aria-label="closeAriaLabel"
        @click="removeMediaItem(index)"
      >
        <template #icon>
          <dt-icon-close
            size="200"
          />
        </template>
      </dt-button>
    </div>
  </li>
</template>

<script>
import { DtImageViewer } from '@/components/image_viewer';
import { DtButton } from '@/components/button';
import { DtIconClose } from '@dialpad/dialtone-icons/vue3';

import DtProgressBar from './progress_bar.vue';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtImageCarousel',

  components: {
    DtImageViewer,
    DtButton,
    DtIconClose,
    DtProgressBar,
  },

  props: {
    mediaItem: {
      type: Object,
      required: true,
    },

    index: {
      type: Number,
      required: true,
    },

    closeAriaLabel: {
      type: String,
      required: true,
    },

    clickToOpenAriaLabel: {
      type: String,
      required: true,
    },

    progressbarAriaLabel: {
      type: String,
      required: true,
    },
  },

  emits: [
    /**
     * Emitted when media close button is clicked to remove the image
     *
     * @event remove-media
     * @type {Number}
     */
    'remove-media',
  ],

  methods: {
    removeMediaItem (index) {
      this.$emit('remove-media', index);
    },
  },
};
</script>
