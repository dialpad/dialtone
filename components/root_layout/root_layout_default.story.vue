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
  >
    <template
      #header
    >
      <v-html
        v-if="$attrs.header"
        :html="$attrs.header"
      />
    </template>
    <template
      #sidebar
    >
      <v-html
        v-if="$attrs.sidebar"
        :html="$attrs.sidebar"
      />
    </template>
    <v-html
      v-if="$attrs.default"
      :html="defaultSlot"
    />
    <template
      #footer
    >
      <v-html
        v-if="$attrs.footer"
        :html="$attrs.footer"
      />
    </template>
  </dt-root-layout>
</template>

<script>
import DtRootLayout from './root_layout';
import VHtml from '@/common/v_html';

export default {
  name: 'DtRootLayoutDefault',
  components: { DtRootLayout, VHtml },
};
</script>
