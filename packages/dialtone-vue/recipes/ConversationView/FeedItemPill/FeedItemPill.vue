<template>
  <div
    :class="['d-recipe-feed-item-pill__border', borderClass, $attrs.class]"
    :style="$attrs.style"
  >
    <div class="d-recipe-feed-item-pill__wrapper">
      <dt-collapsible :open="expanded">
        <template #anchor>
          <button
            data-qa="dt-recipe-feed-item-pill"
            :class="['d-recipe-feed-item-pill__button', toggleableClass, buttonClass]"
            :aria-label="anchorTitle"
            :title="anchorTitle"
            @focusin="hover = true"
            @focusout="hover = false"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
            @click="onClick"
          >
            <dt-item-layout
              class="d-recipe-feed-item-pill__layout"
              unstyled
            >
              <slot name="title">
                <span class="d-recipe-feed-item-pill__title">{{ title }}</span>
              </slot>
              <template #start>
                <div
                  class="d-recipe-feed-item-pill__icon"
                  data-qa="dt-recipe-feed-item-pill__icon"
                >
                  <component
                    :is="toggleIcon"
                    v-if="showChevronIcon"
                    size="300"
                  />
                  <!-- @slot Slot for start icon, icon-size slot prop defaults to '300' -->
                  <slot
                    v-else-if="$slots.startIcon"
                    name="startIcon"
                    :icon-size="'300'"
                  />
                  <!-- @slot @deprecated Use startIcon -->
                  <slot
                    v-else
                    name="leftIcon"
                    :icon-size="'300'"
                  />
                </div>
              </template>
              <template
                v-if="$slots.subtitle"
                #subtitle
              >
                <div class="d-recipe-feed-item-pill__subtitle">
                  <slot name="subtitle" />
                </div>
              </template>
              <template
                v-if="$slots.blockEnd || $slots.bottom"
                #blockEnd
              >
                <div class="d-recipe-feed-item-pill__bottom">
                  <!-- @slot Slot for block-end content -->
                  <slot
                    v-if="$slots.blockEnd"
                    name="blockEnd"
                  />
                  <!-- @slot @deprecated Use blockEnd -->
                  <slot
                    v-else
                    name="bottom"
                  />
                </div>
              </template>
              <template
                v-if="$slots.end || $slots.right"
                #end
              >
                <div class="d-recipe-feed-item-pill__right">
                  <!-- @slot Slot for end content -->
                  <slot
                    v-if="$slots.end"
                    name="end"
                  />
                  <!-- @slot @deprecated Use end -->
                  <slot
                    v-else
                    name="right"
                  />
                </div>
              </template>
            </dt-item-layout>
          </button>
        </template>
        <template
          v-if="$slots.content"
          #content
        >
          <div class="d-recipe-feed-item-pill__content">
            <slot name="content" />
          </div>
        </template>
      </dt-collapsible>
    </div>
  </div>
</template>

<script>
import { FEED_ITEM_PILL_BORDER_COLORS } from './FeedItemPillConstants';
import { DtItemLayout } from '@/components/ItemLayout';
import { DtCollapsible } from '@/components/collapsible';
import { DtIconChevronDown, DtIconChevronRight } from '@dialpad/dialtone-icons/vue';
import { DialtoneLocalization } from '@/localization';

export default {
  compatConfig: { MODE: 3 },
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
     * Additional styling for the pill
     */
    buttonClass: {
      type: [String, Array, Object],
      default: '',
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
      i18n: new DialtoneLocalization(),
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
      return this.toggleable ? 'd-recipe-feed-item-pill--toggleable' : '';
    },

    borderClass () {
      return FEED_ITEM_PILL_BORDER_COLORS[this.borderColor];
    },

    anchorTitle () {
      return this.i18n.$t('DIALTONE_FEED_ITEM_PILL_ARIA_LABEL');
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
