<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <dt-root-layout
    :header-class="headerClass"
    :header-sticky="headerSticky"
    :content-class="contentClass"
    :sidebar-class="sidebarClass"
    :sidebar-position="sidebarPosition"
    :footer-class="footerClass"
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
