import {
  getOppositeMode,
  getRootContrast,
  getRootMaterial,
  findParentMode,
} from '@/components/ModeIsland/Utils';
import { CONTENT_MODE_VALUES } from '@/common/mode_constants';

const VALID_MODES = CONTENT_MODE_VALUES;

const SUGGESTIONS = {
  inverted: 'invert',
};

/**
 * v-dt-mode directive — applies a color mode (light, dark, or invert) to an element.
 *
 * Sets `data-dt-mode`, `data-dt-contrast`, and `data-dt-material` attributes so
 * descendant token-based styles resolve to the correct palette under the active contrast and material.
 *
 * @example
 * // Explicit modes
 * <section v-dt-mode:dark>Dark content</section>
 * <section v-dt-mode:light>Light content</section>
 *
 * // Invert nearest parent mode (default when no arg)
 * <section v-dt-mode>Inverted content</section>
 * <section v-dt-mode:invert>Same as above</section>
 *
 * // Dynamic arg
 * <section v-dt-mode:[reactiveMode]>Reactive mode</section>
 *
 * // Disable with false value
 * <section v-dt-mode:dark="false">No mode applied</section>
 */
export const DtModeDirective = {
  name: 'dt-mode-directive',
  install (app) {
    const instances = new WeakMap();

    app.directive('dt-mode', {
      mounted (el, binding) {
        if (binding.value === false) return;
        const mode = resolveArg(binding.arg);
        const state = applyMode(el, mode);
        instances.set(el, state);
      },

      updated (el, binding) {
        const prev = instances.get(el);
        const valueChanged = binding.value !== binding.oldValue;
        const resolvedArg = resolveArg(binding.arg);
        const argChanged = resolvedArg !== prev?.arg;
        if (!valueChanged && !argChanged) return;

        cleanup(prev);
        removeAttributes(el);
        instances.delete(el);

        if (binding.value === false) return;

        const state = applyMode(el, resolvedArg);
        instances.set(el, state);
      },

      unmounted (el) {
        cleanup(instances.get(el));
        removeAttributes(el);
        instances.delete(el);
      },
    });

    function resolveArg (arg) {
      if (!arg) return 'invert';
      if (VALID_MODES.includes(arg)) return arg;
      if (SUGGESTIONS[arg]) {
        console.warn(
          `[DtModeDirective] Invalid mode "${arg}". Did you mean "${SUGGESTIONS[arg]}"? Falling back to "${SUGGESTIONS[arg]}".`,
        );
        return SUGGESTIONS[arg];
      }
      console.warn(
        `[DtModeDirective] Invalid mode "${arg}". Valid modes: ${VALID_MODES.join(', ')}. Falling back to "invert".`,
      );
      return 'invert';
    }

    function applyMode (el, mode) {
      const state = {
        arg: mode,
        contrastObserver: null,
        materialObserver: null,
        modeObserver: null,
      };

      // Set contrast from root
      el.setAttribute('data-dt-contrast', getRootContrast());

      // Watch for contrast changes on root
      state.contrastObserver = new MutationObserver(() => {
        el.setAttribute('data-dt-contrast', getRootContrast());
      });
      state.contrastObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-dt-contrast'],
      });

      // Set material from root
      el.setAttribute('data-dt-material', getRootMaterial());

      // Watch for material changes on root
      state.materialObserver = new MutationObserver(() => {
        el.setAttribute('data-dt-material', getRootMaterial());
      });
      state.materialObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-dt-material'],
      });

      if (mode === 'light' || mode === 'dark') {
        el.setAttribute('data-dt-mode', mode);
      } else {
        // invert mode
        const parentMode = findParentMode(el);
        el.setAttribute('data-dt-mode', getOppositeMode(parentMode));

        // Watch for mode changes on root and ancestors
        const config = {
          attributes: true,
          attributeFilter: ['data-dt-mode'],
          subtree: false,
        };

        state.modeObserver = new MutationObserver(() => {
          const currentParentMode = findParentMode(el);
          el.setAttribute('data-dt-mode', getOppositeMode(currentParentMode));
        });

        // Observe root element
        state.modeObserver.observe(document.documentElement, config);

        // Observe all ancestor elements for data-dt-mode changes.
        // This includes ancestors that don't yet have the attribute,
        // because a sibling directive may set it after this one mounts
        // (Vue 3 fires child mounted before parent mounted).
        let parent = el.parentElement;
        while (parent && parent !== document.documentElement) {
          state.modeObserver.observe(parent, config);
          parent = parent.parentElement;
        }
      }

      return state;
    }

    function removeAttributes (el) {
      el.removeAttribute('data-dt-mode');
      el.removeAttribute('data-dt-contrast');
      el.removeAttribute('data-dt-material');
    }

    function cleanup (state) {
      if (!state) return;
      if (state.contrastObserver) {
        state.contrastObserver.disconnect();
        state.contrastObserver = null;
      }
      if (state.materialObserver) {
        state.materialObserver.disconnect();
        state.materialObserver = null;
      }
      if (state.modeObserver) {
        state.modeObserver.disconnect();
        state.modeObserver = null;
      }
    }
  },
};

export default DtModeDirective;
