<template>
  <dt-stack class="d-ps-fixed d-all-0 d-of-hidden">
    <migration-banner />
    <DtBox padding="250" padding-block-end="0">
      <DtBox padding-block="100" padding="200" surface="secondary" border-radius="400">
        <dt-stack direction="row" justify="space-between" gap="400">
          <dt-stack direction="row" gap="200" align="end">
            <router-link
              class="d-td-none"
              title="Dialtone homepage"
              to="/"
            >
              <dt-stack direction="row" gap="200">
                <DtIllustration name="dialpad-logo" />
                <!-- <dialtone-logo /> -->
              </dt-stack>
            </router-link>
            <DtBox v-if="showBranchBadge" :title="branchName" padding-block-end="100">
              <dt-stack direction="row" gap="50">
                <dt-icon-branch class="d-fc-muted" :size="100" />
                <dt-text as="p" kind="body" size="100" tone="muted" class="d-wmx-250" truncate>
                  {{ branchName }}
                </dt-text>
              </dt-stack>
            </DtBox>
          </dt-stack>
          <navbar />
        </dt-stack>
      </DtBox>
    </DtBox>
    <DtBox
      padding-block-end="0"
      min-block-size="0"
      class="d-fl1"
    >
      <dt-stack direction="row" align="stretch" gap="150" class="d-h100p">
        <DtBox
          v-if="viewport.above('lg') && !$frontmatter.home && !$frontmatter.noSidebar"
          padding-block-end="400"
          padding-inline-start="250"
          padding-inline-end="200"
          min-inline-size="450"
          max-inline-size="450"
          block-size="100p"
          scrollbar="move"
        >
          <sidebar />
        </DtBox>
        <DtBox
          v-if="$frontmatter.home"
          inline-size="100p"
          padding-inline-end="250"
        >
          <home />
        </DtBox>
        <DtBox
          v-else
          min-inline-size="0"
          inline-size="100p"
          scrollbar="move"
          scrollbar-content-class="dialtone-doc-page-scroll-container"
          padding-inline-end="250"
          padding-block-end="400"
          :padding-inline-start="viewport.pick({
            default: '250',
            lg: false,
          })"
        >
          <page
            :prev="$frontmatter.prev || prev"
            :next="$frontmatter.next || next"
          />
        </DtBox>
        <DtBox
          v-if="componentCombinatorName && viewport.above('xxxl')"
          id="combinator-side-target"
          surface="secondary"
          min-inline-size="1200"
          inline-size="1200"
          padding-inline="300"
          padding-inline-start="0"
          block-size="100p"
          border-radius="400"
          class="d-fl1 d-my-300 d-mie-250"
        >
          <dt-text
            as="p"
            align="center"
            kind="headline"
            :size="500"
            class="d-mbs-800 d-o25"
          >
            (playground moves over here if enough room)
          </dt-text>
        </DtBox>
      </dt-stack>
    </DtBox>
  </dt-stack>
</template>

<script setup>
// Default (dp-light) theme CSS — Vite bundles this into the main CSS asset so it's
// present before any JS runs. setTheme() injects <style id="dialtone-css-*"> tags
// that override these vars at runtime. Both persist across SPA navigation because
// neither is tracked by VuePress's head management system.
import '@dialpad/dialtone-tokens/tokens-base-light.css';
import '@dialpad/dialtone-tokens/tokens-dp-light.css';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Home from '../components/Home.vue';
import Page from '../components/Page.vue';
import MigrationBanner from '../../baseComponents/MigrationBanner.vue';
import { getComponentCombinatorName } from '../utils/componentCombinator.js';
import { isExternalUrl } from '../utils/isExternalUrl';
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { usePageData } from 'vuepress/client';
import { DtStack, DtText } from '@dialpad/dialtone-vue';
import { DtIconBranch } from '@dialpad/dialtone-icons/vue';
import {
  PAGE_SCROLL_CONTAINER_SELECTOR,
  scrollRouteToTop,
  shouldScrollRouteToTop,
} from '../utils/pageToc.js';

const route = useRoute();
const prev = ref(null);
const next = ref(null);
const items = useThemeLocaleData().value.sidebar;
const pageData = usePageData();
const componentCombinatorName = computed(() => getComponentCombinatorName(pageData.value?.frontmatter));
const branchName = __DIALTONE_BRANCH_NAME__;
const showBranchBadge = branchName && (__VUEPRESS_DEV__ || __DIALTONE_DEPLOY_PREVIEW__);

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

const viewport = useViewportBreakpoints();

watch(
  () => route.path,
  () => {
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
