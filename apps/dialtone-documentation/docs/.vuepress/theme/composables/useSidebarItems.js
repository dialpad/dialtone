import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePageData } from '@vuepress/client';

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
