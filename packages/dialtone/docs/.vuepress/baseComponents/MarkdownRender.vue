<template>
  <span v-html="markdownToHtml" />
</template>

<script setup>
/**
 * Use this component to render markdown content in a Vue SFC.
 * Use only for complex cases where the built-in markdown renderer in MD files is not enough
 * or you need a reusable component with props.
 * There's a POC to include md files in another md page,
 * see https://github.com/dialpad/dialtone/commit/8498ffaf89f2b305be33689b6b0ae34724ff0878
 */

import { computed } from 'vue';
import markdownIt from 'markdown-it';

const props = defineProps({
  markdown: {
    type: String,
    required: true,
  },
});

const markdownToHtml = computed(() => {
  // eslint-disable-next-line new-cap
  const md = new markdownIt({ html: true });
  const renderedMarkdown = md.render(props.markdown);
  return renderedMarkdown;
});
</script>
