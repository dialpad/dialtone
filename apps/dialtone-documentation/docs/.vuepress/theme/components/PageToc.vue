<template>
  <aside ref="tocRef">
    <dt-text
      as="h2"
      kind="headline"
      :size="100"
      strength="semibold"
      tone="secondary"
      class="d-tt-uppercase d-px-100 d-pbe-50 "
    >
      On this page
    </dt-text>
    <nav>
      <ul
        v-for="header in headers"
        :key="header.slug"
      >
        <li v-if="!header.children.length">
          <toc-item
            :active="isItemActive(header)"
            :to="header.link"
            :text="header.title"
            @navigate="handleNavigate($event, header)"
          />
        </li>
        <dt-collapsible
          v-else
          element-type="li"
          :open="isHeaderActive(header)"
        >
          <template #anchor="{ attrs }">
            <toc-item
              v-bind="attrs"
              :active="isItemActive(header)"
              :to="header.link"
              :text="header.title"
              @navigate="handleNavigate($event, header)"
            />
          </template>
          <template
            v-if="header.children.length"
            #content
          >
            <ul class="d-pis-100 ">
              <li
                v-for="child in header.children"
                :key="child.slug"
                class="d-fw-wrap "
              >
                <toc-item
                  :active="isItemActive(child)"
                  :to="child.link"
                  :text="child.title"
                  @navigate="handleNavigate($event, child)"
                />
              </li>
            </ul>
          </template>
        </dt-collapsible>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  createRouteHashScrollGuard,
  findPageScrollContainer,
  getActiveHeaderLink,
  getHashScrollBehavior,
  getScrollOffset,
  getTargetScrollTop,
  hashToId,
} from '../utils/pageToc.js';
import TocItem from './TocItem.vue';

const props = defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();
const router = useRouter();
const tocRef = ref(null);
const scrollContainer = ref(null);
const activeHash = ref(route.hash);
const routeHashScrollGuard = createRouteHashScrollGuard();

// Absolute cap on how long scroll-spy stays suppressed after a programmatic scroll,
// for browsers/cases where `scrollend` never fires.
const PROGRAMMATIC_SCROLL_MAX_MS = 2000;
// Idle gap after the last scroll event before a programmatic scroll is considered settled.
const SCROLL_IDLE_SETTLE_MS = 150;

let removeScrollListener = null;
let scrollFrame = null;
let isProgrammaticScrolling = false;
let programmaticScrollTimer = null;

function isHeaderActive (header) {
  const links = [header.link, ...(header.children || []).map(child => child.link)];
  return links.some(link => link === activeHash.value);
}

function isItemActive (item) {
  return item.link === activeHash.value;
}

function syncScrollContainer () {
  const nextScrollContainer = findPageScrollContainer(tocRef.value);
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
  const nextActiveHash = getActiveHeaderLink(props.headers, scrollContainer.value, {
    offset: getScrollOffset(scrollContainer.value),
  });

  if (nextActiveHash === activeHash.value) return;

  activeHash.value = nextActiveHash;
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
// not this argument — see getHashScrollBehavior.)
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

async function updateRouteHash (hash) {
  if (route.hash === hash) return;

  // Suppress the router's global scroll-to-hash (set in client.js) for this write:
  // the TOC owns scrolling inside the page container, so the hash should change
  // without triggering a second scroll from the route.hash watcher.
  const scrollBehavior = router.options.scrollBehavior;
  routeHashScrollGuard.skip(hash);
  router.options.scrollBehavior = undefined;

  try {
    await router.push({
      path: route.path,
      query: route.query,
      hash,
    });
  } finally {
    router.options.scrollBehavior = scrollBehavior;
  }
}

async function handleNavigate (event, item) {
  event.preventDefault();
  activeHash.value = item.link;
  await updateRouteHash(item.link);
  scrollToHash(item.link);
}

// Client-only: runs the initial sync after mount. Must NOT be folded into the
// watcher below via `immediate` — that fires during SSR (flush:'post' still runs
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
  () => [route.path, props.headers],
  async () => {
    await nextTick();
    syncScrollContainer();

    if (route.hash) {
      activeHash.value = route.hash;
      scrollToHash(route.hash, getHashScrollBehavior());
      return;
    }

    activeHash.value = '';
    updateActiveHeaderFromScroll();
  },
  { flush: 'post' },
);
</script>

<style lang="less" scoped>
.dialtone-toc {
  inline-size: var(--dt-layout-300);
  block-size: calc(100vh - var(--dt-layout-100));
  inset-block-start: var(--dt-layout-100);
}
</style>
