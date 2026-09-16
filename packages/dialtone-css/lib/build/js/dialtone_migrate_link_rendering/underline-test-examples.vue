<template>
  <!--
    TEST FILE FOR underline MIGRATION (DLT-3035)

    Each block shows a `<dt-link>` with d-td-* utility classes and the expected
    rewritten form. Most patterns map exactly; "alone" and "both-same" patterns
    map to the closest prop value with a per-file informational note about
    hover-state delta.
  -->

  <!-- ============================================ -->
  <!-- 1. Clean mappings (no hover delta) -->
  <!-- ============================================ -->

  <!-- d-td-underline h:d-td-none → strip both (matches default) -->
  <dt-link href="/x" class="d-td-underline h:d-td-none">Default</dt-link>

  <!-- d-td-none h:d-td-underline → :underline="false" (the canonical example) -->
  <dt-link href="/x" class="d-td-none h:d-td-underline">No-underline link</dt-link>

  <!-- h:d-td-none alone — strip (matches default hover) -->
  <dt-link href="/x" class="h:d-td-none">Default redundant</dt-link>

  <!-- ============================================ -->
  <!-- 2. "Alone" patterns — closest mapping + per-file hover-delta note -->
  <!-- ============================================ -->

  <!-- d-td-none alone — closest is :underline="false" (hover gains underline) -->
  <dt-link href="/x" class="d-td-none">No underline ever (will hover-underline)</dt-link>

  <!-- d-td-underline alone — closest is default (hover loses underline) -->
  <dt-link href="/x" class="d-td-underline">Always underlined (will lose hover)</dt-link>

  <!-- ============================================ -->
  <!-- 3. Other classes preserved -->
  <!-- ============================================ -->

  <dt-link href="/x" class="d-td-none h:d-td-underline d-fc-secondary">
    Mixed with font-color utility
  </dt-link>

  <!-- ============================================ -->
  <!-- 4. Patterns that warn (not transformed) -->
  <!-- ============================================ -->

  <!-- Responsive variant — warn, skip -->
  <dt-link href="/x" class="sm:d-td-none h:d-td-underline">Responsive</dt-link>

  <!-- Dynamic :class containing d-td-* — warn -->
  <dt-link href="/x" :class="{ 'd-td-none': isQuiet }">Dynamic underline</dt-link>

  <!-- ============================================ -->
  <!-- 5. Idempotent: already on the new API -->
  <!-- ============================================ -->

  <dt-link href="/x" :underline="false">Already migrated</dt-link>
</template>
