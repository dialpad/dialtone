<template>
  <!--
    Chrome switches on the viewport; `<content />` does not. The page sits outside every
    breakpoint and drawer branch so it mounts once per navigation. It previously lived in
    two `v-if` arms, which meant a desktop load built the page, threw it away, and rebuilt
    it once the breakpoint resolved — and opening the mobile drawer unmounted it outright.
  -->
  <dt-stack
    :direction="viewport.atLeast('lg') ? 'row' : 'column'"
    :align="viewport.atLeast('lg') ? 'start' : 'stretch'"
    :inert="isMobileDrawerOpen"
    gap="0"
    class="d-w100p"
  >
    <dt-box
      v-if="viewport.atLeast('lg')"
      padding-block-end="250"
      padding-inline="75"
      min-inline-size="450"
      max-inline-size="450"
      border-width-inline-end="100"
      border-color="subtle"
      class="dialtone-shell-sidebar d-ps-sticky d-ibs-0 d-h100vh"
    >
      <sidebar />
    </dt-box>
    <doc-header
      v-else
      class="d-ps-sticky d-ibs-0 d-zi-navigation-fixed"
      :mobile-menu-open="isMobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
    />
    <dt-box
      min-inline-size="0"
      inline-size="100p"
      class="d-fl1"
    >
      <content />
    </dt-box>
  </dt-stack>
  <!--
    Fixed and opaque, so it covers the page rather than replacing it in the tree. It
    carries its own header because it hides the one above.
  -->
  <dt-stack
    v-if="isMobileDrawerOpen"
    role="dialog"
    aria-modal="true"
    aria-label="Site navigation"
    class="d-ps-fixed d-all-0 d-of-hidden d-zi-navigation-fixed d-bgc-primary"
    @keydown="handleMobileDrawerKeydown"
  >
    <doc-header
      ref="mobileDrawerHeader"
      :mobile-menu-open="isMobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
    />
    <dt-box
      id="sidebar-mobile"
      padding-inline="50"
      surface="primary"
      scrollbar="always"
      min-block-size="0"
      class="d-fl1"
    >
      <sidebar />
    </dt-box>
  </dt-stack>
</template>

<script setup>
// Keep the legacy default component token layers that Layout.vue currently supplies.
import '@dialpad/dialtone-tokens/tokens-base-light.css';
import '@dialpad/dialtone-tokens/tokens-dp-light.css';
import { DtStack } from '@dialpad/dialtone-vue';
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Content } from 'vuepress/client';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import DocHeader from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';

const route = useRoute();
const viewport = useViewportBreakpoints();
const isMobileMenuOpen = ref(false);
const mobileDrawerHeader = ref(null);
let mobileMenuTrigger = null;

// Gates the drawer's own mount, so the narrow shell's sidebar is never instantiated
// alongside the desktop rail's copy.
const isMobileDrawerOpen = computed(() => isMobileMenuOpen.value && !viewport.atLeast('lg'));

const toggleMobileMenu = () => {
  if (!isMobileDrawerOpen.value && typeof document !== 'undefined') {
    mobileMenuTrigger = document.activeElement;
  }

  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const handleMobileDrawerKeydown = (event) => {
  if (event.key !== 'Escape' || event.defaultPrevented) return;

  event.preventDefault();
  isMobileMenuOpen.value = false;
};

watch(isMobileDrawerOpen, async (isOpen, wasOpen) => {
  await nextTick();

  if (isOpen) {
    mobileDrawerHeader.value?.focusMobileMenuButton();
    return;
  }

  if (wasOpen && mobileMenuTrigger?.isConnected) {
    mobileMenuTrigger.focus({ preventScroll: true });
  }
  mobileMenuTrigger = null;
});

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  },
);
</script>
