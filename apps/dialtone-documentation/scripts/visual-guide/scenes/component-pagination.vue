<template>
  <!-- DLT-2965: pagination visual refresh — inherits the new button styling.
       Same component API on both branches. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Pagination
    </p>
    <dt-pagination
      :total-pages="12"
      :active-page="5"
      :max-visible="5"
      aria-label="Pagination"
      prev-aria-label="Previous"
      next-aria-label="Next"
    />
  </div>
</template>
