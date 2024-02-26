<template>
  <h2 class="d-vi-visible-sr">
    Local navigation
  </h2>
  <dt-stack
    v-if="sidebarItems.length"
    as="ul"
    gap="500"
    class="dialtone-sidebar__list"
  >
    <sidebar-item
      v-for="item in sidebarItems"
      :key="item.link || item.text"
      :item="item"
      :is-single-page="item.isSinglePage"
    />
  </dt-stack>
</template>

<script setup>
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import SidebarItem from '../components/SidebarItem.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePageData } from '@vuepress/client';

const route = useRoute();
const items = useThemeLocaleData().value.sidebar;
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
</script>
