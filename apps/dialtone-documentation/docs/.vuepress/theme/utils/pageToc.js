export const PAGE_SCROLL_CONTAINER_SELECTOR = '.dialtone-doc-page-scroll-container';
export const PAGE_SCROLL_CONTAINER_NO_SMOOTH_CLASS = 'dialtone-doc-page-scroll-container--no-smooth';
// Stable id hook (set in Page.vue) rather than a styling-class selector, which
// would silently break getScrollOffset if the sticky header's utilities change.
export const PAGE_STICKY_HEADER_SELECTOR = '#page-sticky-header';
export const TOC_SCROLL_OFFSET_GAP = 16;

// Scroll behavior for hash navigation — kept as a function (not a const) as a seam
// for a future prefers-reduced-motion check. Visual smoothness is owned by CSS
// (.dialtone-doc-page-scroll-container); this value also arms the scroll-spy guard
// (see startProgrammaticScroll in PageToc.vue).
export function getHashScrollBehavior () {
  return 'smooth';
}

export function getRouteScrollToTopBehavior () {
  return 'auto';
}

export function shouldScrollRouteToTop (to, from) {
  return Boolean(from?.path && to?.path && to.path !== from.path && !to.hash);
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

export function flattenHeaders (headers = []) {
  return headers.flatMap(header => [
    header,
    ...flattenHeaders(header.children || []),
  ]);
}

export function hashToId (link = '') {
  const hashIndex = link.indexOf('#');
  const hash = hashIndex === -1 ? link : link.slice(hashIndex + 1);

  return decodeURIComponent(hash.replace(/^#/, ''));
}

export function findPageScrollContainer (element) {
  return element?.closest?.(PAGE_SCROLL_CONTAINER_SELECTOR) ||
    document.querySelector(PAGE_SCROLL_CONTAINER_SELECTOR) ||
    document.scrollingElement ||
    document.documentElement;
}

export function getScrollOffset (scrollContainer) {
  const stickyHeader = scrollContainer?.querySelector?.(PAGE_STICKY_HEADER_SELECTOR);
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

export function getActiveHeaderLink (headers, scrollContainer, { offset = 0, getTarget = getElementById } = {}) {
  const linkedHeaders = getLinkedHeaders(headers);
  if (!linkedHeaders.length || !scrollContainer) return '';

  if (isScrolledToBottom(scrollContainer)) {
    return linkedHeaders[linkedHeaders.length - 1].link;
  }

  return getPassedHeaderLink(linkedHeaders, scrollContainer.getBoundingClientRect().top + offset, getTarget);
}

function getLinkedHeaders (headers) {
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
