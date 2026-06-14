<template>
  <DtStack direction="row" align="start" gap="250" class="d-100p">
    <DtBox
      class="d-fl1 d-mx-auto"
      min-inline-size="0"
      max-inline-size="1600"
    >
      <DtBox
        id="page-sticky-header"
        padding-block-start="250"
        surface="primary"
        class="d-ps-sticky d-ibs-0 d-zi-navigation-fixed"
      >
        <DtBox border-width-block-end="100">
          <page-header />
          <dt-tab-group
            v-if="$frontmatter.status"
            selected="panel-1"
            borderless
          >
            <template #tabs>
              <dt-tab id="tab-1" panel-id="panel-1" selected>
                <template #startIcon="{ iconSize }">
                  <dt-icon name="file" :size="iconSize" />
                </template>
                Documentation
              </dt-tab>
              <dt-tab id="tab-2" panel-id="panel-2">
                <template #startIcon="{ iconSize }">
                  <dt-icon name="code" :size="iconSize" />
                </template>
                Properties
              </dt-tab>
            </template>
          </dt-tab-group>
        </DtBox>
      </DtBox>
      <DtBox id="vue-rwd-demo" outline>
        <DtBox>
          Show this by default
        </DtBox>
        <DtBox>Show this element at xs</DtBox>
        <DtBox>Show this element at sm</DtBox>
        <DtBox>Show this element at md</DtBox>
        <DtBox>Show this element at lg</DtBox>
        <DtBox>Show this element at xl</DtBox>
        <DtBox>Show this element at 2xl</DtBox>
        <DtBox>Show this element at 3xl</DtBox>

        <DtBox
          surface="critical"
          inline-size="100p"
        >
          Change `inline-size` prop of below like so...
          xs = `100`
          sm = `200`
          md = `300`
          lg = `400`
          xl = `500`
          2xl = `600`
          3xl = `700`
        </DtBox>
      </DtBox>
      <DtBox padding-block-start="250">
        <!-- eslint-disable-next-line vue/no-undef-components -->
        <component-combinator
          v-if="componentCombinatorName"
          :component-name="componentCombinatorName"
        />
      </DtBox>
      <!-- eslint-disable-next-line vue/no-undef-components -->
      <content class="d-docsite-article" />
      <DtStack gap="300">
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
        <DtBox>
          <dt-text as="p" kind="body" :size="300" tone="muted">
            <dt-text v-if="$frontmatter.title">
              {{ $frontmatter.title }}
            </dt-text>
            documentation last updated
            <dt-text>{{ lastUpdated }}</dt-text>
          </dt-text>
        </DtBox>
      </DtStack>
    </DtBox>
    <DtBox
      v-if="!isMobile && includeToc"
      max-inline-size="300"
      min-inline-size="300"
      padding-block-start="200"
      class="d-ps-sticky d-ibs-450 d-d-none xl:d-d-block"
    >
      <page-toc :headers="headers" />
    </DtBox>
    <!--
    <DtBox
      id="combinator-side-target"
      surface="moderate"
      padding-block-start="250"
      block-size="800"
      class="d-fl1 d-ps-sticky d-ibs-0"
    >
      asdf
    </DtBox>
    -->
  </DtStack>
</template>

<script setup>
import PageHeader from '../components/PageHeader.vue';
import PageToc from '../components/PageToc.vue';
import { getComponentCombinatorName } from '../utils/componentCombinator.js';
import { computed, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import { usePageData } from 'vuepress/client';

defineProps({
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
const componentCombinatorName = computed(() => getComponentCombinatorName(pageData.value?.frontmatter));
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
