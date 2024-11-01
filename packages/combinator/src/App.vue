<template>
  <dt-stack
    gap="500"
    class="d-ai-center"
  >
    <dtc-suggestion
      :value="component.name"
      :suggestions="options"
      @update:value="updateComponent"
    >
      <span>Target Component</span>
      <template #item="{ value }">
        <span class="d-d-flex d-jc-space-between">
          <span>{{ value }}</span>
          <dt-badge
            v-if="!isSupportedComponent(value)"
            class="d-ml6"
            color="yellow-300"
          >
            Unsupported
          </dt-badge>
          <dt-badge
            v-if="value === DEFAULT_COMPONENT"
            color="purple-500"
          >
            Default
          </dt-badge>
        </span>
      </template>
    </dtc-suggestion>
    <div class="d-mx128 lg:d-mx16">
      <Combinator
        :key="componentKey"
        :component="component"
        :variants="variants"
        :documentation="componentDocumentation"
        :library="library"
      />
    </div>
  </dt-stack>
</template>

<script setup>
import documentation from '@dialpad/dialtone-vue/component-documentation.json';
import * as modules from '@dialpad/dialtone-vue';
import Combinator from './components/combinator.vue';
import { computed, markRaw, onMounted, ref } from 'vue';
import { DIALTONE_PREFIX } from '@/src/lib/constants';
import { DtBadge, DtStack } from '@dialpad/dialtone-vue';
import DtcSuggestion from '@/src/components/controls/control_suggestion.vue';
import supportedComponentData from '@/src/supported_components.json';
import variantBank from '@/src/variants/variants';
// import { getIcons } from '@/src/lib/utils';

const DEFAULT_COMPONENT = 'DtButton';

function isSupportedComponent (exportName) {
  return supportedComponentData.includes(exportName);
}

const components = computed(() => {
  return Object.fromEntries(Object.entries(modules).filter(([exportName, exportValue]) => {
    return typeof (exportValue) === 'object' &&
      exportName.toLowerCase().startsWith(DIALTONE_PREFIX) &&
      exportValue.name;
  }));
});

const options = computed(() => {
  return Object.keys(components.value);
});

function getComponentFromHash () {
  componentKey.value += 1;
  const hash = window.location.hash.substring(1);
  return markRaw(modules[hash] ?? modules.DtButton);
}

function getVariantFromHash () {
  const hash = window.location.hash.substring(1);
  return variantBank()[hash] ?? {};
}

const componentKey = ref(0);
const component = ref(getComponentFromHash());
const variants = ref(getVariantFromHash());

function updateComponent (e) {
  window.location.hash = e;
}

const background = ref('white');

function updateBackground (e) {
  background.value = e;
}

const icons = ref();

const library = computed(() => {
  return {
    ...components.value,
    ...icons.value,
  };
});

const componentDocumentation = computed(() => {
  return documentation.find(componentInfo => componentInfo.displayName === component.value.name);
});

onMounted(async () => {
  addEventListener('hashchange', () => {
    component.value = getComponentFromHash();
    variants.value = getVariantFromHash();
  });

  const promises = [];
  // getIcons().forEach(icon => {
  //  promises.push(import(`../node_modules/@dialpad/dialtone/lib/dist/vue/icons/${icon}.vue`).then(module => {
  //    return [icon, module.default];
  //  }));
  // });
  // icons.value = Object.fromEntries(await Promise.all(promises));
});

</script>

<style>
  .dtc-preview {
    padding-left: var(--dt-space-800);
    padding-right: var(--dt-space-800);
  }
</style>
