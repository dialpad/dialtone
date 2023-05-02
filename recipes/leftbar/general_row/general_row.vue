<template>
  <div
    :class="leftbarGeneralRowClasses"
    data-qa="dt-leftbar-row"
  >
    <a
      class="dt-leftbar-row__primary"
      :data-qa="'data-qa' in $attrs ? $attrs['data-qa'] : 'dt-leftbar-row-link'"
      :aria-label="getAriaLabel"
      :title="description"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div
        class="dt-leftbar-row__alpha"
      >
        <div
          v-if="isTyping"
          class="dt-leftbar-row__is-typing"
        >
          <span /><span /><span />
        </div>
        <slot
          v-else
          name="left"
        >
          <dt-recipe-leftbar-general-row-icon
            :type="getIcon"
            :color="color"
            :icon-size="iconSize"
            data-qa="dt-leftbar-row-icon"
          />
        </slot>
      </div>
      <div class="dt-leftbar-row__label">
        <slot name="label">
          <dt-emoji-text-wrapper
            class="dt-leftbar-row__description"
            data-qa="dt-leftbar-row-description"
            size="200"
          >
            {{ description }}
          </dt-emoji-text-wrapper>
        </slot>
      </div>
      <div
        class="dt-leftbar-row__omega"
      >
        <dt-tooltip
          v-if="dndText"
          placement="top"
          :message="dndTextTooltip"
        >
          <template #anchor>
            <div
              class="dt-leftbar-row__dnd"
            >
              {{ dndText }}
            </div>
          </template>
        </dt-tooltip>
        <div
          v-if="activeVoiceChat"
          class="dt-leftbar-row__active-voice"
        >
          <dt-icon
            size="300"
            name="activity"
          />
        </div>
        <dt-tooltip
          v-else-if="!!unreadCount && hasUnreads"
          :message="unreadCountTooltip"
          placement="top"
        >
          <template #anchor>
            <dt-badge
              kind="count"
              type="bulletin"
              data-qa="dt-leftbar-row-unread-badge"
            >
              {{ unreadCount }}
            </dt-badge>
          </template>
        </dt-tooltip>
      </div>
    </a>
    <div
      v-if="hasCallButton"
      class="dt-leftbar-row__action"
      data-qa="dt-leftbar-row-action"
    >
      <dt-tooltip
        :message="callButtonTooltip"
        placement="top"
      >
        <template #anchor>
          <dt-button
            class="dt-leftbar-row__action-button"
            data-qa="dt-leftbar-row-action-call-button"
            circle
            size="xs"
            kind="inverted"
            :aria-label="callButtonTooltip"
            @focus="actionFocused = true"
            @blur="actionFocused = false"
            @mouseleave="actionFocused = false"
            @click.stop="$emit('call', $event)"
          >
            <template #icon>
              <dt-icon
                name="phone"
                size="200"
              />
            </template>
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
  </div>
</template>

<script>
import {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR,
  LEFTBAR_GENERAL_ROW_ICON_SIZES,
} from './general_row_constants.js';
import { DtBadge } from '@/components/badge';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
import { DtTooltip } from '@/components/tooltip';
import DtEmojiTextWrapper from '@/components/emoji_text_wrapper/emoji_text_wrapper.vue';
import DtRecipeLeftbarGeneralRowIcon from './leftbar_general_row_icon.vue';

export default {
  name: 'DtRecipeGeneralRow',

  components: {
    DtEmojiTextWrapper,
    DtBadge,
    DtIcon,
    DtButton,
    DtTooltip,
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
     * Will be read out by a screen reader upon focus of this row. If not defined "description" will be read.
     */
    ariaLabel: {
      type: String,
      default: '',
    },

    /**
     * Text displayed next to the icon. Required. Even if you are overriding this field using the label slot
     * you still must input this as it will be displayed as the "title" attribute for the row.
     */
    description: {
      type: String,
      required: true,
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
     * Text shown when the unread count is hovered.
     */
    unreadCountTooltip: {
      type: String,
      default: '',
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
     * Acronym used to represent "Do not Disturb" state. If entered will display the entered text alongside
     * unreadCount.
     */
    dndText: {
      type: String,
      default: '',
    },

    /**
     * Text shown in tooltip when you hover the dndText
     */
    dndTextTooltip: {
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

    /**
     * Text shown when the call button is hovered.
     */
    callButtonTooltip: {
      type: String,
      default: '',
    },

    /**
     * Shows an "is typing" animation over the avatar when true.
     */
    isTyping: {
      type: Boolean,
      default: false,
    },

    /**
     * Sets the size of the icon.
     */
    iconSize: {
      type: String,
      default: '300',
      validator: (size) => {
        return LEFTBAR_GENERAL_ROW_ICON_SIZES.includes(size);
      },
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

    getAriaLabel () {
      return this.ariaLabel ? this.ariaLabel : `${this.description} ${this.unreadCountTooltip} ${this.dndTextTooltip}`;
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
