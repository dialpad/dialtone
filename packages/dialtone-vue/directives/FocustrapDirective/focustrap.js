import { getTabbableElements, getFirstFocusCandidate } from './FocustrapUtils.js';
import { FOCUSTRAP_DEFAULTS, FOCUSTRAP_STATE_KEY } from './FocustrapConstants.js';

/**
 * v-dt-focustrap directive — trap Tab/Shift+Tab within a container element.
 *
 * Manages initial focus, Tab boundary wrapping, and focus restoration.
 * Does NOT handle Escape or click-outside — that's the component's responsibility.
 *
 * @example
 * // Boolean binding — activate when truthy
 * <div role="dialog" v-dt-focustrap="isOpen" aria-label="Settings">
 *
 * // Object binding — full configuration
 * <div role="dialog" v-dt-focustrap="{ active: isOpen, initialFocus: '#name-input' }">
 *
 * // Always active (no binding value)
 * <div role="alertdialog" v-dt-focustrap aria-label="Confirm">
 *
 * @see https://dialtone.dialpad.com/vue/next/?path=/docs/directives-focustrap--docs
 */
export const DtFocustrapDirective = {
  name: 'dt-focustrap-directive',

  install (app) {
    app.directive('dt-focustrap', {
      mounted (el, binding) {
        const config = resolveConfig(binding.value);
        el[FOCUSTRAP_STATE_KEY] = createState();

        if (config.active) {
          activate(el, config);
        }
      },

      updated (el, binding) {
        const prev = resolveConfig(binding.oldValue);
        const next = resolveConfig(binding.value);
        const state = el[FOCUSTRAP_STATE_KEY];

        if (!state) return;

        if (!prev.active && next.active) {
          activate(el, next);
        } else if (prev.active && !next.active) {
          deactivate(el);
        }
      },

      unmounted (el) {
        const state = el[FOCUSTRAP_STATE_KEY];
        if (state?.active) {
          deactivate(el);
        }
        cleanup(el);
        delete el[FOCUSTRAP_STATE_KEY];
      },
    });
  },
};

// ── Config resolution ───────────────────────────────────────

function resolveConfig (value) {
  if (value == null || value === true) {
    return { ...FOCUSTRAP_DEFAULTS, active: true };
  }
  if (value === false) {
    return { ...FOCUSTRAP_DEFAULTS, active: false };
  }
  if (typeof value === 'object') {
    return { ...FOCUSTRAP_DEFAULTS, ...value };
  }
  return { ...FOCUSTRAP_DEFAULTS, active: Boolean(value) };
}

// ── State management ────────────────────────────────────────

function createState () {
  return {
    active: false,
    onKeydown: null,
    previousActiveElement: null,
    restoreFocus: true,
    addedTabindex: false,
  };
}

// ── Activate / Deactivate ───────────────────────────────────

function activate (el, config) {
  const state = el[FOCUSTRAP_STATE_KEY];
  if (!state || state.active) return;

  state.active = true;
  state.restoreFocus = config.restoreFocus;
  state.previousActiveElement = document.activeElement;

  // Bind Tab keydown handler
  state.onKeydown = (event) => handleKeydown(event, el);
  el.addEventListener('keydown', state.onKeydown);

  // Set initial focus
  setInitialFocus(el, config);
}

function deactivate (el) {
  const state = el[FOCUSTRAP_STATE_KEY];
  if (!state || !state.active) return;

  state.active = false;
  cleanup(el);

  // Restore focus using the config captured at activation time
  if (state.restoreFocus && state.previousActiveElement) {
    try {
      state.previousActiveElement.focus({ preventScroll: true });
    } catch {
      // Element no longer in DOM or not focusable
    }
  }
  state.previousActiveElement = null;
}

function cleanup (el) {
  const state = el[FOCUSTRAP_STATE_KEY];
  if (!state) return;
  if (state.onKeydown) {
    el.removeEventListener('keydown', state.onKeydown);
    state.onKeydown = null;
  }
  if (state.addedTabindex) {
    el.removeAttribute('tabindex');
    state.addedTabindex = false;
  }
}

// ── Initial focus ───────────────────────────────────────────

function resolveInitialFocusTarget (el, initialFocus) {
  if (initialFocus === 'auto' || initialFocus == null) {
    const elements = getTabbableElements(el, { includeNegativeTabIndex: true });
    return getFirstFocusCandidate(elements);
  }
  if (typeof initialFocus === 'string') return el.querySelector(initialFocus);
  if (initialFocus instanceof HTMLElement) return initialFocus;
  return null;
}

function focusOrFallback (el, target) {
  if (target) {
    target.focus({ preventScroll: true });
    return;
  }
  if (!el.hasAttribute('tabindex')) {
    el.setAttribute('tabindex', '-1');
    const state = el[FOCUSTRAP_STATE_KEY];
    if (state) state.addedTabindex = true;
  }
  el.focus({ preventScroll: true });
}

function setInitialFocus (el, config) {
  if (config.initialFocus === false) return;

  // Delay to next microtask to avoid breaking transitions and unwanted scrolling
  Promise.resolve().then(() => {
    const state = el[FOCUSTRAP_STATE_KEY];
    if (!state?.active) return;
    focusOrFallback(el, resolveInitialFocusTarget(el, config.initialFocus));
  });
}

// ── Tab trapping ────────────────────────────────────────────

function handleKeydown (event, el) {
  if (event.key !== 'Tab') return;

  const elements = getTabbableElements(el);

  if (!elements.length) {
    event.preventDefault();
    return;
  }

  // Tab boundaries use DOM order (elements[0] / elements[last]),
  // NOT getFirstFocusCandidate() — the radio-preference logic is for
  // initial focus only, not for Tab wrapping.
  const first = elements[0];
  const last = elements[elements.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      last.focus({ preventScroll: true });
      event.preventDefault();
    }
  } else {
    if (document.activeElement === last) {
      first.focus({ preventScroll: true });
      event.preventDefault();
    }
  }
}

export default DtFocustrapDirective;
