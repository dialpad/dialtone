/**
 * Nav links whose descendant routes belong to them.
 *
 * A collection page owns pages that do not appear in site-nav.json — What's New owns
 * its blog posts, which live under a route prefix instead of as nav children. These
 * entries let the sidebar treat such a route as "inside" the collection, and let
 * prev/next pagination offer a way back to it.
 *
 * Keyed by the collection's own nav link. Add a row here rather than another
 * conditional at a call site — this used to be hardcoded in three separate files.
 *
 * @constant {Map<string, { descendantPrefix: string, backLabel: string }>}
 */
const NAV_COLLECTIONS = new Map([
  ['/dialtone/whats-new/', {
    descendantPrefix: '/dialtone/whats-new/posts/',
    backLabel: 'Back to What\'s New',
  }],
]);

const containsRoute = (items, routePath) => Boolean(routePath && items?.some(item => (
  item.link === routePath ||
  containsRoute(item.children, routePath)
)));

/**
 * The route opened alongside a marked collapsible in the persistent sidebar.
 *
 * @param {{
 *   children?: Array<{ link?: string }>,
 *   navigateToFirstChildWhenPersistent?: boolean,
 * }} item
 * @param {{ persistent: boolean, open: boolean, routePath?: string }} options
 * @returns {string | null}
 */
export const getCollapsibleNavigationTarget = (item, { persistent, open, routePath }) => (
  persistent &&
  !open &&
  item.navigateToFirstChildWhenPersistent &&
  !containsRoute(item.children, routePath)
    ? item.children?.[0]?.link ?? null
    : null
);

/**
 * Remove repeated page links while keeping the deepest nav item as the page label.
 * Grouping parents appear before their children, so the final occurrence is the
 * actual linked page.
 *
 * @param {Array<{ link: string }>} items
 * @returns {Array<{ link: string }>}
 */
export const dedupeNavItemsByLink = (items) => {
  const lastIndexByLink = new Map(items.map((item, index) => [item.link, index]));

  return items.filter((item, index) => lastIndexByLink.get(item.link) === index);
};

/**
 * Whether `routePath` is a page owned by the collection at `link`.
 *
 * @param {string | undefined} link - a nav item's own link
 * @param {string} routePath - the current route path
 * @returns {boolean}
 */
export const isDescendantOfNavCollection = (link, routePath) => {
  const collection = NAV_COLLECTIONS.get(link);

  return Boolean(collection) && routePath.startsWith(collection.descendantPrefix);
};

/**
 * The collection a descendant route belongs to, shaped as a nav item so pagination
 * can use it directly as a prev link. Null when the route is not inside a collection.
 *
 * @param {string} routePath
 * @returns {{ link: string, text: string } | null}
 */
export const findNavCollectionForRoute = (routePath) => {
  for (const [link, { descendantPrefix, backLabel }] of NAV_COLLECTIONS) {
    if (routePath.startsWith(descendantPrefix)) return { link, text: backLabel };
  }

  return null;
};
