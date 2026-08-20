<template>
  <dt-stack
    direction="row"
    align="stretch"
    gap="400"
    class="d-h100p"
  >
    <dt-box
      v-if="viewport.above('lg') && !$frontmatter.noSidebar"
      padding-block-end="250"
      padding-inline="200"
      min-inline-size="450"
      max-inline-size="450"
      block-size="100p"
      scrollbar="move"
      border-width-inline-end="100"
      border-color="subtle"
      class="dialtone-shell-sidebar"
    >
      <sidebar />
    </dt-box>
    <dt-box
      min-inline-size="0"
      inline-size="100p"
      scrollbar="move"
      scrollbar-content-class="dialtone-doc-page-scroll-container"
      :padding-inline-start="viewport.pick({
        default: '250',
        lg: false,
      })"
      :padding-inline-end="viewport.pick({
        default: '300',
        lg: '400',
        xl: '0',
      })"
      :padding-block-start="viewport.pick({
        lg: '0',
      })"
      padding-block-end="400"
    >
      <page
        :prev="props.prev"
        :next="props.next"
        :component-combinator-name="props.componentCombinatorName"
      />
    </dt-box>
    <dt-box
      v-if="props.componentCombinatorName"
      v-show="showWideCombinator"
      id="combinator-wide-target"
      min-inline-size="1200"
      inline-size="1200"
      block-size="100p"
      padding-block="300"
      class="d-mie-300"
    />
    <Teleport
      v-if="props.componentCombinatorName"
      defer
      :to="combinatorDockTarget"
    >
      <!-- eslint-disable-next-line vue/no-undef-components -->
      <component-combinator
        v-model:full-screen="isCombinatorFullScreen"
        :class="{
          'd-h100p': showWideCombinator,
          'd-hmx-900': !showWideCombinator && !isCombinatorFullScreen,
        }"
        :component-name="props.componentCombinatorName"
      />
    </Teleport>
  </dt-stack>
</template>

<script setup>
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import Sidebar from '../components/Sidebar.vue';
import Page from '../components/Page.vue';
import { computed, ref, watch } from 'vue';

const props = defineProps({
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
const isCombinatorFullScreen = ref(false);
const showWideCombinator = computed(() => viewport.above('xxxl'));
const combinatorDockTarget = computed(() => {
  return showWideCombinator.value ? '#combinator-wide-target' : '#combinator-inline-target';
});

watch(() => props.componentCombinatorName, () => {
  isCombinatorFullScreen.value = false;
});
</script>
