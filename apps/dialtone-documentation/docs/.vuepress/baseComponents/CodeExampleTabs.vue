<template>
  <dt-tab-group class="code-example-tab-group" @change="selectedPanelId = $event.selected">
    <template #tabs>
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
import { computed, onMounted, ref, nextTick } from 'vue';
import Prism from 'prismjs';
import pretty from 'pretty';
import CopyButton from './CopyButton.vue';
import { getUniqueString } from '@workspaceRoot/common/utils';

const props = defineProps({
  /**
   * Retrieves the reference to the example component to get the HTML code.
   * If not provided, the HTML code will be used.
   *
   * @returns {Component} The reference to the component.
   */
  getComponentRef: {
    type: Function,
    default: null,
  },
  /**
   * The HTML code to be displayed in the HTML tab if the component reference is not provided.
   */
  htmlCode: {
    type: String,
    default: null,
  },
  /**
   * The Vue code to be displayed in the Vue tab.
   */
  vueCode: {
    type: String,
    required: true,
  },
  /**
   * Indicates whether to show a warning for HTML code.
   */
  showHtmlWarning: {
    type: Boolean,
    default: true,
  },
});

const elementHTML = ref(null);

const trimmedHtmlCode = computed(() => {
  if (elementHTML.value) {
    return formatHTML(elementHTML.value);
  }
  return props.htmlCode ? props.htmlCode.replace(/^\n/gm, '') : '';
});

const highlightedHtml = computed(() => {
  if (elementHTML.value) {
    return Prism.highlight(
      formatHTML(elementHTML.value),
      Prism.languages.html,
      'html',
    );
  }
  return props.htmlCode ? Prism.highlight(props.htmlCode.trim(), Prism.languages.html, 'html') : '';
});

const trimmedVueCode = props.vueCode.replace(/^\n/gm, '');
const highlightedVue = Prism.highlight(props.vueCode.trim(), Prism.languages.html, 'html');

const vueTabId = getUniqueString();
const vuePanelId = getUniqueString();
const htmlTabId = getUniqueString();
const htmlPanelId = getUniqueString();

const selectedPanelId = ref(vuePanelId);

onMounted(() => {
  if (props.getComponentRef) {
    const compRef = props.getComponentRef();
    nextTick(() => (elementHTML.value = compRef.$el.outerHTML));
  }
});

/**
 * Transforms a single-line HTML string to an indented multiline HTML string.
 * Removes comments, id and data-qa attributes, and simplifies svg tags.
 * Also, adds a new line before each svg, img, and span tag because pretty
 * doesn't do it.
 * @param elementHTML - The HTML code to be formatted.
 * @returns The formatted HTML code.
 */
const formatHTML = (elementHTML) => {
  const normalizedHTML = elementHTML
    .replace(/<!--.*?-->/g, '')
    .replace(/id=".*?"/g, '')
    .replace(/data-qa=".*?"/g, '')
    .replace(/<svg.*?>.*?<\/svg>/g, '<svg>...</svg>')
    .replace(/<svg/g, '\n<svg')
    .replace(/<img/g, '\n<img')
    .replace(/<span/g, '\n<span');
  return pretty(normalizedHTML, { ocd: true });
};
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
