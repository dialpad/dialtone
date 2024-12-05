<template>
  <dt-list-item
    ref="FeedItemRef"
    navigation-type="none"
    v-bind="$attrs"
    :class="['dt-recipe-feed-item-row', listItemClasses]"
    data-qa="dt-recipe-feed-item-row"
    v-on="feedListeners"
  >
    <!-- Avatar or time -->
    <template #left>
      <div
        v-if="showHeader"
        class="dt-recipe-feed-item-row__avatar-container"
      >
        <!-- @slot Slot to contain the avatar, overrides avatar props. -->
        <slot
          name="avatar"
        >
          <dt-avatar
            :full-name="displayName"
            :image-src="avatarImageUrl"
            image-alt=""
            :seed="avatarSeed"
          >
            <template
              v-if="noInitials"
              #icon="{ iconSize }"
            >
              <dt-icon-user
                :size="iconSize"
              />
            </template>
          </dt-avatar>
        </slot>
      </div>
      <!-- show time instead of avatar when headers not present -->
      <span
        v-if="!showHeader"
        v-show="isActive"
        class="dt-recipe-feed-item-row__left-time"
        data-qa="dt-recipe-feed-item-row--left-time"
      >
        {{ shortTime }}
      </span>
    </template>

    <article class="dt-recipe-feed-item-row__content">
      <!-- Feed Item -->
      <div
        v-if="showHeader"
        data-qa="dt-recipe-feed-item-row--header"
        class="dt-recipe-feed-item-row__header"
      >
        <p class="dt-recipe-feed-item-row__header-name">
          {{ displayName }}
        </p>
        <time
          class="dt-recipe-feed-item-row__header-time"
        >
          {{ time }}
        </time>
        <dt-badge
          v-if="labelText"
          :text="labelText"
        />
      </div>
      <!-- @slot Default content slot for feed item row -->
      <span
        data-qa="dt-recipe-feed-item-row--content"
      >
        <slot />
      </span>
      <div
        v-if="$slots.attachment"
        data-qa="dt-recipe-feed-item-row--attachment"
        class="dt-recipe-feed-item-row__attachment"
      >
        <slot name="attachment" />
      </div>
    </article>

    <template #bottom>
      <div
        v-if="$slots.reactions"
        class="dt-recipe-feed-item-row__reactions"
        data-qa="dt-recipe-feed-item-row--reactions"
      >
        <!-- @slot Slot for reactions row component -->
        <slot name="reactions" />
      </div>
      <div
        v-if="$slots.threading"
        class="dt-recipe-feed-item-row__threading"
      >
        <!-- @slot Slot for threading row component -->
        <slot name="threading" />
      </div>
    </template>

    <!-- Action menu -->
    <template #right>
      <div
        v-show="isActive"
        data-qa="dt-recipe-feed-item-row--menu"
        class="dt-recipe-feed-item-row__menu"
      >
        <dt-lazy-show
          :appear="true"
          transition="fade"
          :show="isActive"
        >
          <!-- @slot Slot for actions hover menu component -->
          <slot name="menu" />
        </dt-lazy-show>
      </div>
    </template>
  </dt-list-item>
</template>

<script>
/* eslint-disable max-lines */
import { DEFAULT_FEED_ROW_STATE, FEED_ROW_STATE_BACKGROUND_COLOR } from './feed_item_row_constants.js';
import { DtAvatar } from '@/components/avatar';
import { DtLazyShow } from '@/components/lazy_show';
import { DtListItem } from '@/components/list_item';
import { DtBadge } from '@/components/badge';
import Modal from '@/common/mixins/modal';
import { DtIconUser } from '@dialpad/dialtone-icons/vue3';

export default {
  name: 'DtRecipeFeedItemRow',

  components: {
    DtAvatar,
    DtLazyShow,
    DtListItem,
    DtBadge,
    DtIconUser,
  },

  mixins: [Modal],

  inheritAttrs: false,

  props: {
    /**
     * Avatar seed, set this to the user's ID to get the same avatar background gradient each time it is displayed.
     */
    avatarSeed: {
      type: String,
      default: null,
    },

    /**
     * Show avatar, show header text or dont show left time and vice versa
     */
    showHeader: {
      type: Boolean,
      default: false,
    },

    /**
     * Optional avatar image url.
     * If not provided it will use extracted initials from displayName.
     */
    avatarImageUrl: {
      type: String,
      default: '',
    },

    /**
     * The display name of the sender
     */
    displayName: {
      type: String,
      default: '',
    },

    /**
     * Initials will never be shown. Instead it will show a "User" icon.
     */
    noInitials: {
      type: Boolean,
      default: false,
    },

    /**
     * time string displayed as is.
     * Shown on the header when showHeader is true
     */
    time: {
      type: String,
      default: '',
    },

    /**
     * short time string without AM/PM displayed as is.
     * Shown on the left of feed item when showHeader is false and isActive is true
     */
    shortTime: {
      type: String,
      default: '',
    },

    /**
     * A label displayed next to the displayName. Will not show if empty.
     */
    labelText: {
      type: String,
      default: '',
    },

    /**
     * displays a darkened background on the row.
     */
    isActive: {
      type: Boolean,
      default: false,
    },

    /**
     * state for the feed item row. Can be normal, searched & error
     */
    state: {
      type: String,
      default: DEFAULT_FEED_ROW_STATE,
      validator: state => Object.keys(FEED_ROW_STATE_BACKGROUND_COLOR).includes(state),
    },
  },

  emits: [
    /**
     * Fires when hovered over feed row
     *
     * @event hover
     * @type {Boolean}
     */
    'hover',

    /**
     * Fires when focused over feed row
     *
     * @event focus
     * @type {Boolean}
     */
    'focus',

    /**
     * Key down event
     *
     * @event keydown
     * @type {KeyboardEvent}
     */
    'keydown',
  ],

  data () {
    return {
      transitionActive: false,
    };
  },

  computed: {
    feedListeners () {
      return {
        mouseenter: () => this.setHover(true),
        mouseleave: () => this.setHover(false),
        focusin: () => this.setFocus(true),
        focusout: () => this.setFocus(false),
        transitionend: () => this.transitionComplete(),
        keydown: event => {
          switch (event.code) {
            case 'Tab':
              this.trapFocus(event);
              break;
          }
          this.$emit('keydown', event);
        },
      };
    },

    listItemClasses () {
      return [
        'dt-recipe-feed-item-row',
        { 'dt-recipe-feed-item-row--active': this.isActive && this.state === DEFAULT_FEED_ROW_STATE },
        { 'dt-recipe-feed-item-row__state-transition': this.transitionActive },
        FEED_ROW_STATE_BACKGROUND_COLOR[this.state],

      ];
    },
  },

  watch: {
    state: {
      immediate: true,
      handler: function (newState, oldState) {
        if (newState !== DEFAULT_FEED_ROW_STATE) {
          this.transitionActive = true;
        }
      },
    },
  },

  methods: {
    transitionComplete () {
      if (this.state === DEFAULT_FEED_ROW_STATE) {
        this.transitionActive = false;
      }
    },

    trapFocus (e) {
      this.focusTrappedTabPress(e);
    },

    setFocus (bool) {
      this.$emit('focus', bool);
    },

    setHover (bool) {
      this.$emit('hover', bool);
    },
  },
};
</script>
