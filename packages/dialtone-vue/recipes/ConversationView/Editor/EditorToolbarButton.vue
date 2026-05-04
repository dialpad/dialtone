<template>
  <dt-button
    ref="buttonRef"
    v-dt-tooltip="{ message: tooltipMessage, placement: 'top', externalAnchorElement: $refs.buttonRef?.$el }"
    :active="isActive"
    :aria-label="tooltipMessage"
    :data-qa="dataQA"
    :tabindex="tabindex"
    importance="clear"
    kind="muted"
    :size="100"
    @click="onClick"
    @keydown.right.stop="$emit('shift-focus-right')"
    @keydown.left.stop="$emit('shift-focus-left')"
  >
    <template #icon>
      <component
        :is="icon"
        size="200"
      />
      <slot name="extra" />
    </template>
    {{ label }}
  </dt-button>
</template>

<script>
import { DtButton } from '@/components/Button';

export default {
  name: 'EditorToolbarButton',

  components: {
    DtButton,
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
    dataQA: {
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

    /**
     * Button label text
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * Click handler function
     */
    onClick: {
      type: Function,
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
