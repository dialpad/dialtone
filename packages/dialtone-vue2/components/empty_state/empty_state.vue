<template>
  <div
    :class="emptyStateClasses"
  >
    <dt-icon
      v-if="iconName"
      :name="iconName"
      :size="iconSize"
    />

    <dt-illustration
      v-if="showIllustration && !!illustrationName"
      :name="illustrationName"
    />

    <h1 v-if="!!headerText">
      {{ headerText }}
    </h1>

    <p v-if="!!bodyText">
      {{ bodyText }}
    </p>

    <slot name="body" />
  </div>
</template>

<script>
import { EMPTY_STATE_SIZE_MODIFIERS } from './empty_state_constants.js';
import { DtIllustration, ILLUSTRATION_NAMES } from '@/components/illustration';
import { DtIcon, ICON_NAMES } from '@/components/icon';

export default {
  name: 'DtEmptyState',

  components: {
    DtIllustration,
    DtIcon,
  },

  props: {
    /**
     * The empty state size.
     * @values sm, md, lg
     */
    size: {
      type: String,
      default: 'lg',
      validator: (s) => Object.keys(EMPTY_STATE_SIZE_MODIFIERS).includes(s),
    },

    /**
     * The illustration name in kebab-case
     */
    illustrationName: {
      type: String,
      default: null,
      validator: (name) => ILLUSTRATION_NAMES.includes(name),
    },

    /**
     * The icon name in kebab-case
     */
    iconName: {
      type: String,
      default: null,
      validator: (name) => ICON_NAMES.includes(name),
    },

    /**
     * Header text
     * @type {String}
     */
    headerText: {
      type: String,
      default: null,
    },

    /**
     * Body text
     * @type {String}
     */
    bodyText: {
      type: String,
      default: null,
    },

    /**
     * Whether to show the illustration
     * @type {Boolean}
     */
    showIllustration: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    iconSize () {
      switch (this.size) {
        case 'sm':
          return '200';
        case 'md':
          return '500';
        case 'lg':
          return '800';
        default:
          return '400';
      }
    },

    sizeClass () {
      return EMPTY_STATE_SIZE_MODIFIERS[this.size];
    },

    emptyStateClasses () {
      return ['d-empty-state', this.sizeClass];
    },
  },
};
</script>

<style lang="scss">
.d-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;

  &--size-sm {
    width: 40%;
    h1{
      font-size: 1.5rem;
    }
    p{
      font-size: 1.2rem;
    }
  }

  &--size-md {
    width: 60%;
    h1{
      font-size: 2.7rem;
    }
    p{
      font-size: 1.2rem;
    }
  }

  &--size-lg {
    width: 100%;

    h1{
      font-size: 3.8rem;
    }
    p{
      font-size: 1.5rem;
    }
  }
}
</style>
