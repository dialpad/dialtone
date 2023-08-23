<template>
  <dt-item-layout class="dt-recipe-callbox">
    <template #default>
      <div class="dt-recipe-callbox--video">
        <!-- @slot Slot for video stream -->
        <slot name="video" />
      </div>
    </template>
    <template #bottom>
      <dt-item-layout :class="['dt-recipe-callbox--main-content', borderClass]">
        <template #default>
          <dt-item-layout class="dt-recipe-callbox--top-content">
            <template #left>
              <dt-avatar
                v-if="shouldShowAvatar"
                :image-src="avatarSrc"
                :full-name="avatarFullName"
                size="sm"
              />
            </template>
            <template #default>
              <div class="dt-recipe-callbox--title">
                {{ title }}
              </div>
            </template>
            <template #subtitle>
              <dt-item-layout class="dt-recipe-callbox--subtitle">
                <template #default>
                  <!-- @slot Slot for call center badge -->
                  <slot name="badge">
                    <dt-badge
                      v-if="badgeText"
                      :class="badgeClass"
                      :text="badgeText"
                    />
                  </slot>
                </template>
                <template #bottom>
                  <!-- @slot Slot for subtitle -->
                  <slot name="subtitle" />
                </template>
              </dt-item-layout>
            </template>
            <template #right>
              <div class="dt-recipe-callbox--right">
                <!-- @slot Slot for right icons -->
                <slot name="right" />
              </div>
            </template>
          </dt-item-layout>
        </template>
        <template #bottom>
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
  background-color: var(--dt-color-surface-primary);
  border-radius: var(--dt-size-radius-300);

  &:deep(.dt-item-layout--left) {
    justify-content: flex-start;
    padding-right: 0;
  }

  &:deep(.dt-item-layout--content) {
    overflow: hidden;
  }

  &:deep(.dt-item-layout--right) {
    flex-shrink: 0;
  }

  &--video {}

  &--main-content {
    padding: 0;
    border-radius: var(--dt-size-radius-300);
    border: var(--dt-size-border-200) solid transparent;

    &.dt-recipe-callbox--border-default {
      border: var(--dt-size-border-200) solid var(--dt-color-border-default);
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
    font-weight: var(--dt-font-weight-bold) ;
  }

  &--subtitle {
    padding: 0;
    min-height: auto;
    font-size: var(--dt-font-size-100);
    color: var(--dt-color-foreground-tertiary);
  }

  .dt-recipe-callbox-badge--warning {
    background-color: var(--dt-color-surface-warning);
  }
}
</style>
