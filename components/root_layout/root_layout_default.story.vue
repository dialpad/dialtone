<template>
  <dt-root-layout
    :body-class="bodyClass"
    :header-class="headerClass"
    :header-sticky="headerSticky"
    :header-height="headerHeight"
    :content-class="contentClass"
    :content-wrap-width-percent="contentWrapWidthPercent"
    :sidebar-class="sidebarClass"
    :sidebar-position="sidebarPosition"
    :sidebar-width="sidebarWidth"
    :footer-class="footerClass"
    :footer-height="footerHeight"
    :fixed="fixed"
  >
    <template
      v-if="header"
      #header
    >
      <span v-html="header" />
    </template>
    <template
      v-if="sidebar"
      #sidebar
    >
      <span v-html="sidebar" />
    </template>
    <template v-if="defaultSlot">
      <span v-html="defaultSlot" />
    </template>
    <template
      v-if="footer"
      #footer
    >
      <span v-html="footer" />
    </template>
  </dt-root-layout>
</template>

<script>
import DtRootLayout from './root_layout';

export default {
  name: 'DtRootLayoutDefault',
  components: { DtRootLayout },
};
</script>
