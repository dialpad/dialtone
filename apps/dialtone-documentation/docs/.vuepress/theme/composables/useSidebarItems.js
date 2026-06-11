import { computed } from 'vue';

/*
 * Returns the unified left-nav tree from site-nav.json (`nav` array).
 * The tree is route-independent — every page renders the full nav.
 * Top-level items without an icon get the `box-select` placeholder.
 */
export function useSidebarItems (items) {
  return computed(() => {
    return (items.nav || []).map(item => ({
      ...item,
      icon: item.icon ?? 'box-select',
    }));
  });
}
