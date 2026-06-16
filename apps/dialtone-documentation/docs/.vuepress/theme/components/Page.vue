<template>
  <DtStack direction="row" align="start" gap="250">
    <DtBox
      class="d-fl1 d-mx-auto"
      min-inline-size="0"
      max-inline-size="1600"
    >
      <DtBox
        id="page-sticky-header"
        padding-block-start="250"
        surface="primary"
        :class="viewport.pick({
          default: false,
          lg: 'd-ps-sticky d-ibs-0 d-zi-navigation-fixed',
        })"
      >
        <DtBox border-width-block-end="100">
          <page-header>
            <template #content-top>
              <slot name="content-top" />
            </template>
          </page-header>
          <dt-tab-group
            v-if="$frontmatter.status"
            :size="viewport.pick({
              default: '200',
              md: '300',
            })"
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
              <dt-popover
                v-if="viewport.pick({
                  default: true,
                  xl: false,
                  xxxl: true,
                  xxxxl: false,
                })"
                placement="bottom-end"
                class="d-mis-auto"
                padding="small"
                content-class="d-w-300"
              >
                <template #anchor>
                  <dt-button
                    importance="outlined"
                    kind="muted"
                    :size="200"
                  >
                    On this page
                    <template #endIcon="{ iconSize }">
                      <dt-icon name="chevron-down" :size="iconSize" />
                    </template>
                  </dt-button>
                </template>
                <template #content>
                  <page-toc :headers="headers" always-expanded />
                </template>
              </dt-popover>
            </template>
          </dt-tab-group>
        </DtBox>
      </DtBox>
      <page-toc
        v-if="includeToc && viewport.pick({
          default: true,
          xl: false,
          xxxl: true,
          xxxxl: false,
        })"
        :headers="headers"
        scroll-spy-only
      />
      <DtBox id="vue-rwd-demo" hidden>
        <DtBox>
          Show this by default
        </DtBox>
        <DtBox v-if="viewport.above('xs')">
          Show this element above xs
        </DtBox>
        <DtBox v-if="viewport.above('sm')">
          Show this element above sm
        </DtBox>
        <DtBox v-if="viewport.above('md')">
          Show this element above md
        </DtBox>
        <DtBox v-if="viewport.above('lg')">
          Show this element above lg
        </DtBox>
        <DtBox v-if="viewport.above('xl')">
          Show this element above xl
        </DtBox>
        <DtBox v-if="viewport.above('xxl')">
          Show this element above xxl
        </DtBox>
        <DtBox v-if="viewport.above('xxxl')">
          Show this element above xxxl
        </DtBox>
        <DtBox
          surface="critical"
          :inline-size="viewport.pick({
            default: '100p',
            xs: '100',
            sm: '200',
            md: '300',
            lg: '400',
            xl: '500',
            xxl: '600',
            xxxl: '700',
          })"
        >
          Change inline-size with viewport.pick().
        </DtBox>
      </DtBox>
      <DtBox padding-block-start="250">
        <!-- eslint-disable-next-line vue/no-undef-components -->
        <component-combinator
          v-if="componentCombinatorName && !viewport.above('xxxl')"
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
      v-if="includeToc && viewport.pick({
        default: false,
        xl: true,
        xxxl: false,
        xxxxl: true,
      })"
      max-inline-size="300"
      min-inline-size="300"
      padding-block-start="200"
      class="d-ps-sticky d-ibs-450"
    >
      <dt-text
        as="h2"
        kind="headline"
        :size="100"
        strength="semibold"
        tone="secondary"
        class="d-tt-uppercase d-px-100 d-pbe-50 "
      >
        On this page
      </dt-text>
      <page-toc :headers="headers" />
    </DtBox>
  </DtStack>
</template>

<script setup>
import PageHeader from '../components/PageHeader.vue';
import PageToc from '../components/PageToc.vue';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
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
const viewport = useViewportBreakpoints();

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
