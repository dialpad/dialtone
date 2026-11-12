import { useEffect, useEffectEvent } from 'react';
import { FOCUSTRAP_DEFAULTS, FOCUSTRAP_STATE_KEY } from './focustrap_constants';
import { getFirstFocusCandidate, getTabbableElements } from './focustrap_utils';

export interface FocusTrapOptions {
  /** Whether the trap is on. Defaults to true. */
  active?: boolean;
  /**
   * Where focus goes when the trap activates: `'auto'` (the first tabbable element, or the checked radio of a first
   * radio group), a CSS selector, an element, or `false` to leave focus where it is.
   */
  initialFocus?: 'auto' | string | HTMLElement | false | null;
  /** Whether focus returns to the previously focused element when the trap deactivates. Defaults to true. */
  restoreFocus?: boolean;
}

/** What `v-dt-focustrap` accepts as its binding value. `true`, `null` and `undefined` all mean the defaults. */
export type FocusTrapValue = FocusTrapOptions | boolean | null | undefined;

/** The trap's state on its host element, under FOCUSTRAP_STATE_KEY. */
export interface FocusTrapState {
  active: boolean;
  onKeydown: ((event: KeyboardEvent) => void) | null;
  previousActiveElement: HTMLElement | null;
  restoreFocus: boolean;
  addedTabindex: boolean;
}

export type FocusTrapHost = HTMLElement & { [FOCUSTRAP_STATE_KEY]?: FocusTrapState };

type ResolvedConfig = Required<FocusTrapOptions>;

// ── Config resolution ───────────────────────────────────────

function resolveConfig (value: FocusTrapValue): ResolvedConfig {
  if (value == null || value === true) {
    return { ...FOCUSTRAP_DEFAULTS, active: true };
  }
  if (value === false) {
    return { ...FOCUSTRAP_DEFAULTS, active: false };
  }
  return { ...FOCUSTRAP_DEFAULTS, ...value };
}

// ── State management ────────────────────────────────────────

function createState (): FocusTrapState {
  return {
    active: false,
    onKeydown: null,
    previousActiveElement: null,
    restoreFocus: true,
    addedTabindex: false,
  };
}

// ── Activate / Deactivate ───────────────────────────────────

function activate (el: FocusTrapHost, config: ResolvedConfig) {
  const state = el[FOCUSTRAP_STATE_KEY];
  if (!state || state.active) return;

  state.active = true;
  state.restoreFocus = config.restoreFocus;
  state.previousActiveElement = document.activeElement as HTMLElement | null;

  // Bind Tab keydown handler
  state.onKeydown = (event) => handleKeydown(event, el);
  el.addEventListener('keydown', state.onKeydown);

  // Set initial focus
  setInitialFocus(el, state, config);
}

function deactivate (el: FocusTrapHost) {
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

function cleanup (el: FocusTrapHost) {
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

function resolveInitialFocusTarget (el: FocusTrapHost, initialFocus: FocusTrapOptions['initialFocus']) {
  if (initialFocus === 'auto' || initialFocus == null) {
    const elements = getTabbableElements(el, { includeNegativeTabIndex: true });
    return getFirstFocusCandidate(elements);
  }
  if (typeof initialFocus === 'string') return el.querySelector<HTMLElement>(initialFocus);
  if (initialFocus instanceof HTMLElement) return initialFocus;
  return null;
}

function focusOrFallback (el: FocusTrapHost, target: HTMLElement | null | undefined) {
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

function setInitialFocus (el: FocusTrapHost, activated: FocusTrapState, config: ResolvedConfig) {
  if (config.initialFocus === false) return;

  // Delay to next microtask to avoid breaking transitions and unwanted scrolling
  Promise.resolve().then(() => {
    // The state this activation created must still be the live, active one. Vue's directive looks the state up on the
    // element; here StrictMode (or a remount) can replace it between the activation and this microtask.
    const state = el[FOCUSTRAP_STATE_KEY];
    if (state !== activated || !state.active) return;
    focusOrFallback(el, resolveInitialFocusTarget(el, config.initialFocus));
  });
}

// ── Tab trapping ────────────────────────────────────────────

function handleKeydown (event: KeyboardEvent, el: FocusTrapHost) {
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

/**
 * dialtone-vue's `v-dt-focustrap` directive as a hook: trap Tab/Shift+Tab within `el`.
 *
 * Manages initial focus, Tab boundary wrapping, and focus restoration. Does NOT handle Escape or click-outside — that's
 * the component's responsibility.
 *
 * `el` is kept in state with a callback ref, so the trap follows the element: a new element gets fresh state, as on
 * the directive's `mounted`, and losing one is the directive's `unmounted`. The trap's state lives on the element
 * under `FOCUSTRAP_STATE_KEY`, as in Vue.
 *
 * @example
 * const [el, setEl] = useState<HTMLElement | null>(null);
 * // <div ref={setEl}>
 *
 * // Always active (no binding value)
 * useFocusTrap(el);
 *
 * // Activate when truthy
 * useFocusTrap(el, isOpen);
 *
 * // Full configuration
 * useFocusTrap(el, { active: isOpen, initialFocus: '#name-input' });
 */
export function useFocusTrap (el: HTMLElement | null, options?: FocusTrapValue): void {
  const { active } = resolveConfig(options);

  // Called only from the effect below, so it reads the options of the render that activated the trap.
  const activateTrap = useEffectEvent((el: FocusTrapHost) => activate(el, resolveConfig(options)));

  // Passive effects, not layout effects: after a commit React puts focus back on the element that had it before, which
  // would undo the focus restored by a layout effect's cleanup (a trap deactivating while focus is inside it).

  // The directive's `mounted` and `unmounted`: the state exists for as long as the element does, active or not.
  useEffect(() => {
    if (!el) return undefined;
    const host: FocusTrapHost = el;

    host[FOCUSTRAP_STATE_KEY] = createState();
    return () => {
      if (host[FOCUSTRAP_STATE_KEY]?.active) {
        deactivate(host);
      }
      cleanup(host);
      delete host[FOCUSTRAP_STATE_KEY];
    };
  }, [el]);

  // Mounting with `active`, and the directive's `updated` for a change of `active`. It's declared after the effect that
  // creates the state, so it finds it on mount.
  useEffect(() => {
    if (!el || !active) return undefined;
    const host: FocusTrapHost = el;

    activateTrap(host);
    return () => deactivate(host);
  }, [el, active]);
}
