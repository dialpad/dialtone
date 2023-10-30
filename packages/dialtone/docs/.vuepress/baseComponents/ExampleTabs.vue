<template>
  <dt-tab-group class="example-tab-group">
    <template #tabs>
      <dt-tab
        id="vueTab"
        label="vueCode"
        panel-id="vuePanel"
        selected
      >
        Vue code
      </dt-tab>
      <dt-tab
        id="htmlTab"
        label="htmlCode"
        panel-id="htmlPanel"
      >
        HTML code
      </dt-tab>
    </template>
    <dt-tab-panel
      id="vuePanel"
      tab-id="vueTab"
    >
      <div class="language-html" data-ext="html">
        <pre class="language-html" v-html="highlightedVue" />
        <copy-button
          class="code-copy-button"
          :text="trimmedVueCode"
          aria-label="Copy Vue code"
        />
      </div>
    </dt-tab-panel>
    <dt-tab-panel
      id="htmlPanel"
      tab-id="htmlTab"
    >
      <dt-banner
        v-if="showHtmlWarning"
        class="d-ps-static"
        kind="warning"
        hide-close
      >
        This component needs Javascript to work as the example
      </dt-banner>
      <div class="language-html" data-ext="html">
        <pre class="language-html" v-html="highlightedHtml" />
        <copy-button
          class="code-copy-button"
          :text="trimmedHtmlCode"
          aria-label="Copy Html code"
        />
      </div>
    </dt-tab-panel>
  </dt-tab-group>
</template>

<script setup>
import Prism from 'prismjs';
import CopyButton from './CopyButton.vue';

const props = defineProps({
  htmlCode: {
    type: String,
    required: true,
  },
  vueCode: {
    type: String,
    required: true,
  },
  showHtmlWarning: Boolean,
});

const highlightedHtml = Prism.highlight(props.htmlCode.trim(), Prism.languages.html, 'html');
const highlightedVue = Prism.highlight(props.vueCode.trim(), Prism.languages.html, 'html');
</script>

<style scoped lang="less">
.example-tab-group {
  margin-top: var(--dt-space-500);
  .language-html {
    margin-top: 0;
    position: relative;
    .code-copy-button {
      position: absolute;
      top: var(--dt-space-450);
      right: var(--dt-space-450);
    }
  }
}
</style>
