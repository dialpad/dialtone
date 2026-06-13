<template>
  <aside ref="tocRef">
    <dt-text
      as="h2"
      kind="headline"
      :size="100"
      strength="semibold"
      tone="secondary"
      class="d-tt-uppercase d-px-100 d-pbe-50 d-vi-visible-sr"
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
            <ul class="d-pis-100 d-mbs-25">
              <li
                v-for="child in header.children"
                :key="child.slug"
                class="lg:d-d-flex d-fw-wrap d-mbs-25"
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
  findPageScrollContainer,
  getActiveHeaderLink,
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

let removeScrollListener = null;
let scrollFrame = null;
let isUpdatingRouteHash = false;
let ignoreScrollUpdatesUntil = 0;

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
  if (scrollFrame) return;

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = null;
    updateActiveHeaderFromScroll();
  });
}

function updateActiveHeaderFromScroll () {
  if (performance.now() < ignoreScrollUpdatesUntil) return;

  const nextActiveHash = getActiveHeaderLink(props.headers, scrollContainer.value, {
    offset: getScrollOffset(scrollContainer.value),
  });

  if (nextActiveHash === activeHash.value) return;

  activeHash.value = nextActiveHash;
  void updateRouteHash(nextActiveHash, { replace: true });
}

function scrollToHash (hash, behavior = 'smooth') {
  if (!hash || !scrollContainer.value) return;

  const target = document.getElementById(hashToId(hash));
  if (!target) return;

  ignoreScrollUpdatesUntil = performance.now() + (behavior === 'smooth' ? 700 : 100);

  scrollContainer.value.scrollTo({
    top: Math.max(0, getTargetScrollTop(scrollContainer.value, target, getScrollOffset(scrollContainer.value))),
    behavior,
  });
}

async function updateRouteHash (hash, { replace = false } = {}) {
  if (route.hash === hash) return;

  // Suppress the router's global scroll-to-hash (set in client.js) for this write:
  // the TOC owns scrolling inside the page container, so the hash should change
  // without triggering a second scroll. isUpdatingRouteHash likewise stops the
  // route.hash watcher from re-scrolling in response to our own replace.
  const scrollBehavior = router.options.scrollBehavior;
  isUpdatingRouteHash = true;
  router.options.scrollBehavior = undefined;

  try {
    await router[replace ? 'replace' : 'push']({
      path: route.path,
      query: route.query,
      hash,
    });
  } finally {
    router.options.scrollBehavior = scrollBehavior;
    window.requestAnimationFrame(() => {
      isUpdatingRouteHash = false;
    });
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
    scrollToHash(route.hash, 'auto');
  } else {
    updateActiveHeaderFromScroll();
  }
});

onUnmounted(() => {
  removeScrollListener?.();
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
});

watch(
  () => route.hash,
  async (hash) => {
    activeHash.value = hash;
    if (isUpdatingRouteHash) return;

    await nextTick();
    syncScrollContainer();
    scrollToHash(hash, 'auto');
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
      scrollToHash(route.hash, 'auto');
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
