<template>
  <div class="mobile-sidebar">
    <div
      class="
        d-px16
        d-ps-fixed d-w100p d-bgc-primary d-h64 d-x0
        lg:d-d-flex d-bb d-bc-black-100 d-ai-center
        d-jc-space-between d-t64 d-d-none
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
    </div>
    <div
      :class="{ 'd-o0 d-d-none': !isSiteNavOpen }"
      class="
        mobile-header-drop-down-navigation d-ps-fixed d-l0 d-w100p
        d-bgc-primary d-of-auto d-d-flex
        d-fd-column d-ai-baseline d-pt24 d-pr16 d-pl64
      "
    >
      <sidebar-item
        v-for="item in sidebarItems"
        :key="item.link || item.text"
        :item="item"
        @click="toggleSiteNav"
      />
    </div>
  </div>
</template>

<script setup>
import SidebarItem from '../components/SidebarItem.vue';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const items = useThemeLocaleData().value.sidebar;
const sidebarItems = computed(() => {
  const key = Object.keys(items).filter(item => route.path.includes(item));
  return items[key] || [];
});

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
