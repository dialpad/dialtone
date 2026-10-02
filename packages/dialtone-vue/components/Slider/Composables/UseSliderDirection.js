import { ref, onMounted, onBeforeUnmount } from 'vue';

// RTL/LTR direction tracking, shared by UseSliderInteraction (pointer math,
// keyboard direction-relative keys), UseSliderGeometry (centerInlineTransform),
// and UseSliderCollisionAvoidance (mirroring the analytical collision rect) —
// all three need to agree on the same reactively-cached value instead of each
// doing its own point-in-time getComputedStyle() read.
export function useSliderDirection(controlRef) {
  // Cached, reactive mirror of isRtl()'s live DOM read — getComputedStyle
  // itself isn't reactive, so a runtime dir change on any ancestor (dir is
  // ambient/inherited) would otherwise never re-trigger the template's
  // transform bindings between mount and the next unrelated render.
  const rtl = ref(false);

  // Re-reads the control's resolved text direction off the DOM and caches it
  // in `rtl` above. Called once on mount, and again whenever dirObserver
  // below sees a relevant dir attribute change.
  function syncDirection() {
    rtl.value = !!controlRef.value && getComputedStyle(controlRef.value).direction === 'rtl';
  }

  function isRtl() {
    return rtl.value;
  }

  // dir is ambient — inherited from ANY ancestor, not just controlRef's direct
  // parent — so this has to watch the whole document, not just this
  // component's own subtree, to catch every change that could actually affect
  // the resolved direction here.
  let dirObserver = null;

  onMounted(() => {
    syncDirection();
    if (typeof MutationObserver !== 'undefined') {
      dirObserver = new MutationObserver(syncDirection);
      dirObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir'], subtree: true });
    }
  });

  onBeforeUnmount(() => {
    dirObserver?.disconnect();
  });

  return { isRtl };
}
