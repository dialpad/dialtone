import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePageData } from '@vuepress/client';

/*
* Get the sidebar items from the page data, that are listed in site-nav.
* If the value for the current route is not an array, it will use the headers
* to fill the sidebar items.
*/
export function useSidebarItems (items) {
  const route = useRoute();
  const sidebarItems = computed(() => {
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

  return sidebarItems;
}
