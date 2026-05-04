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
      <span
        class="d-recipe-attachment-carousel__image-progress-bar"
      >
        <dt-progress-circle
          v-if="mediaItem.isUploading"
          kind="brand"
          size="400"
          :progress="mediaItem.progress"
          :aria-label="i18n.$t('DIALTONE_IMAGE_CAROUSEL_PROGRESS_BAR_ARIA_LABEL')"
        />
      </span>
      <dt-button
        :id="`closeButton-${index}`"
        tabindex="0"
        class="d-recipe-attachment-carousel__image-close-button"
        circle
        :size="100"
        importance="clear"
        :aria-label="closeButtonTitle"
        :title="closeButtonTitle"
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
import { DtImageViewer } from '@/components/ImageViewer';
import { DtButton } from '@/components/Button';
import { DtIconClose } from '@dialpad/dialtone-icons/vue';
import { DialtoneLocalization } from '@/localization';

import { DtProgressCircle } from '@/components/ProgressCircle';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtImageCarousel',

  components: {
    DtImageViewer,
    DtButton,
    DtIconClose,
    DtProgressCircle,
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

  data () {
    return {
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    closeButtonTitle () {
      return this.i18n.$t('DIALTONE_CLOSE_BUTTON');
    },
  },

  methods: {
    removeMediaItem (index) {
      this.$emit('remove-media', index);
    },
  },
};
</script>
