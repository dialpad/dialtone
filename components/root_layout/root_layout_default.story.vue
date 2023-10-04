<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <dt-root-layout
    :body-class="bodyClass"
    :header-class="headerClass"
    :header-sticky="headerSticky"
    :header-height="headerHeight"
    :content-class="contentClass"
    :sidebar-class="sidebarClass"
    :sidebar-position="sidebarPosition"
    :sidebar-width="sidebarWidth"
    :footer-class="footerClass"
    :footer-height="footerHeight"
    :fixed="fixed"
    :responsive-breakpoint="responsiveBreakpoint"
  >
    <template
      #header
    >
      <span v-html="header" />
    </template>
    <template
      #sidebar
    >
      <span v-html="sidebar" />
    </template>
    <span v-html="defaultSlot" />
    <template
      #footer
    >
      <span v-html="footer" />
    </template>
  </dt-root-layout>
</template>

<script>
import DtRootLayout from './root_layout.vue';

export default {
  name: 'DtRootLayoutDefault',
  components: { DtRootLayout },
};
</script>
