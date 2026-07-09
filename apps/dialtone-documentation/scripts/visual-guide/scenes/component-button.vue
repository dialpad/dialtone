<template>
  <!-- Button restyle in Next: squarer corners (8px → 6px), medium label weight
       (was semibold), adjusted label sizes, softer outlined border, slightly
       darker primary hover/active. The destructive kind is branch-adaptive:
       `danger` on staging, renamed to `critical` on Next (component-props
       guide, "Severity vocabulary"). Button group: DLT-2947. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Button — kinds and importance
    </p>
    <div style="display:flex;flex-direction:column;gap:20px;">
      <div style="display:flex;gap:14px;align-items:center;">
        <dt-button importance="primary">
          Primary
        </dt-button>
        <dt-button importance="outlined">
          Outlined
        </dt-button>
        <dt-button importance="clear">
          Clear
        </dt-button>
      </div>
      <div style="display:flex;gap:14px;align-items:center;">
        <dt-button
          importance="primary"
          :kind="severeKind"
        >
          {{ severeLabel }}
        </dt-button>
        <dt-button
          importance="outlined"
          :kind="severeKind"
        >
          {{ severeLabel }} outlined
        </dt-button>
        <dt-button
          importance="primary"
          kind="muted"
        >
          Muted
        </dt-button>
      </div>
      <dt-button-group alignment="start">
        <dt-button importance="primary">
          Confirm
        </dt-button>
        <dt-button importance="outlined">
          Cancel
        </dt-button>
      </dt-button-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const severeKind = ref('danger');
const severeLabel = computed(() => (severeKind.value === 'danger' ? 'Danger' : 'Critical'));

onMounted(() => {
  // --dt-color-surface-overlay only exists on Next, where `danger` → `critical`.
  const probe = getComputedStyle(document.documentElement).getPropertyValue('--dt-color-surface-overlay');
  if (probe && probe.trim()) severeKind.value = 'critical';
});
</script>
