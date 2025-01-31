<template>
  <div
    data-qa="dt-recipe-callbox"
    class="d-recipe-callbox"
  >
    <div
      v-if="$slots.video"
      data-qa="dt-recipe-callbox__video-wrapper"
      class="d-recipe-callbox__video"
    >
      <!-- @slot Slot for video stream -->
      <slot name="video" />
    </div>
    <div
      data-qa="dt-recipe-callbox__main-content"
      :class="['d-recipe-callbox__main-content', borderClass, { 'd-recipe-callbox--clickable': clickable }]"
    >
      <div
        class="d-recipe-callbox__main-content-top"
      >
        <dt-avatar
          v-if="shouldShowAvatar"
          avatar-class="d-recipe-callbox__avatar"
          :image-src="avatarSrc"
          image-alt=""
          :full-name="avatarFullName"
          :seed="avatarSeed"
          :clickable="clickable"
          size="sm"
          @click="handleClick"
        >
          <template
            v-if="isOnHold"
            #overlayIcon
          >
            <dt-icon-pause />
          </template>
        </dt-avatar>
        <div class="d-recipe-callbox__content">
          <component
            :is="clickable ? 'button' : 'span'"
            data-qa="dt-recipe-callbox__title"
            class="d-recipe-callbox__content-title"
            @click="handleClick"
          >
            {{ title }}
          </component>
          <div
            v-if="$slots.badge || badgeText"
            data-qa="dt-recipe-callbox__badge-wrapper"
            class="d-recipe-callbox__content-badge"
          >
            <!-- @slot Slot for call center badge -->
            <slot name="badge">
              <dt-badge
                :class="badgeClass"
                :text="badgeText"
              />
            </slot>
          </div>
          <div
            v-if="$slots.subtitle"
            data-qa="dt-recipe-callbox__subtitle-wrapper"
            class="d-recipe-callbox__content-subtitle"
          >
            <!-- @slot Slot for subtitle -->
            <slot name="subtitle" />
          </div>
        </div>
        <div
          v-if="$slots.right"
          data-qa="dt-recipe-callbox__right-wrapper"
          class="d-recipe-callbox__right"
        >
          <!-- @slot Slot for right icons -->
          <slot name="right" />
        </div>
      </div>
      <div
        v-if="$slots.bottom"
        data-qa="dt-recipe-callbox__bottom-wrapper"
        class="d-recipe-callbox__main-content-bottom"
      >
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>

<script>
import { CALLBOX_BADGE_COLORS, CALLBOX_BORDER_COLORS } from './callbox_constants';
import DtAvatar from '@/components/avatar/avatar.vue';
import DtBadge from '@/components/badge/badge.vue';
import { DtIconPause } from '@dialpad/dialtone-icons/vue3';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeCallbox',

  components: { DtBadge, DtAvatar, DtIconPause },

  inheritAttrs: false,

  props: {
    /**
     * Text for the badge element
     */
    badgeText: {
      type: String,
      default: '',
    },

    /**
     * Color for the badge element
     * @values null, warning
     */
    badgeColor: {
      type: String,
      default: null,
      validator: (color) => color === null || Object.keys(CALLBOX_BADGE_COLORS).includes(color),
    },

    /**
     * Optional avatar image url.
     * If not provided it will use the initial of the name.
     */
    avatarSrc: {
      type: String,
      default: '',
    },

    /**
     * Avatar's full name, used to extract initials
     * to display if `avatarSrc` is empty.
     */
    avatarFullName: {
      type: String,
      default: '',
    },

    /**
     * Avatar seed, set this to the user's ID to get the same avatar background gradient each time it is displayed.
     */
    avatarSeed: {
      type: String,
      default: '',
    },

    /**
     * Callbox title
     */
    title: {
      type: String,
      default: '',
    },

    /**
     * Callbox border color
     * @values default, ai, critical
     */
    borderColor: {
      type: String,
      default: 'default',
      validator: (color) => Object.keys(CALLBOX_BORDER_COLORS).includes(color),
    },

    /**
     * Makes the callbox avatar and title clickable,
     * emits a click event when clicked.
     */
    clickable: {
      type: Boolean,
      default: false,
    },

    /**
     * Controls the avatars overlay icon
     */
    isOnHold: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Callbox click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  computed: {
    shouldShowAvatar () {
      return this.avatarFullName || this.avatarSrc;
    },

    badgeClass () {
      return CALLBOX_BADGE_COLORS[this.badgeColor];
    },

    borderClass () {
      return CALLBOX_BORDER_COLORS[this.borderColor];
    },
  },

  methods: {
    handleClick (e) {
      if (!this.clickable) return;
      this.$emit('click', e);
    },
  },
};
</script>
