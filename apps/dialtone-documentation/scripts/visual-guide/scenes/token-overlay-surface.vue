<template>
  <!-- Page background = surface-primary; the floating panel = surface-overlay.
       In dark mode surface-overlay is intentionally LIGHTER than the page,
       creating color-based elevation. On staging --dt-color-surface-overlay
       does not exist, so the panel falls back to surface-secondary — the
       closest thing overlays had before. -->
  <div class="vg-scene" style="width:540px;">
    <p class="vg-heading">
      Surface — page vs overlay
    </p>
    <div style="display:flex;gap:28px;align-items:center;justify-content:center;">
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
        <p class="vg-caption">
          overlay (modal/popover)<br><code style="font-size:10px;">surface-overlay</code>
        </p>
      </div>
    </div>
  </div>
</template>
