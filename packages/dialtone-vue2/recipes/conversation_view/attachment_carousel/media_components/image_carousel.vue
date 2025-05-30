<template>
  <li
    class="d-recipe-attachment-carousel__image"
  >
    <dt-image-viewer
      image-button-class="d-recipe-attachment-carousel__image-viewer"
      :image-src="mediaItem.path"
      :image-alt="mediaItem.altText"
      :aria-label="i18n.$t('DIALTONE_IMAGE_CAROUSEL_CLICK_TO_OPEN_ARIA_LABEL')"
    />

    <!-- Loader / Close button -->
    <div
      class="d-recipe-attachment-carousel__image-top-right"
    >
      <dt-progress-bar
        v-if="mediaItem.isUploading"
        class="d-recipe-attachment-carousel__image-progress-bar"
        :progress="mediaItem.progress"
        :aria-label="i18n.$t('DIALTONE_IMAGE_CAROUSEL_PROGRESS_BAR_ARIA_LABEL')"
      />
      <dt-button
        :id="`closeButton-${index}`"
        tabindex="0"
        class="d-recipe-attachment-carousel__image-close-button"
        circle
        size="xs"
        importance="clear"
        v-bind="i18n.$ta('DIALTONE_CLOSE_BUTTON')"
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
import { DtIconClose } from '@dialpad/dialtone-icons/vue2';
import { DtLocalizationMixin } from '@/common/mixins';

import DtProgressBar from './progress_bar.vue';

export default {
  name: 'DtImageCarousel',

  components: {
    DtImageViewer,
    DtButton,
    DtIconClose,
    DtProgressBar,
  },

  mixins: [DtLocalizationMixin],

  props: {
    mediaItem: {
      type: Object,
      required: true,
    },

    index: {
      type: Number,
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
