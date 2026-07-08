<template>
  <!-- Focus rings are a deeper, more saturated blue in Next (both modes). The
       ring is applied via the same --dt-shadow-focus token both branches use;
       data-vg-keep-focus opts this scene out of the harness's focus
       suppression. -->
  <div data-vg-keep-focus class="vg-scene" style="width:560px;">
    <p class="vg-heading">
      Focus ring color
    </p>
    <div style="display:flex;gap:44px;align-items:center;">
      <div style="text-align:center;">
        <div
          style="display:inline-block;
          padding:8px 18px;
          border-radius:8px;
          background:var(--dt-color-surface-secondary);
          border:1px solid var(--dt-color-border-default);
          box-shadow:var(--dt-shadow-focus);
          font-size:14px;
          color:var(--dt-color-foreground-primary);"
        >
          Button
        </div>
        <p class="vg-caption">
          focused button
        </p>
      </div>
      <div style="text-align:center;">
        <div
          style="width:180px;
          padding:8px 12px;
          border-radius:6px;
          background:var(--dt-color-surface-primary);
          border:1px solid var(--dt-color-border-default);
          box-shadow:var(--dt-shadow-focus);
          font-size:14px;
          color:var(--dt-color-foreground-placeholder);
          text-align:left;"
        >
          Search…
        </div>
        <p class="vg-caption">
          focused input
        </p>
      </div>
      <div style="text-align:center;">
        <div
          style="width:44px;
          height:44px;
          border-radius:9999px;
          background:var(--dt-color-surface-secondary);
          border:1px solid var(--dt-color-border-default);
          box-shadow:var(--dt-shadow-focus);"
        />
        <p class="vg-caption">
          focused icon button
        </p>
      </div>
    </div>
  </div>
</template>
