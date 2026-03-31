<template>
  <dt-stack
    gap="200"
    class="d-ai-center d-p-800"
  >
    <dtc-suggestion
      :value="component.name"
      :suggestions="options"
      @update:value="updateComponent"
    >
      <template #item="{ value }">
        <span class="d-d-flex d-jc-space-between">
          <span :class="isSupportedComponent(value) ? '' : 'd-fc-muted'">{{ value }}</span>
          <dt-badge
            v-if="!isSupportedComponent(value)"
            class="d-mis-75"
            type="warning"
          >
            Unsupported
          </dt-badge>
          <dt-badge
            v-if="value === DEFAULT_COMPONENT"
          >
            Default
          </dt-badge>
        </span>
      </template>
    </dtc-suggestion>
    <Combinator
      :key="componentKey"
      class="d-w100p"
      :component="component"
      :variants="variants"
      :documentation="componentDocumentation"
      :library="library"
    />
  </dt-stack>
</template>

<script setup>
import documentation from '@dialpad/dialtone-vue/component-documentation.json';
import * as modules from '@dialpad/dialtone-vue';
import Combinator from './components/combinator.vue';
import { computed, markRaw, onMounted, ref } from 'vue';
import { DIALTONE_PREFIX } from '@/src/lib/constants';
import { DtBadge, DtStack } from '@dialpad/dialtone-vue';
import * as dialtoneIcons from '@dialpad/dialtone-icons/vue';
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

const library = computed(() => {
  return {
    ...components.value,
    ...dialtoneIcons,
  };
});

const componentDocumentation = computed(() => {
  return documentation.find(componentInfo => componentInfo.displayName === component.value.name);
});

onMounted(() => {
  addEventListener('hashchange', () => {
    component.value = getComponentFromHash();
    variants.value = getVariantFromHash();
  });
});

</script>
