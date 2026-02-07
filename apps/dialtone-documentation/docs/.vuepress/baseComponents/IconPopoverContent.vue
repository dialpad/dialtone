<template>
  <dt-stack direction="row" align="center" justify="center" class="d-h64 d-mb16 d-fc-primary">
    <dt-icon
      ref="iconPreview"
      :name="iconName"
      :size="selectedSize"
    />
  </dt-stack>
  <dt-stack gap="500" class="d-fc-primary">
    <div class="d-wmx50p">
      <dt-select-menu
        v-model="selectedSize"
        label="Size"
        size="sm"
      >
        <option
          v-for="option in sizeOptions"
          :key="`size-${option}`"
          :selected="option === selectedSize"
          :value="option"
          v-text="option"
        />
      </dt-select-menu>
    </div>
    <dt-stack direction="row" align="center">
      <dt-stack class="d-fl-grow5">
        <dt-text kind="label" size="sm">
          Name
        </dt-text>
        <dt-text kind="body" size="md" density="200">
          {{ iconName }}
        </dt-text>
      </dt-stack>
      <copy-button
        class="d-ml8"
        :text="iconName"
        aria-label="Copy icon name"
      />
    </dt-stack>
    <dt-stack>
      <dt-text kind="label" size="sm">
        Category
      </dt-text>
      <dt-text kind="body" size="md" density="200" class="d-tt-capitalize">
        {{ category }}
      </dt-text>
    </dt-stack>
    <dt-stack>
      <dt-text kind="label" size="sm">
        Keywords
      </dt-text>
      <dt-text kind="body" size="md" density="200">
        {{ keywords.join(', ') || '-' }}
      </dt-text>
    </dt-stack>
    <dt-stack direction="row" align="end">
      <div class="d-fl-grow1">
        <dt-input
          class="d-ff-mono"
          label="SVG"
          readonly
          tabindex="-1"
          size="sm"
          :value="svgExample"
        />
      </div>
      <copy-button
        class="d-ml8"
        :text="svgExample"
        aria-label="Copy SVG markup"
      />
    </dt-stack>
    <dt-stack direction="row" align="end" class="d-bb d-bc-default d-pb16">
      <div class="d-fl-grow1">
        <dt-input
          class="d-ff-mono"
          label="Vue"
          tabindex="-1"
          readonly
          size="sm"
          :value="vueExample"
        />
      </div>
      <copy-button
        class="d-ml8"
        :text="vueExample"
        aria-label="Copy Vue markup"
      />
    </dt-stack>
    <dt-stack direction="row" align="end">
      <div class="d-fl-grow1">
        <dt-input
          class="d-ff-mono"
          label="Deprecated"
          tabindex="-1"
          readonly
          size="sm"
          :value="vueExampleDeprecated"
        >
          <template #description>
            This Vue approach does not include tree-shaking.
            Please use the Vue snippet above.
            <dt-link href="/dialtone/whats-new/posts/2024-4-15.html" target="_blank">
              About this change.
            </dt-link>
          </template>
        </dt-input>
      </div>
      <copy-button
        class="d-ml8"
        :text="vueExampleDeprecated"
        aria-label="Copy Vue Deprecated markup"
      />
    </dt-stack>
  </dt-stack>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import sizes from '@data/icons-sizes.json';
import CopyButton from './CopyButton.vue';

const props = defineProps({
  iconName: { type: String, required: true },
  keywords: { type: Array, default: () => [] },
  category: { type: String, default: '' },
});

const selectedSize = ref('500');
const iconPreview = ref(null);
const svgExample = ref('');

const sizeOptions = computed(() => {
  return sizes.map(item => item.size.toString());
});
const vueExample = computed(() => {
  return `<dt-icon-${props.iconName} size="${selectedSize.value}" />`;
});
const vueExampleDeprecated = computed(() => {
  return `<dt-icon name="${props.iconName}" size="${selectedSize.value}" />`;
});

watch([iconPreview, selectedSize], async () => {
  await nextTick();
  svgExample.value = iconPreview.value.$el.outerHTML;
});
</script>
