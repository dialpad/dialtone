<template>
  <h2 class="d-vi-visible-sr">
    Local navigation
  </h2>
  <dt-stack
    v-if="sidebarItems[0]?.children.length"
    as="ul"
    gap="200"
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
import SidebarItem from './SidebarItem.vue';
import { useSidebarItems } from '../composables/useSidebarItems';

const items = useThemeLocaleData().value.sidebar;
const sidebarItems = useSidebarItems(items);
</script>
