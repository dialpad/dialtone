<template>
  <!--
    TEST FILE FOR SIZE-TO-LAYOUT MIGRATION
    Tests context-aware migration of --dt-size-* tokens to either:
      --dt-spacing-* (spacing properties: padding, margin, gap, inset)
      --dt-layout-*  (layout properties: width, height, min/max, flex-basis)
    Tokens exceeding the layout scale (>1024px) become raw rem + TODO comment.
    Run: node packages/dialtone-css/lib/dist/js/dialtone_migration_helper/index.mjs --cwd .
    then select "size-to-layout"
  -->

  <!-- ============================================ -->
  <!-- VUE :style — SPACING CONTEXT                 -->
  <!-- (should route to --dt-spacing-*)             -->
  <!-- ============================================ -->

  <p :style="{ padding: 'var(--dt-size-400)' }">size-400 on padding → spacing-100</p>
  <p :style="{ margin: 'var(--dt-size-500)' }">size-500 on margin → spacing-200</p>
  <p :style="{ gap: 'var(--dt-size-550)' }">size-550 on gap → spacing-300</p>

  <!-- ============================================ -->
  <!-- VUE :style — LAYOUT CONTEXT                  -->
  <!-- (should route to --dt-layout-*)              -->
  <!-- ============================================ -->

  <div :style="{ width: 'var(--dt-size-700)' }">size-700 on width → layout-100</div>
  <div :style="{ height: 'var(--dt-size-800)' }">size-800 on height → layout-200</div>
  <div :style="{ maxWidth: 'var(--dt-size-1000)' }">size-1000 on max-width → layout-800</div>

  <!-- Off-scale pixel-indexed exceptions (DLT-3330) — layout context only -->
  <div :style="{ width: 'var(--dt-size-100)' }">size-100 on width → layout-1px</div>
  <div :style="{ height: 'var(--dt-size-200)' }">size-200 on height → layout-2px</div>
  <div :style="{ minInlineSize: 'var(--dt-size-400)' }">size-400 on min-inline-size → layout-8px</div>
  <div :style="{ maxWidth: 'var(--dt-size-525)' }">size-525 on max-width → layout-20px</div>
  <div :style="{ blockSize: 'var(--dt-size-550)' }">size-550 on block-size → layout-24px</div>

  <!-- Skip: already-migrated tokens -->
  <div :style="{ width: 'var(--dt-layout-100)' }">already layout-100</div>
  <p :style="{ padding: 'var(--dt-spacing-100)' }">already spacing-100</p>
</template>

<style lang="less">
/* ============================================ */
/* SPACING CONTEXT → --dt-spacing-*             */
/* padding, margin, gap, inset and variants     */
/* ============================================ */

/* padding: all mapped stops */
.test-padding-exact {
  padding: var(--dt-size-0);          /* → spacing-0   (0px) */
  padding: var(--dt-size-100);        /* → spacing-1   (1px) */
  padding: var(--dt-size-200);        /* → spacing-25  (2px) */
  padding: var(--dt-size-300);        /* → spacing-50  (4px) */
  padding: var(--dt-size-350);        /* → spacing-75  (6px) */
  padding: var(--dt-size-400);        /* → spacing-100 (8px) */
  padding: var(--dt-size-450);        /* → spacing-150 (12px) */
  padding: var(--dt-size-500);        /* → spacing-200 (16px) */
  padding: var(--dt-size-525);        /* → spacing-250 (20px) */
  padding: var(--dt-size-550);        /* → spacing-300 (24px) */
  padding: var(--dt-size-600);        /* → spacing-400 (32px) */
  padding: var(--dt-size-625);        /* → spacing-525 (42px) */
  padding: var(--dt-size-650);        /* → spacing-600 (48px) */
  padding: var(--dt-size-700);        /* → spacing-800 (64px) */
}

/* padding directional */
.test-padding-directional {
  padding-block-start: var(--dt-size-400);
  padding-inline: var(--dt-size-550);
  padding-block-start: var(--dt-size-300);
  padding-inline-end: var(--dt-size-400);
}

/* margin */
.test-margin {
  margin: var(--dt-size-400);
  margin-block-start: var(--dt-size-550);
  margin-inline: var(--dt-size-600);
  margin-block-end: var(--dt-size-300);
}

/* gap, row-gap, column-gap */
.test-gap {
  gap: var(--dt-size-400);
  row-gap: var(--dt-size-550);
  column-gap: var(--dt-size-300);
}

/* inset */
.test-inset {
  inset: var(--dt-size-400);
  inset-block: var(--dt-size-300);
  inset-inline-start: var(--dt-size-550);
}

