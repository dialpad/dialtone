<template>
  <!--
    TEST FILE FOR BASE-TO-SEMANTIC MIGRATION
    Tests replacement of base color utility classes with semantic equivalents.
  -->

  <!-- ============================================ -->
  <!-- FOREGROUND UTILITIES (d-fc-*) -->
  <!-- ============================================ -->

  <!-- Mapped foreground classes -->
  <p class="d-fc-black-600">tertiary text</p>
  <p class="d-fc-black-700">secondary text</p>
  <p class="d-fc-black-900">primary text</p>
  <p class="d-fc-red-600">critical text</p>
  <p class="d-fc-red-700">critical-strong text</p>
  <p class="d-fc-green-800">success text</p>
  <p class="d-fc-green-900">success-strong text</p>
  <p class="d-fc-gold-800">warning text</p>

  <!-- Unmapped foreground classes (should NOT be replaced) -->
  <p class="d-fc-purple-600">no foreground mapping for purple</p>
  <p class="d-fc-blue-500">no foreground mapping for blue</p>
  <p class="d-fc-magenta-400">no foreground mapping for magenta</p>
  <p class="d-fc-black-500">ambiguous: placeholder or disabled</p>

  <!-- ============================================ -->
  <!-- SURFACE UTILITIES (d-bgc-*) -->
  <!-- ============================================ -->

  <!-- Mapped surface classes -->
  <div class="d-bgc-black-50">primary surface</div>
  <div class="d-bgc-black-100">secondary surface</div>
  <div class="d-bgc-black-200">moderate surface</div>
  <div class="d-bgc-black-300">bold surface</div>
  <div class="d-bgc-black-600">strong surface</div>
  <div class="d-bgc-black-800">contrast surface</div>
  <div class="d-bgc-red-50">critical-subtle</div>
  <div class="d-bgc-red-100">critical</div>
  <div class="d-bgc-red-600">critical-strong</div>
  <div class="d-bgc-gold-50">warning-subtle</div>
  <div class="d-bgc-gold-100">warning</div>
  <div class="d-bgc-gold-400">warning-strong</div>
  <div class="d-bgc-green-50">success-subtle</div>
  <div class="d-bgc-green-100">success</div>
  <div class="d-bgc-green-800">success-strong</div>
  <div class="d-bgc-blue-50">info-subtle</div>
  <div class="d-bgc-blue-100">info</div>
  <div class="d-bgc-blue-800">info-strong</div>
  <div class="d-bgc-purple-50">brand-subtle</div>
  <div class="d-bgc-purple-100">brand</div>
  <div class="d-bgc-purple-600">brand-strong</div>

  <!-- Unmapped surface classes -->
  <div class="d-bgc-magenta-400">no surface mapping for magenta</div>

  <!-- ============================================ -->
  <!-- BORDER UTILITIES (d-bc-*) -->
  <!-- ============================================ -->

  <!-- Mapped border classes -->
  <div class="d-bc-red-300">critical-subtle</div>
  <div class="d-bc-red-600">critical</div>
  <div class="d-bc-red-800">critical-strong</div>
  <div class="d-bc-green-300">success-subtle</div>
  <div class="d-bc-green-700">success</div>
  <div class="d-bc-green-900">success-strong</div>
  <div class="d-bc-gold-300">warning-subtle</div>
  <div class="d-bc-gold-500">warning</div>
  <div class="d-bc-gold-700">warning-strong</div>
  <div class="d-bc-purple-300">brand-subtle</div>
  <div class="d-bc-purple-600">brand</div>
  <div class="d-bc-purple-800">brand-strong</div>
  <div class="d-bc-blue-500">focus</div>

  <!-- ============================================ -->
  <!-- DIVIDE UTILITIES (d-divide-*) -->
  <!-- ============================================ -->

  <div class="d-divide-red-600">critical divide</div>
  <div class="d-divide-green-700">success divide</div>

  <!-- ============================================ -->
  <!-- PSEUDO & RESPONSIVE PREFIXED -->
  <!-- ============================================ -->

  <p class="h:d-fc-red-600">hover critical text</p>
  <p class="f:d-fc-green-800">focus success text</p>
  <div class="sm:d-bgc-black-100">responsive secondary surface</div>
  <div class="md:d-bc-red-600">responsive critical border</div>

  <!-- ============================================ -->
  <!-- ALREADY-SEMANTIC CLASSES (should NOT be touched) -->
  <!-- ============================================ -->

  <p class="d-fc-critical">already semantic</p>
  <div class="d-bgc-primary">already semantic</div>
  <div class="d-bc-success">already semantic</div>
</template>

<style>
/* ============================================ */
/* CSS PROPERTY CONTEXT: FOREGROUND (color:)    */
/* ============================================ */

/* Mapped */
.test-fg-mapped {
  color: var(--dt-color-red-600);
  color: var(--dt-color-black-900);
}

/* Unmapped (should NOT be replaced) */
.test-fg-unmapped {
  color: var(--dt-color-purple-600);
}

/* Already semantic (should NOT be replaced) */
.test-fg-semantic {
  color: var(--dt-color-foreground-critical);
}

/* ============================================ */
/* CSS PROPERTY CONTEXT: SURFACE (background)   */
/* ============================================ */

/* background-color longhand */
.test-bg-longhand {
  background-color: var(--dt-color-red-100);
  background-color: var(--dt-color-black-100);
}

/* background shorthand — color only */
.test-bg-shorthand {
  background: var(--dt-color-red-100);
  background: var(--dt-color-purple-100);
}

/* background shorthand — color + image/position/repeat */
.test-bg-shorthand-complex {
  background: var(--dt-color-black-100) url('banner.png') no-repeat center;
  background: url('icon.svg') no-repeat var(--dt-color-green-100);
  background: var(--dt-color-blue-100) no-repeat center / cover;
  background: var(--dt-color-red-50) url('texture.png') repeat-x top left;
}

/* ============================================ */
/* CSS PROPERTY CONTEXT: BORDER                 */
/* ============================================ */

/* border-color longhand */
.test-border-longhand {
  border-color: var(--dt-color-red-600);
  border-block-start-color: var(--dt-color-green-700);
}

/* border shorthand with size token before color */
.test-border-shorthand {
  border: var(--dt-size-border-300) solid var(--dt-color-red-600);
}

/* border logical properties */
.test-border-logical {
  border-block-start: var(--dt-size-border-100) solid var(--dt-color-red-600);
  border-inline-end-color: var(--dt-color-green-700);
  border-block-end-color: var(--dt-color-gold-500);
}

/* ============================================ */
/* SKIP CASES (should NOT be replaced)          */
/* ============================================ */

/* Custom property definition */
.test-skip-custom-prop {
  --my-color: var(--dt-color-red-600);
}

/* HSL variant */
.test-skip-hsl {
  color: var(--dt-color-red-600-hsl);
}

/* Same base color, different property → different semantic */
.test-context-difference {
  color: var(--dt-color-red-600);
  background-color: var(--dt-color-red-600);
  border-color: var(--dt-color-red-600);
}
</style>
