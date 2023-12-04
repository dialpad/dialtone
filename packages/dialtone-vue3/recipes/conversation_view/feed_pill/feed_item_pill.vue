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
                <dt-icon
                  data-qa="dt-recipe-feed-item-pill__icon"
                  size="300"
                  class="dt-recipe-feed-item-pill__icon"
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
import { DtIcon } from '@/components/icon';
import { DtItemLayout } from '@/components/item_layout';
import { DtCollapsible } from '@/components/collapsible';

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
.dt-recipe-feed-item-pill {
  &__wrapper {
    background-color: var(--dt-color-surface-secondary);
    padding: var(--dt-space-400);
  }

  &__button {
    background-color: var(--dt-color-surface-moderate);
    text-align: left;
    width: 100%;
    cursor: pointer;
    border-width: 0;
    border-radius: var(--dt-size-radius-600);
    --button-padding-x: var(--button-padding-y-md);
    --button-padding-y: var(--button-padding-y-md);
    --button-color-text: var(--dt-action-color-foreground-muted-default);
    --button-border-radius: var(--dt-size-radius-600);
  }

  &__layout {
    padding: var(--dt-space-400);
    width: 100%;
  }

  &__icon {
    animation: fade 0.15s ease-in;
    margin-right: var(--dt-space-400);
  }

  &__content {
    display: flex;
    justify-content: center;
  }

  &__title {
    font-weight: var(--dt-font-weight-bold);
  }

  // Gradient radius solution taken from https://stackoverflow.com/a/53037637
  &__border {
    border: double 1px transparent;
    border-radius: var(--dt-size-radius-600);
    background-origin: border-box;
    background-clip: content-box, border-box;
    overflow: hidden;
  }

  &__border-default {
    background: var(--dt-color-border-default)
  }

  &__border-ai {
    background-image:
      linear-gradient(var(--dt-color-surface-primary), var(--dt-color-surface-primary)),
      var(--dt-badge-color-background-ai);
  }

  &__border-critical {
    background: var(--dt-color-foreground-critical);
  }

  @keyframes fade {
    0%   {transform: scale(0);}
    100% {transform: scale(1);}
  }
}
</style>
