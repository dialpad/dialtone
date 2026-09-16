<template>
  <code-well-header
    v-if="showDemo"
    ref="demoContent"
    :bgclass="bgclass"
    :custom="custom"
    :class="$attrs.class"
  >
    <slot />
  </code-well-header>

  <code-example-tabs
    v-if="showCode && resolvedVueCode"
    :html-code="showDemo ? () => $refs.demoContent?.$el : null"
    :vue-code="resolvedVueCode"
    show-html-warning
  />
</template>

<script>
import CodeWellHeader from './CodeWellHeader.vue';
import CodeExampleTabs from './CodeExampleTabs.vue';

export default {
  name: 'CodeExample',

  components: {
    CodeWellHeader,
    CodeExampleTabs,
  },

  inheritAttrs: false,

  props: {
    /**
     * Auto-injected by markdown-it plugin. Raw slot source extracted at build time.
     */
    sourceCode: {
      type: String,
      default: null,
    },

    /**
     * Explicit Vue code override. Takes priority over auto-extracted source.
     * Use when the displayed code should differ from the live demo slot content.
     */
    vueCode: {
      type: String,
      default: null,
    },

    /**
     * Restrict to showing only the demo or only the code.
     * When unset (default), both demo and code are shown.
     * @values demo, code
     */
    onlyShow: {
      type: String,
      default: null,
      validator: (v) => v === null || ['demo', 'code'].includes(v),
    },

    /**
     * Background class for the demo area.
     */
    bgclass: {
      type: String,
      default: 'd-bgc-secondary',
    },

    /**
     * Custom class mode for the demo area.
     */
    custom: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    showDemo () {
      return this.onlyShow !== 'code';
    },

    showCode () {
      return this.onlyShow !== 'demo';
    },

    resolvedVueCode () {
      return this.vueCode ?? this.sourceCode ?? null;
    },
  },
};
</script>
