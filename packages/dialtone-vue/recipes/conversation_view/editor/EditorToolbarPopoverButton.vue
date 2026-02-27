<template>
  <dt-popover
    :data-qa="popoverDataQA || `${dataQA}-popover`"
    padding="small"
    placement="bottom-start"
    :modal="false"
  >
    <template #anchor="{ attrs }">
      <dt-button
        v-dt-tooltip="{ message: tooltipMessage, placement: 'top' }"
        v-bind="attrs"
        :active="isActive"
        :aria-label="tooltipMessage"
        :data-qa="dataQA"
        :tabindex="tabindex"
        importance="clear"
        kind="muted"
        size="xs"
        @keydown.right.stop="$emit('shift-focus-right')"
        @keydown.left.stop="$emit('shift-focus-left')"
      >
        <template #icon>
          <component
            :is="icon"
            size="200"
          />
        </template>
      </dt-button>
    </template>
    <template #content="{ close }">
      <slot
        name="content"
        :close="close"
      />
    </template>
  </dt-popover>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtPopover } from '@/components/popover';

export default {
  name: 'EditorToolbarPopoverButton',

  components: {
    DtButton,
    DtPopover,
  },

  props: {
    /**
     * Button reference key for focus management
     */
    buttonRef: {
      type: String,
      required: true,
    },

    /**
     * Whether the button is active
     */
    isActive: {
      type: Boolean,
      default: false,
    },

    /**
     * Tooltip message
     */
    tooltipMessage: {
      type: String,
      required: true,
    },

    /**
     * Data QA attribute for testing
     */
    dataQA: {
      type: String,
      default: '',
    },

    /**
     * Popover specific data QA attribute
     */
    popoverDataQA: {
      type: String,
      default: '',
    },

    /**
     * Tab index for keyboard navigation
     */
    tabindex: {
      type: Number,
      default: -1,
    },

    /**
     * Icon component
     */
    icon: {
      type: Object,
      required: true,
    },
  },

  emits: [
    /**
     * Emitted when right arrow key is pressed
     */
    'shift-focus-right',

    /**
     * Emitted when left arrow key is pressed
     */
    'shift-focus-left',
  ],
};
</script>
