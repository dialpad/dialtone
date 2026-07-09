<template>
  <!-- DLT-3438: presence indicators gain internal shapes/icons so statuses
       are distinguishable by more than color. `dnd` may not exist on the
       before branch and falls back — part of the story. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Presence
    </p>
    <div style="display:flex;gap:36px;align-items:flex-end;">
      <div
        v-for="p in ['active', 'away', 'busy', 'dnd', 'offline']"
        :key="p"
        style="text-align:center;"
      >
        <dt-presence
          :presence="p"
          class="vg-presence-size"
        />
        <p class="vg-caption">
          {{ p }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Render presence dots large enough to see the new internal shapes. */
.vg-presence-size {
  inline-size: 20px;
  block-size: 20px;
}
</style>
