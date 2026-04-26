<template>
  <!--
    TEST FILE FOR SUCCESS-TO-POSITIVE MIGRATION
    Tests replacement of `success` color references with `positive`.
  -->

  <!-- ============================================ -->
  <!-- FOREGROUND UTILITIES (d-fc-success*) -->
  <!-- ============================================ -->

  <p class="d-fc-success">success foreground</p>
  <p class="d-fc-success-strong">success-strong foreground</p>
  <p class="d-fc-success-inverted">success inverted foreground</p>
  <p class="d-fc-success-strong-inverted">success-strong inverted foreground</p>

  <!-- ============================================ -->
  <!-- SURFACE UTILITIES (d-bgc-success*) -->
  <!-- ============================================ -->

  <div class="d-bgc-success">success surface</div>
  <div class="d-bgc-success-subtle">success-subtle surface</div>
  <div class="d-bgc-success-strong">success-strong surface</div>
  <div class="d-bgc-success-opaque">success-opaque surface</div>
  <div class="d-bgc-success-subtle-opaque">success-subtle-opaque surface</div>
  <div class="d-bgc-success-inverted">success inverted</div>
  <div class="d-bgc-success-subtle-inverted">success-subtle inverted</div>
  <div class="d-bgc-success-strong-inverted">success-strong inverted</div>
  <div class="d-bgc-success-opaque-inverted">success-opaque inverted</div>
  <div class="d-bgc-success-subtle-opaque-inverted">success-subtle-opaque inverted</div>

  <!-- ============================================ -->
  <!-- BORDER UTILITIES (d-bc-success*) -->
  <!-- ============================================ -->

  <div class="d-bc-success">success border</div>
  <div class="d-bc-success-subtle">success-subtle border</div>
  <div class="d-bc-success-strong">success-strong border</div>
  <div class="d-bc-success-inverted">success inverted border</div>
  <div class="d-bc-success-subtle-inverted">success-subtle inverted border</div>
  <div class="d-bc-success-strong-inverted">success-strong inverted border</div>

  <!-- ============================================ -->
  <!-- PSEUDO & RESPONSIVE PREFIXED -->
  <!-- ============================================ -->

  <p class="h:d-fc-success">hover success text</p>
  <p class="f:d-fc-success-strong">focus success-strong text</p>
  <div class="sm:d-bgc-success">responsive success surface</div>
  <div class="md:d-bc-success-subtle">responsive success-subtle border</div>

  <!-- ============================================ -->
  <!-- ALREADY-POSITIVE CLASSES (should NOT be touched) -->
  <!-- ============================================ -->

  <p class="d-fc-positive">already positive</p>
  <div class="d-bgc-positive-subtle">already positive</div>
  <div class="d-bc-positive-strong">already positive</div>

  <!-- ============================================ -->
  <!-- UNRELATED SEMANTIC FAMILIES (preserve) -->
  <!-- ============================================ -->

  <p class="d-fc-critical">critical text — preserve</p>
  <div class="d-bgc-warning-subtle">warning surface — preserve</div>

  <!-- ============================================ -->
  <!-- ENGLISH WORDS WITH "success" PREFIX (preserve) -->
  <!-- ============================================ -->

  <p>The migration ran successfully.</p>
  <p>This is a successful operation.</p>
</template>

<style>
/* ============================================ */
/* CSS VARIABLE: FOREGROUND                     */
/* ============================================ */

.test-fg-success {
  color: var(--dt-color-foreground-success);
}

.test-fg-success-strong {
  color: var(--dt-color-foreground-success-strong);
}

.test-fg-success-inverted {
  color: var(--dt-color-foreground-success-inverted);
}

.test-fg-success-strong-inverted {
  color: var(--dt-color-foreground-success-strong-inverted);
}

/* ============================================ */
/* CSS VARIABLE: SURFACE                        */
/* ============================================ */

.test-surface-success {
  background-color: var(--dt-color-surface-success);
}

.test-surface-success-opaque {
  background-color: var(--dt-color-surface-success-opaque);
}

.test-surface-success-subtle-opaque {
  background-color: var(--dt-color-surface-success-subtle-opaque);
}

.test-surface-success-subtle-opaque-inverted {
  background-color: var(--dt-color-surface-success-subtle-opaque-inverted);
}

/* ============================================ */
/* CSS VARIABLE: BORDER                         */
/* ============================================ */

.test-border-success {
  border-color: var(--dt-color-border-success);
}

.test-border-success-subtle-inverted {
  border-color: var(--dt-color-border-success-subtle-inverted);
}

/* ============================================ */
/* CSS VARIABLE: LINK                           */
/* ============================================ */

.test-link-success {
  color: var(--dt-color-link-success);
}

.test-link-success-hover {
  color: var(--dt-color-link-success-hover);
}

.test-link-success-inverted {
  color: var(--dt-color-link-success-inverted);
}

.test-link-success-inverted-hover {
  color: var(--dt-color-link-success-inverted-hover);
}

/* ============================================ */
/* SKIP CASES (should NOT be replaced)          */
/* ============================================ */

/* Unrelated tokens with "success" elsewhere */
.test-skip-unrelated-token {
  --my-success-color: red;
}

/* Already migrated */
.test-already-positive {
  color: var(--dt-color-foreground-positive);
}

/* Comments with English usage of "success" — preserve */
.test-comment {
  /* Operation succeeded successfully — keep this comment text */
  color: red;
}
</style>
