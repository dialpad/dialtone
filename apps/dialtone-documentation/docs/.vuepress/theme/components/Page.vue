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
      <footer
        v-if="lastUpdated"
        class="d-mt16 d-mb16 d-body--sm d-fc-tertiary"
      >
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
const lastUpdated = computed(() => {
  const updatedTime = usePageData().value.git?.updatedTime;
  if (!updatedTime) return null;
  const date = new Date(updatedTime);
  if (isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);
});
const gridClass = computed(() => {
  if (props.isMobile || !includeToc.value) return 'd-gl-docsite';
  return 'd-gl-docsite-toc';
});
const { headers } = inject('headers');

const items = useThemeLocaleData().value.sidebar;
const route = useRoute();

/**
 * Determine which top-level group the current route belongs to
 * @param {string} path Current route path
 * @returns {string} The top-level group key
 */
function detectTopLevelGroup(path) {
  // Map routes to top-level groups
  const designSystemPaths = ['/design/', '/components/', '/utilities/', '/tokens/', '/guides/', '/about/'];

  if (designSystemPaths.some(p => path.includes(p))) {
    return 'dialtone';
  }
  if (path.includes('/foundations/')) {
    return 'foundations';
  }
  if (path.includes('/careers/')) {
    return 'careers';
  }
  if (path.includes('/articles/')) {
    return 'articles';
  }
  if (path.includes('/dialtone/')) {
    return 'dialtone';
  }

  // Default to dialtone for any unknown paths
  return 'dialtone';
}

const includeToc = computed(() => {
  // Check if using new top-level groups structure
  if (items.topLevelGroups) {
    const topLevelGroup = detectTopLevelGroup(route.path);
    const sections = items.topLevelGroups[topLevelGroup]?.sections || {};

    // For dialtone group, check if any section has content
    if (topLevelGroup === 'dialtone') {
      const hasContent = Object.values(sections).some(section => section && section.length > 0);
      if (!hasContent) return false;
    } else {
      // For other groups, check if specific section exists
      const sectionKey = Object.keys(sections).find(key =>
        route.path.includes(key.replace(/\/$/, '')),
      );
      if (!sections[sectionKey]) return false;
    }
  } else {
    // Fallback to old flat structure (for backwards compatibility)
    const key = Object.keys(items).filter(item => route.path.includes(item.replace(/\/$/, '')));
    if (!items[key] || !Array.isArray(items[key])) return false;
  }

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
