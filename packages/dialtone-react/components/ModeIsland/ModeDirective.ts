import { useLayoutEffect, useRef } from 'react';
import { CONTENT_MODE_VALUES, type ContentMode } from '../../common/mode_constants';
import { findParentMode, getOppositeMode, getRootContrast, getRootMaterial } from './Utils';

const VALID_MODES: readonly string[] = CONTENT_MODE_VALUES;

const SUGGESTIONS: Readonly<Record<string, ContentMode>> = {
  inverted: 'invert',
};

const MODE_OBSERVER_CONFIG: MutationObserverInit = {
  attributes: true,
  attributeFilter: ['data-dt-mode'],
  subtree: false,
};

/** The directive's arg, resolved: a valid mode, and the warning Vue logs for an invalid one. */
function resolveArg (arg: string | null | undefined): { mode: ContentMode; warning: string | null } {
  if (!arg) return { mode: 'invert', warning: null };
  if (VALID_MODES.includes(arg)) return { mode: arg as ContentMode, warning: null };
  if (Object.hasOwn(SUGGESTIONS, arg)) {
    const suggestion = SUGGESTIONS[arg];
    return {
      mode: suggestion,
      warning: `[DtModeDirective] Invalid mode "${arg}". Did you mean "${suggestion}"? Falling back to "${suggestion}".`,
    };
  }
  return {
    mode: 'invert',
    warning: `[DtModeDirective] Invalid mode "${arg}". Valid modes: ${VALID_MODES.join(', ')}. ` +
      'Falling back to "invert".',
  };
}

function removeAttributes (el: Element) {
  el.removeAttribute('data-dt-mode');
  el.removeAttribute('data-dt-contrast');
  el.removeAttribute('data-dt-material');
}

/**
 * Sets the mode attributes on `el` and keeps them in sync. Returns the teardown: observers off.
 * `isActive` says whether this hook is the one that set the element last: only that one writes `data-dt-mode` when a
 * root or ancestor mode changes, so an earlier hook's observer can't override a later hook's explicit mode.
 */
function applyMode (el: Element, mode: ContentMode, isActive: () => boolean): () => void {
  // Set contrast from root, and watch for contrast changes on root
  el.setAttribute('data-dt-contrast', getRootContrast());
  const contrastObserver = new MutationObserver(() => el.setAttribute('data-dt-contrast', getRootContrast()));
  contrastObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-dt-contrast'] });

  // Set material from root, and watch for material changes on root
  el.setAttribute('data-dt-material', getRootMaterial());
  const materialObserver = new MutationObserver(() => el.setAttribute('data-dt-material', getRootMaterial()));
  materialObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-dt-material'] });

  let modeObserver: MutationObserver | null = null;
  if (mode === 'light' || mode === 'dark') {
    el.setAttribute('data-dt-mode', mode);
  } else {
    // invert mode
    el.setAttribute('data-dt-mode', getOppositeMode(findParentMode(el)));

    // Watch for mode changes on root and ancestors
    modeObserver = new MutationObserver(() => {
      if (isActive()) el.setAttribute('data-dt-mode', getOppositeMode(findParentMode(el)));
    });
    modeObserver.observe(document.documentElement, MODE_OBSERVER_CONFIG);

    // Observe all ancestor elements for data-dt-mode changes. This includes ancestors that don't yet have the
    // attribute, because another region may set it after this one is set up (child layout effects run before the
    // parent's, as Vue fires child mounted before parent mounted).
    for (let parent = el.parentElement; parent && parent !== document.documentElement; parent = parent.parentElement) {
      modeObserver.observe(parent, MODE_OBSERVER_CONFIG);
    }
  }

  return () => {
    contrastObserver.disconnect();
    materialObserver.disconnect();
    modeObserver?.disconnect();
  };
}

