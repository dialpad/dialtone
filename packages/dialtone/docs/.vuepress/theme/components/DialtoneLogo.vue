<template>
  <router-link
    class="d-btn h:d-bgc-transparent d-py6 d-w216 d-jc-flex-start"
    title="Go back to the homepage"
    to="/"
  >
    <img
      class="d-h42"
      :alt="brandLogoAlt"
      :src="brandLogo"
    >
  </router-link>
</template>

<script setup>
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { useSiteLocaleData } from '@vuepress/client';

const brandLogo = useThemeLocaleData().value.logo;
const brandLogoAlt = useSiteLocaleData().value.title;
</script>
