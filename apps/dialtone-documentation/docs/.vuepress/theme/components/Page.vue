<template>
  <div
    class="d-d-grid d-jc-center"
    :class="gridClass"
  >
    <div class="d-p-600">
      <page-header />
      <article class="dialtone-content__article">
        <div
          v-if="$page.path.startsWith('/components') && !$frontmatter.no_preview"
          id="preview-header"
        >
          <h2 class="d-vi-visible-sr">
            Preview
          </h2>
        </div>
        <!-- eslint-disable-next-line vue/no-undef-components -->
        <content class="d-docsite-article" />
      </article>
      <dt-stack
        direction="row"
        :justify="prev ? 'between' : 'end'"
        align="center"
        class="d-pbs-400"
        as="nav"
        gap="400"
      >
        <dt-button
          v-if="prev"
          :to="prev.link"
          class="d-wmn40p"
          label-class="d-jc-space-between"
          importance="outlined"
          kind="muted"
          :size="400"
        >
          <template #startIcon>
            <dt-icon name="arrow-left" />
          </template>
          <dt-stack as="span" class="d-p-100">
            <dt-text as="span" kind="body" :size="300" tone="muted">
              Previous
            </dt-text>
            <span>{{ prev.text }}</span>
          </dt-stack>
        </dt-button>
        <dt-button
          v-if="next"
          :to="next.link"
          class="d-wmn40p"
          label-class="d-jc-space-between"
          importance="outlined"
          kind="muted"
          :size="400"
        >
          <template #endIcon>
            <dt-icon name="arrow-right" />
          </template>
          <dt-stack as="span" class="d-p-100">
            <dt-text as="span" kind="body" :size="300" tone="muted">
              Next
            </dt-text>
            <span>{{ next.text }}</span>
          </dt-stack>
        </dt-button>
      </dt-stack>
      <footer class="d-mbs-200 d-mbe-200">
        <dt-text as="p" kind="body" :size="200" tone="muted">
          <dt-text v-if="$frontmatter.title">
            {{ $frontmatter.title }}
          </dt-text>
          documentation last updated
          <dt-text>{{ lastUpdated }}</dt-text>
        </dt-text>
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

const route = useRoute();

const includeToc = computed(() => {
  return headers.value && headers.value.length > 0;
});

// Pages whose headers are populated by their own Vue component via inject('headers')
// rather than extracted from markdown — skip the default clobber for these routes.
const selfManagedHeaderPaths = ['/tokens/', '/downloads/'];

watch(route, () => {
  if (selfManagedHeaderPaths.some(p => route.path.includes(p))) return;

  try {
    headers.value = route.meta._pageChunk.data.headers;
  } catch( e ) {
    console.log('Error getting page headers', e)
  }
}, { flush: 'pre', immediate: true, deep: true })
</script>
