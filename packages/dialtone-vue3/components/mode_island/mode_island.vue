<template>
  <component
    :is="as"
    v-bind="$attrs"
    :data-dt-mode="computedMode"
    :data-dt-contrast="currentContrast"
  >
    <!-- @slot Slot for main content -->
    <slot />
  </component>
</template>

<script>
import { DT_MODE_ISLAND_TYPES } from './mode_island_constants';
import { modeValidator } from './validators';
import {
  getOppositeMode,
  getRootMode,
  getRootContrast,
  findParentMode,
} from './utils';

export default {
  name: 'DtModeIsland',
  compatConfig: { MODE: 3 },

  provide () {
    return {
      dtModeIslandMode: () => this.computedMode,
    };
  },

  inject: {
    parentModeIslandMode: {
      from: 'dtModeIslandMode',
      default: null,
    },
  },

  inheritAttrs: false,

  props: {
    /**
     * Set this prop to render the mode island as a specific HTML element.
     * @type {String}
     * @values div, section, nav, article, aside, header, footer, main
     */
    as: {
      type: String,
      default: 'div',
    },

    /**
     * The mode to apply to the island.
     * - 'inverted': Opposite of parent or root mode
     * - 'light': Always light mode
     * - 'dark': Always dark mode
     * @type {String}
     * @values inverted, light, dark
     */
    mode: {
      type: String,
      default: DT_MODE_ISLAND_TYPES.INVERTED,
      validator: modeValidator,
    },
  },

  data () {
    return {
      currentContrast: getRootContrast(),
      contrastObserver: null,
      elementRef: null,
    };
  },

  computed: {
    computedMode () {
      // If mode is explicitly light or dark, use it directly
      if (this.mode === DT_MODE_ISLAND_TYPES.LIGHT || this.mode === DT_MODE_ISLAND_TYPES.DARK) {
        return this.mode;
      }

      // If mode is inverted, calculate based on parent
      if (this.mode === DT_MODE_ISLAND_TYPES.INVERTED) {
        // First check if there's a parent mode island
        if (this.parentModeIslandMode) {
          const parentMode = typeof this.parentModeIslandMode === 'function'
            ? this.parentModeIslandMode()
            : this.parentModeIslandMode;
          return getOppositeMode(parentMode);
        }

        // Otherwise, find the nearest parent with data-dt-mode
        if (this.elementRef) {
          const parentMode = findParentMode(this.elementRef);
          return getOppositeMode(parentMode);
        }

        // Default fallback
        return getOppositeMode(getRootMode());
      }

      return this.mode;
    },
  },

  beforeCreate () {
    // Throw error if data-dt-brand is manually set
    if (this.$attrs && this.$attrs['data-dt-brand']) {
      throw new Error('[DtModeIsland] The data-dt-brand attribute is not allowed on mode islands. Brand should only be set at the root level.');
    }
  },

  mounted () {
    // Store element reference
    this.elementRef = this.$el;

    // Setup MutationObserver to watch for contrast changes on root
    this.setupContrastObserver();

    // Initial contrast value
    this.currentContrast = getRootContrast();
  },

  beforeUnmount () {
    // Cleanup observer
    if (this.contrastObserver) {
      this.contrastObserver.disconnect();
      this.contrastObserver = null;
    }
  },

  methods: {
    setupContrastObserver () {
      const config = {
        attributes: true,
        attributeFilter: ['data-dt-contrast'],
      };

      const callback = (mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-dt-contrast') {
            this.currentContrast = getRootContrast();
          }
        }
      };

      this.contrastObserver = new MutationObserver(callback);
      this.contrastObserver.observe(document.documentElement, config);
    },
  },
};
</script>