<template>
  <dt-recipe-general-row
    :unread-count="unreadCount"
    :description="contactDescription"
    :has-unreads="hasUnreads"
    :selected="selected"
    :has-call-button="hasCallButton"
    :muted="muted"
    :is-typing="isTyping"
    v-bind="$attrs"
    data-qa="contact-row"
    v-on="$listeners"
  >
    <template #left>
      <dt-avatar
        :full-name="name"
        :image-src="avatarSrc"
        :color="avatarColor"
        image-alt=""
        size="sm"
        :seed="avatarSeed"
        :presence="avatarPresence"
      >
        <template
          v-if="noInitials"
          #icon
        >
          <dt-icon-user
            size="200"
          />
        </template>
      </dt-avatar>
    </template>
    <template #label>
      <dt-emoji-text-wrapper
        class="d-recipe-leftbar-row__description"
        data-qa="dt-recipe-leftbar-row-description"
        size="200"
      >
        {{ name }}
      </dt-emoji-text-wrapper>
      <div class="d-recipe-leftbar-row__status">
        <span
          v-if="presenceText"
          data-qa="dt-recipe-leftbar-row-presence-text"
          :class="['d-recipe-leftbar-row__meta-context', presenceFontColorClass]"
        >
          {{ presenceText }}
        </span>
        <dt-emoji-text-wrapper
          v-if="userStatus"
          size="100"
          element-type="span"
          data-qa="dt-recipe-leftbar-row-user-status"
          class="d-recipe-leftbar-row__meta-custom"
        >
          {{ userStatus }}
        </dt-emoji-text-wrapper>
      </div>
    </template>
  </dt-recipe-general-row>
</template>

<script>
import { DtRecipeGeneralRow } from '@/recipes/leftbar/general_row';
import { DtEmojiTextWrapper } from '@/components/emoji_text_wrapper';
import { DtAvatar } from '@/components/avatar';
import { safeConcatStrings } from '@/common/utils';
import { DtIconUser } from '@dialpad/dialtone-icons/vue2';

export default {
  name: 'DtRecipeContactRow',

  components: {
    DtAvatar,
    DtRecipeGeneralRow,
    DtEmojiTextWrapper,
    DtIconUser,
  },

  inheritAttrs: false,

  props: {
    /**
     * Optional avatar image url.
     * If not provided it will use the initial of the name.
     */
    avatarSrc: {
      type: String,
      default: '',
    },

    /**
     * Determines whether to show the presence indicator for
     * Avatar - accepts PRESENCE_STATES values: 'busy', 'away', 'offline',
     * or 'active'. By default, it's null and nothing is shown.
     * defer validation to avatar component.
     * @values null, busy, away, offline, active
     */
    avatarPresence: {
      type: String,
      default: null,
    },

    /**
     * Avatar seed, set this to the user's ID to get the same avatar background gradient each time it is displayed.
     */
    avatarSeed: {
      type: String,
      default: null,
    },

    /**
     * Avatar color to display if `avatarSrc` is empty.
     */
    avatarColor: {
      type: String,
      default: null,
    },

    /**
     * Text describing the user's presence, such as "in a meeting"
     */
    presenceText: {
      type: String,
      default: '',
    },

    /**
     * Name of the contact
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * Status as set by the user.
     */
    userStatus: {
      type: String,
      default: '',
    },

    /**
     * Gives a faded style to be used when muted
     */
    muted: {
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
     * Styles the row with an increased font weight to convey it has unreads. This must be true to see
     * the unread count badge.
     */
    hasUnreads: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines if the row is selected
     */
    selected: {
      type: Boolean,
      default: false,
    },

    /**
     * Initials will never be shown. Instead it will show a "User" icon.
     */
    noInitials: {
      type: Boolean,
      default: false,
    },

    /**
     * Shows an "is typing" animation over the avatar when true.
     */
    isTyping: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether the contact row should display a call button when hovered.
     */
    hasCallButton: {
      type: Boolean,
      default: true,
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

  computed: {
    presenceFontColorClass () {
      const presenceFontColors = {
        active: 'd-recipe-contact-row--active',
        busy: 'd-recipe-contact-row--busy',
        away: 'd-recipe-contact-row--away',
      };

      return presenceFontColors[this.avatarPresence];
    },

    contactDescription () {
      return safeConcatStrings([this.name, this.presenceText, this.userStatus]);
    },
  },
};
</script>
