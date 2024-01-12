<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <dt-popover
    :id="id"
    :placement="placement"
    :content-class="contentClass"
    :fallback-placements="fallbackPlacements"
    :padding="padding"
    :transition="transition ? 'fade' : null"
    :offset="offset"
    :modal="false"
    initial-focus-element="none"
    :header-class="headerClass"
    :footer-class="footerClass"
    :append-to="appendTo"
    :hovercard="true"
    :timer="timer"
    data-qa="dt-hovercard"
    @opened="(e) => ($emit('opened', e))"
  >
    <template #anchor="{ attrs }">
      <slot
        name="anchor"
        v-bind="attrs"
      />
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
</template>

<script>
import { reactive } from 'vue';
import { POPOVER_APPEND_TO_VALUES, POPOVER_PADDING_CLASSES, DtPopover } from '@/components/popover/index.js';
import { TOOLTIP_DIRECTIONS } from '@/components/tooltip/index.js';
import { getUniqueString } from '@/common/utils';
import useTimer from './timer';

export default {
  name: 'DtHovercard',

  components: {
    DtPopover,
  },

  props: {
  /**
   * Fade transition when the content display is toggled.
   * @type boolean
   * @values true, false
   */
    transition: {
      type: Boolean,
      default: false,
    },

    /**
      * If the popover does not fit in the direction described by "placement",
     * it will attempt to change its direction to the "fallbackPlacements".
     * @see https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements"
     */
    fallbackPlacements: {
      type: Array,
      default: () => {
        return ['auto'];
      },
    },

    /**
   * The direction the popover displays relative to the anchor.
   * @see https://atomiks.github.io/tippyjs/v6/all-props/#placement"
   * @values top, top-start, top-end,
   * right, right-start, right-end,
   * left, left-start, left-end,
   * bottom, bottom-start, bottom-end,
   * auto, auto-start, auto-end
   */
    placement: {
      type: String,
      default: 'top-start',
      validator (placement) {
        return TOOLTIP_DIRECTIONS.includes(placement);
      },
    },

    /**
   * Padding size class for the popover content.
   * @values none, small, medium, large
   */
    padding: {
      type: String,
      default: 'large',
      validator: (padding) => {
        return Object.keys(POPOVER_PADDING_CLASSES).some((item) => item === padding);
      },
    },

    /**
     * Displaces the content box from its anchor element
     * by the specified number of pixels.
     * @see https://atomiks.github.io/tippyjs/v6/all-props/#offset"
     */
    offset: {
      type: Array,
      default: () => [0, 16],
    },

    /**
   * The id of the tooltip
   */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
   * Additional class name for the header content wrapper element.
   */
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
   * Additional class name for the footer content wrapper element.
   */
    footerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
   * Additional class name for the dialog element.
   */
    dialogClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
   * Sets the element to which the popover is going to append to.
   * 'body' will append to the nearest body (supports shadow DOM).
   * @values 'body', 'parent', HTMLElement,
   */
    appendTo: {
      type: [HTMLElement, String],
      default: 'body',
      validator: appendTo => {
        return POPOVER_APPEND_TO_VALUES.includes(appendTo) ||
            (appendTo instanceof HTMLElement);
      },
    },
  },

  emits: [
    /**
     * Emitted when popover is shown or hidden
     *
     * @event opened
     * @type {Boolean | Array}
     */
    'opened',
  ],

  data () {
    return {
      timer: reactive(useTimer()),
    };
  },
};
</script>
