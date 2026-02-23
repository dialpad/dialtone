<template>
  <!--
    TEST FILE FOR COLOR STOP MIGRATION
    Tests all accent color stop renames from irregular numbering to standard 12-stop scale.
    Hex values are unchanged — only stop names moved.
  -->

  <!-- ============================================ -->
  <!-- PURPLE: 250→300, 300→400, 350→500, 400→600, 450→700, 500→800, 550→900, 600→950 -->
  <!-- ============================================ -->

  <!-- TEST 1: Purple CSS custom properties -->
  <div :style="{ color: 'var(--dt-color-purple-250)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-300)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-350)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-400)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-450)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-500)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-550)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-600)' }"></div>

  <!-- TEST 2: Purple HSL variants -->
  <div :style="{ color: 'var(--dt-color-purple-350-h)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-350-s)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-350-l)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-350-hsl)' }"></div>

  <!-- TEST 3: Purple utility classes -->
  <div class="d-bgc-purple-250 d-fc-purple-300 d-bc-purple-350"></div>
  <div class="d-bgg-from-purple-450 d-bgg-to-purple-500"></div>

  <!-- TEST 4: Purple unchanged stops (should NOT be modified) -->
  <div :style="{ color: 'var(--dt-color-purple-50)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-100)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-200)' }"></div>
  <div :style="{ color: 'var(--dt-color-purple-1000)' }"></div>
  <div class="d-bgc-purple-50 d-fc-purple-100 d-bc-purple-200"></div>

  <!-- ============================================ -->
  <!-- BLUE: 425→500, 450→600, 475→700, 500→800, 600→900, 900→950 -->
  <!-- ============================================ -->

  <!-- TEST 5: Blue CSS custom properties -->
  <div :style="{ color: 'var(--dt-color-blue-425)' }"></div>
  <div :style="{ color: 'var(--dt-color-blue-450)' }"></div>
  <div :style="{ color: 'var(--dt-color-blue-475)' }"></div>
  <div :style="{ color: 'var(--dt-color-blue-500)' }"></div>
  <div :style="{ color: 'var(--dt-color-blue-600)' }"></div>
  <div :style="{ color: 'var(--dt-color-blue-900)' }"></div>

  <!-- TEST 6: Blue utility classes -->
  <div class="d-bgc-blue-425 d-fc-blue-450 d-bc-blue-475"></div>
  <div class="d-bgg-from-blue-600 d-bgg-to-blue-900"></div>

  <!-- TEST 7: Blue unchanged stops (300 also unchanged for blue) -->
  <div :style="{ color: 'var(--dt-color-blue-50)' }"></div>
  <div :style="{ color: 'var(--dt-color-blue-100)' }"></div>
  <div :style="{ color: 'var(--dt-color-blue-200)' }"></div>
  <div :style="{ color: 'var(--dt-color-blue-300)' }"></div>
  <div :style="{ color: 'var(--dt-color-blue-1000)' }"></div>

  <!-- ============================================ -->
  <!-- MAGENTA: 250→300, 300→400, 400→500, 425→600, 475→700, 500→800, 600→900, 900→950 -->
  <!-- ============================================ -->

  <!-- TEST 8: Magenta CSS custom properties -->
  <div :style="{ color: 'var(--dt-color-magenta-250)' }"></div>
  <div :style="{ color: 'var(--dt-color-magenta-300)' }"></div>
  <div :style="{ color: 'var(--dt-color-magenta-400)' }"></div>
  <div :style="{ color: 'var(--dt-color-magenta-425)' }"></div>
  <div :style="{ color: 'var(--dt-color-magenta-475)' }"></div>
  <div :style="{ color: 'var(--dt-color-magenta-500)' }"></div>
  <div :style="{ color: 'var(--dt-color-magenta-600)' }"></div>
  <div :style="{ color: 'var(--dt-color-magenta-900)' }"></div>

  <!-- TEST 9: Magenta utility classes -->
  <div class="d-bgc-magenta-250 d-fc-magenta-300 d-bc-magenta-400"></div>
  <div class="d-bgg-from-magenta-475 d-bgg-to-magenta-500"></div>

  <!-- ============================================ -->
  <!-- GOLD: 350→400, 400→500, 450→600, 500→700, 600→800, 700→900, 900→950 -->
  <!-- ============================================ -->

  <!-- TEST 10: Gold CSS custom properties -->
  <div :style="{ color: 'var(--dt-color-gold-350)' }"></div>
  <div :style="{ color: 'var(--dt-color-gold-400)' }"></div>
  <div :style="{ color: 'var(--dt-color-gold-450)' }"></div>
  <div :style="{ color: 'var(--dt-color-gold-500)' }"></div>
  <div :style="{ color: 'var(--dt-color-gold-600)' }"></div>
  <div :style="{ color: 'var(--dt-color-gold-700)' }"></div>
  <div :style="{ color: 'var(--dt-color-gold-900)' }"></div>

  <!-- TEST 11: Gold utility classes -->
  <div class="d-bgc-gold-350 d-fc-gold-400 d-bc-gold-450"></div>
  <div class="d-bgg-from-gold-600 d-bgg-to-gold-700"></div>

  <!-- ============================================ -->
  <!-- GREEN: 350→400, 400→500, 425→600, 475→700, 500→800, 600→900, 900→950 -->
  <!-- ============================================ -->

  <!-- TEST 12: Green CSS custom properties -->
  <div :style="{ color: 'var(--dt-color-green-350)' }"></div>
  <div :style="{ color: 'var(--dt-color-green-400)' }"></div>
  <div :style="{ color: 'var(--dt-color-green-425)' }"></div>
  <div :style="{ color: 'var(--dt-color-green-475)' }"></div>
  <div :style="{ color: 'var(--dt-color-green-500)' }"></div>
  <div :style="{ color: 'var(--dt-color-green-600)' }"></div>
  <div :style="{ color: 'var(--dt-color-green-900)' }"></div>

  <!-- TEST 13: Green utility classes -->
  <div class="d-bgc-green-350 d-fc-green-400 d-bc-green-425"></div>
  <div class="d-bgg-from-green-500 d-bgg-to-green-600"></div>

  <!-- ============================================ -->
  <!-- RED: 350→400, 400→500, 450→600, 500→700, 600→800, 700→900, 900→950 -->
  <!-- ============================================ -->

  <!-- TEST 14: Red CSS custom properties -->
  <div :style="{ color: 'var(--dt-color-red-350)' }"></div>
  <div :style="{ color: 'var(--dt-color-red-400)' }"></div>
  <div :style="{ color: 'var(--dt-color-red-450)' }"></div>
  <div :style="{ color: 'var(--dt-color-red-500)' }"></div>
  <div :style="{ color: 'var(--dt-color-red-600)' }"></div>
  <div :style="{ color: 'var(--dt-color-red-700)' }"></div>
  <div :style="{ color: 'var(--dt-color-red-900)' }"></div>

  <!-- TEST 15: Red utility classes -->
  <div class="d-bgc-red-350 d-fc-red-400 d-bc-red-450"></div>
  <div class="d-bgg-from-red-600 d-bgg-to-red-700"></div>

  <!-- ============================================ -->
  <!-- CROSS-CUTTING CONCERNS -->
  <!-- ============================================ -->

  <!-- TEST 16: Pseudo-prefixed utility classes -->
  <div class="h:d-bgc-purple-350 f:d-fc-blue-425 a:d-bc-green-500"></div>

  <!-- TEST 17: Responsive-prefixed utility classes -->
  <div class="sm:d-bgc-magenta-400 md:d-fc-gold-450 lg:d-bc-red-600"></div>

  <!-- TEST 18: Multiple colors on one element -->
  <div
    class="d-bgc-purple-350 d-fc-blue-425 d-bc-green-500"
    :style="{ 'border-color': 'var(--dt-color-red-450)' }"
  ></div>

  <!-- TEST 19: Collision test — purple-300 must become 400, NOT 600 -->
  <div :style="{ color: 'var(--dt-color-purple-300)' }"></div>

  <!-- TEST 20: Non-accent colors should NOT be touched -->
  <div :style="{ color: 'var(--dt-color-black-500)' }"></div>
  <div :style="{ color: 'var(--dt-color-tan-300)' }"></div>
  <div class="d-bgc-black-300 d-fc-tan-400"></div>
</template>

<style>
/* TEST 21: CSS custom properties in stylesheets */
.test-css-vars {
  color: var(--dt-color-purple-350);
  background-color: var(--dt-color-blue-425);
  border-color: var(--dt-color-green-500);
}

/* TEST 22: HSL variants in stylesheets */
.test-hsl {
  --custom-h: var(--dt-color-magenta-475-h);
  --custom-s: var(--dt-color-gold-450-s);
  --custom-l: var(--dt-color-red-600-l);
  --custom-hsl: var(--dt-color-purple-550-hsl);
}

/* TEST 23: Unchanged stops in stylesheets */
.test-unchanged {
  color: var(--dt-color-purple-50);
  background: var(--dt-color-blue-100);
  border-color: var(--dt-color-green-200);
  outline-color: var(--dt-color-red-1000);
}
</style>
