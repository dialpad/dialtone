<template>
  <div :class="['dt-recipe-feed-item-pill__border', borderClass, wrapperClass]">
    <div class="dt-recipe-feed-item-pill__wrapper">
      <dt-collapsible :open="expanded">
        <template #anchor>
          <button
            data-qa="dt-recipe-feed-item-pill"
            :aria-label="ariaLabel"
            :class="['dt-recipe-feed-item-pill__button', toggleableClass, buttonClass]"
            @focusin="hover = true"
            @focusout="hover = false"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
            @click="onClick"
          >
            <dt-item-layout class="dt-recipe-feed-item-pill__layout">
              <slot name="title">
                <span class="dt-recipe-feed-item-pill__title">{{ title }}</span>
              </slot>
              <template #left>
                <div
                  class="dt-recipe-feed-item-pill__icon"
                  data-qa="dt-recipe-feed-item-pill__icon"
                >
                  <component
                    :is="toggleIcon"
                    v-if="showChevronIcon"
                    size="300"
                  />
                  <!-- @slot Slot for left icon, icon-size slot prop defaults to '300' -->
                  <slot
                    v-else
                    name="leftIcon"
                    :icon-size="'300'"
                  />
                </div>
              </template>
              <template #subtitle>
                <slot name="subtitle" />
              </template>
              <template #bottom>
                <slot name="bottom" />
              </template>
              <template #right>
                <slot name="right" />
              </template>
            </dt-item-layout>
          </button>
        </template>
        <template #content>
          <div class="dt-recipe-feed-item-pill__content">
            <slot name="content" />
          </div>
        </template>
      </dt-collapsible>
    </div>
  </div>
</template>

<script>
import { FEED_ITEM_PILL_BORDER_COLORS } from './feed_item_pill_constants';
import { DtItemLayout } from '@/components/item_layout';
import { DtCollapsible } from '@/components/collapsible';
import { DtIconChevronDown, DtIconChevronRight } from '@dialpad/dialtone-icons/vue3';

export default {
  name: 'DtRecipeFeedItemPill',

  components: { DtItemLayout, DtCollapsible },

  props: {
    /**
     * Bolded primary text
     */
    title: {
      type: String,
      default: () => '',
    },

    /**
     * Additional styling around the pill
     */
    wrapperClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional styling for the pill
     */
    buttonClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Aria label for feed pill
     */
    ariaLabel: {
      type: String,
      required: true,
    },

    /**
     * Sets whether the pill can be toggled (Icon changing on hover, expanding and collapsing, pointer)
     */
    toggleable: {
      type: Boolean,
      default: () => true,
    },

    defaultToggled: {
      type: Boolean,
      default: () => false,
    },

    /**
     * Callbox border color
     * @values default, ai, critical
     */
    borderColor: {
      type: String,
      default: 'default',
      validator: (color) => Object.keys(FEED_ITEM_PILL_BORDER_COLORS).includes(color),
    },
  },

  data () {
    return {
      hover: false,
      expanded: this.defaultToggled,
    };
  },

  computed: {
    toggleIcon () {
      return this.expanded ? DtIconChevronDown : DtIconChevronRight;
    },

    showChevronIcon () {
      return this.toggleable && this.hover;
    },

    toggleableClass () {
      return this.toggleable ? 'd-c-pointer' : '';
    },

    borderClass () {
      return FEED_ITEM_PILL_BORDER_COLORS[this.borderColor];
    },
  },

  methods: {
    onClick () {
      if (!this.toggleable) return;

      this.expanded = !this.expanded;
    },
  },
};
</script>
