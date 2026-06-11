/**
 * Depth-first search of a site-nav `nav` tree for the item whose `link`
 * matches exactly. Returns the first match (a parent wins over a child that
 * shares its link), or null when nothing matches.
 */
export function findNavItemByLink (items, link) {
  for (const item of items || []) {
    if (item.link === link) return item;
    if (item.children) {
      const found = findNavItemByLink(item.children, link);
      if (found) return found;
    }
  }
  return null;
}
