<template>
  <dtc-combinator
    :component="component"
    :library="library"
    :documentation="componentDocumentation"
    :variants="componentVariants"
  />
</template>

<script>
import { variantBank } from '@dialpad/dialtone-combinator';

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

    showBlueprints: {
      type: Boolean,
      default: false,
    },
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

    componentVariants () {
      return variantBank()[this.componentName] ?? {};
    },

    library () {
      return {
        ...this.dialtoneComponents,
        ...this.dialtoneIcons,
        ...this.dialtoneIllustrations,
      };
    },
  },
};
</script>
