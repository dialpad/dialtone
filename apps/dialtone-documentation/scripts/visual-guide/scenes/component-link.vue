<template>
  <!-- Quiet links (no rest underline) gained a hover underline in Next: the
       `underline` prop (:underline="false") shows an underline on hover
       (link.less &--no-underline), while the old utility-class approach
       (d-td-none, !important) never underlined. The capture pipeline moves the
       pointer over #vg-hover-target before shooting (`hover` scene flag), so
       the second link is a REAL :hover state. The quiet mechanism is
       branch-adaptive: d-td-none on staging (the old way — it would also kill
       Next's hover underline via !important), :underline="false" on Next. -->
  <div
    class="vg-scene"
    style="width:520px;"
  >
    <p class="vg-heading">
      Link — quiet link, rest vs hover
    </p>
    <div style="display:flex;gap:64px;">
      <div style="text-align:center;">
        <p class="vg-label">
          rest
        </p>
        <dt-link
          href="#"
          :underline="false"
          :class="quietClass"
        >
          View call settings
        </dt-link>
      </div>
      <div style="text-align:center;">
        <p class="vg-label">
          hover (pointer over)
        </p>
        <dt-link
          id="vg-hover-target"
          href="#"
          :underline="false"
          :class="quietClass"
        >
          View call settings
        </dt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useIsNext } from '../harness/use-is-next.js';

// Staging has no `underline` prop — quiet links were authored with the
// d-td-none utility class there.
const isNext = useIsNext();
const quietClass = computed(() => (isNext.value ? '' : 'd-td-none'));
</script>
