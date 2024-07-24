<template>
  <div
    class="d-d-grid d-jc-center"
    :class="gridClass"
  >
    <div class="d-p24 lg:d-pr24 lg:d-pt64">
      <page-header />
      <content />
      <nav
        :class="prev ? 'd-jc-space-between' : 'd-jc-flex-end'"
        class="page-nav d-h64 d-d-flex d-ai-center"
      >
        <router-link
          v-if="prev"
          v-slot="{ navigate }"
          :to="prev.link"
          custom
        >
          <dt-button
            importance="clear"
            size="lg"
            @click="navigate"
          >
            <template #icon>
              <dt-icon name="arrow-left" />
            </template>
            {{ prev.text }}
          </dt-button>
        </router-link>
        <router-link
          v-if="next"
          v-slot="{ navigate }"
          :to="next.link"
          custom
        >
          <dt-button
            icon-position="right"
            importance="clear"
            size="lg"
            @click="navigate"
          >
            <template #icon>
              <dt-icon name="arrow-right" />
            </template>
            {{ next.text }}
          </dt-button>
        </router-link>
      </nav>
      <footer class="d-mt16 d-mb16 d-body--sm d-fc-tertiary">
        <span
          v-if="$frontmatter.title"
          v-text="$frontmatter.title"
        />
        documentation last updated {{ lastUpdated }}
      </footer>
    </div>
    <div class="d-ps-relative d-ga-toc">
      <page-toc v-if="!isMobile && includeToc" :headers="headers" />
    </div>
  </div>
</template>

<script setup>
import PageHeader from '../components/PageHeader.vue';
import PageToc from '../components/PageToc.vue';
import { computed, watch, ref, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { usePageData } from '@vuepress/client';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';

const props = defineProps({
  prev: {
    type: Object,
    default: () => {
    },
  },
  next: {
    type: Object,
    default: () => {
    },
  },
  isMobile: {
    type: Boolean,
    required: true,
  },
});

const headers = ref(null);

const lastUpdated = computed(() => {
  const date = new Date(usePageData().value.git.updatedTime);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);
});
const gridClass = computed(() => {
  if (props.isMobile || !includeToc.value) return 'd-gl-docsite';
  return 'd-gl-docsite-toc';
});

const items = useThemeLocaleData().value.sidebar;
const route = useRoute();
const includeToc = computed(() => {
  // get the item that matches the current route from site-nav without cosidering the last '/'
  const key = Object.keys(items).filter(item => route.path.includes(item.replace(/\/$/, '')));
  if (!items[key] || !Array.isArray(items[key])) return false;
  return headers.value && headers.value.length > 0;
});

watch(route, async () => {
  await nextTick();
  const filteredHeaders = JSON.parse(localStorage.getItem('filteredHeaders'));
  const pageHeaders = usePageData().value.headers;
  headers.value = filteredHeaders ?? pageHeaders;
}, { flush: 'pre', immediate: true, deep: true });
</script>
