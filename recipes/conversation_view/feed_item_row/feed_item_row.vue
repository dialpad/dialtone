<template>
  <dt-list-item
    ref="FeedItemRef"
    navigation-type="none"
    v-bind="$attrs"
    :class="listItemClasses"
    data-qa="feed-item-row"
    v-on="feedListeners"
  >
    <!-- Avatar or time -->
    <template #left>
      <dt-avatar
        v-if="showHeader"
        avatar-class="d-mt4"
        :initials="avatarInitials"
      >
        <img
          v-if="avatarImageUrl"
          data-qa="feed-item-row-avatar-img"
          alt=""
          :src="avatarImageUrl"
        >
      </dt-avatar>
      <!-- show time instead of avatar when headers not present -->
      <div
        v-if="!showHeader"
        v-show="isActive"
        class="d-fs-100 d-fw-normal d-ws-nowrap d-lh-100 d-fc-tertiary d-mb6"
        data-qa="feed-item-row-left-time"
      >
        {{ shortTime }}
      </div>
    </template>

    <article>
      <!-- Feed Item -->
      <div
        v-if="showHeader"
        data-qa="feed-item-row-header"
        class="d-d-flex d-ai-center"
      >
        <p class="d-fs-200 d-lh-300 d-fw-bold d-to-ellipsis d-of-hidden d-ws-nowrap">
          {{ displayName }}
        </p>
        <time
          class="d-fs-100 d-mt2 d-lh-300 d-fc-tertiary d-fw-normal d-ml4 d-fl-shrink0"
        >
          {{ time }}
        </time>
      </div>
      <!-- @slot Default content slot for feed item row -->
      <span
        class="content-text-wrapper-class"
        data-qa="feed-item-row-content"
      >
        <slot />
      </span>
    </article>

    <template #bottom>
      <div
        class="d-d-flex d-fw-wrap"
        data-qa="feed-item-row-reactions"
      >
        <!-- @slot Slot for reactions row component -->
        <slot name="reactions" />
      </div>
      <!-- @slot Slot for threading row component -->
      <slot name="threading" />
    </template>

    <!-- Action menu -->
    <template #right>
      <div
        v-show="isActive"
        data-qa="feed-item-row-menu"
        class="d-ps-absolute d-tn16 d-r12"
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
import { DEFAULT_FEED_ROW_STATE, FEED_ROW_STATE_BACKGROUND_COLOR } from './feed_item_row_constants.js';
import { DtAvatar } from '@/components/avatar';
import { DtLazyShow } from '@/components/lazy_show';
import { DtListItem } from '@/components/list_item';

export default {
  name: 'DtRecipeFeedItemRow',

  components: {
    DtAvatar,
    DtLazyShow,
    DtListItem,
  },

  inheritAttrs: false,

  props: {
    /**
     * Show avatar, show header text or dont show left time and vice versa
     */
    showHeader: {
      type: Boolean,
      default: false,
    },

    /**
     * Show the avatar of the user, if this is not passed in, the initials would display
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
     * displays a darkened background on the row.
     */
    isActive: {
      type: Boolean,
      default: false,
    },

    /**
     * state for the feed item row. Can be default, searched & error
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
  ],

  data () {
    return {
      faded: false,
    };
  },

  computed: {

    avatarInitials () {
      const name = (this.displayName || '').split(' ');
      const initials = name.map(word => word.charAt(0)).join('');
      return initials.slice(0, 2).toUpperCase();
    },

    feedListeners () {
      return {
        ...this.$listeners,
        mouseenter: () => this.setHover(true),
        mouseleave: () => this.setHover(false),
        focusin: () => this.setFocus(true),
        focusout: () => this.setFocus(false),
      };
    },

    listItemClasses () {
      return [
        'd-w100p',
        'd-box-border',
        'd-ps-relative',
        'd-px8',
        { 'd-bgc-secondary-opaque': this.isActive && this.state === DEFAULT_FEED_ROW_STATE },
        FEED_ROW_STATE_BACKGROUND_COLOR[this.state],
        'feed-item-row',
        'd-t',
        'd-tp-bgc',
      ];
    },
  },

  methods: {
    setFocus (bool) {
      this.$emit('focus', bool);
    },

    setHover (bool) {
      this.$emit('hover', bool);
    },

    fade () {
      // Do not fade if its a default feed row state
      if (this.state === DEFAULT_FEED_ROW_STATE || this.faded === true) {
        return;
      }

      this.$refs.FeedItemRef.$el.classList.remove(FEED_ROW_STATE_BACKGROUND_COLOR[this.state]);
      this.faded = true;
    },
  },
};
</script>

<style lang="less">
content-text-wrapper-class:not(img) {
  line-height: 1.6rem;
}

.feed-item-row {
  transition-duration: 2s !important;
}
</style>
