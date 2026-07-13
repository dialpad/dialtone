<template>
  <!-- Button restyle in Next: squarer corners (8px → 6px), medium label weight
       (was semibold), adjusted label sizes, softer outlined border, slightly
       darker primary hover/active. The destructive kind is branch-adaptive:
       `danger` on staging, renamed to `critical` on Next (component-props
       guide, "Severity vocabulary"); `positive` exists on both. Sizes use the
       t-shirt aliases valid on both branches (Next prefers numeric). Button
       group: DLT-2947 — Next bakes in an 8px gap; staging has none (consumers
       added their own), so the scene sets the same 8px explicitly to keep the
       comparison about button chrome, not spacing. -->
  <div
    class="vg-scene"
    style="width:680px;"
  >
    <p class="vg-heading">
      Button — kinds, sizes, icons
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
          kind="positive"
        >
          Positive
        </dt-button>
        <dt-button
          importance="outlined"
          kind="positive"
        >
          Positive outlined
        </dt-button>
      </div>
      <div style="display:flex;gap:14px;align-items:center;">
        <!-- Muted is used with clear/outlined importance (see the Muted
             section of the button docs) — with the default primary
             importance it renders as a purple fill. -->
        <dt-button
          kind="muted"
          importance="clear"
        >
          Muted
        </dt-button>
        <dt-button
          kind="muted"
          importance="outlined"
        >
          Muted outlined
        </dt-button>
      </div>
      <div style="display:flex;gap:14px;align-items:center;">
        <dt-button size="xs">
          Extra small
        </dt-button>
        <dt-button size="md">
          Medium
        </dt-button>
        <dt-button size="xl">
          Extra large
        </dt-button>
      </div>
      <div style="display:flex;gap:14px;align-items:center;">
        <dt-button>
          <template #icon="{ iconSize }">
            <dt-icon-phone :size="iconSize" />
          </template>
          Start call
        </dt-button>
        <dt-button
          importance="outlined"
          icon-position="right"
        >
          <template #icon="{ iconSize }">
            <dt-icon-download :size="iconSize" />
          </template>
          Download
        </dt-button>
        <dt-button
          importance="outlined"
          aria-label="Settings"
        >
          <template #icon="{ iconSize }">
            <dt-icon-settings :size="iconSize" />
          </template>
        </dt-button>
      </div>
      <dt-button-group
        alignment="start"
        style="gap: 8px;"
      >
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
import { computed } from 'vue';
import { useIsNext } from '../harness/use-is-next.js';

// `danger` → `critical` on Next.
const isNext = useIsNext();
const severeKind = computed(() => (isNext.value ? 'critical' : 'danger'));
const severeLabel = computed(() => (severeKind.value === 'danger' ? 'Danger' : 'Critical'));
</script>
