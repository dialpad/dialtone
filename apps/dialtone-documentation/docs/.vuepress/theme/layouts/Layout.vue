<template>
  <dt-stack class="d-ps-fixed d-all-0 d-of-hidden">
    <migration-banner />
    <doc-header
      v-if="viewport.pick({
        default: true,
        lg: false,
      })"
      :mobile-menu-open="isMobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
    />
    <DtBox
      v-if="isMobileMenuOpen && !viewport.above('lg')"
      id="sidebar-mobile"
      padding-inline="150"
      surface="secondary"
      scrollbar="always"
      min-block-size="0"
      class="d-fl1"
    >
      <sidebar />
    </DtBox>
    <DtBox
      v-else
      id="layout-body"
      padding-block-end="0"
      min-block-size="0"
      class="d-fl1"
    >
      <layout-body
        :prev="$frontmatter.prev || prev"
        :next="$frontmatter.next || next"
        :component-combinator-name="componentCombinatorName"
        :full-bleed="props.fullBleed"
      />
    </DtBox>
    <dt-box
      v-if="showBranchBadge"
      padding-block="25"
      padding-inline="75"
      border-width="100"
      position="fixed"
      max-inline-size="30"
      inset-block-end="100"
      inset-inline-end="100"
      z-index="notification"
      border-radius="300"
      shadow="card"
      surface="overlay"
    >
      <dt-stack :title="branchName" direction="row" gap="50">
        <dt-icon name="branch" class="d-fc-muted" :size="100" />
        <dt-text
          as="p"
          kind="body"
          size="100"
          tone="muted"
          class="d-c-default"
          :title="branchName"
          truncate
        >
          {{ branchName }}
        </dt-text>
      </dt-stack>
    </dt-box>
  </dt-stack>
</template>

<script setup>
// Default (dp-light) theme CSS — Vite bundles this into the main CSS asset so it's
// present before any JS runs. setBrand() injects <style id="dialtone-css-*"> tags
// that override these vars at runtime. Both persist across SPA navigation because
// neither is tracked by VuePress's head management system.
import '@dialpad/dialtone-tokens/tokens-base-light.css';
import '@dialpad/dialtone-tokens/tokens-dp-light.css';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import DocHeader from '../components/Header.vue';
import LayoutBody from '../components/LayoutBody.vue';
import Sidebar from '../components/Sidebar.vue';
import MigrationBanner from '../../baseComponents/MigrationBanner.vue';
import { getComponentCombinatorName } from '../utils/componentCombinator.js';
import { isExternalUrl } from '../utils/isExternalUrl';
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { usePageData } from 'vuepress/client';
import { DtStack } from '@dialpad/dialtone-vue';
import {
  PAGE_SCROLL_CONTAINER_SELECTOR,
  scrollRouteToTop,
  shouldScrollRouteToTop,
} from '../utils/pageToc.js';

const props = defineProps({
  fullBleed: {
    type: Boolean,
    default: false,
  },
});

const branchName = __DIALTONE_BRANCH_NAME__;
const showBranchBadge = branchName && (__VUEPRESS_DEV__ || __DIALTONE_DEPLOY_PREVIEW__);

const route = useRoute();
const prev = ref(null);
const next = ref(null);
const items = useThemeLocaleData().value.sidebar;
const pageData = usePageData();
const componentCombinatorName = computed(() => getComponentCombinatorName(pageData.value?.frontmatter));
const viewport = useViewportBreakpoints();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

/**
 * Recursively extract all navigable pages from a tree structure
 * Groups them by their parent category for pagination purposes
 * Includes both parent pages with children AND leaf nodes
 */
function extractLeafNodes(items) {
  const groups = [];

  function traverse(itemsList, currentGroup = []) {
    itemsList.forEach(item => {
      // Include this item if it has a link (it's a navigable page)
      if (item.link && !isExternalUrl(item.link)) {
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
    if (parentItem.link && !isExternalUrl(parentItem.link)) {
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

// Flatten the nav tree into per-section page groups for prev/next pagination.
const currentItems = computed(() => {
  if (!items.nav?.length) return null;
  return extractLeafNodes(items.nav);
});

// Finds the current item

const findCurrent = () => {
  if (!currentItems.value) return;

  prev.value = null;
  next.value = null;

  if (route.path.includes('/dialtone/whats-new/posts/')) {
    prev.value = { link: '/dialtone/whats-new/', text: 'Back to what\'s new' };
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

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;

    if (route.path === '/') return;
    findCurrent();
  },
  { immediate: true },
);

watch(
  () => ({ path: route.path, hash: route.hash }),
  async (to, from) => {
    if (!shouldScrollRouteToTop(to, from)) return;

    await nextTick();
    scrollRouteToTop(document.querySelector(PAGE_SCROLL_CONTAINER_SELECTOR));
  },
  { flush: 'post' },
);
</script>
