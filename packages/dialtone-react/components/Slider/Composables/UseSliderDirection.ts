import { useEffect, useEffectEvent, useState } from 'react';

// RTL/LTR direction tracking, shared by UseSliderInteraction (pointer math,
// keyboard direction-relative keys), UseSliderGeometry (centerInlineTransform),
// and UseSliderCollisionAvoidance (mirroring the analytical collision rect) —
// all three need to agree on the same cached value instead of each doing its
// own point-in-time getComputedStyle() read.
export function useSliderDirection (controlEl: HTMLElement | null): { isRtl: boolean } {
  // Cached mirror of a live DOM read — getComputedStyle itself doesn't notify,
  // so a runtime dir change on any ancestor (dir is ambient/inherited) would
  // otherwise never re-render the transform bindings.
  const [isRtl, setIsRtl] = useState(false);

  const syncDirection = useEffectEvent(() => {
    setIsRtl(!!controlEl && getComputedStyle(controlEl).direction === 'rtl');
  });

  useEffect(() => {
    syncDirection();
    if (typeof MutationObserver === 'undefined' || !controlEl) return undefined;
    const dirObserver = new MutationObserver(() => syncDirection());
    const options = { attributes: true, attributeFilter: ['dir', 'style', 'class'] };
    // Only nodes in the control's own ancestor chain can affect its resolved
    // direction via CSS cascade — watching the whole document would re-run
    // this on every class/style mutation anywhere on the page.
    for (let node: HTMLElement | null = controlEl; node; node = node.parentElement) {
      dirObserver.observe(node, options);
    }
    // Always also watched explicitly, even when not reached by the walk above
    // — dir/class toggled on <html> itself is the most common real-world way
    // an app sets RTL.
    dirObserver.observe(document.documentElement, options);
    return () => dirObserver.disconnect();
  }, [controlEl]);

  return { isRtl };
}
