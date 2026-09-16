import { ref, onMounted } from 'vue';

/**
 * Shared branch probe for scenes: resolves to true when the harness renders
 * against Dialtone Next, false in the staging worktree. Detection reads a
 * custom property that only the Next build defines — by default the overlay
 * surface token; pass another variable when a scene depends on a more
 * specific feature (e.g. token-color-ramps probes the 12-stop scale).
 * Scenes derive branch-specific vocabulary or captions from the returned
 * ref with computed().
 */
export function useIsNext (probeVar = '--dt-color-surface-overlay') {
  const isNext = ref(false);
  onMounted(() => {
    const probe = getComputedStyle(document.documentElement).getPropertyValue(probeVar);
    isNext.value = Boolean(probe && probe.trim());
  });
  return isNext;
}
