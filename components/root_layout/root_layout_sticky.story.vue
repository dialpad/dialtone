<template>
  <div
    class="d-h332 d-of-scroll"
    tabindex="0"
  >
    <dt-root-layout
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
    >
      <template
        v-if="$attrs.header"
        #header
      >
        <v-html :html="$attrs.header" />
      </template>
      <template
        v-if="$attrs.sidebar"
        #sidebar
      >
        <v-html :html="$attrs.sidebar" />
      </template>
      <template v-if="defaultSlot">
        <div
          class="d-h512"
          v-html="defaultSlot"
        />
      </template>
      <template
        v-if="$attrs.footer"
        #footer
      >
        <v-html :html="$attrs.footer" />
      </template>
    </dt-root-layout>
  </div>
</template>

<script>
import DtRootLayout from './root_layout';
import VHtml from '@/common/v_html';

export default {
  name: 'DtRootLayoutSticky',
  components: { DtRootLayout, VHtml },
};
</script>
