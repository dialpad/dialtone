import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getCombinatorPresetName, getCombinatorPresetSlugs } from '../utils/componentCombinator.js';
import { getCurrentBrowserHash, suppressRouteHashScroll } from '../utils/pageToc.js';

function getNavigationOrigin (route) {
  return route?.redirectedFrom ?? route;
}

function hasSamePresetQuery (to, from) {
  const first = to.query.preset;
  const second = from.query.preset;
  if (first === second) return true;
  // Repeated query values are arrays recreated for each navigation.
  return Array.isArray(first) && Array.isArray(second)
    && first.length === second.length
    && first.every((value, index) => value === second[index]);
}

function hasSamePresetRoute (to, from) {
  return to.path === from.path && hasSamePresetQuery(to, from);
}

function getPresetNavigationFrom (to, navigation, fallback) {
  // Redirects continue the original navigation's comparison, including its pending intent.
  return getNavigationOrigin(navigation?.route) === getNavigationOrigin(to) ? navigation.presetFrom : fallback;
}

function getDeferredPreset (to, from, intent, preset) {
  if (!intent || intent.path !== to.path || !hasSamePresetRoute(to, from)) return null;
  if (hasSamePresetQuery(to, intent)) return null;
  return { preset, path: intent.path, query: intent.query };
}

/**
 * @param {import('vue').WatchSource<string>} componentName - Ref or getter for the component name.
 * @param {import('vue').Ref<Record<string, unknown>>} variants - Ref or computed ref for the current preset bank.
 */
export function usePresetQuerySync (componentName, variants) {
  const router = useRouter();
  const preset = ref('default');

  // UI edit -> pending replace, tagged with an id so older writes cannot clear newer intent.
  // External navigation -> defer UI writes until settlement; replay only on their owning page.
  // History compares with pending intent; redirects retain the original comparison.
  // Success retires the superseded write; failure releases the external-navigation gate.
  // Only preset is reactive. Plain bookkeeping preserves router-object identity without markRaw.
  let presetNavigationId = 0;
  let pendingPresetNavigation = null;
  let externalNavigation = null;
  let historyPop = null;
  let deferredPreset = null;
  const navigationStops = [];

  function onHistoryNavigation (to, from, info) {
    // Old native-anchor entries may have no direction because their positions match.
    if (info.type === 'pop') {
      historyPop = router.resolve(to).fullPath;
    }
  }

  function onPresetNavigationSettled (to, from, failure) {
    const externalOrigin = getNavigationOrigin(externalNavigation?.route);
    if (externalOrigin === getNavigationOrigin(to)) {
      const { presetFrom, pendingId } = externalNavigation;
      externalNavigation = null;
      if (!failure) applyNavigationPreset(to, presetFrom, pendingId);
      flushDeferredPreset();
    } else if (!failure && to.fullPath !== pendingPresetNavigation?.fullPath) {
      applyNavigationPreset(to, from);
    }
  }

  function applyNavigationPreset (to, from, pendingId) {
    // A successful external navigation supersedes this write, even if its guard is still held.
    if (pendingPresetNavigation?.id === pendingId) pendingPresetNavigation = null;
    if (!hasSamePresetRoute(to, from)) readPresetRoute(to);
  }

  function readPresetRoute (route) {
    preset.value = getCombinatorPresetName(variants.value, route.query.preset);
  }

  function flushDeferredPreset () {
    const deferred = deferredPreset;
    deferredPreset = null;
    if (deferred?.path === router.currentRoute.value.path) updatePreset(deferred.preset);
  }

  function updatePreset (nextPreset) {
    preset.value = nextPreset;
    const query = { ...router.currentRoute.value.query };
    if (nextPreset && nextPreset !== 'default') query.preset = getCombinatorPresetSlugs(variants.value)[nextPreset];
    else delete query.preset;

    if (externalNavigation) {
      // A preset click on the departing page must not supersede its page navigation.
      deferredPreset = { preset: nextPreset, path: router.currentRoute.value.path, query };
      return;
    }

    if (!pendingPresetNavigation && query.preset === router.currentRoute.value.query.preset) return;
    const location = { path: router.currentRoute.value.path, query, hash: getCurrentBrowserHash() };
    const id = ++presetNavigationId;
    pendingPresetNavigation = {
      id, fullPath: router.resolve(location).fullPath, path: location.path, query,
    };
    // A newer write must still navigate when it matches the current URL: it cancels an older pending replace.
    // Navigation error hooks restore state; DOM event handlers cannot handle a rejection.
    return router.replace(location).catch(() => {}).finally(() => {
      if (pendingPresetNavigation?.id === id) pendingPresetNavigation = null;
    });
  }

  watch(componentName, () => readPresetRoute(router.currentRoute.value), { immediate: true });

  onMounted(() => {
    navigationStops.push(
      router.options.history.listen(onHistoryNavigation),
      router.beforeEach(to => {
        const isPop = historyPop === to.fullPath;
        historyPop = null;
        if (!isPop && to.fullPath === pendingPresetNavigation?.fullPath) {
          suppressRouteHashScroll(to);
        } else {
          const intent = deferredPreset ?? pendingPresetNavigation;
          // History restores relative to the latest UI intent, even before its URL write commits.
          const presetFrom = getPresetNavigationFrom(
            to, externalNavigation, isPop && intent ? intent : router.currentRoute.value,
          );
          // TOC/query pushes can carry the old query. A different preset discards that deferral.
          deferredPreset = getDeferredPreset(to, presetFrom, intent, preset.value);
          externalNavigation = { route: to, presetFrom, pendingId: pendingPresetNavigation?.id };
        }
      }),
      router.afterEach(onPresetNavigationSettled),
      router.onError((error, to) => {
        // Registering an error hook replaces Vue Router's default error logging.
        console.error(error);
        if (preset.value !== '' && !externalNavigation && to.fullPath === pendingPresetNavigation?.fullPath) {
          // A failed preset selection can revert; a failed edit write must keep the user's values.
          readPresetRoute(router.currentRoute.value);
        }
        onPresetNavigationSettled(to, null, error);
      }),
    );
  });

  onBeforeUnmount(() => {
    navigationStops.forEach(stop => stop());
  });

  return { preset, updatePreset };
}
