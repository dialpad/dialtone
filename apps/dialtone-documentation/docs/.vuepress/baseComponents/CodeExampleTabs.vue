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
            v-if="!!htmlCode"
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
      <div v-dt-scrollbar class="language-html d-hmx332" data-ext="html">
        <pre class="language-html" v-html="highlightedVue" />
      </div>
    </dt-tab-panel>
    <dt-tab-panel
      v-if="!!htmlCode"
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
      <div v-dt-scrollbar class="language-html d-hmx332" data-ext="html">
        <pre class="language-html" v-html="highlightedHtml" />
      </div>
    </dt-tab-panel>
  </dt-tab-group>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import Prism from 'prismjs';
import prettier from 'prettier/standalone';
import htmlParser from 'prettier/plugins/html.mjs';
import CopyButton from './CopyButton.vue';
import { getUniqueString } from '@workspaceRoot/common/utils';

const props = defineProps({
  /**
   * The HTML code to be displayed in the HTML tab if the component reference is not provided or
   * a function that retrieves the reference to the example component to get the HTML code.
   */
  htmlCode: {
    type: [String, Function],
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

const formattedHTML = ref(null);

const trimmedHtmlCode = computed(() => {
  if (formattedHTML.value) {
    return formattedHTML.value;
  }
  return typeof props.htmlCode === 'string' ? props.htmlCode.replace(/^\n/gm, '') : '';
});

const highlightedHtml = computed(() => {
  if (formattedHTML.value) {
    return Prism.highlight(
      formattedHTML.value,
      Prism.languages.html,
      'html',
    );
  }
  return typeof props.htmlCode === 'string' ? Prism.highlight(props.htmlCode.trim(), Prism.languages.html, 'html') : '';
});

const trimmedVueCode = props.vueCode.replace(/^\n/gm, '');
const highlightedVue = Prism.highlight(props.vueCode.trim(), Prism.languages.html, 'html');

const vueTabId = getUniqueString();
const vuePanelId = getUniqueString();
const htmlTabId = getUniqueString();
const htmlPanelId = getUniqueString();

const selectedPanelId = ref(vuePanelId);

onMounted(async () => {
  if (typeof props.htmlCode === 'function') {
    const componentRef = props.htmlCode();
    const el = componentRef.$el ?? componentRef;
    const formatted = await formatHTML(el.outerHTML);
    formattedHTML.value = formatted;
  }
});

/**
 * Transforms a single-line HTML string to an indented multiline HTML string.
 * Removes comments, id and data-qa attributes, and simplifies svg tags.
 * Also, adds a new line before each svg, img, and span tag because prettier
 * doesn't do it.
 * @param elementHTML - The HTML code to be formatted.
 * @returns The formatted HTML code.
 */
const formatHTML = async (elementHTML) => {
  const normalizedHTML = elementHTML
    .replace(/<!--.*?-->/g, '')
    .replace(/id=".*?"/g, '')
    .replace(/data-qa=".*?"/g, '')
    .replace(/<svg.*?>.*?<\/svg>/g, '<svg>...</svg>')
    .replace(/<svg/g, '\n<svg')
    .replace(/<img/g, '\n<img')
    .replace(/<span/g, '\n<span');
  const prettyHTML = await prettier.format(normalizedHTML,
    {
      parser: 'html',
      plugins: [htmlParser],
      htmlWhitespaceSensitivity: 'ignore',
    });
  return prettyHTML;
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
