<template>
  <page-header />
  <DtStack direction="row" align="start" gap="250">
    <DtBox class="d-fl1 " min-inline-size="0">
      <!-- eslint-disable-next-line vue/no-undef-components -->
      <content class="d-docsite-article" />
      <DtStack
        as="nav"
        direction="row"
        :justify="prev ? 'between' : 'end'"
        align="center"
        class="d-pbs-400"
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
      </DtStack>
    </DtBox>
    <DtBox
      v-if="!isMobile && includeToc"
      max-inline-size="400"
      min-inline-size="400"
      class="d-ps-sticky d-ibs-450"
    >
      <page-toc :headers="headers" />
    </DtBox>
  </DtStack>
  <DtBox padding-block="400">
    <dt-text as="p" kind="body" :size="300" tone="muted">
      <dt-text v-if="$frontmatter.title">
        {{ $frontmatter.title }}
      </dt-text>
      documentation last updated
      <dt-text>{{ lastUpdated }}</dt-text>
    </dt-text>
  </DtBox>
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
