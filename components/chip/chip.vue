<template>
  <span
    :id="id"
    :class="chipClasses()"
    data-qa="dt-chip"
    :tabindex="tabIndex"
    :aria-labelledby="ariaLabel ? undefined : `${id}-content`"
    :aria-label="ariaLabel"
    @mousedown="onClick"
    @mouseup="onClick"
    @mouseleave="isActive = false"
    @focusout="isActive = false"
    @keydown.enter="onClick"
    @keyup.enter="onClick"
    @keyup.delete="onClose"
  >
    <span
      v-if="$slots.icon"
      data-qa="dt-chip-icon"
      class="d-chip__icon"
    >
      <!-- @slot Chip icon -->
      <slot name="icon" />
    </span>
    <span
      v-else-if="$slots.avatar"
      data-qa="dt-chip-avatar"
    >
      <!-- @slot Chip avatar -->
      <slot name="avatar" />
    </span>
    <span
      v-if="$slots.default"
      :id="`${id}-content`"
      data-qa="dt-chip-label"
      :class="['d-truncate', contentClass]"
    >
      <!-- @slot Content within chip -->
      <slot />
    </span>
    <span
      v-if="!hideClose"
      class="d-chip-btn-holder"
    />
    <span
      ref="closeBtnContainer"
      class="d-chip-btn-container"
    >
      <dt-button
        v-if="!hideClose"
        v-bind="closeButtonProps"
        data-qa="dt-chip-close"
        circle
        importance="clear"
        :aria-label="closeButtonProps.ariaLabel"
        @click="$emit('close')"
      >
        <icon-close />
      </dt-button>
    </span>
  </span>
</template>

<script>
import IconClose from '@dialpad/dialtone/lib/dist/vue/icons/IconClose';
import { DtButton } from '../button';
import { CHIP_SIZE_MODIFIERS } from './chip_constants';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'DtChip',

  components: {
    IconClose,
    DtButton,
  },

  props: {
    /**
     * A set of props to be passed into the modal's close button. Requires an 'ariaLabel' property.
     */
    closeButtonProps: {
      type: Object,
      validator: (props) => {
        return !!props.ariaLabel;
      },
    },

    /**
     * Hides the close button on the chip
     */
    hideClose: {
      type: Boolean,
      default: false,
    },

    /**
     * The size of the chip.
     * @values xs, sm, md
     * @see https://dialpad.design/components/chip
     */
    size: {
      type: String,
      default: 'md',
      validator: (s) => Object.keys(CHIP_SIZE_MODIFIERS).includes(s),
    },

    /**
     * The interactivity of the chip.
     * Makes chip clickable, apply hover/focus/active style, emit keyboard events etc.
     * @see https://dialpad.design/components/chip
     */
    interactive: {
      type: Boolean,
      default: true,
    },

    /**
     * Id to use for the dialog's aria-labelledby.
     */
    id: {
      type: String,
      default: function () { return getUniqueString(); },
    },

    /**
     * Descriptive label for the chip content.
     * If this prop is unset the content in the default slot will be used as an aria-label.
     */
    ariaLabel: {
      type: String,
      default: '',
    },

    /**
     * Additional class name for the chip element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  emits: ['click', 'close'],

  data () {
    return {
      isActive: false,
    };
  },

  computed: {
    tabIndex () {
      return this.interactive ? 0 : -1;
    },
  },

  methods: {
    chipClasses () {
      return [
        'd-chip',
        CHIP_SIZE_MODIFIERS[this.size],
        {
          'd-chip--interactive': this.interactive,
          'd-chip--active': this.isActive,
        },
      ];
    },

    onClose () {
      if (!this.hideClose) {
        this.$emit('close');
      }
    },

    onClick (event) {
      // Clicking on the button should not update value of isActive.
      if (!this.interactive || this.$refs.closeBtnContainer.contains(event.target)) {
        return;
      }
      if (event.type === 'mousedown' || event.type === 'keydown') {
        this.isActive = true;
      } else {
        this.isActive = false;
        this.$emit('click');
      }
    },
  },
};
</script>
