<template>
  <!--
    TEST FILE FOR FLEX-TO-STACK MIGRATION EDGE CASES
    This file tests all edge cases identified in Phase 11
  -->

  <!-- TEST 1: d-fl-center - Should convert to dt-stack with align="center" justify="center" direction="row" -->
  <div class="d-fl-center">
    <span>Centered content</span>
  </div>

  <!-- TEST 2: d-fl-center with additional utilities - Should convert and retain other classes -->
  <div class="d-fl-center d-p16 d-ba d-bc-primary">
    <span>Centered with padding and border</span>
  </div>

  <!-- TEST 3: d-d-grid - Should be SKIPPED (grid container, not flex) -->
  <div class="d-d-grid d-g-cols2 d-g16">
    <div>Grid item 1</div>
    <div>Grid item 2</div>
  </div>

  <!-- TEST 4: d-d-inline-grid - Should be SKIPPED (grid container, not flex) -->
  <div class="d-d-inline-grid d-g-cols3">
    <span>A</span>
    <span>B</span>
    <span>C</span>
  </div>

  <!-- TEST 5: d-d-inline-flex - Should be SKIPPED (DtStack is block-level only) -->
  <div class="d-d-inline-flex d-ai-center d-g8">
    <span>Inline flex item</span>
  </div>

  <!-- TEST 6: d-d-contents - Should be SKIPPED (layout tree manipulation) -->
  <div class="d-d-flex d-d-contents d-ai-center">
    <span>Contents display</span>
  </div>

  <!-- TEST 7: d-fl-col4 - Should be SKIPPED (deprecated flex column system) -->
  <div class="d-d-flex d-fl-col4">
    <div>Column 1</div>
    <div>Column 2</div>
    <div>Column 3</div>
    <div>Column 4</div>
  </div>

  <!-- TEST 8: d-stack8 - Should be SKIPPED (auto-spacing utility, margin-based) -->
  <div class="d-d-flex d-stack8">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>

  <!-- TEST 9: d-flow8 - Should be SKIPPED (auto-spacing utility, margin-based) -->
  <div class="d-d-flex d-flow8">
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
  </div>

  <!-- TEST 10: d-flg8 - Should be RETAINED as class (deprecated flex gap) -->
  <div class="d-d-flex d-flg8 d-ai-center">
    <span>Item 1</span>
    <span>Item 2</span>
  </div>

  <!-- TEST 11: d-ji-center - Should be RETAINED as class (justify-items, grid/flex hybrid) -->
  <div class="d-d-flex d-ji-center">
    <div>Item with justify-items</div>
  </div>

  <!-- TEST 12: d-js-center - Should be RETAINED as class (justify-self, grid/flex hybrid) -->
  <div class="d-d-flex d-js-center d-ai-center">
    <div>Item with justify-self</div>
  </div>

  <!-- TEST 13: d-plc-center - Should be RETAINED as class (place-content, grid shorthand) -->
  <div class="d-d-flex d-plc-center">
    <div>Item with place-content</div>
  </div>

  <!-- TEST 14: d-pli-center - Should be RETAINED as class (place-items, grid shorthand) -->
  <div class="d-d-flex d-pli-center">
    <div>Item with place-items</div>
  </div>

  <!-- TEST 15: d-pls-center - Should be RETAINED as class (place-self, grid shorthand) -->
  <div class="d-d-flex d-pls-center d-ai-center">
    <div>Item with place-self</div>
  </div>

  <!-- TEST 16: Direction default (no direction) - Should add direction="row" -->
  <div class="d-d-flex d-ai-center d-g8">
    <span>No explicit direction</span>
  </div>

  <!-- TEST 17: Explicit d-fd-row - Should convert to direction="row" -->
  <div class="d-d-flex d-fd-row d-ai-center d-g8">
    <span>Explicit row</span>
  </div>

  <!-- TEST 18: Explicit d-fd-column - Should OMIT direction prop (DtStack default) -->
  <div class="d-d-flex d-fd-column d-ai-center d-g8">
    <span>Explicit column</span>
  </div>

  <!-- TEST 19: d-fd-row-reverse - Should convert to direction="row-reverse" -->
  <div class="d-d-flex d-fd-row-reverse d-jc-end">
    <span>Row reverse</span>
  </div>

  <!-- TEST 20: d-fd-column-reverse - Should convert to direction="column-reverse" -->
  <div class="d-d-flex d-fd-column-reverse d-ai-end">
    <span>Column reverse</span>
  </div>

  <!-- TEST 21: Multiple direction utilities - Should retain all as classes, add direction="row" -->
  <div class="d-d-flex d-fd-row d-fd-column d-ai-center">
    <span>Multiple directions</span>
  </div>

  <!-- TEST 22: Complex case - d-fl-center with additional flex utilities -->
  <div class="d-fl-center d-fw-wrap d-g16 d-p24">
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
  </div>

  <!-- TEST 23: Regular flex with all supported props -->
  <div class="d-d-flex d-fd-row d-ai-center d-jc-between d-g16">
    <span>Full props</span>
    <span>Example</span>
  </div>

  <!-- TEST 24: Flex with retained classes only -->
  <div class="d-d-flex d-fw-wrap d-as-start d-order2">
    <div>Retained utilities</div>
  </div>

  <!-- TEST 25: Combination - retained + converted utilities -->
  <div class="d-d-flex d-ai-center d-g8 d-p16 d-fw-wrap d-fl-grow1">
    <span>Mixed utilities</span>
  </div>

  <!-- TEST 26: Non-div element with as prop -->
  <section class="d-d-flex d-fd-column d-g24">
    <h2>Section as flex container</h2>
    <p>Should use as="section"</p>
  </section>

  <!-- TEST 27: Multiple edge cases combined -->
  <div class="d-d-flex d-flg8 d-ji-center d-ai-center d-p16">
    <span>Multiple edge cases</span>
  </div>
</template>

<script setup>
// Test file for edge case validation
</script>
