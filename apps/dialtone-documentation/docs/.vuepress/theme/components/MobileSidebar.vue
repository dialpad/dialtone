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
      data-migrate-outline
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
      data-migrate-outline
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
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1.5rem;
      height: 1.5rem;
    }

    &--top {
      transform: rotate(90deg);
    }
  }

  .d-breadcrumbs .d-breadcrumbs__item:not(:last-of-type):before {
    right: -1rem;
    margin-top: 0;
  }

  .mobile-header-drop-down-navigation {
    top: var(--dt-space-800);
    height: 100%;
    padding-bottom: 15.2rem;

    ul {
      list-style-type: none;
    }
  }
}
</style>
