<template>
  <!-- DLT-2957: empty state visual refresh — illustration/title/body/CTA
       layout restyle. Same component API on both branches. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Empty state
    </p>
    <dt-empty-state
      header-text="Nothing to see here"
      body-text="Looks like there is no data to display here."
    >
      <template #illustration>
        <dt-illustration-nothing-to-see-here />
      </template>
    </dt-empty-state>
  </div>
</template>
