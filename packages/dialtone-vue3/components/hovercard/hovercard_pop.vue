<template>
  {{ isOpen }}
  <dt-popover
    :id="id"
    :open="isOpen"
    :placement="placement"
    :content-class="contentClass"
    :fallback-placements="fallbackPlacements"
    :padding="padding"
    :transition="transition"
    :offset="offset"
    :modal="false"
    initial-focus-element="none"
    :header-class="headerClass"
    :footer-class="footerClass"
    :append-to="appendTo"
    @mouseenter="onEnter"
    @update:open="(value) => { isOpen = value; }"
  >
    <template #anchor>
      <slot name="anchor" />
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

<script setup>
import { POPOVER_APPEND_TO_VALUES, POPOVER_PADDING_CLASSES, DtPopover } from '@/components/popover/index.js';
import { getUniqueString } from '@/common/utils';
import { ref } from 'vue';

defineProps({
  /**
     * Named transition when the content display is toggled.
     * @see DtLazyShow
     */
  transition: {
    type: String,
    default: 'fade',
  },

  /**
     * If the popover does not fit in the direction described by "placement",
     * it will attempt to change its direction to the "fallbackPlacements".
     * <a
     *   class="d-link"
     *   href="https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements"
     *   target="_blank"
     * >
     *   Popper.js docs
     * </a>
     * */
  fallbackPlacements: {
    type: Array,
    default: () => {
      return ['auto'];
    },
  },

  /**
     * The direction the popover displays relative to the anchor.
     * <a
     *   class="d-link"
     *   href="https://atomiks.github.io/tippyjs/v6/all-props/#placement"
     *   target="_blank"
     * >
     *   Tippy.js docs
     * </a>
     * @values top, top-start, top-end,
     * right, right-start, right-end,
     * left, left-start, left-end,
     * bottom, bottom-start, bottom-end,
     * auto, auto-start, auto-end
     */
  placement: {
    type: String,
    default: 'bottom-end',
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
     *  Displaces the content box from its anchor element
     *  by the specified number of pixels.
     *  <a
     *    class="d-link"
     *    href="https://atomiks.github.io/tippyjs/v6/all-props/#offset"
     *    target="_blank"
     *  >
     *    Tippy.js docs
     *  </a>
     */
  offset: {
    type: Array,
    default: () => [0, 4],
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
});

const emits = defineEmits([
  /**
     * Emitted when popover is shown or hidden
     *
     * @event opened
     * @type {Boolean}
     */
  'opened',
]);

const isOpen = ref(false);

function onEnter () {
  isOpen.value = true;
  emits('opened', true);
}

function onLeave () {
  isOpen.value = false;
  emits('opened', false);
}
</script>
