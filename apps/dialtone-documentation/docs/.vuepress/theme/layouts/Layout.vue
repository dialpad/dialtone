<template>
  <migration-banner />
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
          class="d-pis-100 d-td-none"
          title="Dialtone homepage"
          to="/"
        >
          <DtStack direction="row" gap="200">
            <DtIllustration name="dialpad-logo" />
            <DtBox v-if="showBranchBadge" padding-block-start="200" :title="branchName">
              <DtStack direction="row" gap="50">
                <dt-icon-branch class="d-fc-muted" :size="100" />
                <DtText as="p" kind="body" size="100" tone="muted" class="d-wmx-250" truncate>
                  {{ branchName }}
                </DtText>
              </DtStack>
            </DtBox>
          </DtStack>
        </router-link>
        <navbar
          @search="openSearch"
        />
        <mobile-sidebar
          v-if="isMobile && route.path !== '/'"
        />
      </div>
      <!-- eslint-disable-next-line vue/no-undef-components -->
      <div
        id="docsearch"
        ref="docSearchBtn"
        class="d-d-none"
        options=""
      />
    </template>
    <template
      v-if="!$frontmatter.home && !$frontmatter.noSidebar"
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
// Default (dp-light) theme CSS — Vite bundles this into the main CSS asset so it's
// present before any JS runs. setTheme() injects <style id="dialtone-css-*"> tags
// that override these vars at runtime. Both persist across SPA navigation because
// neither is tracked by VuePress's head management system.
import '@dialpad/dialtone-tokens/tokens-base-light.css';
import '@dialpad/dialtone-tokens/tokens-dp-light.css';
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Home from '../components/Home.vue';
import Page from '../components/Page.vue';
import MobileSidebar from '../components/MobileSidebar.vue';
import MigrationBanner from '../../baseComponents/MigrationBanner.vue';
import { isExternalUrl } from '../utils/isExternalUrl';
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { disableRootScrolling, enableRootScrolling } from '@dialpad/dialtone-vue';
import { DtIconBranch } from '@dialpad/dialtone-icons/vue';

const route = useRoute();
const prev = ref(null);
const next = ref(null);
const docSearchBtn = ref(null);
const items = useThemeLocaleData().value.sidebar;
const mobileBreakpoint = 980;
const branchName = __DIALTONE_BRANCH_NAME__;
const showBranchBadge = branchName && (__VUEPRESS_DEV__ || __DIALTONE_DEPLOY_PREVIEW__);
const evaluateWindowWidth = () => {
  isMobile.value = window.innerWidth <= mobileBreakpoint;
};
let observer = null;

const isMobile = ref(false);

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
const openSearch = () => {
  docSearchBtn.value?.children[0]?.click();
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
  window.addEventListener('resize', evaluateWindowWidth);

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

onUnmounted(() => {
  window.removeEventListener('resize', evaluateWindowWidth);
  observer?.disconnect();
});
</script>
