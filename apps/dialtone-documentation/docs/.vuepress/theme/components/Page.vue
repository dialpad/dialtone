<template>
  <div
    class="d-d-grid d-jc-center"
    :class="gridClass"
  >
    <div class="d-p24 lg:d-pr24 lg:d-pt64">
      <page-header>
        <template #content-bottom>
          <page-toc v-if="isMobile && includeToc" />
        </template>
      </page-header>
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
      <footer class="d-mt16 d-mb16 d-body-small d-fc-secondary">
        <span
          v-if="$frontmatter.title"
          v-text="$frontmatter.title"
        />
        documentation last updated {{ lastUpdated }}
      </footer>
    </div>
    <div class="d-ps-relative d-ga-toc">
      <page-toc v-if="!isMobile && includeToc" />
    </div>
  </div>
</template>

<script setup>
import PageHeader from '../components/PageHeader.vue';
import PageToc from '../components/PageToc.vue';
import { computed } from 'vue';
import { usePageData } from '@vuepress/client';

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
  const date = new Date(usePageData().value.git.updatedTime);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);
});
const gridClass = computed(() => {
  if (props.isMobile || !includeToc.value) return 'd-gl-docsite';
  return 'd-gl-docsite-toc';
});
const includeToc = computed(() => {
  const headers = usePageData().value.headers;
  return headers?.length > 0;
});
</script>
