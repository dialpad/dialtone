<template>
  <!-- Buttons, inputs, and selects were restyled in the same pass and must
       keep matching heights when paired in a row. The dashed block borders
       shrink-wrap the row: equal-height controls touch both lines, a
       mismatched control leaves a visible gap. Heights are measured at
       runtime so each branch prints its own real values — the numbers can
       move between branches, but within a row they have to match. Labels
       are omitted (staging DtSelectMenu has no show-label prop). -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Paired controls — one row
    </p>
    <div
      id="vg-align"
      style="display:inline-flex;align-items:center;gap:12px;
      border-block:1px dashed var(--dt-color-border-subtle);"
    >
      <div style="width:190px;">
        <dt-input
          model-value="Rosa Diaz"
          aria-label="Search people"
        />
      </div>
      <div style="width:170px;">
        <dt-select-menu
          model-value="all"
          aria-label="Filter by team"
        >
          <option
            value="all"
            selected
          >
            All teams
          </option>
          <option value="support">
            Support
          </option>
        </dt-select-menu>
      </div>
      <dt-button importance="primary">
        Apply
      </dt-button>
    </div>
    <p
      class="vg-mono"
      style="margin-top:16px;"
    >
      {{ measured }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const measured = ref('');

onMounted(() => {
  // Measure the row's direct children (the rendered control boxes), not the
  // native elements inside them — DtInput's visible box is its wrapper.
  const names = ['input', 'select', 'button'];
  const heights = [...document.querySelectorAll('#vg-align > *')]
    .map((el, i) => `${names[i]} ${Math.round(el.getBoundingClientRect().height)}px`);
  measured.value = heights.join(' · ');
});
</script>
