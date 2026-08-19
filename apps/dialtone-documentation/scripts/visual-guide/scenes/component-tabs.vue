<template>
  <!-- Tabs in Next: re-mapped hover/active/selected colors and a traveling
       selected-tab indicator (static capture shows the selected style; the
       slide animation is described in the guide prose). -->
  <div class="vg-scene" style="width:560px;">
    <p class="vg-heading">
      Tabs — selected state
    </p>
    <dt-tab-group selected="panel-1">
      <template #tabs>
        <dt-tab id="tab-1" panel-id="panel-1" selected>
          Overview
        </dt-tab>
        <dt-tab id="tab-2" panel-id="panel-2">
          Members
        </dt-tab>
        <dt-tab id="tab-3" panel-id="panel-3">
          Settings
        </dt-tab>
      </template>
      <div style="padding:18px 4px;">
        <dt-tab-panel id="panel-1" tab-id="tab-1">
          <p style="margin:0;font-size:14px;color:var(--dt-color-foreground-secondary);">
            Overview panel content.
          </p>
        </dt-tab-panel>
        <dt-tab-panel id="panel-2" tab-id="tab-2">
          <p style="margin:0;font-size:14px;color:var(--dt-color-foreground-secondary);">
            Members panel content.
          </p>
        </dt-tab-panel>
        <dt-tab-panel id="panel-3" tab-id="tab-3">
          <p style="margin:0;font-size:14px;color:var(--dt-color-foreground-secondary);">
            Settings panel content.
          </p>
        </dt-tab-panel>
      </div>
    </dt-tab-group>
  </div>
</template>
