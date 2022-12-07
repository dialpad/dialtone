<template>
  <component
    :is="elementType"
    ref="collapsible"
    v-on="$listeners"
  >
    <!-- Element for capturing keypress events -->
    <div
      :id="!ariaLabelledBy && labelledBy"
      ref="anchor"
      :class="[
        'd-dt-collapsibe__anchor',
        anchorClass,
      ]"
    >
      <!-- @slot Slot for the anchor element that toggles the collapsible content -->
      <slot
        name="anchor"
        :attrs="{
          'aria-controls': id,
          'aria-expanded': isOpen.toString(),
          'role': 'button',
        }"
      >
        <dt-button
          importance="clear"
          kind="muted"
          :aria-controls="id"
          :aria-expanded="`${isOpen}`"
          :aria-label="ariaLabel"
          :style="{
            'width': maxWidth,
          }"
          @click="defaultToggleOpen"
        >
          <dt-icon
            :name=" isOpen ? 'chevron-down' : 'chevron-right'"
            class="d-icon d-icon--size-300 d-mr8 d-fl-shrink0"
          />
          <span
            class="d-mr-auto d-truncate"
            :title="anchorText"
          >
            {{ anchorText }}
          </span>
        </dt-button>
      </slot>
    </div>
    <dt-collapsible-lazy-show
      :id="id"
      ref="contentWrapper"
      :aria-hidden="`${!isOpen && !hasContentOnCollapse}`"
      :aria-labelledby="labelledBy"
      :is-expanded="isOpen"
      :element-type="contentElementType"
      :class="[
        'd-dt-collapsible__content',
        contentClass,
      ]"
      :style="{
        'max-height': maxHeight,
        'max-width': maxWidth,
      }"
      tabindex="-1"
      appear
      v-on="$listeners"
    >
      <template #contentOnExpanded>
        <!-- @slot Slot for content that is shown when collapsible is expanded -->
        <slot
          name="contentOnExpanded"
        />
      </template>
      <template #contentOnCollapsed>
        <!-- @slot Slot for content that is shown when collapsible is collapsed -->
        <slot
          name="contentOnCollapsed"
        />
      </template>
    </dt-collapsible-lazy-show>
  </component>
</template>

<script>
import { getUniqueString } from '@/common/utils';
import DtCollapsibleLazyShow from './collapsible_lazy_show';
import { DtButton } from '@/components/button';
import { DtLazyShow } from '@/components/lazy_show';
import { DtIcon } from '@/components/icon';

/**
 * A collapsible is a component consisting of an interactive anchor that toggled the expandable/collapsible element.
 * @see https://dialpad.design/components/collapsible.html
 */
export default {
  name: 'DtCollapsible',

  components: {
    DtButton,
    DtCollapsibleLazyShow,
    DtLazyShow,
    DtIcon,
  },

  props: {
    /**
     * Text that is displayed on the anchor if nothing is passed in the slot.
     * Ignored if the anchor slot is used.
     */
    anchorText: {
      type: String,
      default: null,
    },

    /**
     * Controls whether the collapsible is shown. Leaving this null will have the collapsible start
     * expanded and trigger on click by default. If you set this value, the default trigger
     * behavior will be disabled, and you can control it as you need.
     * Supports .sync modifier
     * @values null, true, false
     */
    open: {
      type: Boolean,
      default: null,
    },

    /**
     * The id of the content wrapper.
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     * HTML element type (tag name) of the root element of the component.
     */
    elementType: {
      type: String,
      default: 'div',
    },

    /**
     * HTML element type (tag name) of the content wrapper element.
     */
    contentElementType: {
      type: String,
      default: 'div',
    },

    /**
     * Additional class name for the anchor wrapper element.
     */
    anchorClass: {
      type: [String, Array, Object],
      default: null,
    },

    /**
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: null,
    },

    /**
     * The maximum width of the anchor and collapsible element.
     * Possible units rem|px|%|em
     */
    maxWidth: {
      type: String,
      default: null,
    },

    /**
     * The maximum height of the collapsible element.
     * Possible units rem|px|%|em
     */
    maxHeight: {
      type: String,
      default: null,
    },

    /**
     * Label on the anchor. Should provide this or ariaLabelledBy but not both.
     */
    ariaLabel: {
      type: String,
      default: null,
    },

    /**
     * Id of the element that labels the collapsible content. Defaults to the anchor element.
     * Should provide this or ariaLabel but not both.
     */
    ariaLabelledBy: {
      type: String,
      default: null,
    },
  },

  emits: [
    /**
     * Event fired to sync the open prop with the parent component
     * @event update:open
     */
    'update:open',

    /**
     * Event fired when the content is shown or hidden
     *
     * @event opened
     * @type {Boolean}
     */
    'opened',
  ],

  data () {
    return {
      isOpen: true,
    };
  },

  computed: {
    labelledBy () {
      // aria-labelledby should be set only if aria-labelledby is passed as a prop, or if
      // there is no aria-label and the labelledby should point to the anchor
      return this.ariaLabelledBy || (!this.ariaLabel && getUniqueString('DtCollapsible__anchor'));
    },

    hasContentOnCollapse () {
      return !!this.$slots.contentOnCollapsed;
    },
  },

  watch: {
    open: {
      handler: function (open) {
        if (open !== null) {
          this.isOpen = open;
        }
      },

      immediate: true,
    },
  },

  created () {
    this.validateProperAnchor();
  },

  methods: {

    defaultToggleOpen () {
      this.$emit('opened', !this.isOpen);
      if (this.open === null) {
        this.isOpen = !this.isOpen;
      } else {
        this.$emit('update:open', !this.isOpen);
      }
    },

    validateProperAnchor () {
      if (!this.anchorText && !this.$scopedSlots.anchor) {
        console.error('anchor text and anchor slot content cannot both be falsy');
      }
    },
  },
};
</script>
