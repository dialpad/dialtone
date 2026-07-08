<template>
  <!-- MUST-LOOK-IDENTICAL control: shadows have NOT changed in Next as shipped
       (the elevation refresh was reverted from `next` and lives on a separate
       branch). Shadow shape/spread should match exactly across the pair; only
       the ambient neutral warmth of the surfaces may differ. Any shadow
       difference beyond that is a bug — this section flips to "expected" only
       if the elevation refresh lands later. -->
  <div class="vg-scene vg-scene--well" style="width:600px;">
    <p class="vg-heading">
      Shadows — unchanged in Next
    </p>
    <div style="display:flex;gap:32px;justify-content:center;">
      <div style="text-align:center;">
        <div
          class="d-bs-sm"
          style="width:128px;
          height:88px;
          border-radius:12px;
          background:var(--dt-color-surface-primary);"
        />
        <p class="vg-caption">
          small<br><code style="font-size:10px;">.d-bs-sm</code>
        </p>
      </div>
      <div style="text-align:center;">
        <div
          class="d-bs-lg"
          style="width:128px;
          height:88px;
          border-radius:12px;
          background:var(--dt-color-surface-primary);"
        />
        <p class="vg-caption">
          large<br><code style="font-size:10px;">.d-bs-lg</code>
        </p>
      </div>
      <div style="text-align:center;">
        <div
          class="d-bs-xl"
          style="width:128px;
          height:88px;
          border-radius:12px;
          background:var(--dt-color-surface-primary);"
        />
        <p class="vg-caption">
          extra large<br><code style="font-size:10px;">.d-bs-xl</code>
        </p>
      </div>
    </div>
  </div>
</template>