/* shorthand with multiple size tokens */
.test-padding-multi {
  padding: var(--dt-size-400) var(--dt-size-550);
  margin: var(--dt-size-300) var(--dt-size-400) var(--dt-size-550) var(--dt-size-600);
}

/* ============================================ */
/* LAYOUT CONTEXT → --dt-layout-*               */
/* width, height, min/max, flex-basis, logical  */
/* ============================================ */

/* width: exact matches */
.test-width-exact {
  inline-size: var(--dt-size-500);    /* → layout-25   (16px) */
  inline-size: var(--dt-size-600);    /* → layout-50   (32px) */
  inline-size: var(--dt-size-650);    /* → layout-75   (48px) */
  inline-size: var(--dt-size-700);    /* → layout-100  (64px) */
  inline-size: var(--dt-size-750);    /* → layout-150  (96px) */
  inline-size: var(--dt-size-800);    /* → layout-200  (128px) */
  inline-size: var(--dt-size-850);    /* → layout-300  (192px) */
  inline-size: var(--dt-size-900);    /* → layout-400  (256px) */
  inline-size: var(--dt-size-950);    /* → layout-600  (384px) */
  inline-size: var(--dt-size-1000);   /* → layout-800  (512px) */
  inline-size: var(--dt-size-1050);   /* → layout-1200 (768px) */
  inline-size: var(--dt-size-1100);   /* → layout-1600 (1024px) */
}

/* off-scale pixel-indexed exceptions (DLT-3330) — only route in layout context */
.test-width-off-scale {
  inline-size: var(--dt-size-100);          /* → layout-1px  (1px)  */
  block-size: var(--dt-size-200);         /* → layout-2px  (2px)  */
  min-inline-size: var(--dt-size-400); /* → layout-8px  (8px)  */
  max-inline-size: var(--dt-size-525);      /* → layout-20px (20px) */
  block-size: var(--dt-size-550);     /* → layout-24px (24px) */
}

/* height */
.test-height {
  block-size: var(--dt-size-700);
  min-block-size: var(--dt-size-800);
  max-block-size: var(--dt-size-1000);
}

/* min/max width */
.test-minmax {
  min-inline-size: var(--dt-size-650);
  max-inline-size: var(--dt-size-900);
  min-inline-size: var(--dt-size-1000);
}

/* flex-basis */
.test-flex-basis {
  flex-basis: var(--dt-size-700);
  flex-basis: var(--dt-size-800);
}

/* logical layout properties */
.test-logical-layout {
  inline-size: var(--dt-size-700);
  block-size: var(--dt-size-800);
  min-inline-size: var(--dt-size-650);
  max-inline-size: var(--dt-size-1000);
  max-block-size: var(--dt-size-950);
}

/* ============================================ */
/* NEAREST-NEIGHBOR MAPPINGS                    */
/* No exact match — mapped to closest stop      */
/* ============================================ */

.test-nearest-neighbor {
  inline-size: var(--dt-size-825);      /* 164px → layout-250  (160px, Δ4px) */
  inline-size: var(--dt-size-875);      /* 216px → layout-350  (224px, Δ8px) */
  inline-size: var(--dt-size-905);      /* 264px → layout-400  (256px, Δ8px) */
  inline-size: var(--dt-size-925);      /* 332px → layout-500  (320px, Δ12px) */
  block-size: var(--dt-size-975);     /* 464px → layout-700  (448px, Δ16px) */
  inline-size: var(--dt-size-1020);     /* 628px → layout-1000 (640px, Δ12px) */
  max-inline-size: var(--dt-size-1040); /* 764px → layout-1200 (768px, Δ4px) */
  max-inline-size: var(--dt-size-1060); /* 828px → layout-1300 (832px, Δ4px) */
  max-block-size: var(--dt-size-1080); /* 912px → layout-1400 (896px, Δ16px) */
}

/* ============================================ */
/* RAW FALLBACK (exceeds layout scale >1024px)  */
/* Converted to rem + TODO comment              */
/* ============================================ */

.test-raw-fallback {
  max-inline-size: var(--dt-size-1115); /* 1140px → 71.25rem + TODO comment */
  max-inline-size: var(--dt-size-1120); /* 1268px → 79.25rem + TODO comment */
  max-inline-size: var(--dt-size-1125); /* 1280px → 80rem + TODO comment */
  max-inline-size: var(--dt-size-1130); /* 1340px → 83.75rem + TODO comment */
  inline-size: var(--dt-size-1150);     /* 1536px → 96rem + TODO comment */
  inline-size: var(--dt-size-1200);     /* 2048px → 128rem + TODO comment */
}

