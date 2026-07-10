<template>
  <!-- Validation messages: colors shift subtly with the re-tuned ramps
       (icons existed on staging too — DLT-3422 only made them customizable),
       the blue `info` variant is NEW (DLT-3423), and the severity vocabulary
       changed (error→critical, success→positive — component-props guide,
       "Severity vocabulary"). The scene detects the branch and uses its
       canonical type names; the info row gets an in-image "new" marker,
       which only ever renders on the after side. -->
  <div
    class="vg-scene"
    style="width:520px;"
  >
    <p class="vg-heading">
      Validation messages
    </p>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <div
        v-for="t in types"
        :key="t"
        style="display:flex;align-items:center;gap:16px;"
      >
        <span
          class="vg-mono"
          style="width:64px;flex:none;"
        >{{ t }}</span>
        <dt-validation-messages
          :id="`vg-vm-${t}`"
          :validation-messages="[{ message: `Sample ${t} message`, type: t }]"
        />
        <span
          v-if="t === 'info'"
          class="vg-caption"
          style="margin:0;flex:none;"
        >new in Next</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Each branch's canonical severity vocabulary.
const BEFORE_TYPES = ['error', 'warning', 'success'];
const AFTER_TYPES = ['critical', 'warning', 'positive', 'info'];

const types = ref(BEFORE_TYPES);

onMounted(() => {
  // --dt-color-surface-overlay only exists on Next.
  const probe = getComputedStyle(document.documentElement).getPropertyValue('--dt-color-surface-overlay');
  if (probe && probe.trim()) types.value = AFTER_TYPES;
});
</script>
