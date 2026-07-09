<template>
  <!-- DLT-2941: DtFilterPill is a NEW core component in Next (staging only
       has recipe pills) with dropdown single-select, deferred apply/cancel,
       and a read-only state — captured after-only. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Filter pill
    </p>
    <div style="display:flex;gap:20px;align-items:center;">
      <dt-filter-pill
        label="Status"
        :model-value="[
          { name: 'Open' },
          { name: 'Pending', active: true },
          { name: 'Closed' },
        ]"
        end-tooltip-text="Remove"
      />
      <dt-filter-pill
        label="Team"
        :model-value="[{ name: 'Support', active: true }]"
        :read-only="true"
        end-tooltip-text="Remove"
      />
    </div>
  </div>
</template>
