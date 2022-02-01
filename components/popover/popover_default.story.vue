<template>
  <dt-popover
    :id="id"
    :key="uniqueKey"
    :open="isOpen"
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
    :focus-anchor-on-close="focusAnchorOnClose"
    :offset="offset"
    :append-to="appendTo"
    :interactive="interactive"
    :flip-boundary="flipBoundary"
    :interactive-border="interactiveBorder"
    :trigger="trigger"
    :modal="modal"
    :content-width="contentWidth"
    :show-close-button="showCloseButton"
    :header-class="headerClass"
    :footer-class="footerClass"
    :fixed-header-footer="fixedHeaderFooter"
    :max-height="maxHeight"
    :max-width="maxWidth"
    width-content="anchor"
    @update:open="updateOpen"
  >
    <template #anchor="{ attrs }">
      <dt-button
        v-bind="attrs"
        @click="isOpen = !isOpen"
      >
        Click to open
      </dt-button>
    </template>
    <template #content>
      <div class="d-fs14 d-m0">
        <span
          v-if="content"
          v-html="content"
        />
        <template v-else>
          <p class="d-mb4">
            I will be displayed in the popover!
          </p>
          <dt-button
            @click="isOpen = !isOpen"
          >
            Click to close
          </dt-button>
        </template>
      </div>
    </template>
    <template
      v-if="headerContent"
      #headerContent
    >
      <span v-html="headerContent" />
    </template>
    <template
      v-if="footerContent"
      #footerContent
    >
      <span v-html="footerContent" />
    </template>
  </dt-popover>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '../button';
import { getUniqueString } from '../utils';

export default {
  name: 'PopoverDefaultStory',
  components: {
    DtPopover,
    DtButton,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      isOpen: this.open || false,
    };
  },

  computed: {
    uniqueKey () {
      return getUniqueString();
    },
  },

  watch: {
    open (isOpen) {
      this.isOpen = isOpen;
    },
  },

  methods: {
    updateOpen (isOpen) {
      this.isOpen = isOpen;
      this.onUpdateOpen(...arguments);
    },
  },
};
</script>
