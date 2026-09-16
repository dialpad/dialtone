<template>
  <!--
    TEST FILE FOR SPACE-TO-SPACING MIGRATION
    Tests migration of --dt-space-* tokens to --dt-spacing-* (8px base unit scale).
    Run: npx dialtone-migration-helper --cwd . and select "space-to-spacing"
  -->

  <!-- ============================================ -->
  <!-- VUE :style BINDINGS — SPACING CONTEXT        -->
  <!-- ============================================ -->

  <!-- Mapped: small stops -->
  <p :style="{ padding: 'var(--dt-space-0)' }">space-0 → spacing-0</p>
  <p :style="{ margin: 'var(--dt-space-100)' }">space-100 → spacing-1</p>
  <p :style="{ padding: 'var(--dt-space-200)' }">space-200 → spacing-25</p>
  <p :style="{ gap: 'var(--dt-space-300)' }">space-300 → spacing-50</p>
  <p :style="{ padding: 'var(--dt-space-350)' }">space-350 → spacing-75</p>
  <p :style="{ margin: 'var(--dt-space-400)' }">space-400 → spacing-100</p>

  <!-- Mapped: mid stops -->
  <p :style="{ padding: 'var(--dt-space-450)' }">space-450 → spacing-150</p>
  <p :style="{ gap: 'var(--dt-space-500)' }">space-500 → spacing-200</p>
  <p :style="{ padding: 'var(--dt-space-525)' }">space-525 → spacing-250</p>
  <p :style="{ margin: 'var(--dt-space-550)' }">space-550 → spacing-300</p>
  <p :style="{ padding: 'var(--dt-space-600)' }">space-600 → spacing-400</p>
  <p :style="{ gap: 'var(--dt-space-625)' }">space-625 → spacing-525</p>
  <p :style="{ padding: 'var(--dt-space-650)' }">space-650 → spacing-600</p>
  <p :style="{ margin: 'var(--dt-space-700)' }">space-700 → spacing-800</p>

  <!-- Skip: stops with no --dt-spacing-* equivalent (should NOT be modified) -->
  <p :style="{ padding: 'var(--dt-space-720)' }">space-720 (72px) — no equivalent, left unchanged</p>
  <p :style="{ gap: 'var(--dt-space-730)' }">space-730 (84px) — no equivalent, left unchanged</p>
  <p :style="{ margin: 'var(--dt-space-750)' }">space-750 (96px) — use --dt-layout-150 instead</p>

  <!-- Skip: already-migrated tokens (should NOT be modified) -->
  <p :style="{ padding: 'var(--dt-spacing-100)' }">already spacing-100</p>
  <p :style="{ margin: 'var(--dt-spacing-300)' }">already spacing-300</p>
</template>

<style lang="less">
/* ============================================ */
/* SMALL STOPS (0–350)                          */
/* ============================================ */

/* space-0 → spacing-0 */
.test-space-0 {
  padding: var(--dt-space-0);
}

/* space-100 → spacing-1 */
.test-space-100 {
  margin-block-start: var(--dt-space-100);
}

/* space-200 → spacing-25 */
.test-space-200 {
  gap: var(--dt-space-200);
}

/* space-300 → spacing-50 */
.test-space-300 {
  padding-inline: var(--dt-space-300);
}

/* space-350 → spacing-75 */
.test-space-350 {
  column-gap: var(--dt-space-350);
}

/* ============================================ */
/* BASE AND MID STOPS (400–700)                 */
/* ============================================ */

/* space-400 → spacing-100 (base unit) */
.test-space-400 {
  padding: var(--dt-space-400);
  margin: var(--dt-space-400);
  gap: var(--dt-space-400);
}

/* space-450 → spacing-150 */
.test-space-450 {
  padding-block: var(--dt-space-450);
}

/* space-500 → spacing-200 */
.test-space-500 {
  inset: var(--dt-space-500);
}

/* space-525 → spacing-250 */
.test-space-525 {
  row-gap: var(--dt-space-525);
}

/* space-550 → spacing-300 */
.test-space-550 {
  padding-inline-start: var(--dt-space-550);
}

/* space-600 → spacing-400 */
.test-space-600 {
  margin-inline: var(--dt-space-600);
}

/* space-625 → spacing-525 */
.test-space-625 {
  padding: var(--dt-space-625);
}

/* space-650 → spacing-600 */
.test-space-650 {
  inset-block: var(--dt-space-650);
}

/* space-700 → spacing-800 */
.test-space-700 {
  padding: var(--dt-space-700);
  gap: var(--dt-space-700);
}

/* ============================================ */
/* SHORTHAND WITH MULTIPLE TOKENS               */
/* ============================================ */

/* Multiple space tokens in one declaration */
.test-shorthand-multi {
  padding: var(--dt-space-400) var(--dt-space-550);
  margin: var(--dt-space-300) var(--dt-space-400) var(--dt-space-550) var(--dt-space-600);
}

/* ============================================ */
/* NEGATIVE VARIANTS                            */
/* ============================================ */

/* space-400-negative → spacing-100-negative */
.test-negative-400 {
  margin-block-start: var(--dt-space-400-negative);
}

/* space-550-negative → spacing-300-negative */
.test-negative-550 {
  margin-inline-start: var(--dt-space-550-negative);
}

/* space-700-negative → spacing-800-negative */
.test-negative-700 {
  margin: var(--dt-space-700-negative);
}

/* ============================================ */
/* SKIP CASES (should NOT be modified)          */
/* ============================================ */

/* -percent variants — no --dt-spacing-*-percent tokens exist; percent tokens live under
   --dt-layout-*-percent with a different stop axis, so these are left for manual review */
.test-skip-percent-400 {
  padding: var(--dt-space-400-percent);
}

.test-skip-percent-600 {
  gap: var(--dt-space-600-percent);
}

/* Stops with no --dt-spacing-* equivalent — leave unchanged */
.test-skip-720 {
  padding: var(--dt-space-720); /* 72px — no spacing equivalent */
}

.test-skip-730 {
  gap: var(--dt-space-730); /* 84px — no spacing equivalent */
}

.test-skip-750 {
  padding: var(--dt-space-750); /* 96px+ — use --dt-layout-150 instead */
}

/* Already-migrated spacing tokens (should NOT be touched) */
.test-skip-already-spacing {
  padding: var(--dt-spacing-100);
  margin: var(--dt-spacing-300);
  gap: var(--dt-spacing-400);
}

/* Custom property definition — WILL be replaced (regex is context-free) */
.test-skip-custom-prop {
  --my-spacing: var(--dt-space-400); /* → var(--dt-spacing-100) */
}
</style>
