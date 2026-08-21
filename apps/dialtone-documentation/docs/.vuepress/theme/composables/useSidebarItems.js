import { computed } from 'vue';

function toSidebarItem (item, isTopLevel = false) {
  const sidebarItem = {
    ...item,
    text: item.sidebarText ?? item.text,
    ...(isTopLevel ? { icon: item.icon ?? 'box-select' } : {}),
  };

  delete sidebarItem.promoteChildrenInSidebar;
  delete sidebarItem.sidebarText;

  if (item.hideChildrenInSidebar) {
    delete sidebarItem.children;
  } else if (item.children) {
    sidebarItem.children = item.children.map(child => toSidebarItem(child));
  }

  return sidebarItem;
}

/*
 * Projects the route-independent `site-nav.json` tree into promoted and primary
 * sidebar presentation groups. Top-level primary items without an icon get the
 * `box-select` placeholder.
 */
export function useSidebarItems (items) {
  return computed(() => {
    const navItems = items.nav || [];
    const promotedParent = navItems.find(item => (
      item.promoteChildrenInSidebar && item.children?.length
    ));

    return [
      {
        key: 'promoted',
        presentation: 'promoted',
        items: promotedParent?.children.map(item => toSidebarItem(item)) || [],
      },
      {
        key: 'primary',
        presentation: 'primary',
        items: navItems
          .filter(item => item !== promotedParent)
          .map(item => toSidebarItem(item, true)),
      },
    ];
  });
}
