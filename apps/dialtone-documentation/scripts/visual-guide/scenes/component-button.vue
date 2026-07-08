<template>
  <!-- Button restyle in Next: squarer corners (8px → 6px), medium label weight
       (was semibold), adjusted label sizes, softer outlined border, slightly
       darker primary hover/active. Same component API on both branches. -->
  <div class="vg-scene" style="width:560px;">
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
        <dt-button importance="primary" kind="danger">
          Danger
        </dt-button>
        <dt-button importance="outlined" kind="danger">
          Danger outlined
        </dt-button>
        <dt-button importance="primary" kind="muted">
          Muted
        </dt-button>
      </div>
    </div>
  </div>
</template>
