<template>
  <div
    data-qa="dt-popover-header-footer"
    :class="{
      'd-popover__header': type === 'header',
      'd-popover__footer': type === 'footer',
    }"
  >
    <div
      v-if="$slots.content"
      data-qa="dt-popover-header-footer-content"
      :class="['d-to-ellipsis', 'd-w100p', contentClass]"
    >
      <!-- @slot Slot for main content -->
      <slot name="content" />
    </div>
    <dt-button
      v-if="showCloseButton"
      ref="popover__close-button"
      data-qa="dt-popover-close"
      class="d-p6 d-mr6 d-bc-transparent"
      importance="outlined"
      kind="muted"
      circle
      v-bind="closeButtonProps"
      @click="$emit('close')"
    >
      <template #icon>
        <dt-icon
          name="close"
          size="300"
        />
      </template>
    </dt-button>
  </div>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';

export default {
  name: 'PopoverHeaderFooter',
  components: {
    DtButton,
    DtIcon,
  },

  props: {
    // eslint-disable-next-line vue/require-default-prop
    type: {
      type: String,
      validator: function (value) {
        return ['header', 'footer'].includes(value);
      },
    },

    /**
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Determines visibility for close button
     * @values true, false
     */
    showCloseButton: {
      type: Boolean,
      default: false,
    },

    /**
     * A set of props to be passed into the popover's header close button.
     * Requires an 'ariaLabel' property.
     */
    closeButtonProps: {
      type: Object,
      default: () => {},
    },
  },

  emits: [
    /**
     * Emitted when popover is closed
     *
     * @event close
     * @type { Boolean }
     */
    'close',
  ],

  methods: {
    focusCloseButton () {
      const closeButton = this.$refs['popover__close-button']?.$el;
      closeButton?.focus();
    },
  },
};
</script>
