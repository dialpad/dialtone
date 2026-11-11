import { useLayoutEffect, useRef, type RefObject } from 'react';
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

/** Sets the mode attributes on `el` and keeps them in sync. Returns the teardown: observers off, attributes removed. */
function applyMode (el: Element, mode: ContentMode): () => void {
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
    modeObserver = new MutationObserver(() => el.setAttribute('data-dt-mode', getOppositeMode(findParentMode(el))));
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
    removeAttributes(el);
  };
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
 * @example
 * const ref = useRef<HTMLElement>(null);
 * useModeRegion(ref, 'dark');
 * return <section ref={ref}>Dark content</section>;
 */
export function useModeRegion (ref: RefObject<Element | null>, mode: ContentMode | false = 'invert'): void {
  const enabled = mode !== false;
  const { mode: resolvedMode, warning } = resolveArg(mode === false ? null : mode);
  const warnedFor = useRef<string | null>(null);

  // Vue's mounted / updated / unmounted: set up when enabled, and only tear down and set up again when the value or
  // the resolved mode changes, so a re-render with the same arguments keeps the observers.
  useLayoutEffect(() => {
    if (!enabled) return undefined;
    // Once per invalid arg, so StrictMode's second setup doesn't repeat it.
    if (warning && warnedFor.current !== warning) {
      warnedFor.current = warning;
      console.warn(warning);
    }
    const el = ref.current;
    if (!el) return undefined;
    return applyMode(el, resolvedMode);
  }, [enabled, resolvedMode, warning, ref]);
}
