<template>
  <div>
    <dt-modal
      :open="isModalOpen"
      header-text="Modal with Popover and Tooltip"
      @update:open="isModalOpen = $event"
    >
      <template #default>
        <div class="d-d-flex d-ai-center d-gg-400">
          <dt-popover
            :open="isPopoverOpen"
            placement="bottom-start"
            @update:open="isPopoverOpen = $event"
          >
            <template #anchor="{ attrs }">
              <dt-button v-bind="attrs">
                Open popover
              </dt-button>
            </template>
            <template #content="{ close }">
              <p class="d-mbe-50">
                Popover inside a dialog
              </p>
              <dt-button @click="close">
                Close
              </dt-button>
            </template>
          </dt-popover>
          <dt-tooltip
            message="Tooltip inside a dialog"
            :open="isTooltipOpen"
          >
            <template #anchor>
              <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
              <dt-button
                @mouseenter="isTooltipOpen = true"
                @mouseleave="isTooltipOpen = false"
                @focus="isTooltipOpen = true"
                @blur="isTooltipOpen = false"
              >
                Hover for tooltip
              </dt-button>
            </template>
          </dt-tooltip>
        </div>
      </template>
      <template #footer>
        <dt-button
          importance="clear"
          @click="isModalOpen = false"
        >
          Close modal
        </dt-button>
      </template>
    </dt-modal>
    <dt-button @click="isModalOpen = true">
      Open modal
    </dt-button>
  </div>
</template>

<script>
import DtModal from '../Modal/Modal.vue';
import { DtPopover } from './';
import DtTooltip from '../Tooltip/Tooltip.vue';
import { DtButton } from '../Button';

export default {
  name: 'PopoverInsideDialogStory',
  components: {
    DtModal,
    DtPopover,
    DtTooltip,
    DtButton,
  },

  data () {
    return {
      isModalOpen: this.$attrs.open ?? false,
      isPopoverOpen: this.$attrs.popoverOpen ?? false,
      isTooltipOpen: this.$attrs.tooltipOpen ?? false,
    };
  },

  watch: {
    '$attrs.open' (val) {
      this.isModalOpen = val;
    },

    '$attrs.popoverOpen' (val) {
      this.isPopoverOpen = val;
    },

    '$attrs.tooltipOpen' (val) {
      this.isTooltipOpen = val;
    },
  },
};
</script>
