import { computed } from 'vue';

function toSidebarItem (item, isTopLevel = false) {
  const sidebarItem = {
    ...item,
    ...(isTopLevel ? { icon: item.icon ?? 'box-select' } : {}),
  };

  if (item.hideChildrenInSidebar) {
    delete sidebarItem.children;
  } else if (item.children) {
    sidebarItem.children = item.children.map(child => toSidebarItem(child));
  }

  return sidebarItem;
}

/*
 * Returns the unified left-nav tree from site-nav.json (`nav` array).
 * The tree is route-independent — every page renders the full nav.
 * Top-level items without an icon get the `box-select` placeholder.
 */
export function useSidebarItems (items) {
  return computed(() => {
    return (items.nav || []).map(item => toSidebarItem(item, true));
  });
}
