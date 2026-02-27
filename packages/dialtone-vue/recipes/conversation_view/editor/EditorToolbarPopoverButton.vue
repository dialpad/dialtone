<template>
  <dt-popover
    :data-qa="popoverDataQa || `${dataQa}-popover`"
    padding="small"
    navigation-type="arrow-keys"
    placement="bottom-start"
    :open-with-arrow-keys="true"
  >
    <template #anchor="{ attrs }">
      <dt-button
        ref="buttonRef"
        v-dt-tooltip="{ message: tooltipMessage, placement: 'top' }"
        v-bind="attrs"
        :active="isActive"
        :aria-label="tooltipMessage"
        :data-qa="dataQa"
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
    dataQa: {
      type: String,
      default: '',
    },

    /**
     * Popover specific data QA attribute
     */
    popoverDataQa: {
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
