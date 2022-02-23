<template>
  <div
    data-qa="dt-popover-header-footer"
    :class="type === 'header' ? 'd-popover__header' : 'd-popover__footer'"
  >
    <div
      v-if="$slots.content"
      data-qa="dt-popover-header-footer-content"
      :class="['d-to-ellipsis', 'd-w100p', contentClass]"
    >
      <slot name="content" />
    </div>
    <div
      v-if="showCloseButton"
      class="d-pl6 d-d-flex d-ws-nowrap"
    >
      <dt-button
        ref="popover__close-button"
        class="d-p6 d-bc-transparent"
        importance="outlined"
        kind="muted"
        circle
        v-bind="closeButtonProps"
        @click="$emit('close')"
      >
        <template #icon>
          <icon-close
            class="d-svg--size20"
          />
        </template>
      </dt-button>
    </div>
  </div>
</template>

<script>
import DtButton from '../button/button';
import IconClose from '@dialpad/dialtone/lib/dist/vue/icons/IconClose';
export default {
  name: 'PopoverHeaderFooter',
  components: {
    DtButton,
    IconClose,
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

  emits: ['close'],

  methods: {
    focusCloseButton () {
      const closeButton = this.$refs['popover__close-button']?.$el;
      closeButton?.focus();
    },
  },
};
</script>
