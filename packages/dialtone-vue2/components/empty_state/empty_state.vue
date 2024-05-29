<template>
  <div :class="emptyStateClasses">
    <template v-if="showIllustration">
      <dt-icon
        v-if="showIcon"
        :name="iconName"
        size="800"
      />

      <dt-illustration
        v-if="showIllustrationComponent"
        :name="illustrationName"
      />
    </template>

    <div :class="`d-stack d-stack--gap-450 ${emptyStateContentSpacing}`">
      <h1>
        {{ headerText }}
      </h1>

      <p v-if="bodyText">
        {{ bodyText }}
      </p>
    </div>

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
     * @values 'sm', 'md', 'lg'
     */
    size: {
      type: String,
      default: 'lg',
      validator: (s) => Object.keys(EMPTY_STATE_SIZE_MODIFIERS).includes(s),
    },

    /**
     * The illustration name in kebab-case
     * This only displays when size is 'lg' or 'md'
     * This has priority over icon.
     * @type {String}
     */
    illustrationName: {
      type: String,
      default: null,
      validator: (name) => ILLUSTRATION_NAMES.includes(name),
    },

    /**
     * The icon name in kebab-case
     * This will be shown in 'lg' and 'md' size only if illustrationName prop is not provided and
     * Will always be shown in 'sm' size.
     * @type {String}
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
      required: true,
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
    /**
     * Illustration will always be shown in lg and md size
     * Illustration will not be shown in sm size
     */
    showIllustrationComponent () {
      return this.illustrationName && this.notSmSize;
    },

    /**
     * Icon will be shown in lg and md size only if illustration is not provided
     * Icon will always be shown in sm size
     */
    showIcon () {
      if (!this.iconName) {
        return false;
      }

      return !(this.illustrationName && this.notSmSize);
    },

    notSmSize () {
      return this.size !== 'sm';
    },

    sizeClass () {
      return EMPTY_STATE_SIZE_MODIFIERS[this.size];
    },

    emptyStateClasses () {
      return ['d-empty-state', this.sizeClass];
    },

    emptyStateContentSpacing () {
      switch (this.size) {
        case 'sm':
          return 'd-p16';
        case 'md':
          return 'd-p32';
        case 'lg':
          return 'd-p32';
        default:
          return 'd-p32';
      }
    },
  },

  mounted () {
    if (!this.bodyText && !this.$slots.body) {
      console.warn('Dialtone Empty State component: You should provide either bodyText or content on body slot.');
    }
  },
};
</script>
