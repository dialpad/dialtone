<template>
  <!-- Disabled controls in Next are desaturated + translucent (oklch
       color-mix) instead of flat gray. The vivid gradient backdrop is
       hardcoded (no tokens — identical chrome on both branches) so the
       translucency is actually visible: Next's disabled controls let the
       gradient bleed through, staging's stay opaque. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Disabled states
    </p>
    <div
      style="background: linear-gradient(105deg, #7c5cff 0%, #0fb5c9 55%, #ffb703 100%);
        padding: 28px;
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        gap: 22px;"
    >
      <div style="display:flex;gap:16px;align-items:center;">
        <dt-button importance="primary">
          Enabled
        </dt-button>
        <dt-button
          importance="primary"
          disabled
        >
          Disabled
        </dt-button>
        <dt-button importance="outlined">
          Enabled
        </dt-button>
        <dt-button
          importance="outlined"
          disabled
        >
          Disabled
        </dt-button>
      </div>
      <div style="display:flex;gap:16px;align-items:flex-start;">
        <dt-input
          model-value="Enabled input"
          style="width:200px;"
          aria-label="Enabled input"
        />
        <dt-input
          model-value="Disabled input"
          :disabled="true"
          style="width:200px;"
          aria-label="Disabled input"
        />
      </div>
    </div>
  </div>
</template>
