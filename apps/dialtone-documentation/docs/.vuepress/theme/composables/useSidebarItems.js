import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePageData } from 'vuepress/client';

/**
 * Determine which top-level group the current route belongs to
 * @param {string} path Current route path
 * @returns {string} The top-level group key
 */
function detectTopLevelGroup(path) {
  // Map routes to top-level groups
  const designSystemPaths = ['/design/', '/components/', '/utilities/', '/tokens/', '/guides/', '/about/'];

  if (designSystemPaths.some(p => path.includes(p))) {
    return 'dialtone';
  }
  if (path.includes('/foundations/')) {
    return 'foundations';
  }
  if (path.includes('/careers/')) {
    return 'careers';
  }
  if (path.includes('/articles/')) {
    return 'articles';
  }
  if (path.includes('/dialtone/')) {
    return 'dialtone';
  }

  // Default to dialtone for any unknown paths
  return 'dialtone';
}

/*
* Get the sidebar items from the page data, that are listed in site-nav.
* If the value for the current route is not an array, it will use the headers
* to fill the sidebar items.
*
* Now supports top-level grouping (Foundations, Design System, Careers, Articles)
*/
export function useSidebarItems (items) {
  const route = useRoute();
  return computed(() => {
    // Check if using new top-level groups structure
    if (items.topLevelGroups) {
      const topLevelGroup = detectTopLevelGroup(route.path);
      const groupData = items.topLevelGroups[topLevelGroup];
      const sections = groupData?.sections || {};
      const icon = groupData?.icon;

      // For dialtone group, return ALL sections so they all appear in sidebar
      // This shows: Design | Components | Utilities | Tokens | Guides | About
      if (topLevelGroup === 'dialtone') {
        // Flatten all sections into a single array
        // Each section is an array with one parent item containing children
        // Add icon to first-level items
        return Object.values(sections).flat().map(item => ({
          ...item,
          icon: item.icon || icon,
        }));
      }

      // For other groups (foundations, careers, articles), find the specific matching section
      const sectionKey = Object.keys(sections).find(key =>
        route.path.includes(key.replace(/\/$/, '')),
      );

      if (!sections[sectionKey]) return [];
      // Add icon to first-level items
      return (sections[sectionKey] || []).map(item => ({
        ...item,
        icon: item.icon || icon,
      }));
    }

    // Fallback to old flat structure (for backwards compatibility)
    const key = Object.keys(items).filter(item => route.path.includes(item.replace(/\/$/, '')));
    if (!items[key]) return [];
    if (Array.isArray(items[key])) return items[key] || [];
    return [{
      isSinglePage: true,
      text: items[key].text,
      children: usePageData().value.headers.map(item => {
        return { text: item.title, link: item.link };
      }),
    }];
  });
}
