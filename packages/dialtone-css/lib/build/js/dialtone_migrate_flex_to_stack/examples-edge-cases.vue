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

  <!-- ============================================ -->
  <!-- NEW TESTS: REF ATTRIBUTE SKIP DETECTION -->
  <!-- ============================================ -->

  <!-- TEST 28: Ref with DOM API (addEventListener) - Should be SKIPPED -->
  <div ref="containerRef" class="d-d-flex d-ai-center d-g8">
    <span>Element with ref used for DOM manipulation</span>
  </div>

  <!-- TEST 29: Ref with DOM API (focus) - Should be SKIPPED -->
  <nav ref="navElement" class="d-d-flex d-fd-row d-jc-between">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
  </nav>

  <!-- TEST 30: Ref without DOM API usage - Should be CONVERTED (ref alone doesn't trigger skip) -->
  <div ref="simpleRef" class="d-d-flex d-ai-center">
    <span>Ref but no DOM API usage in script</span>
  </div>

  <!-- ============================================ -->
  <!-- NEW TESTS: DYNAMIC CLASS BINDING SKIP -->
  <!-- ============================================ -->

  <!-- TEST 31: Dynamic :class with flex utilities - Should be SKIPPED -->
  <div :class="['d-d-flex d-ai-center', { 'd-jc-between': isActive }]">
    <span>Dynamic binding with flex utilities</span>
  </div>

  <!-- TEST 32: Dynamic :class array with flex utilities - Should be SKIPPED -->
  <div :class="[flexClass, 'd-d-flex', alignmentClass]">
    <span>Dynamic array binding with flex</span>
  </div>

  <!-- TEST 33: Dynamic :class object with flex utilities - Should be SKIPPED -->
  <div :class="{ 'd-d-flex d-ai-center': isVisible, 'd-jc-end': alignEnd }">
    <span>Dynamic object binding with flex</span>
  </div>

  <!-- TEST 34: Dynamic :class without flex utilities - Should be CONVERTED -->
  <div class="d-d-flex d-ai-center" :class="{ 'd-p16': hasPadding }">
    <span>Dynamic binding but NO flex utilities in binding</span>
  </div>

  <!-- ============================================ -->
  <!-- NEW TESTS: MORE SEMANTIC HTML ELEMENTS -->
  <!-- ============================================ -->

  <!-- TEST 35: span as flex container - Should use as="span" -->
  <span class="d-d-flex d-ai-center d-g4">
    <span>Inner span</span>
  </span>

  <!-- TEST 36: header as flex container - Should use as="header" -->
  <header class="d-d-flex d-jc-between d-ai-center d-p16">
    <span>Logo</span>
    <nav>Navigation</nav>
  </header>

  <!-- TEST 37: footer as flex container - Should use as="footer" -->
  <footer class="d-d-flex d-fd-column d-g16 d-p24">
    <span>Footer content</span>
  </footer>

  <!-- TEST 38: aside as flex container - Should use as="aside" -->
  <aside class="d-d-flex d-fd-column d-g8">
    <span>Sidebar item 1</span>
    <span>Sidebar item 2</span>
  </aside>

  <!-- TEST 39: article as flex container - Should use as="article" -->
  <article class="d-d-flex d-fd-column d-g16">
    <h3>Article title</h3>
    <p>Article content</p>
  </article>

  <!-- TEST 40: main as flex container - Should use as="main" -->
  <main class="d-d-flex d-fd-column d-g24">
    <section>Section 1</section>
    <section>Section 2</section>
  </main>

  <!-- TEST 41: nav as flex container - Should use as="nav" -->
  <nav class="d-d-flex d-ai-center d-g16">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </nav>

  <!-- ============================================ -->
  <!-- NEW TESTS: NESTED SAME-TAG ELEMENTS -->
  <!-- ============================================ -->

  <!-- TEST 42: Nested divs at depth 2 - closing tags must match correctly -->
  <div class="d-d-flex d-fd-column d-g8">
    <div class="d-d-flex d-ai-center d-g4">
      <span>Nested depth 2</span>
    </div>
  </div>

  <!-- TEST 43: Nested divs at depth 3 - closing tags must match correctly -->
  <div class="d-d-flex d-fd-column d-g16">
    <div class="d-d-flex d-ai-center d-g8">
      <div class="d-d-flex d-jc-center">
        <span>Nested depth 3</span>
      </div>
    </div>
  </div>

  <!-- TEST 44: Nested spans - closing tags with as="span" must match -->
  <span class="d-d-flex d-ai-center">
    <span class="d-d-flex d-g4">
      <span>Inner content</span>
    </span>
  </span>

  <!-- TEST 45: Mixed nesting - different tag types -->
  <section class="d-d-flex d-fd-column d-g24">
    <header class="d-d-flex d-jc-between">
      <span>Title</span>
    </header>
    <div class="d-d-flex d-ai-center d-g8">
      <span>Content</span>
    </div>
    <footer class="d-d-flex d-jc-end">
      <span>Footer</span>
    </footer>
  </section>

  <!-- ============================================ -->
  <!-- NEW TESTS: SELF-CLOSING AND EMPTY ELEMENTS -->
  <!-- ============================================ -->

  <!-- TEST 46: Self-closing with flex - Should NOT convert (no content to wrap) -->
  <div class="d-d-flex d-ai-center" />

  <!-- TEST 47: Empty element with flex - Should convert -->
  <div class="d-d-flex d-fd-column"></div>
</template>

<script setup>
// Test file for edge case validation

// Refs for DOM manipulation tests (TEST 28, 29)
import { ref, onMounted } from 'vue';

const containerRef = ref(null);
const navElement = ref(null);
const simpleRef = ref(null);

// This triggers skip for containerRef (TEST 28)
onMounted(() => {
  containerRef.value.addEventListener('click', () => {});
});

// This triggers skip for navElement (TEST 29)
function focusNav() {
  navElement.value.focus();
}

// simpleRef is used but NOT for DOM APIs, so it should NOT trigger skip (TEST 30)
function getRefValue() {
  return simpleRef.value;
}

// Dynamic class variables for tests
const isActive = ref(false);
const flexClass = ref('d-d-flex');
const alignmentClass = ref('d-ai-center');
const isVisible = ref(true);
const alignEnd = ref(false);
const hasPadding = ref(true);
</script>
