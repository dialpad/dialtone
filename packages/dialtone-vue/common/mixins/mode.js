import { CONTENT_MODE_PROP } from '@/common/ModeConstants';
import {
  getOppositeMode,
  getRootContrast,
  findParentMode,
} from '@/components/ModeIsland/utils';

/**
 * Mixin that adds a `contentMode` prop and computes `modeAttrs` for binding
 * `data-dt-mode` / `data-dt-contrast` to a positioned content element.
 *
 * Components that use this mixin should bind `v-bind="modeAttrs"` on their
 * internal content element (e.g. the dialog or teleported container).
 *
 * For `invert` mode, the mixin resolves the opposite of the nearest ancestor's
 * mode and watches for changes via MutationObserver. Override
 * `getModeReferenceEl()` to return the anchor element so `invert` resolves
 * from the correct DOM context (not the teleported content's position).
 *
 * @displayName Mode Mixin
 */
export default {
  props: {
    /**
     * Applies a color mode to the positioned content element.
     * `light` and `dark` are explicit overrides. `invert` computes the
     * opposite of the nearest ancestor's mode and stays reactive.
     * @values light, dark, invert
     */
    contentMode: CONTENT_MODE_PROP,
  },

  data () {
    return {
      modeContrast: 'default',
      modeResolved: null,
    };
  },

  computed: {
    modeAttrs () {
      if (!this.contentMode) return {};
      const resolvedMode = this.contentMode === 'invert'
        ? this.modeResolved
        : this.contentMode;
      if (!resolvedMode) return {};
      return {
        'data-dt-mode': resolvedMode,
        'data-dt-contrast': this.modeContrast,
      };
    },
  },

  watch: {
    contentMode () {
      this.cleanupModeObservers();
      this.setupModeObservers();
    },
  },

  mounted () {
    this.setupModeObservers();
  },

  beforeUnmount () {
    this.cleanupModeObservers();
  },

  methods: {
    /**
     * Override in components to return the element from which `invert` mode
     * should resolve the parent mode. For positioned components, this should
     * be the anchor element (in the original DOM context), not the teleported
     * content element.
     * @returns {HTMLElement|null}
     */
    getModeReferenceEl () {
      return this.$el;
    },

    setupModeObservers () {
      if (!this.contentMode) return;
      if (typeof document === 'undefined') return;

      // Watch for contrast changes on root
      this.modeContrast = getRootContrast();
      this.modeContrastObserver = new MutationObserver(() => {
        this.modeContrast = getRootContrast();
      });
      this.modeContrastObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-dt-contrast'],
      });

      if (this.contentMode === 'invert') {
        const refEl = this.getModeReferenceEl();
        this.modeResolved = getOppositeMode(findParentMode(refEl));

        const config = {
          attributes: true,
          attributeFilter: ['data-dt-mode'],
          subtree: false,
        };

        this.modeModeObserver = new MutationObserver(() => {
          const el = this.getModeReferenceEl();
          this.modeResolved = getOppositeMode(findParentMode(el));
        });

        // Observe root element
        this.modeModeObserver.observe(document.documentElement, config);

        // Observe all ancestor elements for mode changes
        let parent = refEl?.parentElement;
        while (parent && parent !== document.documentElement) {
          this.modeModeObserver.observe(parent, config);
          parent = parent.parentElement;
        }
      }
    },

    cleanupModeObservers () {
      if (this.modeContrastObserver) {
        this.modeContrastObserver.disconnect();
        this.modeContrastObserver = null;
      }
      if (this.modeModeObserver) {
        this.modeModeObserver.disconnect();
        this.modeModeObserver = null;
      }
      this.modeResolved = null;
    },
  },
};
