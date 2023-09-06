<template>
  <div :class="['dt-feed-item-pill--border', borderClass, wrapperClass]">
    <div class="d-p8 d-bgc-secondary">
      <dt-collapsible :open="expanded">
        <template #anchor>
          <button
            :aria-label="ariaLabel"
            data-qa="dt-feed-item-pill"
            :class="['d-baw0 d-bgc-moderate d-bar-pill d-w100p d-ta-left d-btn--circle', toggleableClass, buttonClass]"
            @focusin="hover = true"
            @focusout="hover = false"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
            @click="onClick"
          >
            <dt-item-layout class="d-w100p d-p8">
              {{ title }}
              <template #left>
                <dt-icon
                  size="300"
                  class="dt-feed-item-pill--icon d-pr8"
                  data-qa="dt-feed-item-pill-icon"
                  :name="computedIcon"
                />
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
          <div class="d-jc-center d-d-flex">
            <slot name="content" />
          </div>
        </template>
      </dt-collapsible>
    </div>
  </div>
</template>

<script>
import { FEED_ITEM_PILL_BORDER_COLORS } from './feed_item_pill_constants';
import { DtIcon, DtItemLayout, DtCollapsible } from '@/index';

export default {
  name: 'DtRecipeFeedItemPill',

  components: { DtItemLayout, DtIcon, DtCollapsible },

  props: {
    /**
     * Accepts a DtIcon name to be shown in the left
     */
    iconName: {
      type: String,
      default: () => '',
    },

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
      expanded: false,
    };
  },

  computed: {
    computedIcon () {
      if (this.toggleable && this.hover) {
        return this.expanded ? 'chevron-down' : 'chevron-right';
      } else {
        return this.iconName;
      }
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

<style lang="less" scoped>
  // Gradient radius solution taken from https://stackoverflow.com/a/53037637
  .dt-feed-item-pill--border {
    border: double 1px transparent;
    border-radius: 4.8rem; // Special value determined by designer here where it works in both expanded and collapsed
    background-origin: border-box;
    background-clip: content-box, border-box;
    overflow: hidden;
  }

  .dt-feed-item-pill--border-default {
    background: var(--dt-color-border-default)
  }

  .dt-feed-item-pill--border-ai {
    background-image:
      linear-gradient(var(--dt-color-surface-primary), var(--dt-color-surface-primary)),
      var(--dt-badge-color-background-ai);
  }

  .dt-feed-item-pill--border-critical {
    background: var(--dt-color-foreground-critical);
  }

  .dt-feed-item-pill--icon {
    animation: fade 0.15s ease-in;
  }

  @keyframes fade {
    0%   {transform: scale(0);}
    100% {transform: scale(1);}
  }
</style>
