<template>
  <div
    :class="leftbarContactCentersRowClasses"
    data-qa="dt-recipe-contact-centers-row"
  >
    <a
      class="dt-leftbar-row__primary"
      :data-qa="$attrs['data-qa'] ?? 'dt-leftbar-row-link'"
      :aria-label="getAriaLabel"
      :title="description"
      :href="$attrs.href ?? 'javascript:void(0)'"
      v-bind="$attrs"
      v-on="contactRowListeners"
      @click="$emit('click', $event)"
      @mouseenter="hovered = true"
      @focus="hovered = true"
      @mouseleave="hovered = false"
      @blur="hovered = false"
    >
      <div class="dt-leftbar-row__alpha">
        <dt-icon-headphones
          size="300"
          data-qa="dt-leftbar-row-icon"
        />
      </div>
      <div class="dt-leftbar-row__label">
        <dt-emoji-text-wrapper
          class="dt-leftbar-row__description"
          data-qa="dt-leftbar-row-description"
          size="200"
        >
          {{ description }}
        </dt-emoji-text-wrapper>
      </div>
      <slot name="right" />
      <div class="dt-leftbar-row__omega">
        <dt-badge
          v-if="showUnreadCount"
          data-qa="dt-leftbar-row-unread-badge"
          kind="count"
          type="bulletin"
        >
          {{ unreadCount }}
        </dt-badge>
        <dt-button
          v-else
          class="dt-leftbar-row__action"
          data-qa="dt-leftbar-row-action-button"
          :aria-label="menuButtonAriaLabel"
          importance="clear"
          size="xs"
          circle
          @click.stop="$emit('click-menu', $event)"
        >
          <template #icon>
            <dt-icon-chevron-down size="200" />
          </template>
        </dt-button>
      </div>
    </a>
  </div>
</template>

<script>
import { DtBadge } from '@/components/badge';
import { DtButton } from '@/components/button';
import DtIconHeadphones from '@dialpad/dialtone-icons/vue3/headphones';
import DtIconChevronDown from '@dialpad/dialtone-icons/vue3/chevron-down';
import DtEmojiTextWrapper from '@/components/emoji_text_wrapper/emoji_text_wrapper.vue';
import { safeConcatStrings, extractVueListeners } from '@/common/utils';

export default {
  name: 'DtRecipeGeneralRow',

  components: {
    DtEmojiTextWrapper,
    DtBadge,
    DtIconHeadphones,
    DtIconChevronDown,
    DtButton,
  },

  inheritAttrs: false,

  props: {
    /**
     * Will be read out by a screen reader upon focus of this row. If not defined "description" will be read.
     */
    ariaLabel: {
      type: String,
      default: '',
    },

    /**
     * Text displayed next to the icon. Required.
     */
    description: {
      type: String,
      required: true,
    },

    /**
     * Determines if the row is selected
     */
    selected: {
      type: Boolean,
      default: false,
    },

    /**
     * Number of unread messages
     */
    unreadCount: {
      type: Number,
      default: 0,
    },

    /**
     * Aria label for the menu button.
     */
    menuButtonAriaLabel: {
      type: String,
      required: true,
    },
  },

  emits: [
    /**
     * Native click event on the row itself
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Menu button clicked
     *
     * @event call
     * @type {PointerEvent | KeyboardEvent}
     */
    'click-menu',
  ],

  data () {
    return {
      hovered: false,
    };
  },

  computed: {
    leftbarContactCentersRowClasses () {
      return [
        'dt-leftbar-row',
        'dt-leftbar-row--contact-centers',
        {
          'dt-leftbar-row--unread-count': this.showUnreadCount,
          'dt-leftbar-row--selected': this.selected,
        },
      ];
    },

    getAriaLabel () {
      return this.ariaLabel
        ? this.ariaLabel
        : safeConcatStrings([this.description, this.unreadCountTooltip]);
    },

    contactRowListeners () {
      return extractVueListeners(this.$attrs);
    },

    showUnreadCount () {
      return this.unreadCount > 0 && !this.hovered;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../style/leftbar_row.less";
</style>
