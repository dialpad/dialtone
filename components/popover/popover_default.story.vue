<template>
  <dt-popover
    :id="$attrs.id"
    :key="$attrs.uniqueKey"
    v-model:open="isOpen"
    :placement="$attrs.placement"
    :content-class="$attrs.contentClass"
    :fallback-placements="$attrs.fallbackPlacements"
    :padding="$attrs.padding"
    :hide-on-click="$attrs.hideOnClick"
    :role="$attrs.role"
    :element-type="$attrs.elementType"
    :transition="$attrs.transition"
    :aria-labelledby="$attrs.ariaLabelledby"
    :aria-label="$attrs.ariaLabel"
    :offset="$attrs.offset"
    :modal="$attrs.modal"
    :initial-focus-element="$attrs.initialFocusElement"
    :content-width="$attrs.contentWidth"
    :show-close-button="$attrs.showCloseButton"
    :header-class="$attrs.headerClass"
    :footer-class="$attrs.footerClass"
    :max-height="$attrs.maxHeight"
    :max-width="$attrs.maxWidth"
    :tether="$attrs.tether"
    :sticky="$attrs.sticky"
    :open-with-arrow-keys="$attrs.openWithArrowKeys"
    :visually-hidden-close="$attrs.visuallyHiddenClose"
    :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
    @opened="$attrs.onOpened"
  >
    <template #anchor="{ attrs }">
      <dt-button
        v-bind="attrs"
      >
        Click to open
      </dt-button>
    </template>
    <template #content="{ close }">
      <div class="d-fs14 d-m0">
        <span
          v-if="$attrs.content"
          v-html="$attrs.content"
        />
        <template v-else>
          <p class="d-mb4">
            I will be displayed in the popover!
          </p>
          <dt-button
            id="content-close"
            @click="close"
          >
            Click to close
          </dt-button>
        </template>
      </div>
    </template>
    <template
      v-if="$attrs.headerContent"
      #headerContent
    >
      <span v-html="$attrs.headerContent" />
    </template>
    <template
      v-if="$attrs.footerContent"
      #footerContent
    >
      <span v-html="$attrs.footerContent" />
    </template>
  </dt-popover>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '../button';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'PopoverDefaultStory',
  components: {
    DtPopover,
    DtButton,
  },

  data: function () {
    return {
      isOpen: this.open,
    };
  },

  computed: {
    uniqueKey () {
      return getUniqueString();
    },
  },

  watch: {
    open: function (open) {
      this.isOpen = open;
    },
  },
};
</script>
