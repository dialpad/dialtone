<template>
  <div class="mobile-sidebar">
    <dt-stack
      direction="row"
      align="center"
      justify="between"
      class="
        d-px16
        d-ps-fixed
        d-w100p
        d-bgc-secondary
        d-h64
        d-x0
        d-bb
        d-bc-default
        d-t64
        lg:d-d-none
      "
    >
      <dt-breadcrumbs :breadcrumbs="breadcrumbs" />
      <dt-button
        importance="clear"
        :circle="true"
        @click="toggleSiteNav"
      >
        <template #icon>
          <dt-icon
            name="chevron-down"
          />
        </template>
      </dt-button>
    </dt-stack>
    <dt-stack
      align="baseline"
      class="
        mobile-header-drop-down-navigation
        d-ps-fixed
        d-l0
        d-w100p
        d-bgc-primary
        d-of-auto
        d-pt24
        d-px16
      "
      :class="{ 'd-o0 d-d-none': !isSiteNavOpen }"
    >
      <sidebar-item
        v-for="item in sidebarItems"
        :key="item.link || item.text"
        :item="item"
        :is-single-page="item.isSinglePage"
        @click="toggleSiteNav"
      />
    </dt-stack>
  </div>
</template>

<script setup>
import SidebarItem from './SidebarItem.vue';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSidebarItems } from '../composables/useSidebarItems';

const route = useRoute();
const items = useThemeLocaleData().value.sidebar;
const sidebarItems = useSidebarItems(items);

const isSiteNavOpen = ref(false);

const breadcrumbs = computed(() => {
  return route.path
    .replaceAll('-', ' ')
    .replace('.html', '')
    .split('/')
    .filter(v => v.trim())
    .map(v => ({ label: v[0].toUpperCase() + v.slice(1) }));
});

function toggleSiteNav () {
  isSiteNavOpen.value = !isSiteNavOpen.value;
  document.body.classList.toggle('d-of-hidden', !!isSiteNavOpen.value);
}
</script>

<style lang="less">
.mobile-sidebar {
  .breadcrumb-arrow {
    transform: rotate(-90deg);

    svg {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      transform: translate(-50%, -50%);
      inline-size: 1.5rem;
      block-size: 1.5rem;
    }

    &--top {
      transform: rotate(90deg);
    }
  }

  .d-breadcrumbs .d-breadcrumbs__item:not(:last-of-type):before {
    inset-inline-end: -1rem;
    margin-block-start: 0;
  }

  .mobile-header-drop-down-navigation {
    inset-block-start: var(--dt-space-800);
    block-size: 100%;
    padding-block-end: 15.2rem;

    ul {
      list-style-type: none;
    }
  }
}
</style>
