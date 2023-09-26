<template>
  <div
    data-qa="dt-recipe-callbox"
    class="dt-recipe-callbox"
  >
    <div
      v-if="$slots.video"
      data-qa="dt-recipe-callbox--video-wrapper"
      class="dt-recipe-callbox--video"
    >
      <!-- @slot Slot for video stream -->
      <slot name="video" />
    </div>
    <div
      data-qa="dt-recipe-callbox--main-content"
      :class="['dt-recipe-callbox--main-content', borderClass, { 'dt-recipe-callbox--clickable': clickable }]"
    >
      <div
        class="dt-recipe-callbox--main-content-top"
      >
        <dt-avatar
          v-if="shouldShowAvatar"
          avatar-class="dt-recipe-callbox--avatar"
          :image-src="avatarSrc"
          :full-name="avatarFullName"
          :seed="avatarSeed"
          :clickable="clickable"
          size="sm"
          @click.stop="handleClick"
        />
        <div class="dt-recipe-callbox--content">
          <component
            :is="clickable ? 'button' : 'span'"
            data-qa="dt-recipe-callbox--title"
            class="dt-recipe-callbox--content-title"
            @click.stop="handleClick"
          >
            {{ title }}
          </component>
          <div
            v-if="$slots.badge || badgeText"
            data-qa="dt-recipe-callbox--badge-wrapper"
            class="dt-recipe-callbox--content-badge"
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
            data-qa="dt-recipe-callbox--subtitle-wrapper"
            class="dt-recipe-callbox--content-subtitle"
          >
            <!-- @slot Slot for subtitle -->
            <slot name="subtitle" />
          </div>
        </div>
        <div
          v-if="$slots.right"
          data-qa="dt-recipe-callbox--right-wrapper"
          class="dt-recipe-callbox--right"
        >
          <!-- @slot Slot for right icons -->
          <slot name="right" />
        </div>
      </div>
      <div
        v-if="$slots.bottom"
        data-qa="dt-recipe-callbox--bottom-wrapper"
        class="dt-recipe-callbox--main-content-bottom"
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

export default {
  name: 'DtRecipeCallbox',

  components: { DtBadge, DtAvatar },

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
     * Avatar's full name, used as alt attribute for image and
     * to extract initials to display in avatar if `avatarSrc` is empty.
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
  },

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

<style lang="less" scoped>
.dt-recipe-callbox {
  padding: 0;
  color: var(--dt-color-foreground-primary);
  background-color: var(--dt-color-surface-primary);
  border-radius: var(--dt-size-radius-300);

  &--video {
    display: flex;
    border-radius: var(--dt-size-radius-200) var(--dt-size-radius-200) 0 0;
    overflow: clip;
    margin-bottom: var(--dt-space-300-negative);
  }

  &--main-content {
    padding: 0;
    border-radius: var(--dt-size-radius-300);
    border: var(--dt-size-border-100) solid transparent;
    align-items: stretch;

    &.dt-recipe-callbox--border-default {
      border-color: var(--dt-color-border-default);
    }

    &.dt-recipe-callbox--border-ai {
      background:
        linear-gradient(var(--dt-color-surface-primary), var(--dt-color-surface-primary)) padding-box,
        linear-gradient(135deg, var(--dt-color-border-accent), var(--dt-color-border-brand)) border-box;
    }

    &.dt-recipe-callbox--border-critical {
      background:
        radial-gradient(var(--dt-color-surface-primary), var(--dt-color-surface-primary)) padding-box,
        radial-gradient(circle, #E7301D, #F78B23) border-box;
    }

    &-top {
      display: flex;
      align-items: center;
      padding: var(--dt-space-350) var(--dt-space-400);
    }

    &-bottom {
      border-top: 1px solid var(--dt-color-border-subtle);
    }
  }

  &--avatar {
    margin-right: var(--dt-space-400);
  }

  &--content {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    min-width: 0;

    &-title {
      overflow: clip;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--dt-color-foreground-primary);
      background-color: var(--dt-color-surface-primary);
      font-weight: var(--dt-font-weight-bold);
      border: none;
      padding: 0;
      width: 0;
      min-width: 100%;
      text-align: left;
      user-select: text;
      line-height: normal;
    }

    &-badge {
      line-height: normal;
    }

    &-subtitle {
      padding: 0;
      font-size: var(--dt-font-size-100);
      color: var(--dt-color-foreground-tertiary);
      line-height: normal;
      overflow: hidden;
      width: 0;
      min-width: 100%;
    }
  }

  &--right {
    display: flex;
    justify-content: right;
  }

  &--clickable {
    .dt-recipe-callbox--content-title {
      cursor: pointer;
      user-select: none;
      border-radius: var(--dt-size-100);

      &:focus-visible {
        outline: none;
        box-shadow: var(--dt-shadow-focus);
      }

      &:hover {
        background-color: var(--dt-action-color-background-muted-hover)
      }

      &:active {
        background-color: var(--dt-action-color-background-muted-active)
      }
    }
  }

  .dt-recipe-callbox-badge--warning {
    background-color: var(--dt-color-surface-warning);
  }
}
</style>
