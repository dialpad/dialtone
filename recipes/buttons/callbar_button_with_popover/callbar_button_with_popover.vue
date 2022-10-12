<template>
  <div
    class="dt-recipe--callbar-button-with-popover--button"
  >
    <dt-recipe-callbar-button
      :aria-label="ariaLabel"
      :disabled="disabled"
      :active="active"
      :danger="danger"
      :button-class="buttonClass"
      class="dt-recipe--callbar-button-with-popover--main-button"
      @click="buttonClick"
    >
      <template #icon>
        <slot name="icon" />
      </template>
      <template #tooltip>
        <slot name="tooltip" />
      </template>
      <slot />
    </dt-recipe-callbar-button>
    <dt-popover
      v-if="showArrowButton"
      :id="id"
      :open="open"
      :placement="placement"
      :initial-focus-element="initialFocusElement"
      :show-close-button="showCloseButton"
      padding="none"
      class="dt-recipe--callbar-button-with-popover--popover-wrapper"
      :dialog-class="['dt-recipe--callbar-button-with-popover--popover', contentClass]"
      header-class="d-d-flex d-ai-center d-fw-normal d-px12"
      v-bind="$attrs"
      @opened="onModalIsOpened"
    >
      <template #anchor>
        <dt-button
          circle
          importance="clear"
          size="lg"
          class="dt-recipe--callbar-button-with-popover--arrow"
          width="2rem"
          :aria-label="arrowButtonLabel"
          :active="open"
          @click="arrowClick"
        >
          <template #icon>
            <icon-arrow-drop-up class="d-svg--size-16" />
          </template>
        </dt-button>
      </template>
      <template #content>
        <slot name="content" />
      </template>
      <template #headerContent>
        <slot name="headerContent" />
      </template>
      <template #footerContent>
        <slot name="footerContent" />
      </template>
    </dt-popover>
  </div>
</template>

<script>
import DtButton from '@/components/button/button';
import DtPopover from '@/components/popover/popover';
import DtRecipeCallbarButton from '@/recipes/buttons/callbar_button/callbar_button';
import IconArrowDropUp from '@dialpad/dialtone/lib/dist/vue/icons/IconArrowDropUp.vue';
import utils from '@/common/utils';

export default {
  name: 'DtRecipeCallbarButtonWithPopover',

  components: { DtRecipeCallbarButton, DtPopover, DtButton, IconArrowDropUp },

  /* inheritAttrs: false is generally an option we want to set on library
    components. This allows any attributes passed in that are not recognized
    as props to be passed down to another element or component using v-bind:$attrs
    more info: https://vuejs.org/v2/api/#inheritAttrs */
  inheritAttrs: false,

  props: {
    /**
     * Id for the item.
     */
    id: {
      type: String,
      default () {
        return utils.getUniqueString();
      },
    },

    /**
     * Aria label for the button. If empty, it takes its value from the default slot.
     */
    ariaLabel: {
      type: String,
      default: null,
      validator: (label) => {
        return label || this.$slots.default;
      },
    },

    /**
     * Aria label for the arrow. Cannot be empty.
     */
    arrowButtonLabel: {
      type: String,
      required: true,
      validator: (label) => {
        return !!label;
      },
    },

    /**
     * The direction the popover displays relative to the anchor.
     * @values 'bottom', 'bottom-start', 'bottom-end',
     *         'right', 'right-start', 'right-end',
     *         'left', 'left-start', 'left-end',
     *         'top', 'top-start', 'top-end'
     * @default 'top'
     */
    placement: {
      type: String,
      default: 'top',
    },

    /**
     * The element that is focused when the popover is opened. This can be an
     * HTMLElement within the popover, a string starting with '#' which will
     * find the element by ID. 'first' which will automatically focus
     * the first element, or 'dialog' which will focus the dialog window itself.
     * If the dialog is modal this prop cannot be 'none'.
     */
    initialFocusElement: {
      type: String,
      default: 'first',
    },

    /**
     * Determines visibility for close button
     */
    showCloseButton: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines whether the button should be disabled
     * default is false.
     * @values true, false
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Forces showing the arrow, even if the button is disabled.
     * default is false
     * @values true, false
     */
    forceShowArrow: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether the button should have active styling
     * default is false.
     * @values true, false
     * @see https://dialpad.design/components/button/
     */
    active: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines whether the button should have danger styling
     * default is false.
     * @values true, false
     * @see https://dialpad.design/components/button/
     */
    danger: {
      type: Boolean,
      default: false,
    },

    /**
     * We need this declaration because of how Vue3 informs the component about a listener.
     * Spoiler alert: it doesn't.
     * Vue3 intends to work as a real pub-sub, meaning the publisher has not a clue of who the subscribers are.
     * This makes it impossible from the regular declaration (emits: ['click']) to check whether
     * we actually have a click handler or not.
     * We're hacking it by adding an onClick prop: https://github.com/vuejs/core/issues/5220
    */
    /* eslint-disable-next-line vue/no-unused-properties */
    onClick: {
      type: Function,
      default: null,
    },

    /**
     * Additional class name for the button wrapper element.
     */
    buttonClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the popover content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  emits: [
    /**
     * Emitted when the arrow is clicked
     */
    'arrowClick',

    /**
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  data () {
    return {
      open: false,
    };
  },

  computed: {
    showArrowButton () {
      return this.forceShowArrow || !this.disabled;
    },
  },

  methods: {
    arrowClick (ev) {
      this.$emit('arrowClick', ev);
      return (this.open = !this.open);
    },

    buttonClick (ev) {
      // If no listener for the click event, the button click opens the popover
      // the same as if the arrow was clicked.
      if (!this.$props.onClick) {
        this.arrowClick(ev);
      } else {
        this.$emit('click', ev);
      }
    },

    onModalIsOpened (isOpened) {
      this.open = isOpened;
    },
  },

};
</script>

<style lang="less">
.dt-recipe--callbar-button-with-popover--button {
  position: relative;
  display: inline-block;
}
.dt-recipe--callbar-button-with-popover--arrow.d-btn--circle {
  position: absolute;
  top: 2rem;
  right: 0;
  width: var(--su16);
  height: var(--su16);
  padding: var(--su8);
  border-radius: var(--su4);

  &.d-btn--active {
    background: var(--black-025);
  }
}
.dt-recipe--callbar-button-with-popover--popover {
  .d-popover__header {
    background: var(--black-900);
    color: var(--white);

    button {
      color: var(--white);
    }
  }

}
.dt-recipe--callbar-button-with-popover--button .d-tab--selected::after,
.dt-recipe--callbar-button-with-popover--button .d-tab--selected:hover::after {
  --tab--bgc: var(--black-900);
}
.dt-recipe--callbar-button-with-popover--button .tab-group {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.dt-recipe--callbar-button-with-popover--button .tab-content {
  flex: 1 1 100%;
  overflow-y: auto;
}
</style>
