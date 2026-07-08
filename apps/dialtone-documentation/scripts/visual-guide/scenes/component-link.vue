<template>
  <!-- DtLink rendering across branches; Next also underlines quiet links on
       hover (not capturable statically — covered in guide prose). -->
  <div class="vg-scene" style="width:520px;">
    <p class="vg-heading">
      Link
    </p>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <p style="margin:0;font-size:15px;color:var(--dt-color-foreground-primary);">
        Standalone: <dt-link href="#">
          View call settings
        </dt-link>
      </p>
      <p style="margin:0;font-size:15px;color:var(--dt-color-foreground-primary);">
        Inline in body copy — you can <dt-link href="#">
          review the migration guide
        </dt-link> for the full details of every change.
      </p>
    </div>
  </div>
</template>
