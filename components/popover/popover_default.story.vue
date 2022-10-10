<template>
  <dt-popover
    :id="id"
    :key="uniqueKey"
    :open.sync="isOpen"
    :placement="placement"
    :content-class="contentClass"
    :fallback-placements="fallbackPlacements"
    :padding="padding"
    :hide-on-click="hideOnClick"
    :role="role"
    :element-type="elementType"
    :transition="transition"
    :aria-labelledby="ariaLabelledby"
    :aria-label="ariaLabel"
    :offset="offset"
    :modal="modal"
    :initial-focus-element="initialFocusElement"
    :content-width="contentWidth"
    :show-close-button="showCloseButton"
    :header-class="headerClass"
    :footer-class="footerClass"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :tether="tether"
    :sticky="sticky"
    :open-with-arrow-keys="openWithArrowKeys"
    :visually-hidden-close="visuallyHiddenClose"
    :visually-hidden-close-label="visuallyHiddenCloseLabel"
    @opened="onOpened"
  >
    <template
      slot="anchor"
      slot-scope="{ attrs }"
    >
      <dt-button
        v-bind="attrs"
      >
        Click to open
      </dt-button>
    </template>
    <template
      slot="content"
      slot-scope="{ close }"
    >
      <div class="d-fs-200 d-m0">
        <span
          v-if="content"
          v-html="content"
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
      v-if="headerContent"
      slot="headerContent"
    >
      <span v-html="headerContent" />
    </template>
    <template
      v-if="footerContent"
      slot="footerContent"
    >
      <span v-html="footerContent" />
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
