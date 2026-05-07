<template>
  <div
    :class="[leftbarGeneralRowClasses, $attrs.class]"
    :style="$attrs.style"
    data-qa="dt-recipe-leftbar-row"
  >
    <a
      class="d-recipe-leftbar-row__primary"
      :data-qa="'data-qa' in $attrs ? $attrs['data-qa'] : 'd-recipe-leftbar-row-link'"
      :aria-label="getAriaLabel"
      :title="description"
      :href="'href' in $attrs ? $attrs.href : 'javascript:void(0)'"
      v-bind="removeClassStyleAttrs($attrs)"
      v-on="generalRowListeners"
    >
      <div
        class="d-recipe-leftbar-row__alpha"
      >
        <div
          v-if="isTyping"
          v-dt-tooltip="typingTooltip"
          class="d-recipe-leftbar-row__is-typing"
        >
          <span /><span /><span />
        </div>
        <!-- @slot Slot for start content -->
        <template v-else-if="$slots.start">
          <slot name="start" />
        </template>
        <!-- @slot @deprecated Use start -->
        <template v-else-if="$slots.left">
          <slot name="left" />
        </template>
        <template v-else>
          <div
            v-if="isDialbotType"
            class="d-recipe-leftbar-general-row__icon"
            data-qa="dt-recipe-leftbar-row-icon"
          >
            <dt-icon-dialbot size="500" />
          </div>
          <div
            v-else-if="isContactCenterType"
            :class="contactCenterIconClasses"
            data-qa="dt-recipe-leftbar-row-icon"
          />
          <div
            v-else
            data-qa="dt-recipe-leftbar-row-icon"
          >
            <dt-avatar
              icon-only
              :size="avatarSize"
            >
              <template #icon="{ iconSize: slotIconSize }">
                <component
                  :is="getIconComponent"
                  :size="slotIconSize"
                />
              </template>
            </dt-avatar>
          </div>
        </template>
      </div>
      <div
        class="d-recipe-leftbar-row__label"
        :style="`flex-basis: ${labelWidth}`"
      >
        <slot name="label">
          <dt-emoji-text-wrapper
            class="d-recipe-leftbar-row__description"
            data-qa="dt-recipe-leftbar-row-description"
            size="200"
          >
            {{ description }}
          </dt-emoji-text-wrapper>
        </slot>
      </div>
    </a>
    <div
      v-if="hasActions"
      class="d-recipe-leftbar-row__omega"
    >
      <dt-tooltip
        v-if="dndText"
        placement="top"
        :message="dndTextTooltip"
      >
        <template #anchor>
          <div
            ref="d-recipe-leftbar-row-dnd"
            class="d-recipe-leftbar-row__dnd"
            data-qa="dt-recipe-leftbar-row-dnd"
          >
            {{ dndText }}
          </div>
        </template>
      </dt-tooltip>
      <div
        v-if="activeVoiceChat"
        v-dt-tooltip="activeVoiceChatTooltip"
        class="d-recipe-leftbar-row__active-voice"
      >
        <dt-icon-waveform
          size="300"
        />
      </div>
      <dt-tooltip
        v-else-if="showUnreadCount || showUnreadMentionCount"
        :message="unreadCountTooltip"
        placement="top"
      >
        <template #anchor>
          <dt-badge
            v-if="showUnreadCount"
            kind="count"
            type="bulletin"
            data-qa="dt-recipe-leftbar-row-unread-badge"
            :class="['d-recipe-leftbar-row__unread-badge', {
              'd-recipe-leftbar-row__unread-count-badge':
                shouldApplyCustomStyleForCountBadge,
            }]"
          >
            {{ unreadCount }}
          </dt-badge>
          <dt-badge
            v-if="showUnreadMentionCount"
            kind="count"
            type="bulletin"
            data-qa="dt-recipe-leftbar-row-unread-mention-badge"
            :class="['d-recipe-leftbar-row__unread-badge',
                     { 'd-recipe-leftbar-row__unread-mention-count-badge': shouldApplyCustomStyleForCountBadge },
                     { 'd-recipe-leftbar-row__unread-mention-only-count-badge': shouldApplyCustomStyleForMentionOnly },
            ]"
          >
            {{ unreadMentionCount }}
          </dt-badge>
        </template>
      </dt-tooltip>
      <div
        v-if="hasCallButton"
        class="d-recipe-leftbar-row__action"
        data-qa="dt-recipe-leftbar-row-action"
      >
        <dt-tooltip
          :message="callButtonTooltip"
          placement="top"
        >
          <template #anchor>
            <dt-button
              class="d-recipe-leftbar-row__action-button"
              data-qa="dt-recipe-leftbar-row-action-call-button"
              circle
              :size="100"
              kind="inverted"
              :aria-label="callButtonTooltip"
              @focus="actionFocused = true"
              @blur="actionFocused = false"
              @click.stop="$emit('call', $event)"
            >
              <template #icon>
                <dt-icon-phone
                  size="200"
                />
              </template>
            </dt-button>
          </template>
        </dt-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable max-lines */
