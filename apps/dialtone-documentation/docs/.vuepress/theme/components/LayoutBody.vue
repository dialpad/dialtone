<template>
  <dt-stack direction="row" align="stretch" gap="150" class="d-h100p">
    <DtBox
      v-if="viewport.above('lg') && !$frontmatter.home && !$frontmatter.noSidebar"
      padding-block-end="400"
      :padding-inline-start="300"
      :padding-inline-end="200"
      min-inline-size="450"
      max-inline-size="450"
      block-size="100p"
      scrollbar="move"
    >
      <sidebar />
    </DtBox>
    <DtBox
      v-if="$frontmatter.home"
      inline-size="100p"
      padding-inline-end="250"
    >
      <home />
    </DtBox>
    <DtBox
      v-else
      min-inline-size="0"
      inline-size="100p"
      scrollbar="move"
      scrollbar-content-class="dialtone-doc-page-scroll-container"
      :padding-inline-end="viewport.pick({
        default: '250',
        lg: '300',
      })"
      padding-block-end="400"
      :padding-inline-start="viewport.pick({
        default: '250',
        lg: false,
      })"
    >
      <page
        :prev="prev"
        :next="next"
      />
    </DtBox>
    <DtBox
      v-if="componentCombinatorName && viewport.above('xxxl')"
      min-inline-size="1200"
      inline-size="1200"
      block-size="100p"
      padding-block="300"
      class="d-mie-300"
    >
      <!-- eslint-disable-next-line vue/no-undef-components -->
      <component-combinator
        class="d-h100p"
        :component-name="componentCombinatorName"
      />
    </DtBox>
  </dt-stack>
</template>

<script setup>
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import Sidebar from '../components/Sidebar.vue';
import Home from '../components/Home.vue';
import Page from '../components/Page.vue';

defineProps({
  prev: {
    type: Object,
    default: null,
  },
  next: {
    type: Object,
    default: null,
  },
  componentCombinatorName: {
    type: String,
    default: null,
  },
});

const viewport = useViewportBreakpoints();
</script>
