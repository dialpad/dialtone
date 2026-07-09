<template>
  <!-- DtInput in Next: input text re-set with the new type scale (12px → 14px)
       plus validation icons (DLT-3422). Severity vocabulary is branch-adaptive
       (error on staging, critical on Next — component-props guide, "Severity
       vocabulary") so both sides render their true styled states. -->
  <div
    class="vg-scene"
    style="width:480px;"
  >
    <p class="vg-heading">
      Input — text size and validation states
    </p>
    <div style="display:flex;flex-direction:column;gap:20px;">
      <dt-input
        label="Default"
        :show-label="true"
        model-value="hello@dialpad.com"
      />
      <dt-input
        label="Warning"
        :show-label="true"
        model-value="hello"
        :messages="[{ message: 'Double-check this value', type: 'warning' }]"
        :show-messages="true"
      />
      <dt-input
        :label="severeLabel"
        :show-label="true"
        model-value=""
        :messages="[{ message: 'This field is required', type: severeType }]"
        :show-messages="true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const severeType = ref('error');
const severeLabel = computed(() => (severeType.value === 'error' ? 'Error' : 'Critical'));

onMounted(() => {
  // --dt-color-surface-overlay only exists on Next, where `error` → `critical`.
  const probe = getComputedStyle(document.documentElement).getPropertyValue('--dt-color-surface-overlay');
  if (probe && probe.trim()) severeType.value = 'critical';
});
</script>
