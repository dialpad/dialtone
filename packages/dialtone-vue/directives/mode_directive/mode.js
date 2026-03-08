import {
  getOppositeMode,
  getRootContrast,
  findParentMode,
} from '@/components/mode_island/utils';

const VALID_MODES = ['light', 'dark', 'invert'];

export const DtModeDirective = {
  name: 'dt-mode-directive',
  install (app) {
    const instances = new WeakMap();

    app.directive('dt-mode', {
      mounted (el, binding) {
        const mode = resolveArg(binding.arg);
        const state = applyMode(el, mode);
        instances.set(el, state);
      },

      updated (el, binding) {
        if (binding.arg !== binding.oldArg) {
          cleanup(instances.get(el));
          const mode = resolveArg(binding.arg);
          const state = applyMode(el, mode);
          instances.set(el, state);
        }
      },

      unmounted (el) {
        cleanup(instances.get(el));
        instances.delete(el);
      },
    });

    function resolveArg (arg) {
      if (!arg) return 'invert';
      if (VALID_MODES.includes(arg)) return arg;
      console.warn(
        `[DtModeDirective] Invalid mode "${arg}". Valid modes: ${VALID_MODES.join(', ')}. Falling back to "invert".`,
      );
      return 'invert';
    }

    function applyMode (el, mode) {
      const state = {
        contrastObserver: null,
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

    function cleanup (state) {
      if (!state) return;
      if (state.contrastObserver) {
        state.contrastObserver.disconnect();
        state.contrastObserver = null;
      }
      if (state.modeObserver) {
        state.modeObserver.disconnect();
        state.modeObserver = null;
      }
    }
  },
};

export default DtModeDirective;