import {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR,
  LEFTBAR_GENERAL_ROW_ICON_SIZES,
} from './general_row_constants';
import { DtBadge } from '@/components/Badge';
import {
  DtIconPhone,
  DtIconWaveform,
  DtIconDialbot,
  DtIconInbox,
  DtIconContacts,
  DtIconHash,
  DtIconThread,
  DtIconLayoutTemplate,
  DtIconLock,
  DtIconSparkle,
  DtIconUsers,
  DtIconExternalLink,
  DtIconLockFilled,
  DtIconHashBold,
  DtIconAtSign,
  DtIconLaptop2,
  DtIconCalendarClock,
} from '@dialpad/dialtone-icons/vue';
import { DtButton } from '@/components/Button';
import { DtTooltip } from '@/components/Tooltip';
import { DtEmojiTextWrapper } from '@/components/EmojiTextWrapper';
import { DtAvatar } from '@/components/Avatar';
import DtRecipeLeftbarGeneralRowIcon from './leftbar_general_row_icon.vue';
import { extractVueListeners, safeConcatStrings, removeClassStyleAttrs, returnFirstEl } from '@/common/utils';
import { DialtoneLocalization } from '@/localization';

const TYPE_TO_ICON = new Map([
  [LEFTBAR_GENERAL_ROW_TYPES.INBOX, DtIconInbox],
  [LEFTBAR_GENERAL_ROW_TYPES.CONTACTS, DtIconContacts],
  [LEFTBAR_GENERAL_ROW_TYPES.CHANNELS, DtIconHash],
  [LEFTBAR_GENERAL_ROW_TYPES.THREADS, DtIconThread],
  [LEFTBAR_GENERAL_ROW_TYPES.LAUNCHPAD, DtIconLayoutTemplate],
  [LEFTBAR_GENERAL_ROW_TYPES.LOCKED_CHANNEL, DtIconLock],
  [LEFTBAR_GENERAL_ROW_TYPES.QUICK_START, DtIconSparkle],
  [LEFTBAR_GENERAL_ROW_TYPES.COACHING_GROUP, DtIconUsers],
  [LEFTBAR_GENERAL_ROW_TYPES.COACHING_CENTER, DtIconExternalLink],
  ['locked channel unread', DtIconLockFilled],
  ['channel unread', DtIconHashBold],
  [LEFTBAR_GENERAL_ROW_TYPES.ASSIGNED, DtIconAtSign],
  [LEFTBAR_GENERAL_ROW_TYPES.DIGITAL, DtIconLaptop2],
  [LEFTBAR_GENERAL_ROW_TYPES.SCHEDULED, DtIconCalendarClock],
]);

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeGeneralRow',

  components: {
    DtEmojiTextWrapper,
    DtBadge,
    DtButton,
    DtTooltip,
    DtIconPhone,
    DtIconWaveform,
    DtIconDialbot,
    DtAvatar,
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
     * The channel setting, either 'mention' or 'always'.
     * @values 'mention', 'always', null.
     */
    channelSetting: {
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
     * Number of unread messages
     */
    unreadCount: {
      type: String,
      default: null,
    },

    /**
     * Number of unread mention messages
     */
    unreadMentionCount: {
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
     * Acronym used to represent "Do not Disturb" state. If entered will display the entered text alongside
     * unreadCount.
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
      labelWidth: '100%',
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    leftbarGeneralRowClasses () {
      return [
        'd-recipe-leftbar-row',
        {
          'd-recipe-leftbar-row--no-action': !this.hasCallButton,
          'd-recipe-leftbar-row--has-unread': this.hasUnreads,
          'd-recipe-leftbar-row__unread-count': this.showUnreadCount || this.showUnreadMentionCount,
          'd-recipe-leftbar-row--selected': this.selected,
          'd-recipe-leftbar-row--muted': this.muted,
          'd-recipe-leftbar-row--action-focused': this.actionFocused,
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

    getIconComponent () {
      return TYPE_TO_ICON.get(this.getIcon);
    },

    isDialbotType () {
      return this.type === LEFTBAR_GENERAL_ROW_TYPES.DIALBOT;
    },

    isContactCenterType () {
      return this.type === LEFTBAR_GENERAL_ROW_TYPES.CONTACT_CENTER;
    },

    contactCenterIconClasses () {
      return [
        'd-recipe-leftbar-row__icon-cc',
        LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS[this.color],
      ];
    },

    avatarSize () {
      // Map icon sizes to avatar sizes
      // iconSize '300' -> avatar size 300
      // iconSize '200' -> avatar size 200
      return this.iconSize;
    },

    generalRowListeners () {
      return extractVueListeners(this.$attrs);
    },

    getAriaLabel () {
      if (this.ariaLabel) return this.ariaLabel;

      return safeConcatStrings([
        this.typingTooltip,
        this.description,
        this.unreadCountTooltip,
        this.dndTextTooltip,
        this.activeVoiceChatTooltip,
      ]);
    },

    hasActions () {
      return this.dndText || this.activeVoiceChat || this.showUnreadCount || this.hasCallButton ||
        this.showUnreadMentionCount;
    },

    showUnreadCount () {
      return !!this.unreadCount && this.hasUnreads;
    },

    showUnreadMentionCount () {
      return !!this.unreadMentionCount && this.hasUnreads;
    },

    hasUnreadCount () {
      return this.unreadCount !== null;
    },

    hasUnreadMentionCount () {
      return this.unreadMentionCount !== null;
    },

    shouldApplyCustomStyleForCountBadge () {
      return this.hasUnreadCount && this.hasUnreadMentionCount;
    },

    /**
     * When a channel in 'always' setting, meaning the user should see both unread count and unread mention count,
     * if there are only mention messages, we should apply the theme design tokens var(--dt-theme-mention-color-[background||foreground]-strong).
     * @returns {boolean}
     */
    shouldApplyCustomStyleForMentionOnly () {
      return this.channelSetting === 'always' && !this.hasUnreadCount && this.hasUnreadMentionCount;
    },

    messageCount () {
      return isNaN(this.unreadCount)
        ? this.unreadCount
        : Number(this.unreadCount);
    },

    mentionCount () {
      return isNaN(this.unreadMentionCount)
        ? this.unreadMentionCount
        : Number(this.unreadMentionCount);
    },

    unreadCountTooltip () {
      return safeConcatStrings([
        this.unreadCount && this.i18n.$t('DIALTONE_UNREAD_MESSAGE_COUNT_TEXT', { unreadCount: this.messageCount }),
        this.unreadMentionCount && this.i18n.$t('DIALTONE_UNREAD_MENTION_COUNT_TEXT', { unreadCount: this.mentionCount }),
      ]);
    },

    dndTextTooltip () {
      return this.dndText && this.i18n.$t('DIALTONE_GENERAL_ROW_DND_TEXT_TOOLTIP');
    },

    activeVoiceChatTooltip () {
      return this.activeVoiceChat && this.i18n.$t('DIALTONE_GENERAL_ROW_ACTIVE_VOICE_CHAT_TEXT');
    },

    callButtonTooltip () {
      return this.i18n.$t('DIALTONE_GENERAL_ROW_CALL_BUTTON_TOOLTIP');
    },

    typingTooltip () {
      return this.isTyping && this.i18n.$t('DIALTONE_TYPING_TEXT');
    },
  },

  watch: {
    $props: {
      immediate: true,
      deep: true,
      async handler () {
        this.validateProps();
        await this.$nextTick();
        this.adjustLabelWidth();
      },
    },
  },

  mounted () {
    this.resizeObserver = new ResizeObserver(this.adjustLabelWidth);
    this.resizeObserver.observe(returnFirstEl(this.$el));
    this.adjustLabelWidth();
  },

  beforeUnmount: function () {
    this.resizeObserver.disconnect();
  },

  methods: {
    removeClassStyleAttrs,

    validateProps () {
      if (this.type === LEFTBAR_GENERAL_ROW_TYPES.CONTACT_CENTER &&
        !Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS).includes(this.color)) {
        console.error(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR);
      }
    },

    adjustLabelWidth () {
      const labelWidth = returnFirstEl(this.$el)?.querySelector('.d-recipe-leftbar-row__primary')?.clientWidth || 0;
      const omegaWidth = returnFirstEl(this.$el)?.querySelector('.d-recipe-leftbar-row__omega')?.clientWidth || 0;
      const alphaWidth = returnFirstEl(this.$el)?.querySelector('.d-recipe-leftbar-row__alpha')?.clientWidth || 0;
      const paddings = 16;
      this.labelWidth = labelWidth - (omegaWidth + alphaWidth + paddings) + 'px';
    },
  },
};
</script>
