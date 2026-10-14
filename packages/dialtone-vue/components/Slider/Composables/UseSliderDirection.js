import { ref, onMounted, onBeforeUnmount } from 'vue';

// RTL/LTR direction tracking, shared by UseSliderInteraction (pointer math,
// keyboard direction-relative keys), UseSliderGeometry (centerInlineTransform),
// and UseSliderCollisionAvoidance (mirroring the analytical collision rect) —
// all three need to agree on the same reactively-cached value instead of each
// doing its own point-in-time getComputedStyle() read.
export function useSliderDirection(controlRef) {
  // Cached, reactive mirror of a live DOM read — getComputedStyle itself
  // isn't reactive, so a runtime dir change on any ancestor (dir is
  // ambient/inherited) would otherwise never re-trigger the template's
  // transform bindings between mount and the next unrelated render. Exposed
  // as isRtl, matching the sibling isRange/isVertical computed-ref shape.
  const isRtl = ref(false);

  // Re-reads the control's resolved text direction off the DOM and caches it
  // in isRtl above. Called once on mount, and again whenever dirObserver
  // below sees a relevant dir attribute change.
  function syncDirection() {
    isRtl.value = !!controlRef.value && getComputedStyle(controlRef.value).direction === 'rtl';
  }

  // dir is ambient — inherited from ANY ancestor, not just controlRef's direct
  // parent — so every actual ancestor needs its own watch, not just this
  // component's own subtree. Also watches style/class, not just dir — the
  // resolved direction can come from CSS (an inline `direction: rtl` or a
  // class) just as easily, and an attribute-only filter left isRtl stuck
  // stale once the DOM had already mirrored.
  let dirObserver = null;

  onMounted(() => {
    syncDirection();
    if (typeof MutationObserver !== 'undefined' && controlRef.value) {
      dirObserver = new MutationObserver(syncDirection);
      const options = { attributes: true, attributeFilter: ['dir', 'style', 'class'] };
      // Only nodes in controlRef's own ancestor chain can affect its
      // resolved direction via CSS cascade — watching the whole document
      // (subtree: true on documentElement) re-ran this on every class/style
      // mutation anywhere on the page, including unrelated siblings, with no
      // debounce.
      for (let node = controlRef.value; node; node = node.parentElement) {
        dirObserver.observe(node, options);
      }
      // Always also watched explicitly, even when not reached by the walk
      // above (e.g. a detached-then-teleported mount) — dir/class toggled on
      // <html> itself is the most common real-world way an app sets RTL.
      dirObserver.observe(document.documentElement, options);
    }
  });

  onBeforeUnmount(() => {
    dirObserver?.disconnect();
  });

  return { isRtl };
}
