<template>
  <dt-stack
    v-if="viewport.above('lg')"
    direction="row"
    align="start"
    gap="0"
    class="d-w100p"
  >
    <dt-box
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
    <dt-box
      min-inline-size="0"
      inline-size="100p"
      class="d-fl1"
    >
      <content />
    </dt-box>
  </dt-stack>
  <template v-else>
    <dt-stack
      v-if="isMobileMenuOpen"
      class="d-ps-fixed d-all-0 d-of-hidden d-zi-navigation-fixed d-bgc-primary"
    >
      <doc-header
        :mobile-menu-open="isMobileMenuOpen"
        @toggle-mobile-menu="toggleMobileMenu"
      />
      <dt-box
        id="sidebar-mobile"
        padding-inline="300"
        surface="primary"
        scrollbar="always"
        min-block-size="0"
        class="d-fl1"
      >
        <sidebar />
      </dt-box>
    </dt-stack>
    <template v-else>
      <doc-header
        class="d-ps-sticky d-ibs-0 d-zi-navigation-fixed"
        :mobile-menu-open="isMobileMenuOpen"
        @toggle-mobile-menu="toggleMobileMenu"
      />
      <content />
    </template>
  </template>
</template>

<script setup>
// Keep the legacy default component token layers that Layout.vue currently supplies.
import '@dialpad/dialtone-tokens/tokens-base-light.css';
import '@dialpad/dialtone-tokens/tokens-dp-light.css';
import { DtStack } from '@dialpad/dialtone-vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Content } from 'vuepress/client';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import DocHeader from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';

const route = useRoute();
const viewport = useViewportBreakpoints();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  },
);
</script>
