<template>
  <div
    class="d-d-grid d-jc-center"
    :class="gridClass"
  >
    <div class="d-p24 d-pt96 lg:d-pt16">
      <page-header />
      <!-- eslint-disable-next-line vue/no-undef-components -->
      <content />
      <dt-stack
        direction="row"
        :class="prev ? 'd-jc-space-between' : 'd-jc-flex-end'"
        class="d-pt32 d-ai-center"
        as="nav"
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
      </dt-stack>
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
import { computed, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import { usePageData } from 'vuepress/client';
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
const pageData = usePageData();
const lastUpdated = computed(() => {
  const updatedTime = pageData.value?.git?.updatedTime;
  if (!updatedTime) return 'Not available';

  const date = new Date(updatedTime);
  if (Number.isNaN(date.valueOf())) return 'Not available';

  return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);
});
const gridClass = computed(() => {
  if (props.isMobile || !includeToc.value) return 'd-gl-docsite';
  return 'd-gl-docsite-toc';
});
const { headers } = inject('headers');

const items = useThemeLocaleData().value.sidebar;
const route = useRoute();
const includeToc = computed(() => {
  // get the item that matches the current route from site-nav without cosidering the last '/'
  const key = Object.keys(items).filter(item => route.path.includes(item.replace(/\/$/, '')));
  if (!items[key] || !Array.isArray(items[key])) return false;

  return headers.value && headers.value.length > 0;
});

watch(route, () => {
  // Tokens page headers are handled in AllTokens.vue
  if (route.path.includes('/tokens/')) return;

  try {
    headers.value = route.meta._pageChunk.data.headers;
  } catch( e ) {
    console.log('Error getting page headers', e)
  }
}, { flush: 'pre', immediate: true, deep: true })
</script>
