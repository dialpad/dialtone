<template>
  <dt-stack direction="row" align="center" justify="center" class="d-h64 d-mb16 d-fc-primary" data-migrate-outline>
    <dt-icon
      ref="iconPreview"
      :name="iconName"
      :size="selectedSize"
    />
  </dt-stack>
  <div class="d-stack16 d-fc-primary">
    <div class="d-wmx50p">
      <dt-select-menu
        label="Size"
        size="sm"
        @change="changeIconSize"
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
    <dt-stack direction="row" align="center" data-migrate-outline>
      <dt-stack class="d-fl-grow5" data-migrate-outline>
        <span class="d-label d-label--sm">Name</span>
        <span class="d-body--md-compact">{{ iconName }}</span>
      </dt-stack>
      <copy-button
        class="d-ml8"
        :text="iconName"
        aria-label="Copy icon name"
      />
    </dt-stack>
    <dt-stack data-migrate-outline>
      <span class="d-label d-label--sm">Category</span>
      <span
        class="d-tt-capitalize d-body--md-compact"
        v-text="category"
      />
    </dt-stack>
    <dt-stack data-migrate-outline>
      <span class="d-label d-label--sm">Keywords</span>
      <span class="d-body--md-compact">{{ keywords.join(', ') || '-' }}</span>
    </dt-stack>
    <dt-stack direction="row" align="end" data-migrate-outline>
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
    <dt-stack direction="row" align="end" class="d-bb d-bc-default d-pb16" data-migrate-outline>
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
    <dt-stack direction="row" align="end" data-migrate-outline>
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
            <p>
              This Vue approach does not include tree-shaking.
              Please use the Vue snippet above.
              <dt-link href="/about/whats-new/posts/2024-4-15.html" target="_blank">
                About this change.
              </dt-link>
            </p>
          </template>
        </dt-input>
      </div>
      <copy-button
        class="d-ml8"
        :text="vueExampleDeprecated"
        aria-label="Copy Vue Deprecated markup"
      />
    </dt-stack>
  </div>
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
const changeIconSize = (size) => {
  selectedSize.value = size;
};

watch([iconPreview, selectedSize], async () => {
  await nextTick();
  svgExample.value = iconPreview.value.$el.outerHTML;
});
</script>
