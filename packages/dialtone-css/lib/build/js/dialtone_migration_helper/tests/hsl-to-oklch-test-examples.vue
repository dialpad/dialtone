<template>
  <!--
    TEST FILE FOR HSL-TO-OKLCH MIGRATION
    Tests migration of consumer HSL breakout patterns to OKLCH relative color syntax.
  -->

  <!-- Skip cases (should NOT be modified) -->
  <p :style="{ color: 'hsla(137, 100%, 27%, 0.05)' }">hardcoded HSL value</p>
  <p class="d-fc-primary">already semantic, no HSL</p>
  <p :style="{ color: 'oklch(from var(--dt-color-foreground-primary) l c h / 0.5)' }">already oklch</p>
</template>

<style lang="less">
/* ============================================ */
/* COMPOSITE -hsl/-hsla VARS WITH ALPHA         */
/* ============================================ */

/* Expression 1: composite -hsla + numeric alpha */
.test-composite-alpha-1 {
  color: hsla(var(--dt-color-foreground-primary-hsla) / 0.5);
}

/* Expression 1: composite -hsl + percent alpha */
.test-composite-alpha-2 {
  background-color: hsl(var(--dt-color-surface-critical-hsl) / 50%);
}

/* Expression 1: composite -hsl + var() alpha */
.test-composite-alpha-3 {
  color: hsla(var(--dt-color-foreground-primary-hsl) / var(--fco, alpha));
}

/* ============================================ */
/* COMPOSITE -hsl/-hsla VARS WITHOUT ALPHA      */
/* ============================================ */

/* Expression 2: composite -hsl no alpha */
.test-composite-no-alpha-1 {
  color: hsl(var(--dt-color-foreground-primary-hsl));
}

/* Expression 2: composite -hsla no alpha */
.test-composite-no-alpha-2 {
  background-color: hsla(var(--dt-color-surface-critical-hsla));
}

/* ============================================ */
/* SEPARATE H,S,L VARS — COMMA + ALPHA         */
/* ============================================ */

/* Expression 3: comma-separated with numeric alpha */
.test-separate-comma-alpha {
  color: hsla(var(--dt-color-foreground-primary-h), var(--dt-color-foreground-primary-s), var(--dt-color-foreground-primary-l), 0.5);
}

/* Expression 3: comma-separated with var() alpha */
.test-separate-comma-alpha-var {
  color: hsla(var(--dt-color-foreground-primary-h), var(--dt-color-foreground-primary-s), var(--dt-color-foreground-primary-l), var(--fco, 0.5));
}

/* ============================================ */
/* SEPARATE H,S,L VARS — SPACE + SLASH ALPHA   */
/* ============================================ */

/* Expression 4: space-separated with slash alpha */
.test-separate-space-alpha {
  color: hsl(var(--dt-color-foreground-primary-h) var(--dt-color-foreground-primary-s) var(--dt-color-foreground-primary-l) / 0.5);
}

/* ============================================ */
/* SEPARATE H,S,L VARS — NO ALPHA              */
/* ============================================ */

/* Expression 5: no alpha, comma syntax */
.test-separate-no-alpha-comma {
  color: hsl(var(--dt-color-foreground-primary-h), var(--dt-color-foreground-primary-s), var(--dt-color-foreground-primary-l));
}

/* Expression 5: no alpha, space syntax */
.test-separate-no-alpha-space {
  color: hsl(var(--dt-color-foreground-primary-h) var(--dt-color-foreground-primary-s) var(--dt-color-foreground-primary-l));
}

/* ============================================ */
/* CALC() ON LIGHTNESS                          */
/* ============================================ */

/* Expression 6: calc() + lightness (add) */
.test-calc-lightness-add {
  color: hsl(var(--dt-color-foreground-primary-h), var(--dt-color-foreground-primary-s), calc(var(--dt-color-foreground-primary-l) + 10%));
}

/* Expression 6: calc() - lightness (subtract) */
.test-calc-lightness-sub {
  color: hsl(var(--dt-color-foreground-primary-h), var(--dt-color-foreground-primary-s), calc(var(--dt-color-foreground-primary-l) - 5%));
}

/* ============================================ */
/* DESATURATION (S → 0)                         */
/* ============================================ */

/* Expression 7: desaturation with 0% */
.test-desat-percent {
  color: hsl(var(--dt-color-foreground-primary-h), 0%, var(--dt-color-foreground-primary-l));
}

/* Expression 7: desaturation with 0 (no %) */
.test-desat-no-percent {
  color: hsl(var(--dt-color-foreground-primary-h), 0, var(--dt-color-foreground-primary-l));
}

/* ============================================ */
/* LESS ~"" WRAPPED VARIANTS                    */
/* ============================================ */

/* Expression 0 strips ~"" → then expression 3 converts */
.test-less-escape-separate {
  color: ~"hsla(var(--dt-color-foreground-primary-h), var(--dt-color-foreground-primary-s), var(--dt-color-foreground-primary-l), 0.5)";
}

/* Expression 0 strips ~"" → then expression 2 converts */
.test-less-escape-composite {
  color: ~"hsl(var(--dt-color-foreground-primary-hsl))";
}

/* ============================================ */
/* SKIP CASES (should NOT be modified)          */
/* ============================================ */

/* Hardcoded HSL (no var() channel ref) — should adopt tokens */
.test-skip-hardcoded {
  color: hsla(137, 100%, 27%, 0.05);
}

/* LESS variable (not Dialtone token) */
.test-skip-less-var {
  color: ~"@{step0}";
}

/* Already OKLCH (no hsl function to match) */
.test-skip-oklch {
  color: oklch(from var(--dt-color-foreground-primary) l c h / 0.5);
}

/* No suffix token (just the raw token, no breakout vars) */
.test-skip-no-suffix {
  color: var(--dt-color-foreground-primary);
}

/* Mismatched base token names (backreference fails) */
.test-skip-mismatch {
  color: hsl(var(--dt-color-foreground-primary-h), var(--dt-color-surface-critical-s), var(--dt-color-foreground-primary-l));
}
</style>