/* ============================================ */
/* CUSTOM PROPERTY DEFINITIONS                  */
/* Script routes by keyword in property name    */
/* ============================================ */

/* Spacing keywords in custom property name → --dt-spacing-* */
.test-custom-spacing {
  --badge-padding-y: var(--dt-size-400);        /* "padding" → spacing-100 (8px) */
  --badge-padding-x: var(--dt-size-550);        /* "padding" → spacing-300 (24px) */
  --badge-label-padding-x: var(--dt-size-500);  /* "padding" → spacing-200 (16px) */
  --badge-letter-spacing: var(--dt-size-100);   /* "spacing" → spacing-1   (1px) */
  --badge-gap: var(--dt-size-300);              /* "gap"     → spacing-50  (4px) */
  --item-margin-start: var(--dt-size-400);      /* "margin"  → spacing-100 (8px) */
  --item-inset-y: var(--dt-size-300);           /* "inset"   → spacing-50  (4px) */
}

/* Layout keywords in custom property name → --dt-layout-* */
.test-custom-layout {
  --badge-radius: var(--dt-size-700);           /* "radius" → layout-100  (64px) */
  --panel-width: var(--dt-size-1050);           /* "width"  → layout-1200 (768px) */
  --sidebar-min-width: var(--dt-size-900);      /* "width"  → layout-400  (256px) */
  --avatar-basis: var(--dt-size-700);           /* "basis"  → layout-100  (64px) */
}

/* Ambiguous custom property — no keyword match → default fallback (layout map) */
/* NOTE: "line-height" intentionally excluded from height keyword matching */
/* These require manual review after migration */
.test-custom-ambiguous {
  --badge-line-height: var(--dt-size-500);   /* no keyword match → layout-25 (default) */
  --overlay-depth: var(--dt-size-700);       /* no keyword match → layout-100 (default) */
}

/* ============================================ */
/* SKIP CASES (should NOT be modified)          */
/* ============================================ */

/* Already using --dt-layout-* */
.test-skip-already-layout {
  inline-size: var(--dt-layout-100);
  block-size: var(--dt-layout-200);
  max-inline-size: var(--dt-layout-800);
}

/* Already using --dt-spacing-* */
.test-skip-already-spacing {
  padding: var(--dt-spacing-100);
  margin: var(--dt-spacing-300);
  gap: var(--dt-spacing-400);
}

/* Unknown stop number (not in any map — passed through, lint will flag) */
.test-skip-unknown {
  inline-size: var(--dt-size-999);
  padding: var(--dt-size-123);
}

/* ============================================ */
/* ADDITIONAL COVERAGE (from review feedback)   */
/* ============================================ */

/* --dt-size-50 in spacing context → spacing-1 (0.5px → 1px nearest) */
.test-size-50-spacing {
  padding: var(--dt-size-50);           /* → spacing-1 */
  letter-spacing: var(--dt-size-50);    /* → spacing-1 (via default) */
}

/* Unmapped layout stops that should now have nearest-neighbor entries */
.test-newly-mapped-stops {
  inline-size: var(--dt-size-720);      /* 72px → layout-100 (64px) */
  inline-size: var(--dt-size-730);      /* 84px → layout-125 (80px) */
  inline-size: var(--dt-size-760);      /* 102px → layout-150 (96px) */
  inline-size: var(--dt-size-775);      /* 114px → layout-175 (112px) */
}

/* Negative and percent suffixes */
.test-suffixes {
  margin: var(--dt-size-400-negative);  /* → spacing-100-negative */
  inline-size: var(--dt-size-100-percent); /* → layout-100-percent */
}

/* calc(var(--dt-spacing-*) * -1) → negative token cleanup */
.test-calc-negation {
  inset: calc(var(--dt-spacing-100) * -1);  /* → var(--dt-spacing-100-negative) */
  margin: calc(var(--dt-spacing-300) * -1); /* → var(--dt-spacing-300-negative) */
}

/* Border-width context → --dt-size-border-* */
.test-border-width {
  border: var(--dt-size-100) solid red;         /* → dt-size-border-100 */
  border-width: var(--dt-size-200);             /* → dt-size-border-200 */
  outline: var(--dt-size-100) solid;            /* → dt-size-border-100 */
}

/* Border-radius context → --dt-size-radius-* */
.test-border-radius {
  border-radius: var(--dt-size-300);            /* → dt-size-radius-300 */
  border-radius: var(--dt-size-400);            /* → dt-size-radius-400 */
  --badge-radius: var(--dt-size-300);           /* "radius" keyword → dt-size-radius-300 */
}
</style>
