<template>
  <dt-root-layout
    :body-class="$attrs.bodyClass"
    :header-class="$attrs.headerClass"
    :header-sticky="$attrs.headerSticky"
    :header-height="$attrs.headerHeight"
    :content-class="$attrs.contentClass"
    :content-wrap-width-percent="$attrs.contentWrapWidthPercent"
    :sidebar-class="$attrs.sidebarClass"
    :sidebar-position="$attrs.sidebarPosition"
    :sidebar-width="$attrs.sidebarWidth"
    :footer-class="$attrs.footerClass"
    :footer-height="$attrs.footerHeight"
    :fixed="$attrs.fixed"
  >
    <template
      v-if="$attrs.header"
      #header
    >
      <span v-html="$attrs.header" />
    </template>
    <template
      v-if="$attrs.sidebar"
      #sidebar
    >
      <span v-html="$attrs.sidebar" />
    </template>
    <template v-if="defaultSlot">
      <div v-html="defaultSlot" />
    </template>
    <template
      v-if="$attrs.footer"
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
