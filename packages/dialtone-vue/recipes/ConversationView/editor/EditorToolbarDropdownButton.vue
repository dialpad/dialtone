<template>
  <dt-dropdown
    :data-qa="dropdownDataQa || `${dataQa}-dropdown`"
    padding="small"
    navigation-type="arrow-keys"
    placement="bottom-start"
    @opened="onDropdownOpened"
  >
    <template #anchor="{ attrs }">
      <dt-button
        ref="buttonRef"
        v-dt-tooltip="{ message: tooltipMessage, placement: 'top', externalAnchorElement: $refs.buttonRef?.$el }"
        v-bind="attrs"
        :active="isActive"
        :aria-label="tooltipMessage"
        :data-qa="dataQa"
        :tabindex="tabindex"
        importance="clear"
        kind="muted"
        :size="100"
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
    <template #list="{ close: dropdownClose }">
      <slot
        name="list"
        :close="(cb) => { pendingCallback = cb; dropdownClose(); }"
      />
    </template>
  </dt-dropdown>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtDropdown } from '@/components/dropdown';

export default {
  name: 'EditorToolbardropdownButton',

  components: {
    DtButton,
    DtDropdown,
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
     * dropdown specific data QA attribute
     */
    dropdownDataQa: {
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

  data () {
    return {
      pendingCallback: null,
    };
  },

  methods: {
    // Wait until the dropdown is fully closed so the modal's anchor focus
    // completes first, then the callback can override it (e.g. to focus the editor).
    onDropdownOpened (isOpen) {
      if (!isOpen && typeof this.pendingCallback === 'function') {
        this.pendingCallback();
        this.pendingCallback = null;
      }
    },
  },
};
</script>
