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
        <slot name="label">
          <dt-emoji-text-wrapper
            class="dt-leftbar-row__description"
            data-qa="dt-leftbar-row-description"
          >
            {{ description }}
          </dt-emoji-text-wrapper>
        </slot>
      </div>
      <div
        class="dt-leftbar-row__omega"
      >
        <div
          v-if="dndText"
          class="dt-leftbar-row__dnd"
        >
          {{ dndText }}
        </div>
        <div
          v-else-if="activeVoiceChat"
          class="dt-leftbar-row__active-voice"
        >
          <dt-icon
            size="300"
            name="activity"
          />
        </div>
        <dt-badge
          v-else-if="!!unreadCount && hasUnreads"
          kind="count"
          type="bulletin"
          data-qa="dt-leftbar-row-unread-badge"
        >
          {{ unreadCount }}
        </dt-badge>
      </div>
    </button>
    <div
      v-if="hasCallButton"
      class="dt-leftbar-row__action"
      data-qa="dt-leftbar-row-action"
    >
      <dt-button
        class="dt-leftbar-row__action-button"
        data-qa="dt-leftbar-row-action-call-button"
        circle
        size="xs"
        kind="inverted"
        @focus="actionFocused = true"
        @blur="actionFocused = false"
        @mouseout="actionFocused = false"
        @click.stop="$emit('call', $event)"
      >
        <template #icon>
          <dt-icon
            name="phone"
            size="200"
          />
        </template>
      </dt-button>
    </div>
  </div>
</template>

<script>
import {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR,
} from './general_row_constants.js';
import { DtBadge } from '@/components/badge';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
import DtEmojiTextWrapper from '@/components/emoji_text_wrapper/emoji_text_wrapper.vue';
import DtRecipeLeftbarGeneralRowIcon from './leftbar_general_row_icon.vue';
import { extractVueListeners } from '@/common/utils';

export default {
  name: 'DtRecipeGeneralRow',

  components: {
    DtEmojiTextWrapper,
    DtBadge,
    DtIcon,
    DtButton,
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
     * Styles the row with an increased font weight to convey it has unreads. This must be true to see
     * the unread count badge.
     */
    hasUnreads: {
      type: Boolean,
      default: false,
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

    /**
     * Gives a faded style to be used when muted
     */
    muted: {
      type: Boolean,
      default: false,
    },

    /**
     * Shows styling to represent an active voice chat. This will display over unreadCount.
     */
    activeVoiceChat: {
      type: Boolean,
      default: false,
    },

    /**
     * Acronym used to represent "Do not Disturb" state. If entered will display the entered text over
     * unreadCount and activeVoiceChat.
     */
    dndText: {
      type: String,
      default: '',
    },

    /**
     * Whether the row should have a call button. Usually only applicable to individual contact rows.
     */
    hasCallButton: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Call button clicked
     *
     * @event call
     * @type {PointerEvent | KeyboardEvent}
     */
    'call',
  ],

  data () {
    return {
      actionFocused: false,
    };
  },

  computed: {
    leftbarGeneralRowClasses () {
      return [
        'dt-leftbar-row',
        {
          'dt-leftbar-row--no-action': !this.hasCallButton,
          'dt-leftbar-row--has-unread': this.hasUnreads,
          'dt-leftbar-row--selected': this.selected,
          'dt-leftbar-row--muted': this.muted,
          'dt-leftbar-row--action-focused': this.actionFocused,
        },
      ];
    },

    getIcon () {
      switch (this.type) {
        case LEFTBAR_GENERAL_ROW_TYPES.CHANNELS:
          if (this.hasUnreads) return 'channel unread';
          break;
        case LEFTBAR_GENERAL_ROW_TYPES.LOCKED_CHANNEL:
          if (this.hasUnreads) return 'locked channel unread';
          break;
      }
      return this.type;
    },

    generalRowListeners () {
      return extractVueListeners(this.$attrs);
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
        console.error(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR);
      }
    },
  },
};
</script>

<style lang="less">
@import "../style/leftbar_row.less";
</style>
