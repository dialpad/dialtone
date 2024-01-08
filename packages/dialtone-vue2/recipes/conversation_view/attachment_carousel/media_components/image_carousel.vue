<template>
  <li
    class="dt-attachment-image"
  >
    <dt-image-viewer
      image-button-class="dt-attachment-image__image-viewer"
      :image-src="mediaItem.path"
      :image-alt="mediaItem.altText"
      :close-aria-label="closeAriaLabel"
      :aria-label="clickToOpenAriaLabel"
    />

    <!-- Loader / Close button -->
    <div
      class="dt-attachment-image__top-right"
    >
      <dt-progress-bar
        v-if="mediaItem.isUploading"
        class="dt-attachment-image__progress-bar"
        :progress="mediaItem.progress"
        :progressbar-aria-label="progressbarAriaLabel"
      />
      <dt-button
        :id="`closeButton-${index}`"
        tabindex="0"
        class="dt-attachment-image__close-button"
        circle
        size="xs"
        importance="clear"
        :aria-label="closeAriaLabel"
        @click="removeMediaItem(index)"
      >
        <template #icon>
          <dt-icon
            name="close"
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
import { DtIcon } from '@/components/icon';

import DtProgressBar from './progress_bar.vue';

export default {
  name: 'DtImageCarousel',

  components: {
    DtImageViewer,
    DtButton,
    DtIcon,
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

<style lang="less">
.dt-attachment-image {
  position: relative;

  &:focus-within .dt-attachment-image__close-button, &:hover .dt-attachment-image__close-button {
    opacity: 1;
  }
}
.dt-attachment-image__image-viewer {
  height: var(--dt-size-700);
  width: var(--dt-size-700);
  border: var(--dt-space-100) solid;
  border-radius: var(--br4);
  border-width: var(--dt-size-350);
  border-color: var(--dt-color-border-subtle);
  object-fit: cover;
}
.dt-attachment-image__top-right {
  position: absolute;
  top: var(--dt-size-100);
  right: var(--dt-size-100);
}
.dt-attachment-image__close-button {
  opacity: 0;
  position: absolute;
  top: inherit;
  right: inherit;
  color: var(--dt-color-neutral-white);
  background-color: var(--dt-color-black-400);
  border: var(--dt-space-100) solid;
  border-width: var(--dt-size-200);
  border-color: var(--dt-color-neutral-white);
}
.dt-attachment-image__progress-bar {
  position: absolute;
  top: inherit;
  right: inherit;
  background-color: var(--dt-color-neutral-white);
  border-radius: 50%;
  display: flex;
  transform: rotate(-90deg);
  border: var(--dt-space-100) solid;
  border-width: var(--dt-size-200);
  border-color: var(--dt-color-border-subtle);
}
</style>
