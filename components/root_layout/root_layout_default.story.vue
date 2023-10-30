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
      <html-fragment
        :html="header"
      />
    </template>
    <template
      #sidebar
    >
      <html-fragment
        :html="sidebar"
      />
    </template>
    <html-fragment
      :html="defaultSlot"
    />
    <template
      #footer
    >
      <html-fragment
        :html="footer"
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
