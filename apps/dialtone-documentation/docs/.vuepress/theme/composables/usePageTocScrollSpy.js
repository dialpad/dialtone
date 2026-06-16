import { nextTick, onMounted, onUnmounted, ref, unref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  createRouteHashScrollGuard,
  findPageScrollContainer,
  getActiveHeaderLink,
  getCurrentBrowserHash,
  getHashScrollBehavior,
  getScrollOffset,
  getTargetScrollTop,
  hashToId,
  replaceBrowserHash,
  shouldSyncActiveHeaderFromRouteWatch,
  writeRouteHash,
} from '../utils/pageToc.js';

// Absolute cap on how long scroll-spy stays suppressed after a programmatic scroll,
// for browsers/cases where `scrollend` never fires.
const PROGRAMMATIC_SCROLL_MAX_MS = 2000;
// Idle gap after the last scroll event before a programmatic scroll is considered settled.
const SCROLL_IDLE_SETTLE_MS = 150;

export function usePageTocScrollSpy (headers) {
  const route = useRoute();
  const router = useRouter();
  const scrollContainer = ref(null);
  const activeHash = ref(getCurrentBrowserHash(route.hash));
  const routeHashScrollGuard = createRouteHashScrollGuard();

  let removeScrollListener = null;
  let scrollFrame = null;
  let isProgrammaticScrolling = false;
  let programmaticScrollTimer = null;

  function getHeaders () {
    return unref(headers) || [];
  }

  function syncScrollContainer () {
    const nextScrollContainer = findPageScrollContainer();
    if (scrollContainer.value === nextScrollContainer) return;

    removeScrollListener?.();
    const currentScrollContainer = nextScrollContainer;
    scrollContainer.value = currentScrollContainer;
    currentScrollContainer.addEventListener('scroll', queueActiveHeaderUpdate, { passive: true });
    removeScrollListener = () => currentScrollContainer.removeEventListener('scroll', queueActiveHeaderUpdate);
  }

  function queueActiveHeaderUpdate () {
    if (isProgrammaticScrolling) {
      refreshProgrammaticScrollTimer();
      return;
    }

    if (scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = null;
      updateActiveHeaderFromScroll();
    });
  }

  function updateActiveHeaderFromScroll () {
    const currentHeaders = getHeaders();
    if (!currentHeaders.length) return;

    const nextActiveHash = getActiveHeaderLink(currentHeaders, scrollContainer.value, {
      offset: getScrollOffset(scrollContainer.value),
    });

    if (nextActiveHash === activeHash.value) return;

    activeHash.value = nextActiveHash;
    // Scroll-spy updates the URL directly (history.replaceState, no router), so route.hash
    // goes stale during scroll -- read window.location.hash / getCurrentBrowserHash for live
    // state, never route.hash. (Bypassing the router avoids its scroll-to-hash feedback loop.)
    replaceBrowserHash(nextActiveHash);
  }

  function scrollToHash (hash, behavior = 'smooth') {
    if (!hash || !scrollContainer.value) return;

    const target = document.getElementById(hashToId(hash));
    if (!target) return;

    startProgrammaticScroll(behavior);

    scrollContainer.value.scrollTo({
      top: Math.max(0, getTargetScrollTop(scrollContainer.value, target, getScrollOffset(scrollContainer.value))),
      behavior,
    });
  }

  // Only smooth scrolls animate over time, so only they need scroll-spy paused until
  // they finish; an instant scroll lands immediately. (The smoothness itself is CSS,
  // not this argument -- see getHashScrollBehavior.)
  function startProgrammaticScroll (behavior) {
    if (behavior !== 'smooth') return;

    isProgrammaticScrolling = true;
    // Re-attach fresh in case a prior programmatic scroll hasn't resolved (rapid clicks).
    scrollContainer.value?.removeEventListener('scrollend', stopProgrammaticScroll);
    scrollContainer.value?.addEventListener('scrollend', stopProgrammaticScroll, { once: true });
    refreshProgrammaticScrollTimer(PROGRAMMATIC_SCROLL_MAX_MS);
  }

  function refreshProgrammaticScrollTimer (delay = SCROLL_IDLE_SETTLE_MS) {
    window.clearTimeout(programmaticScrollTimer);
    programmaticScrollTimer = window.setTimeout(stopProgrammaticScroll, delay);
  }

  function stopProgrammaticScroll () {
    if (!isProgrammaticScrolling) return;

    isProgrammaticScrolling = false;
    window.clearTimeout(programmaticScrollTimer);
    programmaticScrollTimer = null;
    scrollContainer.value?.removeEventListener('scrollend', stopProgrammaticScroll);
  }

  async function updateRouteHash (hash, options) {
    await writeRouteHash(router, route, hash, routeHashScrollGuard, {
      currentHash: window.location.hash,
      ...options,
    });
  }

  async function handleNavigate (event, item) {
    event.preventDefault();
    activeHash.value = item.link;
    await updateRouteHash(item.link);
    scrollToHash(item.link);
  }

  // Client-only: runs the initial sync after mount. Must NOT be folded into the
  // watcher below via `immediate` -- that fires during SSR (flush:'post' still runs
  // on the server), where syncScrollContainer touches `document`.
  onMounted(async () => {
    await nextTick();
    syncScrollContainer();

    if (route.hash) {
      scrollToHash(route.hash, getHashScrollBehavior());
    } else {
      updateActiveHeaderFromScroll();
    }
  });

  onUnmounted(() => {
    removeScrollListener?.();
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    stopProgrammaticScroll();
  });

  watch(
    () => route.hash,
    async (hash) => {
      activeHash.value = hash;
      if (routeHashScrollGuard.shouldSkip(hash)) return;

      await nextTick();
      syncScrollContainer();
      scrollToHash(hash, getHashScrollBehavior());
    },
    { flush: 'post' },
  );

  watch(
    () => [route.path, getHeaders()],
    async ([path], [previousPath] = []) => {
      await nextTick();
      syncScrollContainer();

      if (route.hash) {
        activeHash.value = route.hash;
        scrollToHash(route.hash, getHashScrollBehavior());
        return;
      }

      activeHash.value = '';
      if (shouldSyncActiveHeaderFromRouteWatch(path, previousPath)) {
        updateActiveHeaderFromScroll();
      }
    },
    { flush: 'post' },
  );

  return {
    activeHash,
    handleNavigate,
  };
}
