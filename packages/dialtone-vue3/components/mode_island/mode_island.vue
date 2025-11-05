<template>
  <component
    :is="as"
    class="d-mode-island"
    v-bind="$attrs"
    :data-dt-mode="computedMode"
    :data-mode-island-inverted="invertedAttribute"
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
      modeObserver: null,
      elementRef: null,
      calculatedMode: null, // Store calculated mode as reactive data
    };
  },

  computed: {
    isInverted () {
      return this.mode === DT_MODE_ISLAND_TYPES.INVERTED;
    },

    invertedAttribute () {
      return this.isInverted ? '' : null;
    },

    computedMode () {
      // If mode is explicitly light or dark, use it directly
      if (this.mode === DT_MODE_ISLAND_TYPES.LIGHT || this.mode === DT_MODE_ISLAND_TYPES.DARK) {
        return this.mode;
      }

      // If mode is inverted, use the calculated mode if available
      if (this.mode === DT_MODE_ISLAND_TYPES.INVERTED && this.calculatedMode) {
        return this.calculatedMode;
      }

      // Otherwise calculate it now
      return this.calculateInvertedMode();
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

    // Setup MutationObserver to watch for mode changes (only if inverted)
    if (this.isInverted) {
      // Initialize the calculated mode
      this.calculatedMode = this.calculateInvertedMode();
      this.setupModeObserver();
    }

    // Initial contrast value
    this.currentContrast = getRootContrast();
  },

  beforeUnmount () {
    // Cleanup observers
    if (this.contrastObserver) {
      this.contrastObserver.disconnect();
      this.contrastObserver = null;
    }
    if (this.modeObserver) {
      this.modeObserver.disconnect();
      this.modeObserver = null;
    }
  },

  methods: {
    calculateInvertedMode () {
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
    },

    setupContrastObserver () {
      this.contrastObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-dt-contrast') {
            this.currentContrast = getRootContrast();
          }
        }
      });

      this.contrastObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-dt-contrast'],
      });
    },

    setupModeObserver () {
      const config = {
        attributes: true,
        attributeFilter: ['data-dt-mode'],
        subtree: false,
      };

      this.modeObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-dt-mode') {
            // Recalculate and update the reactive data property
            this.calculatedMode = this.calculateInvertedMode();
          }
        }
      });

      // Observe root element
      this.modeObserver.observe(document.documentElement, config);

      // Also observe all parent elements with data-dt-mode
      let parent = this.elementRef?.parentElement;
      while (parent) {
        if (parent.hasAttribute('data-dt-mode')) {
          this.modeObserver.observe(parent, config);
        }
        parent = parent.parentElement;
      }
    },
  },
};
</script>
