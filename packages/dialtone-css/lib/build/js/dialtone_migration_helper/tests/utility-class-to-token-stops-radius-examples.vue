<!--
  Manual-test fixture for the radius portion of the `utility-class-to-token-stops` migration.
  Point `pnpm dialtone-migration-helper` at this file to exercise every rewrite in one pass.

  Expected transformations:
    - d-bar{N}          → d-bar-{stop}
    - d-btr{N}          → d-bbsr-{stop}
    - d-bbr{N}          → d-bber-{stop}
    - d-blr{N}          → d-bisr-{stop}
    - d-brr{N}          → d-bier-{stop}
    - d-{btr|bbr|blr|brr}-{pill|circle} → d-{bbsr|bber|bisr|bier}-{pill|circle}
    - d-bar-pill, d-bar-circle, d-bar-unset: unchanged (canonical)
-->
<template>
  <!-- All-corners: every legacy numeric stop -->
  <div class="d-bar0">bar0 → bar-0</div>
  <div class="d-bar1">bar1 → bar-100</div>
  <div class="d-bar2">bar2 → bar-200</div>
  <div class="d-bar4">bar4 → bar-300</div>
  <div class="d-bar6">bar6 → bar-350</div>
  <div class="d-bar8">bar8 → bar-400</div>
  <div class="d-bar12">bar12 → bar-450</div>
  <div class="d-bar16">bar16 → bar-500</div>
  <div class="d-bar24">bar24 → bar-550 (new token)</div>
  <div class="d-bar32">bar32 → bar-600</div>

  <!-- Side-pair numeric: physical → logical -->
  <div class="d-btr6">btr6 → bbsr-350 (top pair)</div>
  <div class="d-bbr8">bbr8 → bber-400 (bottom pair)</div>
  <div class="d-blr12">blr12 → bisr-450 (left pair)</div>
  <div class="d-brr16">brr16 → bier-500 (right pair)</div>
  <div class="d-btr24">btr24 → bbsr-550</div>
  <div class="d-bbr32">bbr32 → bber-600</div>

  <!-- Side-pair keyword: physical → logical -->
  <div class="d-btr-pill">btr-pill → bbsr-pill</div>
  <div class="d-btr-circle">btr-circle → bbsr-circle</div>
  <div class="d-bbr-pill">bbr-pill → bber-pill</div>
  <div class="d-blr-pill">blr-pill → bisr-pill</div>
  <div class="d-brr-circle">brr-circle → bier-circle</div>

  <!-- Canonical names: unchanged -->
  <div class="d-bar-pill">bar-pill (unchanged)</div>
  <div class="d-bar-circle">bar-circle (unchanged)</div>
  <div class="d-bar-unset">bar-unset (unchanged)</div>

  <!-- Mixed in one class attribute (multi-class rewrite) -->
  <div class="d-p-200 d-bar6 d-btr8 d-blr-pill d-fc-primary">
    mixed: bar6+btr8+blr-pill get rewritten; d-p-200 and d-fc-primary untouched
  </div>

  <!-- Class binding via object syntax (plain strings inside) -->
  <div :class="{ 'd-bar6': rounded, 'd-btr-pill': pillTop }">
    object-syntax binding
  </div>

  <!-- Class binding via template literal -->
  <div :class="`d-bar${size} d-btr${size}`">
    template-literal (only matches literal suffixes; dynamic interpolation stays as-is)
  </div>

  <!-- New logical names (already correct): not touched -->
  <div class="d-bar-350 d-bbsr-400 d-bier-pill d-bssr-500 d-beer-circle">
    new logical names stay as-is
  </div>
</template>
