import { ref, reactive, computed, onMounted, onScopeDispose } from 'vue';

// Register an HMR custom-event handler that auto-unsubscribes when the
// current effect scope tears down. Without this, Vite's HMR re-runs the
// parent component's setup() across dev edits, stacking handlers — a single
// event then fires the latest handler PLUS every stale one from prior loads.
function onHmr (event, handler) {
  if (!import.meta.hot) return;
  import.meta.hot.on(event, handler);
  onScopeDispose(() => import.meta.hot.off(event, handler));
}

export function useModifiedSlugs () {
  const modifiedSlugs = ref(new Set());
  const dirty = computed(() => modifiedSlugs.value.size > 0);

  // HMR-on listeners only fire for events received after subscription, so
  // bootstrap from the dev-server endpoint on mount.
  onMounted(async () => {
    try {
      const res = await fetch('/__regen-status');
      if (res.ok) {
        const data = await res.json();
        modifiedSlugs.value = new Set(data.slugs || []);
      }
    } catch { /* dev-server-only feature; ignore in any other context */ }
  });

  onHmr('regen:dirty', (data) => { modifiedSlugs.value = new Set(data?.slugs || []); });
  onHmr('regen:clean', () => { modifiedSlugs.value = new Set(); });

  return { modifiedSlugs, dirty };
}

export function useRegenProgress () {
  const progress = reactive({
    open: false,
    current: 0,
    total: 0,
    complete: false,
    failed: false,
  });
  // Modal becomes user-closeable only once the regen has settled.
  const settled = computed(() => progress.complete || progress.failed);

  onHmr('regen:progress', (data) => {
    progress.current = data?.current ?? 0;
    progress.total = data?.total ?? 0;
  });
  onHmr('regen:complete', (data) => {
    progress.total = data?.total ?? 0;
    if (data?.ok === false) progress.failed = true;
    else progress.complete = true;
  });

  function openProgress () {
    progress.current = 0;
    progress.total = 0;
    progress.complete = false;
    progress.failed = false;
    progress.open = true;
  }

  return { progress, settled, openProgress };
}
