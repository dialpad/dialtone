<template>
  <dt-root-layout
    :fixed="false"
    :header-sticky="true"
    header-class="d-ol-none"
    sidebar-class="dialtone-sidebar lg:d-d-none d-ol-none"
    footer-class="d-text-right d-ol-none"
    content-class="d-ol-none"
  >
    <template #header>
      <div class="dialtone-header">
        <dialtone-logo />
        <navbar
          v-if="!isMobile"
          :items="navbarLinks"
          @search="openSearch"
        />
        <mobile-navbar
          v-else
          :items="navbarLinks"
          @search="openSearch"
        />
        <mobile-sidebar
          v-if="isMobile && route.path !== '/'"
        />
        <!-- eslint-disable-next-line vue/no-undef-components -->
        <docsearch
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
import MobileNavbar from '../components/MobileNavbar.vue';
import MobileSidebar from '../components/MobileSidebar.vue';
import { computed, ref, watch, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import DialtoneLogo from '../components/DialtoneLogo.vue';
import { disableRootScrolling, enableRootScrolling } from '@workspaceRoot/common/utils';

const route = useRoute();

const navbarLinks = useThemeLocaleData().value.navbar || [];
const prev = ref(null);
const next = ref(null);
const docSearchBtn = ref(null);
const items = useThemeLocaleData().value.sidebar;
const mobileBreakpoint = 980;
const evaluateWindowWidth = () => {
  isMobile.value = window.innerWidth <= mobileBreakpoint;
};

const isMobile = ref(false);

// Remove "planned" items to avoid errors
const currentItems = computed(() => {
  const key = Object.keys(items).filter(item => route.path.includes(item));
  if (!Array.isArray(items[key])) return null;
  return items[key].map(item => item.children.filter(child => !child.planned));
});

// Finds the current item
// eslint-disable-next-line complexity
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
const openSearch = async () => {
  docSearchBtn.value.children[0].click();
  await nextTick();
  disableRootScrolling();
  document.querySelector('.DocSearch-Container').addEventListener('focusout', (event) => {
    if (event.relatedTarget === null) {
      enableRootScrolling();
    }
  });
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
});
</script>
