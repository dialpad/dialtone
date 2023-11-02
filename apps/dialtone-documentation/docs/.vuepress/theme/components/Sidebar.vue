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
    />
  </dt-stack>
</template>

<script setup>
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import SidebarItem from '../components/SidebarItem.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const items = useThemeLocaleData().value.sidebar;
const sidebarItems = computed(() => {
  const key = Object.keys(items).filter(item => route.path.includes(item));
  return items[key] || [];
});
</script>
