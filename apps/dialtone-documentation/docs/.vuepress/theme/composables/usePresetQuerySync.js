import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getCombinatorInitialPresetName, getCombinatorPresetName, getCombinatorPresetSlugs } from '../utils/componentCombinator.js';
import { getCurrentBrowserHash, suppressRouteHashScroll } from '../utils/pageToc.js';

function getNavigationOrigin (route) {
  return route?.redirectedFrom ?? route;
}

function hasSamePresetQuery (to, from) {
  const first = to.query.preset;
  const second = from.query.preset;
  // Repeated query values are arrays recreated for each navigation.
  return first === second || Array.isArray(first) && Array.isArray(second)
    && first.length === second.length && first.every((value, index) => value === second[index]);
}

function hasSamePresetRoute (to, from) {
  return to.path === from.path && hasSamePresetQuery(to, from);
}

function getPresetNavigationFrom (to, navigation, pendingFrom, route) {
  return getNavigationOrigin(navigation?.route) === getNavigationOrigin(to)
    ? navigation.presetFrom : pendingFrom ?? route;
}

function shouldQueueIntent (to, from, intent) {
  return Boolean(intent && intent.path === to.path && hasSamePresetRoute(to, from) && !hasSamePresetQuery(to, intent));
}

/**
 * @param {import('vue').WatchSource<string>} componentName - Ref or getter for the component name.
 * @param {import('vue').Ref<Record<string, unknown>>} variants - Ref or computed ref for the current preset bank.
 */
export function usePresetQuerySync (componentName, variants) {
  const router = useRouter();
  // Settled named selection comes from the URL. Only an unsaved edit or UI intent overrides it.
  const localIntent = shallowRef(null);
  const preset = computed(() => localIntent.value?.preset
    ?? getCombinatorPresetName(variants.value, router.currentRoute.value.query.preset));
  // Write identity retires only its own pending work; navigation owns any queued intent until it settles.
  let pendingWrite = null;
  let externalNavigation = null;
  let historyPop = null;
  const navigationStops = [];

  function applyNavigationPreset (to, from, write) {
    if (pendingWrite === write) pendingWrite = null;
    if (!hasSamePresetRoute(to, from)) localIntent.value = null;
  }

  function replayQueuedIntent (intent) {
    if (!intent?.queued) return;
    intent.queued = false;
    if (intent.path === router.currentRoute.value.path) updatePreset(intent.preset);
  }

  function onNavigationSettled (to, from, failure) {
    if (getNavigationOrigin(externalNavigation?.route) === getNavigationOrigin(to)) {
      const navigation = externalNavigation;
      // Keep a click made during navigation even if applying its destination clears the old page's draft.
      const intent = localIntent.value;
      externalNavigation = null;
      if (!failure) applyNavigationPreset(to, navigation.presetFrom, navigation.write);
      replayQueuedIntent(intent);
    } else if (!failure && to.fullPath !== pendingWrite?.fullPath) {
      applyNavigationPreset(to, from);
    }
  }

  function updatePreset (nextPreset) {
    const route = router.currentRoute.value;
    const query = { ...route.query };
    if (nextPreset && nextPreset !== getCombinatorInitialPresetName(variants.value)) {
      query.preset = getCombinatorPresetSlugs(variants.value)[nextPreset];
    }
    else delete query.preset;
    const intent = { preset: nextPreset, path: route.path, query, queued: Boolean(externalNavigation) };
    localIntent.value = intent;
    if (intent.queued) return;
    if (!pendingWrite && query.preset === route.query.preset) {
      if (nextPreset !== '') localIntent.value = null;
      return;
    }
    // Browser fragments are encoded; router object locations expect decoded text.
    let hash = getCurrentBrowserHash();
    try {
      hash = decodeURIComponent(hash);
    } catch {
      // Treat malformed escapes as literal text and let the router encode them safely.
    }
    const location = { path: route.path, query, hash };
    // A fresh object distinguishes consecutive writes, including ones to the same URL.
    const write = { ...intent, fullPath: router.resolve(location).fullPath };
    pendingWrite = write;
    return router.replace(location).then(() => {
      // Settled selections return to URL ownership; queued requests and unsaved edits still need their override.
      if (localIntent.value === intent && !intent.queued && nextPreset !== '') localIntent.value = null;
    }).catch(() => {}).finally(() => {
      if (pendingWrite === write) pendingWrite = null;
    });
  }

  watch(componentName, () => { localIntent.value = null; });

  onMounted(() => {
    navigationStops.push(
      router.options.history.listen((to, from, info) => {
        if (info.type === 'pop') historyPop = router.resolve(to).fullPath;
      }),
      router.beforeEach(to => {
        const isPop = historyPop === to.fullPath;
        historyPop = null;
        if (!isPop && to.fullPath === pendingWrite?.fullPath) {
          suppressRouteHashScroll(to);
          return;
        }
        const intent = localIntent.value?.queued ? localIntent.value : pendingWrite;
        // Redirects retain the original comparison; Back compares against the latest pending UI intent.
        const presetFrom = getPresetNavigationFrom(
          to, externalNavigation, isPop ? intent : null, router.currentRoute.value,
        );
        if (localIntent.value) {
          // TOC/query pushes may carry the old query; an explicit different preset cancels replay.
          localIntent.value.queued = shouldQueueIntent(to, presetFrom, intent);
        }
        externalNavigation = { route: to, presetFrom, write: pendingWrite };
      }),
      router.afterEach(onNavigationSettled),
      router.onError((error, to) => {
        // Installing a hook replaces the router's default logging. Preserve failed edit writes as local drafts.
        console.error(error);
        if (preset.value !== '' && !externalNavigation && to.fullPath === pendingWrite?.fullPath) {
          localIntent.value = null;
        }
        onNavigationSettled(to, null, error);
      }),
    );
  });

  onBeforeUnmount(() => { navigationStops.forEach(stop => stop()); });
  return { preset, updatePreset };
}
