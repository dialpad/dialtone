<!-- eslint-disable vue/no-static-inline-styles -->
<template>
  <dt-root-layout
    :body-class="$attrs.bodyClass"
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
      <v-html
        :html="$attrs.header"
      />
    </template>
    <template
      #sidebar
    >
      <v-html
        :html="$attrs.sidebar"
      />
    </template>
    <v-html
      :html="$attrs.default"
    />
    <template
      #footer
    >
      <v-html
        :html="$attrs.footer"
      />
    </template>
  </dt-root-layout>
</template>

<script>
import DtRootLayout from './root_layout.vue';
import VHtml from '@/common/v_html';

export default {
  name: 'DtRootLayoutDefault',
  components: { DtRootLayout, VHtml },
};
</script>
