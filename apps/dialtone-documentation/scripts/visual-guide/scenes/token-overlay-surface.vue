<template>
  <!-- Next introduces a dedicated overlay surface; layered components
       (Popover, Dropdown, Hovercard, Modal) adopt it with no product code
       change. Top: a REAL open DtPopover over page content — each branch
       renders its own panel surface, which is the honest comparison. Bottom:
       labeled swatches; the panel caption is branch-adaptive because
       surface-overlay does not exist on staging (overlays there used the
       nearest page surface, not a renamed token). Dark mode is where the
       lighter-than-page effect is obvious. -->
  <div
    class="vg-scene"
    style="width:540px;"
  >
    <p class="vg-heading">
      Overlay above the page
    </p>
    <p
      style="margin:0 0 6px;font-size:14px;font-weight:600;color:var(--dt-color-foreground-primary);"
    >
      Call history
    </p>
    <p style="margin:0 0 12px;font-size:13px;color:var(--dt-color-foreground-secondary);">
      Yesterday — 12 calls, 3 voicemails, 1 missed.
    </p>
    <dt-popover
      :open="true"
      placement="bottom-start"
      aria-label="Quick actions"
    >
      <template #anchor>
        <dt-button importance="outlined">
          Quick actions
        </dt-button>
      </template>
      <template #content>
        <div style="padding:4px 0;display:flex;flex-direction:column;gap:2px;min-width:180px;">
          <span style="padding:6px 16px;font-size:13px;color:var(--dt-color-foreground-primary);">Start a call</span>
          <span style="padding:6px 16px;font-size:13px;color:var(--dt-color-foreground-primary);">Send a message</span>
          <span style="padding:6px 16px;font-size:13px;color:var(--dt-color-foreground-primary);">Share screen</span>
        </div>
      </template>
    </dt-popover>
    <!-- The popover teleports to the body and takes no layout space; this
         block reserves room inside the capture rect and doubles as the page
         content the panel floats above. -->
    <div style="height:150px;padding-top:16px;">
      <p style="margin:0;font-size:13px;color:var(--dt-color-foreground-secondary);">
        Monday — 8 calls, 1 voicemail.
      </p>
    </div>
    <div style="display:flex;gap:28px;align-items:center;justify-content:center;margin-top:8px;">
      <div style="text-align:center;">
        <div
          style="width:160px;
          height:104px;
          border-radius:12px;
          background:var(--dt-color-surface-primary);
          border:1px solid var(--dt-color-border-subtle);"
        />
        <p class="vg-caption">
          page<br><code style="font-size:10px;">surface-primary</code>
        </p>
      </div>
      <div style="text-align:center;">
        <div
          class="d-bs-xl"
          style="width:160px;
          height:104px;
          border-radius:12px;
          background:var(--dt-color-surface-overlay, var(--dt-color-surface-secondary));"
        />
        <p
          class="vg-caption"
          v-html="panelCaption"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Staging has no overlay surface — its overlays used the nearest page
// surface. The swatch caption must not imply the token existed there.
const panelCaption = ref('overlay panel<br><code style="font-size:10px;">surface-secondary (no overlay surface yet)</code>');

onMounted(() => {
  const probe = getComputedStyle(document.documentElement).getPropertyValue('--dt-color-surface-overlay');
  if (probe && probe.trim()) {
    panelCaption.value = 'overlay panel<br><code style="font-size:10px;">surface-overlay (new)</code>';
  }
});
</script>
