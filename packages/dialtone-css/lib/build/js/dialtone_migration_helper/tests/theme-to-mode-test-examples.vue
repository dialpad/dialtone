<template>
  <!-- Module path example (should be rewritten by codemod) -->
  <section data-dt-theme="light">
    Light mode section
  </section>

  <!-- CSS selector example (for stylesheet tests) -->
  <div class="themed-container">
    Theme-aware container
  </div>
</template>

<script>
// Legacy imports — these paths and calls are transformed by the codemod
import DpLight from '@dialpad/dialtone/themes/dp-light';
import DpDark from '@dialpad/dialtone/themes/dp-dark';
import { setTheme } from '@dialpad/dialtone/themes/config';

// Startup initialization
setTheme(DpLight);

// Mode switching (runtime)
setTheme(DpDark);
</script>
