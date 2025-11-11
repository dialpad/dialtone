<template>
  <h2 class="d-vi-visible-sr">
    Local navigation
  </h2>
  <dt-stack
    v-if="sidebarItems.length"
    as="ul"
    class="dialtone-sidebar__list"
    gap="300"
  >
    <sidebar-item
      v-for="item in sidebarItems"
      :key="item.link || item.text"
      :item="item"
      :is-single-page="item.isSinglePage"
      :depth="0"
      :open-items="openItems"
      @toggle="handleToggle"
    />
  </dt-stack>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SidebarItem from './SidebarItem.vue';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { useSidebarItems } from '../composables/useSidebarItems';

const route = useRoute();
const items = useThemeLocaleData().value.sidebar;
const sidebarItems = useSidebarItems(items);

// Track which items are open (by their link or text as key)
const openItems = ref(new Set());

// Check if current route is within an item's tree
const isRouteInTree = (item, routePath) => {
  if (!item.children) return false;
  if (routePath === item.link) return true;

  const checkChildren = (children) => {
    return children.some(child => {
      if (routePath === child.link) return true;
      if (child.children) return checkChildren(child.children);
      return false;
    });
  };

  return checkChildren(item.children);
};

// Find all items that should be open based on route
const computeOpenItems = (items, routePath) => {
  const open = new Set();

  const traverse = (itemsList) => {
    itemsList.forEach(item => {
      if (item.children) {
        if (isRouteInTree(item, routePath)) {
          open.add(item.link || item.text);
        }
        traverse(item.children);
      }
    });
  };

  traverse(items);
  return open;
};

// Initialize open items after mount
onMounted(() => {
  openItems.value = computeOpenItems(sidebarItems.value, route.path);
});

// Update open items when route changes
watch(() => route.path, (newPath) => {
  openItems.value = computeOpenItems(sidebarItems.value, newPath);
});

// Handle toggle from child components
const handleToggle = (itemKey, shouldOpen) => {
  const newSet = new Set(openItems.value);
  if (shouldOpen) {
    newSet.add(itemKey);
  } else {
    newSet.delete(itemKey);
  }
  openItems.value = newSet;
};
</script>
