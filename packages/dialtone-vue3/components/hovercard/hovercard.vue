<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <dt-popover
    :id="id"
    ref="popover"
    :open="hovercardOpen"
    :placement="placement"
    :content-class="contentClass"
    :dialog-class="dialogClass"
    :fallback-placements="fallbackPlacements"
    :padding="padding"
    :transition="transition ? 'fade' : null"
    :offset="offset"
    :modal="false"
    initial-focus-element="none"
    :header-class="headerClass"
    :footer-class="footerClass"
    :append-to="appendTo"
    data-qa="dt-hovercard"
    :enter-delay="enterDelay"
    :leave-delay="leaveDelay"
    @opened="(e) => ($emit('opened', e))"
    @mouseenter-popover="onMouseEnter"
    @mouseleave-popover="onMouseLeave"
    @mouseenter-popover-anchor="onMouseEnter"
    @mouseleave-popover-anchor="onMouseLeave"
  >
    <template #anchor="{ attrs }">
      <!-- @slot Anchor element that activates the hovercard. Usually a button. -->
      <slot
        name="anchor"
        v-bind="attrs"
      />
    </template>
    <template #content>
      <div
        @focusin="onContentFocusIn"
        @focusout="onContentFocusOut"
      >
        <!-- @slot Slot for the content that is displayed in the hovercard. -->
        <slot name="content" />
      </div>
    </template>
    <template #headerContent>
      <!-- @slot Slot for hovercard header content -->
      <slot name="headerContent" />
    </template>

    <template #footerContent>
      <!-- @slot Slot for the footer content. -->
      <slot name="footerContent" />
    </template>
  </dt-popover>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { POPOVER_APPEND_TO_VALUES, POPOVER_PADDING_CLASSES, DtPopover } from '@/components/popover/index.js';
import { TOOLTIP_DIRECTIONS, TOOLTIP_DELAY_MS } from '@/components/tooltip/index.js';
import { getUniqueString } from '@/common/utils';

const props = defineProps({
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
     * Controls whether the hovercard is shown. Leaving this null will have the hovercard trigger on hover by default.
     * If you set this value, the default trigger behavior will be disabled, and you can control it as you need.
     * Supports .sync modifier
     * @values null, true, false
     */
  open: {
    type: Boolean,
    default: null,
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

  /**
   * The enter delay in milliseconds before the hovercard is shown.
   * @type number
   */
  enterDelay: {
    type: Number,
    default: TOOLTIP_DELAY_MS,
  },

  /**
   * The leave delay in milliseconds before the hovercard is hidden.
   * @type number
   */
  leaveDelay: {
    type: Number,
    default: TOOLTIP_DELAY_MS,
  },
});

defineEmits([
  /**
   * Emitted when hovercard is shown or hidden
   *
   * @event opened
   * @type {Boolean | Array}
   */
  'opened',
]);

const hovercardOpen = ref(props.open);
const contentFocused = ref(false);
const mouseOverHovercard = ref(false);
const inTimer = ref(null);
const outTimer = ref(null);
const anchorEl = ref(null);
const observer = ref(null);
const popover = ref(null);

onMounted(() => {
  nextTick(() => {
    anchorEl.value = popover.value?.$refs?.anchor?.firstElementChild;

    observer.value = new MutationObserver(() => {
      if (anchorEl.value && !anchorEl.value.isConnected) {
        hovercardOpen.value = false;
      }
    });

    observer.value.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
});

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
  clearTimeout(inTimer);
  clearTimeout(outTimer);
});
watch(() => props.open, (open) => {
  hovercardOpen.value = open;
}, { immediate: true });

function setInTimer () {
  inTimer.value = setTimeout(() => {
    hovercardOpen.value = true;
  }, props.enterDelay);
}

function setOutTimer () {
  outTimer.value = setTimeout(() => {
    hovercardOpen.value = false;
  }, props.leaveDelay);
}

function onMouseEnter () {
  mouseOverHovercard.value = true;
  if (props.open === null) {
    clearTimeout(outTimer.value);
    setInTimer();
  }
}

function onMouseLeave () {
  mouseOverHovercard.value = false;
  if (contentFocused.value) {
    return;
  }
  if (props.open === null) {
    clearTimeout(inTimer.value);
    setOutTimer();
  }
}

function onContentFocusIn () {
  contentFocused.value = true;
}

function onContentFocusOut () {
  contentFocused.value = false;

  // If mouse is not over the hovercard, close it
  if (!mouseOverHovercard.value && props.open === null) {
    clearTimeout(inTimer.value);
    setOutTimer();
  }
}
</script>
