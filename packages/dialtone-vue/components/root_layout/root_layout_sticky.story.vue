<template>
  <dt-root-layout
    :header-class="$attrs.headerClass"
    :header-sticky="$attrs.headerSticky"
    :content-class="$attrs.contentClass"
    :sidebar-class="$attrs.sidebarClass"
    :sidebar-position="$attrs.sidebarPosition"
    :footer-class="$attrs.footerClass"
    :fixed="$attrs.fixed"
    :responsive-breakpoint="$attrs.responsiveBreakpoint"
  >
    <template
      #header
    >
      <span v-html="$attrs.header" />
    </template>
    <template
      #sidebar
    >
      <span v-html="$attrs.sidebar" />
    </template>
    <span v-html="defaultSlot" />
    <template
      #footer
    >
      <span v-html="$attrs.footer" />
    </template>
  </dt-root-layout>
</template>

<script>
import DtRootLayout from './root_layout.vue';

export default {
  name: 'DtRootLayoutSticky',
  components: { DtRootLayout },
};
</script>
