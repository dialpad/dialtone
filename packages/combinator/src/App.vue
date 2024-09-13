<template>
  <div
    class="dtc-preview d-d-flex d-fd-column d-ai-center d-py64 d-w100p"
    :class="`d-bgc-${background}`"
  >
    <dtc-button-bar
      class="d-ps-absolute d-m8 d-t0 d-r0"
      :value="background"
      @click="updateBackground"
    >
      <template #orange-200>
        <div class="d-w16 d-h16 d-ba d-bc-black d-bgc-orange-200" />
      </template>
      <template #black-800>
        <div class="d-w16 d-h16 d-ba d-bc-black d-bgc-black-800" />
      </template>
      <template #white>
        <div class="d-w16 d-h16 d-ba d-bc-black d-bgc-white" />
      </template>
    </dtc-button-bar>
    <div class="d-mb64">
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
    </div>
    <div class="d-d-flex d-as-stretch d-hmn0">
      <Combinator
        :key="componentKey"
        :component="component"
        :variants="variants"
        :documentation="documentation"
        :library="library"
      />
    </div>
  </div>
</template>

<script setup>
import documentation from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';
import * as modules from '@dialpad/dialtone-vue';
import Combinator from './components/combinator';
import { computed, markRaw, onMounted, ref } from 'vue';
import { DIALTONE_PREFIX } from '@/src/lib/constants';
import { DtBadge } from '@dialpad/dialtone-vue';
import DtcButtonBar from '@/src/components/tools/button_bar';
import DtcSuggestion from '@/src/components/controls/control_suggestion';
import supportedComponentData from '@/src/supported_components.json';
import variantBank from '@/src/variants/variants';
import { getIcons } from '@/src/lib/utils';

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

onMounted(async () => {
  addEventListener('hashchange', () => {
    component.value = getComponentFromHash();
    variants.value = getVariantFromHash();
  });

  const promises = [];
  getIcons().forEach(icon => {
    promises.push(import(`../node_modules/@dialpad/dialtone/lib/dist/vue/icons/${icon}.vue`).then(module => {
      return [icon, module.default];
    }));
  });
  icons.value = Object.fromEntries(await Promise.all(promises));
});

</script>

<style lang="less" src="./assets/dialtone.less" />
<style lang="less" src="./assets/transitions.less" />

<style>
  .dtc-preview {
    padding-left: var(--su128);
    padding-right: var(--su128);
  }
</style>