/** Sets all three attributes as `applyMode` last would, for an element that keeps another hook's state. */
function writeAttributes (el: Element, mode: ContentMode) {
  el.setAttribute('data-dt-contrast', getRootContrast());
  el.setAttribute('data-dt-material', getRootMaterial());
  el.setAttribute(
    'data-dt-mode',
    mode === 'light' || mode === 'dark' ? mode : getOppositeMode(findParentMode(el)),
  );
}

interface AppliedMode {
  el: Element;
  mode: ContentMode;
  warning: string | null;
  stop: () => void;
}

// Hooks currently applied to each element, in the order they set it up. Vue can't unmount one of several directives
// on an element, so when one hook lets go while another is still on it, the element keeps the state of the one that
// set it last, instead of losing its attributes.
const appliedByElement = new WeakMap<Element, AppliedMode[]>();

function release (applied: { current: AppliedMode | null }) {
  const current = applied.current;
  if (!current) return;
  applied.current = null;
  current.stop();
  const remaining = (appliedByElement.get(current.el) ?? []).filter(a => a !== current);
  if (remaining.length === 0) {
    appliedByElement.delete(current.el);
    removeAttributes(current.el);
    return;
  }
  appliedByElement.set(current.el, remaining);
  writeAttributes(current.el, remaining[remaining.length - 1].mode);
}

/**
 * dialtone-vue's `v-dt-mode` directive as a ref hook: applies a color mode (light, dark, or invert) to the element in
 * `ref`, with no wrapper and no surface.
 *
 * Sets `data-dt-mode`, `data-dt-contrast`, and `data-dt-material` on the element so descendant token-based styles
 * (`d-fc-primary`, `d-bgc-secondary`, etc.) resolve to the correct palette under the active contrast and material,
 * and keeps them in sync with the root and, for `invert`, the nearest ancestor mode.
 *
 * @param mode The directive's arg: `'light'`, `'dark'` or `'invert'` (the default, the opposite of the nearest
 *   ancestor's mode). `false` is the directive's `false` value: no mode applied, and any applied one removed.
 *
 * @param el The element, kept in state with a callback ref so attaching, detaching or swapping it re-renders.
 *
 * @example
 * const [el, setEl] = useState<HTMLElement | null>(null);
 * useModeRegion(el, 'dark');
 * return <section ref={setEl}>Dark content</section>;
 */
export function useModeRegion (el: Element | null, mode: ContentMode | false = 'invert'): void {
  const enabled = mode !== false;
  const { mode: resolvedMode, warning } = resolveArg(mode === false ? null : mode);
  const warnedFor = useRef<{ el: Element; warning: string } | null>(null);
  const applied = useRef<AppliedMode | null>(null);

  // Vue's mounted / updated / unmounted. Vue binds a directive to one element, so a new element is a new directive
  // instance. This sets up again only when the element, the value or the resolved mode changed: a re-render with the
  // same arguments keeps the observers.
  useLayoutEffect(() => {
    const target = enabled ? el : null;
    const current = applied.current;
    if (current && current.el === target && current.mode === resolvedMode && current.warning === warning) return;
    release(applied);
    if (!target) {
      warnedFor.current = null;
      return;
    }
    // Once per element and invalid arg, so StrictMode's second setup doesn't repeat it. A new element starts afresh,
    // as on Vue's `mounted`.
    if (warning && (warnedFor.current?.el !== target || warnedFor.current.warning !== warning)) {
      warnedFor.current = { el: target, warning };
      console.warn(warning);
    }
    const entry: AppliedMode = { el: target, mode: resolvedMode, warning, stop: () => {} };
    entry.stop = applyMode(target, resolvedMode, () => {
      const onElement = appliedByElement.get(target);
      return onElement?.[onElement.length - 1] === entry;
    });
    applied.current = entry;
    appliedByElement.set(target, [...(appliedByElement.get(target) ?? []), entry]);
  });

  // Unmount (and StrictMode's simulated one, after which the effect above sets up again).
  useLayoutEffect(() => () => release(applied), []);
}
