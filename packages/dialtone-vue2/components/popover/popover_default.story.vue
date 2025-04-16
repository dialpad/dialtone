<template>
  <dt-popover
    :id="$attrs.id"
    :key="uniqueKey"
    :append-to="$attrs.appendTo"
    :aria-label="$attrs.ariaLabel"
    :aria-labelledby="$attrs.ariaLabelledby"
    :content-class="$attrs.contentClass"
    :content-width="$attrs.contentWidth"
    :element-type="$attrs.elementType"
    :fallback-placements="$attrs.fallbackPlacements"
    :footer-class="$attrs.footerClass"
    :header-class="$attrs.headerClass"
    :hide-on-click="$attrs.hideOnClick"
    :initial-focus-element="$attrs.initialFocusElement"
    :max-height="$attrs.maxHeight"
    :max-width="$attrs.maxWidth"
    :modal="$attrs.modal"
    :offset="$attrs.offset"
    :open-with-arrow-keys="$attrs.openWithArrowKeys"
    :open.sync="isOpen"
    :padding="$attrs.padding"
    :placement="$attrs.placement"
    :role="$attrs.role"
    :show-close-button="$attrs.showCloseButton"
    :sticky="$attrs.sticky"
    :tether="$attrs.tether"
    :transition="$attrs.transition"
    :visually-hidden-close="$attrs.visuallyHiddenClose"
    :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
    @opened="$attrs.onOpened"
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
      <div>
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
      slot="headerContent"
    >
      <span v-html="$attrs.headerContent" />
    </template>
    <template
      v-if="$attrs.footerContent"
      slot="footerContent"
    >
      <span v-html="$attrs.footerContent" />
    </template>
  </dt-popover>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '@/components/button';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'PopoverDefaultStory',
  components: {
    DtPopover,
    DtButton,
  },

  data: function () {
    return {
      isOpen: this.$attrs.open,
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
