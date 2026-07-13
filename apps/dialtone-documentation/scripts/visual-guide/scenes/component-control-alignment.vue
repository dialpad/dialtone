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
      <div
        data-vg-measure="input"
        style="width:190px;"
      >
        <dt-input
          model-value="Rosa Diaz"
          aria-label="Search people"
        />
      </div>
      <div
        data-vg-measure="select"
        style="width:170px;"
      >
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
      <dt-button
        data-vg-measure="button"
        importance="primary"
      >
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
  // Measure the rendered control boxes (not the native elements inside them —
  // DtInput's visible box is its wrapper). Labels come from data attributes so
  // reordering the row can't silently mislabel a measurement.
  const heights = [...document.querySelectorAll('#vg-align [data-vg-measure]')]
    .map((el) => `${el.dataset.vgMeasure} ${Math.round(el.getBoundingClientRect().height)}px`);
  measured.value = heights.join(' · ');
});
</script>
