<!-- eslint-disable vue/no-restricted-class -->
<template>
  <dt-list-item
    ref="FeedItemRef"
    navigation-type="none"
    v-bind="$attrs"
    :class="listItemClasses"
    data-qa="dt-feed-item-row"
    v-on="feedListeners"
  >
    <!-- Avatar or time -->
    <template #left>
      <!-- @slot Slot to contain the avatar, overrides avatar props. -->
      <slot
        v-if="showHeader"
        name="avatar"
      >
        <dt-avatar
          :full-name="displayName"
          :image-src="avatarImageUrl"
          :seed="avatarSeed"
        />
      </slot>
      <!-- show time instead of avatar when headers not present -->
      <div
        v-if="!showHeader"
        v-show="isActive"
        class="dt-feed-item-row__left-time"
        data-qa="dt-feed-item-row--left-time"
      >
        {{ shortTime }}
      </div>
    </template>

    <article>
      <!-- Feed Item -->
      <div
        v-if="showHeader"
        data-qa="dt-feed-item-row--header"
        class="dt-feed-item-row__header"
      >
        <p class="dt-feed-item-row__header__name">
          {{ displayName }}
        </p>
        <time
          class="dt-feed-item-row__header__time"
        >
          {{ time }}
        </time>
      </div>
      <!-- @slot Default content slot for feed item row -->
      <span
        class="content-text-wrapper-class"
        data-qa="dt-feed-item-row--content"
      >
        <slot />
      </span>
    </article>

    <template #bottom>
      <div
        class="d-d-flex d-fw-wrap"
        data-qa="dt-feed-item-row--reactions"
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
        data-qa="dt-feed-item-row--menu"
        class="dt-feed-item-row__menu"
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
    feedListeners () {
      return {
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
        'dt-feed-item-row',
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

<style lang="less" scoped>
.dt-feed-item-row {
  transition-duration: 2s !important;

  &__header {
    display: flex;
    align-items: center;

    &__name {
      font-size: var(--dt-font-size-200);
      line-height: var(--dt-font-line-height-300);
      font-weight: var(--dt-font-weight-bold);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &__time {
      font-size: var(--dt-font-size-100);
      margin-top: var(--dt-space-200);
      line-height: var(--dt-font-line-height-300);
      color: var(--dt-color-foreground-tertiary);
      font-weight: var(--dt-font-weight-normal);
      margin-left: var(--dt-space-300);
      flex-shrink: 0;
    }
  }

  &__reactions {
    padding-top: var(--dt-space-200);
    padding-bottom: var(--dt-space-200);
    display: flex;
    flex-wrap: wrap;
  }

  &__threading {
    padding-top: var(--dt-space-200);
    padding-bottom: var(--dt-space-200);
  }

  &__left-time {
    color: var(--dt-color-foreground-tertiary);
    padding-top: var(--dt-space-350);
    line-height: var(--dt-font-line-height-400);
    font-size: var(--dt-font-size-100);
    font-weight: var(--dt-font-weight-normal);
    white-space: nowrap;
    height: 100%;
  }

  &__menu {
    position: absolute;
    top: var(--dt-space-550-negative);
    right: var(--dt-space-450);
  }

  .content-text-wrapper-class:not(img) {
    line-height: 1.6rem;
  }

  &:deep(.dt-item-layout--left) {
    .d-avatar {
      align-self: flex-start;
      margin-top: var(--dt-space-300);
    }
  }
}
</style>
