<template>
  <!--
    TEST FILE FOR link-nav MIGRATION (DLT-3034)

    Each example shows a legacy DtLink pattern the codemod recognizes and the expected
    rewritten form. The fixture doubles as a `npx dialtone-migrate-link-rendering
    --dry-run --cwd <this-folder>` demo target.
  -->

  <!-- ============================================ -->
  <!-- 1. <a class="d-link"> → <dt-link href> -->
  <!-- ============================================ -->

  <a class="d-link" href="/profile">Profile</a>

  <a class="d-link" href="https://example.com" target="_blank" rel="noopener">
    External link
  </a>

  <!-- ============================================ -->
  <!-- 2. <router-link class="d-link"> → <dt-link :to> -->
  <!-- ============================================ -->

  <router-link class="d-link" to="/dashboard">Dashboard</router-link>

  <router-link class="d-link" :to="{ name: 'profile' }">Profile</router-link>

  <!-- ============================================ -->
  <!-- 3. Tone modifier extraction (with renames) -->
  <!-- ============================================ -->

  <a class="d-link d-link--critical" href="/danger">Critical action</a>

  <!-- d-link--danger renames to tone="critical" -->
  <a class="d-link d-link--danger" href="/danger">Danger (legacy name)</a>

  <a class="d-link d-link--positive" href="/win">Positive</a>

  <!-- d-link--success renames to tone="positive" -->
  <a class="d-link d-link--success" href="/win">Success (legacy name)</a>

  <a class="d-link d-link--warning" href="/careful">Warning</a>

  <a class="d-link d-link--info" href="/info">Info</a>

  <a class="d-link d-link--muted" href="/secondary">Muted</a>

  <a class="d-link d-link--mention" href="/user/brad">@brad</a>

  <!-- ============================================ -->
  <!-- 4. d-link--no-underline → :underline="false" -->
  <!-- ============================================ -->

  <a class="d-link d-link--no-underline" href="/x">No underline at rest</a>

  <!-- ============================================ -->
  <!-- 5. Inverted modifiers — extracted + per-file note nudges to v-dt-mode -->
  <!-- ============================================ -->

  <a class="d-link d-link--inverted" href="/x">Inverted (note)</a>

  <a class="d-link d-link--inverted-critical" href="/x">Inverted critical (note + tone)</a>

  <!-- ============================================ -->
  <!-- 6. CSS-only modifiers preserved on class -->
  <!-- ============================================ -->

  <!-- d-link--disabled has no prop equivalent — preserve on class -->
  <a class="d-link d-link--disabled" href="/x">Disabled link</a>

  <!-- d-link--inverted-disabled — preserve on class -->
  <a class="d-link d-link--inverted-disabled" href="/x">Inverted + disabled</a>

  <!-- Custom user class preserved -->
  <a class="d-link my-typography-class" href="/x">Custom class</a>

  <!-- ============================================ -->
  <!-- 7. Patterns that warn (not transformed) -->
  <!-- ============================================ -->

  <!-- Dynamic :href — warn, skip -->
  <a class="d-link" :href="dynamicUrl">Dynamic</a>

  <!-- Dynamic :class alongside static — warn, skip -->
  <a class="d-link" :class="extraClasses" href="/x">Mixed</a>

  <!-- <router-link custom> wrapping <dt-link> — warn, manual review -->
  <router-link
    custom
    v-slot="{ navigate, isActive }"
    :to="{ name: 'profile' }"
  >
    <dt-link :class="{ 'is-active': isActive }" @click="navigate">
      Profile (custom)
    </dt-link>
  </router-link>
</template>
