<!-- eslint-disable vue/no-static-inline-styles -->
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
      <html-fragment
        :html="$attrs.header"
      />
    </template>
    <template
      #sidebar
    >
      <html-fragment
        :html="$attrs.sidebar"
      />
    </template>
    <html-fragment
      :html="$attrs.default"
    />
    <template
      #footer
    >
      <html-fragment
        :html="$attrs.footer"
      />
    </template>
  </dt-root-layout>
</template>

<script>
import DtRootLayout from './root_layout.vue';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'DtRootLayoutDefault',
  components: { DtRootLayout, htmlFragment },
};
</script>
