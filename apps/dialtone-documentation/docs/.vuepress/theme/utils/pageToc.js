export const PAGE_SCROLL_CONTAINER_SELECTOR = '.dialtone-doc-page-scroll-container';
export const PAGE_SCROLL_CONTAINER_NO_SMOOTH_CLASS = 'dialtone-doc-page-scroll-container--no-smooth';
// Stable id hook (set in Page.vue) rather than a styling-class selector, which
// would silently break getScrollOffset if the sticky header's utilities change.
export const PAGE_STICKY_HEADER_SELECTOR = '#page-sticky-header';
export const TOC_SCROLL_OFFSET_GAP = 16;

// Scroll behavior for hash navigation — kept as a function (not a const) as a seam
// for a future prefers-reduced-motion check. Visual smoothness is owned by CSS
// (.dialtone-doc-page-scroll-container); this value also arms the scroll-spy guard
// (see startProgrammaticScroll in usePageTocScrollSpy.js).
export function getHashScrollBehavior () {
  return 'smooth';
}

export function getRightRailTocViewportValues (hasCombinator = false) {
  return {
    default: false,
    xl: true,
    xxxl: !hasCombinator,
    xxxxl: true,
  };
}

export function getCurrentBrowserHash (fallback = '', location = typeof window === 'undefined' ? null : window.location) {
  return location?.hash || fallback;
}

export function getRouteScrollToTopBehavior () {
  return 'auto';
}

export function shouldScrollRouteToTop (to, from) {
  return Boolean(from?.path && to?.path && to.path !== from.path && !to.hash);
}

export function shouldSyncActiveHeaderFromRouteWatch (path, previousPath) {
  return !previousPath || path === previousPath;
}

export function scrollRouteToTop (scrollContainer, scheduleRestore = scheduleScrollBehaviorRestore) {
  if (!scrollContainer?.scrollTo) return;

  // The container's CSS `scroll-behavior: smooth` can win over the scrollTo `behavior`
  // option and animate this jump, so force it instant by toggling the --no-smooth class
  // around the scroll and restoring smoothness next frame. (Same quirk: IconCatalog.vue.)
  scrollContainer.classList?.add(PAGE_SCROLL_CONTAINER_NO_SMOOTH_CLASS);
  scrollContainer.scrollTo({
    top: 0,
    behavior: getRouteScrollToTopBehavior(),
  });
  scheduleRestore(() => {
    scrollContainer.classList?.remove(PAGE_SCROLL_CONTAINER_NO_SMOOTH_CLASS);
  });
}

export function createRouteHashScrollGuard () {
  let skippedHash = null;

  return {
    skip (hash) {
      skippedHash = hash;
    },

    shouldSkip (hash) {
      if (skippedHash !== hash) return false;

      skippedHash = null;
      return true;
    },
  };
}

export async function writeRouteHash (
  router,
  route,
  hash,
  routeHashScrollGuard,
  { replace = false, currentHash = route.hash } = {},
) {
  if (currentHash === hash) return;

  const scrollBehavior = router.options.scrollBehavior;
  const method = replace ? 'replace' : 'push';
  routeHashScrollGuard.skip(hash);
  router.options.scrollBehavior = undefined;

  try {
    await router[method]({
      path: route.path,
      query: route.query,
      hash,
    });
  } finally {
    router.options.scrollBehavior = scrollBehavior;
  }
}

export function replaceBrowserHash (hash, {
  history = window.history,
  location = window.location,
} = {}) {
  if (location.hash === hash) return;

  history.replaceState(
    history.state,
    '',
    `${location.pathname}${location.search}${hash}`,
  );
}

export function flattenHeaders (headers = []) {
  return headers.flatMap(header => [
    header,
    ...flattenHeaders(header.children || []),
  ]);
}

export function flattenHeadersWithDepth (headers = [], depth = 0) {
  return headers.flatMap(header => [
    { ...header, depth },
    ...flattenHeadersWithDepth(header.children || [], depth + 1),
  ]);
}

export function hashToId (link = '') {
  const hashIndex = link.indexOf('#');
  const hash = hashIndex === -1 ? link : link.slice(hashIndex + 1);

  return decodeURIComponent(hash.replace(/^#/, ''));
}

export function findPageScrollContainer () {
  return document.querySelector(PAGE_SCROLL_CONTAINER_SELECTOR) ||
    document.scrollingElement ||
    document.documentElement;
}

// `stickyHeader` may be passed in by callers that already hold it — the scroll path
// runs this every frame and the element only changes between pages.
export function findPageStickyHeader (scrollContainer) {
  return scrollContainer?.querySelector?.(PAGE_STICKY_HEADER_SELECTOR) ?? null;
}

export function getScrollOffset (scrollContainer, stickyHeader = findPageStickyHeader(scrollContainer)) {
  if (!stickyHeader || !scrollContainer?.getBoundingClientRect) return 0;

  const scrollContainerTop = scrollContainer.getBoundingClientRect().top;
  const stickyHeaderBottom = stickyHeader.getBoundingClientRect().bottom;

  return Math.max(0, stickyHeaderBottom - scrollContainerTop) + TOC_SCROLL_OFFSET_GAP;
}

export function getTargetScrollTop (scrollContainer, target, offset = 0) {
  const scrollContainerTop = scrollContainer.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;

  return scrollContainer.scrollTop + targetTop - scrollContainerTop - offset;
}

// `linkedHeaders` may be passed in pre-flattened; the scroll path memoizes it rather
// than rebuilding the whole tree on every frame.
export function getActiveHeaderLink (headers, scrollContainer, {
  offset = 0,
  getTarget = getElementById,
  linkedHeaders = getLinkedHeaders(headers),
} = {}) {
  if (!linkedHeaders.length || !scrollContainer) return '';

  if (isScrolledToBottom(scrollContainer)) {
    return linkedHeaders[linkedHeaders.length - 1].link;
  }

  return getPassedHeaderLink(linkedHeaders, scrollContainer.getBoundingClientRect().top + offset, getTarget);
}

export function getLinkedHeaders (headers) {
  return flattenHeaders(headers).filter(header => header.link);
}

function getPassedHeaderLink (headers, activationTop, getTarget) {
  let activeLink = '';

  for (const header of headers) {
    const target = getTarget(hashToId(header.link));
    if (!target?.getBoundingClientRect) continue;
    if (target.getBoundingClientRect().top > activationTop) break;

    activeLink = header.link;
  }

  return activeLink;
}

function getElementById (id) {
  return document.getElementById(id);
}

function scheduleScrollBehaviorRestore (callback) {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(callback);
    return;
  }

  setTimeout(callback, 0);
}

function isScrolledToBottom (scrollContainer) {
  return scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 5;
}
