<template>
  <div
    :class="leftbarGeneralRowClasses"
    data-qa="dt-leftbar-row"
  >
    <button
      class="dt-leftbar-row__primary"
      data-qa="dt-leftbar-row-link"
      v-bind="$attrs"
    >
      <div
        class="dt-leftbar-row__alpha"
      >
        <slot name="left">
          <dt-recipe-leftbar-general-row-icon
            :type="getIcon"
            :color="color"
            data-qa="dt-leftbar-row-icon"
          />
        </slot>
      </div>
      <div class="dt-leftbar-row__label">
        <dt-emoji-text-wrapper
          class="dt-leftbar-row__description"
          data-qa="dt-leftbar-row-description"
        >
          {{ description }}
        </dt-emoji-text-wrapper>
      </div>
      <div class="dt-leftbar-row__omega">
        <dt-badge
          v-if="hasUnreadMessages"
          kind="count"
          type="bulletin"
          data-qa="dt-leftbar-row-unread-badge"
        >
          {{ unreadCount }}
        </dt-badge>
      </div>
    </button>
  </div>
</template>

<script>
import { LEFTBAR_GENERAL_ROW_TYPES, LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS } from './general_row_constants.js';
import { DtBadge } from '@/components/badge';
import DtEmojiTextWrapper from '@/components/emoji_text_wrapper/emoji_text_wrapper.vue';
import DtRecipeLeftbarGeneralRowIcon from './leftbar_general_row_icon.vue';

export default {
  name: 'DtRecipeGeneralRow',

  components: {
    DtEmojiTextWrapper,
    DtBadge,
    DtRecipeLeftbarGeneralRowIcon,
  },

  inheritAttrs: false,

  props: {
    /**
     * Determines the icon to show.
     * If type is contact center, the color prop must be provided and will determine the color of the icon
     */
    type: {
      type: String,
      default: 'inbox',
      validator: (type) => {
        return Object.values(LEFTBAR_GENERAL_ROW_TYPES).includes(type);
      },
    },

    /**
     * Text displayed next to the icon
     */
    description: {
      type: String,
      default: '',
    },

    /**
     * Determines the color of the contact center icon
     */
    color: {
      type: String,
      default: null,
      validator: (color) => {
        return Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS).includes(color);
      },
    },

    /**
     * Number of unread messages
     */
    unreadCount: {
      type: String,
      default: null,
    },

    /**
     * Determines if the row is selected
     */
    selected: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    leftbarGeneralRowClasses () {
      return [
        'dt-leftbar-row',
        'dt-leftbar-row--no-action',
        {
          'dt-leftbar-row--has-unread': this.hasUnreadMessages,
          'dt-leftbar-row--selected': this.selected,
        },
      ];
    },

    getIcon () {
      switch (this.type) {
        case LEFTBAR_GENERAL_ROW_TYPES.CHANNELS:
          if (this.hasUnreadMessages) return 'channel unread';
          break;
        case LEFTBAR_GENERAL_ROW_TYPES.LOCKED_CHANNEL:
          if (this.hasUnreadMessages) return 'locked channel unread';
          break;
      }
      return this.type;
    },

    hasUnreadMessages () {
      return isNaN(Number(this.unreadCount)) ? !!this.unreadCount : Number(this.unreadCount) > 0;
    },
  },

  watch: {
    $props: {
      immediate: true,
      deep: true,
      handler () {
        this.validateProps();
      },
    },
  },

  methods: {
    validateProps () {
      if (this.type === LEFTBAR_GENERAL_ROW_TYPES.CONTACT_CENTER &&
          !Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS).includes(this.color)) {
        console.error('If type is contact center, color must be one of the following: ' +
          Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS).join(', '));
      }
    },
  },
};
</script>

<style lang="less">
@import "../style/leftbar_row.less";
</style>
