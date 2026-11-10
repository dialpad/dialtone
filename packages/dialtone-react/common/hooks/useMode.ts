import { useEffectEvent, useLayoutEffect, useState } from 'react';
import { findParentMode, getOppositeMode, getRootContrast } from '../../components/ModeIsland/Utils';
import type { ContentMode } from '../mode_constants';

/** What a positioned component spreads on its content element: Vue's `v-bind="modeAttrs"`. */
export interface ModeAttrs {
  'data-dt-mode'?: string;
  'data-dt-contrast'?: string;
}

const MODE_OBSERVER_CONFIG: MutationObserverInit = { attributes: true, attributeFilter: ['data-dt-mode'], subtree: false };

/**
 * dialtone-vue's ModeMixin as a hook. Resolves `contentMode` (light, dark, invert) to the attributes of a positioned
 * content element. `invert` is the opposite of the nearest ancestor mode of `getModeReferenceEl()`, which should be the
 * anchor (the content itself is moved elsewhere, e.g. into a tippy popper). Root contrast and ancestor mode changes are
 * followed through MutationObservers, as the mixin does. Pass `referenceEl` when the reference element can be swapped for
 * another (an external anchor): the mode is then resolved again and the observers move to the new element's ancestors.
 */
export function useMode (
  contentMode: ContentMode | null | undefined,
  getModeReferenceEl: () => Element | null | undefined,
  referenceEl?: Element | null,
): ModeAttrs {
  const [modeContrast, setModeContrast] = useState('default');
  const [modeResolved, setModeResolved] = useState<string | null>(null);

  // The observers outlive the render that set them up, so they call the getter as an Effect Event: the latest one.
  const getReferenceEl = useEffectEvent(getModeReferenceEl);

  // The mixin's setupModeObservers / cleanupModeObservers, on mount and whenever contentMode changes. A layout effect,
  // like Vue's mounted hook: the mode is resolved from the DOM before the browser paints.
  useLayoutEffect(() => {
    if (!contentMode) return undefined;

    setModeContrast(getRootContrast());
    const contrastObserver = new MutationObserver(() => setModeContrast(getRootContrast()));
    contrastObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-dt-contrast'] });

    let modeObserver: MutationObserver | null = null;
    if (contentMode === 'invert') {
      const referenceEl = getReferenceEl();
      setModeResolved(getOppositeMode(findParentMode(referenceEl)));
      modeObserver = new MutationObserver(() => setModeResolved(getOppositeMode(findParentMode(getReferenceEl()))));
      modeObserver.observe(document.documentElement, MODE_OBSERVER_CONFIG);
      // Every ancestor, since any of them can set the mode the reference element inherits.
      for (let el = referenceEl?.parentElement; el && el !== document.documentElement; el = el.parentElement) {
        modeObserver.observe(el, MODE_OBSERVER_CONFIG);
      }
    }

    return () => {
      contrastObserver.disconnect();
      modeObserver?.disconnect();
      setModeResolved(null);
    };
  }, [contentMode, referenceEl]);

  if (!contentMode) return {};
  const resolvedMode = contentMode === 'invert' ? modeResolved : contentMode;
  if (!resolvedMode) return {};
  return {
    'data-dt-mode': resolvedMode,
    'data-dt-contrast': modeContrast,
  };
}
