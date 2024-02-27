<template>
  <dt-tab-group class="code-example-tab-group" @change="selectedPanelId = $event.selected">
    <template #tabs>
      {{ selectedPanelId }}
      <div class="d-d-flex d-jc-space-between d-ai-flex-start d-w100p">
        <div>
          <dt-tab
            :id="vueTabId"
            label="Vue code"
            :panel-id="vuePanelId"
            selected
          >
            Vue
          </dt-tab>
          <dt-tab
            :id="htmlTabId"
            label="HTML code"
            :panel-id="htmlPanelId"
          >
            HTML
          </dt-tab>
        </div>
        <!-- aria label blank so no tooltip displays since it would be redundant to the "Copy code" text -->
        <copy-button
          :text="selectedPanelId === htmlPanelId ? trimmedHtmlCode : trimmedVueCode"
          aria-label=""
        >
          Copy code
        </copy-button>
      </div>
    </template>
    <dt-tab-panel
      :id="vuePanelId"
      :tab-id="vueTabId"
    >
      <div class="language-html" data-ext="html">
        <pre class="language-html" v-html="highlightedVue" />
      </div>
    </dt-tab-panel>
    <dt-tab-panel
      :id="htmlPanelId"
      :tab-id="htmlTabId"
    >
      <dt-banner
        v-if="showHtmlWarning"
        class="d-ps-static"
        kind="warning"
        hide-close
      >
        When using HTML / CSS code only the visuals of the component are rendered. It may require
        additional javascript to function the same way as the example.
      </dt-banner>
      <div class="language-html" data-ext="html">
        <pre class="language-html" v-html="highlightedHtml" />
      </div>
    </dt-tab-panel>
  </dt-tab-group>
</template>

<script setup>
import Prism from 'prismjs';
import CopyButton from './CopyButton.vue';
import { ref } from 'vue';
import { getUniqueString } from '@dialtone/common/utils';

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

const trimmedHtmlCode = props.htmlCode.replace(/^\n/gm, '');
const trimmedVueCode = props.vueCode.replace(/^\n/gm, '');
const highlightedHtml = Prism.highlight(props.htmlCode.trim(), Prism.languages.html, 'html');
const highlightedVue = Prism.highlight(props.vueCode.trim(), Prism.languages.html, 'html');

const vueTabId = getUniqueString();
const vuePanelId = getUniqueString();
const htmlTabId = getUniqueString();
const htmlPanelId = getUniqueString();

const selectedPanelId = ref(vuePanelId);
</script>

<style scoped lang="less">
.code-example-tab-group {
  margin-top: var(--dt-space-500);
  .language-html {
    margin-top: 0;
    position: relative;
  }
}
</style>
