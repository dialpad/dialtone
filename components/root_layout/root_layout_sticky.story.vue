<template>
  <div
    class="d-h332 d-of-scroll"
    tabindex="0"
  >
    <dt-root-layout
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
        <div
          class="d-h512"
          v-html="defaultSlot"
        />
      </template>
      <template
        v-if="footer"
        #footer
      >
        <span v-html="footer" />
      </template>
    </dt-root-layout>
  </div>
</template>

<script>
import DtRootLayout from './root_layout';

export default {
  name: 'DtRootLayoutSticky',
  components: { DtRootLayout },
};
</script>
