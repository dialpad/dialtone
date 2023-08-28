<template>
  <dt-item-layout class="dt-recipe-callbox">
    <template
      v-if="$slots.video"
      #default
    >
      <div class="dt-recipe-callbox--video">
        <!-- @slot Slot for video stream -->
        <slot name="video" />
      </div>
    </template>
    <template #bottom>
      <dt-item-layout :class="['dt-recipe-callbox--main-content', borderClass]">
        <template #default>
          <dt-item-layout class="dt-recipe-callbox--top-content">
            <template
              v-if="shouldShowAvatar"
              #left
            >
              <dt-avatar
                :image-src="avatarSrc"
                :full-name="avatarFullName"
                :seed="avatarSeed"
                size="sm"
              />
            </template>
            <template #default>
              <span
                class="dt-recipe-callbox--title"
                v-text="title"
              />
            </template>
            <template #subtitle>
              <dt-item-layout class="dt-recipe-callbox--subtitle">
                <template #default>
                  <div class="dt-recipe-callbox--subtitle-badge">
                    <!-- @slot Slot for call center badge -->
                    <slot name="badge">
                      <dt-badge
                        v-if="badgeText"
                        :class="badgeClass"
                        :text="badgeText"
                      />
                    </slot>
                  </div>
                </template>
                <template
                  v-if="$slots.subtitle"
                  #bottom
                >
                  <div class="dt-recipe-callbox--subtitle-content">
                    <!-- @slot Slot for subtitle -->
                    <slot name="subtitle" />
                  </div>
                </template>
              </dt-item-layout>
            </template>
            <template
              v-if="$slots.right"
              #right
            >
              <div class="dt-recipe-callbox--right">
                <!-- @slot Slot for right icons -->
                <slot name="right" />
              </div>
            </template>
          </dt-item-layout>
        </template>
        <template
          v-if="$slots.bottom"
          #bottom
        >
          <div class="dt-recipe-callbox--bottom-content">
            <slot name="bottom" />
          </div>
        </template>
      </dt-item-layout>
    </template>
  </dt-item-layout>
</template>

<script>
import { BADGE_COLORS, BORDER_COLORS } from './callbox_constants';
import DtItemLayout from '@/components/item_layout/item_layout.vue';
import DtAvatar from '@/components/avatar/avatar.vue';
import DtBadge from '@/components/badge/badge.vue';

export default {
  name: 'DtRecipeCallbox',

  components: { DtBadge, DtAvatar, DtItemLayout },

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
      validator: (color) => !!color || Object.keys(BADGE_COLORS).includes(color),
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
      validator: (color) => Object.keys(BORDER_COLORS).includes(color),
    },
  },

  computed: {
    shouldShowAvatar () {
      return this.avatarFullName || this.avatarSrc;
    },

    badgeClass () {
      return BADGE_COLORS[this.badgeColor];
    },

    borderClass () {
      return BORDER_COLORS[this.borderColor];
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

  &:deep(.dt-item-layout--left) {
    justify-content: flex-start;
    padding-right: 0;
  }

  &:deep(.dt-item-layout--content) {
    overflow: hidden;
  }

  &:deep(.dt-item-layout--bottom) {
    margin-top: 0;
  }

  &:deep(.dt-item-layout--right) {
    flex-shrink: 0;
  }

  &--video {
    border-radius: var(--dt-size-radius-200) var(--dt-size-radius-200) 0 0;
    overflow: hidden;
    height: calc(var(--dt-size-760) + var(--dt-size-650));
    margin-bottom: var(--dt-size-300-negative);

    :deep(img) {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  &--main-content {
    padding: 0;
    border-radius: var(--dt-size-radius-300);
    border: var(--dt-size-border-100) solid transparent;

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
  }

  &--bottom-content {
    border-top: 1px solid var(--dt-color-border-subtle);
  }

  &--title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: var(--dt-color-foreground-primary);
    background-color: var(--dt-color-surface-primary);
    font-weight: var(--dt-font-weight-bold);
  }

  &--subtitle {
    padding: 0;
    min-height: auto;
    font-size: var(--dt-font-size-100);

    &-badge {
      padding-top: var(--dt-space-300);
    }

    &-content :last-child {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--dt-color-foreground-tertiary);
        background-color: var(--dt-color-surface-primary);
    }
  }

  .dt-recipe-callbox-badge--warning {
    background-color: var(--dt-color-surface-warning);
  }
}
</style>
