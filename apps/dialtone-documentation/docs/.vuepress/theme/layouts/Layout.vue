<template>
  <dt-root-layout
    :fixed="false"
    :header-sticky="true"
    header-class="d-ol-none"
    sidebar-class="dialtone-sidebar d-d-none lg:d-d-block d-ol-none"
    footer-class="d-text-right d-ol-none"
    content-class="d-ol-none dialtone-content"
  >
    <template #header>
      <div class="dialtone-header">
        <!-- <dialtone-logo /> -->
        <router-link
          class="d-pl8"
          title="Dialtone homepage"
          to="/"
        >
          <dt-stack>
            <dt-illustration name="dialpad-logo" />
          </dt-stack>
        </router-link>
        <navbar
          v-if="!$frontmatter.home"
          @search="openSearch"
        />
        <mobile-sidebar
          v-if="isMobile && route.path !== '/'"
        />
        <!-- eslint-disable-next-line vue/no-undef-components -->
        <div
          id="docsearch"
          ref="docSearchBtn"
          class="d-d-none"
          options=""
        />
      </div>
    </template>
    <template
      v-if="!$frontmatter.home"
      #sidebar
    >
      <sidebar />
    </template>
    <template #default>
      <home v-if="$frontmatter.home" />
      <page
        v-else
        :prev="$frontmatter.prev || prev"
        :next="$frontmatter.next || next"
        :is-mobile="isMobile"
      />
    </template>
  </dt-root-layout>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Home from '../components/Home.vue';
import Page from '../components/Page.vue';
import MobileSidebar from '../components/MobileSidebar.vue';
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { disableRootScrolling, enableRootScrolling } from '@dialpad/dialtone-vue';

const route = useRoute();
const prev = ref(null);
const next = ref(null);
const docSearchBtn = ref(null);
const items = useThemeLocaleData().value.sidebar;
const mobileBreakpoint = 980;
const evaluateWindowWidth = () => {
  isMobile.value = window.innerWidth <= mobileBreakpoint;
};
let observer = null;

const isMobile = ref(false);

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

/**
 * Recursively extract all navigable pages from a tree structure
 * Groups them by their parent category for pagination purposes
 * Includes both parent pages with children AND leaf nodes
 */
function extractLeafNodes(items, planned = false) {
  const groups = [];

  function traverse(itemsList, currentGroup = []) {
    itemsList.forEach(item => {
      if (item.planned && !planned) return;

      // Include this item if it has a link (it's a navigable page)
      if (item.link) {
        currentGroup.push(item);
      }

      // If it has children, recurse deeper
      if (item.children && item.children.length > 0) {
        traverse(item.children, currentGroup);
      }
    });
  }

  items.forEach(parentItem => {
    const group = [];

    // Include parent if it has a link
    if (parentItem.link && (!parentItem.planned || planned)) {
      group.push(parentItem);
    }

    // Also traverse children if they exist
    if (parentItem.children) {
      traverse(parentItem.children, group);
    }

    if (group.length > 0) {
      groups.push(group);
    }
  });

  return groups;
}

// Remove "planned" items to avoid errors
const currentItems = computed(() => {
  // Check if using new top-level groups structure
  if (items.topLevelGroups) {
    const topLevelGroup = detectTopLevelGroup(route.path);
    const sections = items.topLevelGroups[topLevelGroup]?.sections || {};

    // Flatten all sections into a single array
    const allSections = Object.values(sections).flat();
    if (!allSections.length) return null;

    // Extract all leaf nodes (actual pages) recursively
    return extractLeafNodes(allSections);
  }

  // Fallback to old flat structure (for backwards compatibility)
  const key = Object.keys(items).filter(item => route.path.includes(item));
  if (!Array.isArray(items[key])) return null;
  return items[key].map(item => item.children.filter(child => !child.planned));
});

// Finds the current item

const findCurrent = () => {
  if (!currentItems.value) return;

  prev.value = null;
  next.value = null;

  if (route.path.includes('/about/whats-new/posts/')) {
    prev.value = { link: '/about/whats-new/', text: 'Back to what\'s new' };
    return;
  }

  const parentIndex = currentItems.value.findIndex(item => item.find(child => child.link === route.path));
  if (parentIndex === -1) return;

  const filteredItems = currentItems.value[parentIndex];
  const childIndex = Object.values(filteredItems).findIndex(child => child.link === route.path);
  const isFirstItem = childIndex === 0;
  const isLastItem = childIndex === filteredItems.length - 1;
  const prevItems = currentItems.value[parentIndex - 1];
  const nextItems = currentItems.value[parentIndex + 1];

  prev.value = isFirstItem && prevItems ? prevItems[prevItems.length - 1] : filteredItems[childIndex - 1];
  next.value = isLastItem && nextItems ? nextItems[0] : filteredItems[childIndex + 1];
};
const openSearch = () => {
  docSearchBtn.value.children[0].click();
};

watch(
  () => route.path,
  () => {
    if (route.path === '/') return;
    findCurrent();
  },
  { immediate: true },
);

onMounted(() => {
  evaluateWindowWidth();
  window.addEventListener('resize', () => {
    evaluateWindowWidth();
  });

  observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'attributes') {
        mutation.target.classList.contains('DocSearch--active')
          ? disableRootScrolling()
          : enableRootScrolling();
      }
    }
  });

  observer.observe(document.body, { attributes: true });
});
</script>
