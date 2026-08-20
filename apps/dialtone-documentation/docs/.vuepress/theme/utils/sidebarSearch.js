import { isDescendantOfNavCollection } from './navRoutes.js';

/**
 * Pure nav-tree transforms behind the sidebar's search, keyboard navigation, and
 * open/closed state. Kept out of Sidebar.vue so they can be tested with plain data
 * instead of a mounted component.
 *
 * A "nav item" here is an entry from site-nav.json: `{ text, link?, keywords?, children? }`.
 * An "item path" is a dotted index trail into the tree (`'2.0.1'`), used as a stable
 * DOM key for keyboard navigation.
 *
 * @module theme/utils/sidebarSearch
 */

/**
 * Strip separators and case so search matches across punctuation.
 *
 * @param {string} str
 * @returns {string}
 */
export const normalizeSearchTerm = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Nav items whose text or keywords match `searchTerm`, keeping any ancestor whose
 * descendants matched. Returns `items` unchanged for an empty term.
 *
 * @param {object[]} items
 * @param {string} searchTerm
 * @returns {object[]}
 */
export const filterNavItems = (items, searchTerm) => {
  if (!searchTerm) return items;

  const term = searchTerm.trim();
  if (!term) return items;

  const normalizedTerm = normalizeSearchTerm(term);
  if (!normalizedTerm) return [];

  const filtered = [];

  items.forEach((item) => {
    const itemMatches = normalizeSearchTerm(item.text).includes(normalizedTerm) ||
      (item.keywords?.some(keyword =>
        normalizeSearchTerm(keyword).includes(normalizedTerm),
      ) ?? false);

    const filteredChildren = item.children
      ? filterNavItems(item.children, searchTerm)
      : [];

    // Keep the item when it matches itself, or when it's the path to something that did.
    if (itemMatches || filteredChildren.length > 0) {
      filtered.push({
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : item.children,
      });
    }
  });

  return filtered;
};

/**
 * Item paths of every leaf link, depth-first — the sequential list arrow keys walk.
 * Parents are skipped: they toggle rather than navigate.
 *
 * @param {object[]} items
 * @returns {string[]}
 */
export const flattenNavigableItemPaths = (items) => {
  const flattened = [];

  const traverse = (itemsList, parentPath = '') => {
    itemsList.forEach((item, index) => {
      const itemPath = parentPath ? `${parentPath}.${index}` : String(index);

      if (item.link && !item.children?.length) {
        flattened.push(itemPath);
      }

      if (item.children && item.children.length > 0) {
        traverse(item.children, itemPath);
      }
    });
  };

  traverse(items);

  return flattened;
};

/**
 * Keys of every item with children — during search everything expands so matches
 * deeper in the tree are visible.
 *
 * @param {object[]} items
 * @returns {Set<string>}
 */
export const collectOpenItemKeys = (items) => {
  const open = new Set();

  const traverse = (itemsList) => {
    itemsList.forEach((item) => {
      if (item.children && item.children.length > 0) {
        open.add(item.link || item.text);
        traverse(item.children);
      }
    });
  };

  traverse(items);

  return open;
};

/**
 * Whether `routePath` sits anywhere inside `item`'s subtree.
 *
 * @param {object} item
 * @param {string} routePath
 * @returns {boolean}
 */
export const isRouteInTree = (item, routePath) => {
  if (!item.children) return false;
  if (routePath === item.link) return true;

  const checkChildren = (children) => {
    return children.some((child) => {
      if (routePath === child.link) return true;

      // Pages a collection owns but that aren't nav children (e.g. blog posts).
      if (isDescendantOfNavCollection(child.link, routePath)) return true;

      if (child.children) return checkChildren(child.children);

      return false;
    });
  };

  return checkChildren(item.children);
};

/**
 * Keys of the items that must be open for `routePath` to be visible — the ancestors
 * of the current page.
 *
 * @param {object[]} items
 * @param {string} routePath
 * @returns {Set<string>}
 */
export const collectOpenItemKeysForRoute = (items, routePath) => {
  const open = new Set();

  const traverse = (itemsList) => {
    itemsList.forEach((item) => {
      if (item.children) {
        if (isRouteInTree(item, routePath)) {
          open.add(item.link || item.text);
        }
        traverse(item.children);
      }
    });
  };

  traverse(items);

  return open;
};

/**
 * Step a highlight index by one, wrapping at both ends. An unset highlight (-1)
 * enters the list at the first item going down, the last going up.
 *
 * @param {number} index - current highlight, or -1 for none
 * @param {number} step - +1 or -1
 * @param {number} count - number of navigable items
 * @returns {number}
 */
export const wrapHighlightIndex = (index, step, count) => {
  if (index < 0) return step > 0 ? 0 : count - 1;

  return (index + step + count) % count;
};
