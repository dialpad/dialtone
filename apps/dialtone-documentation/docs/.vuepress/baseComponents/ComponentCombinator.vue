<template>
  <dtc-combinator
    :component="component"
    :library="library"
    :documentation="componentDocumentation"
    :variants="componentVariants"
    :preset="preset"
    :dev-mode="isDev"
    :full-screen="fullScreen"
    @update:full-screen="$emit('update:fullScreen', $event)"
    @update:preset="updatePreset"
  />
</template>

<script>
import { variantBank } from '@dialpad/dialtone-combinator';
import { computed } from 'vue';
import { usePresetQuerySync } from '../theme/composables/usePresetQuerySync.js';

export default {
  name: 'ComponentCombinator',

  inject: [
    'dialtoneComponents',
    'dialtoneComponentsDocumentation',
    'dialtoneIcons',
    'dialtoneIllustrations',
  ],

  props: {
    componentName: {
      type: String,
      required: true,
    },

    fullScreen: {
      type: Boolean,
      default: undefined,
    },
  },

  emits: ['update:fullScreen'],

  setup (props) {
    const componentVariants = computed(() => variantBank()[props.componentName] ?? {});
    const { preset, updatePreset } = usePresetQuerySync(() => props.componentName, componentVariants);
    return { componentVariants, preset, updatePreset };
  },

  computed: {
    component () {
      return this.dialtoneComponents[this.componentName];
    },

    componentDocumentation () {
      return this.dialtoneComponentsDocumentation.find(
        componentInfo => componentInfo.displayName === this.componentName,
      );
    },

    library () {
      return {
        ...this.dialtoneComponents,
        ...this.dialtoneIcons,
        ...this.dialtoneIllustrations,
      };
    },

    isDev () {
      return typeof __VUEPRESS_DEV__ !== 'undefined'
        && (__VUEPRESS_DEV__ || __DIALTONE_DEPLOY_PREVIEW__);
    },
  },
};
</script>
