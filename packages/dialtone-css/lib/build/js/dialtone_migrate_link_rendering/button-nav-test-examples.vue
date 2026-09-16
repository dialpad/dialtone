<template>
  <!--
    TEST FILE FOR button-nav MIGRATION (DLT-3033)

    Each example shows a legacy pattern the codemod recognizes and the expected
    rewritten form. The fixture doubles as a `npx dialtone-migrate-link-rendering
    --dry-run --cwd <this-folder>` demo target.
  -->

  <!-- ============================================ -->
  <!-- 1. <a class="d-btn"> → <dt-button href> -->
  <!-- ============================================ -->

  <!-- Plain anchor -->
  <a class="d-btn" href="/settings">Settings</a>

  <!-- Anchor with size modifier -->
  <a class="d-btn d-btn--lg" href="/settings">Large CTA</a>

  <!-- Anchor with importance modifier -->
  <a class="d-btn d-btn--outlined" href="/cancel">Cancel</a>

  <!-- Anchor with kind modifier -->
  <a class="d-btn d-btn--critical" href="/delete">Delete</a>

  <!-- Anchor with renamed kind (danger → critical) -->
  <a class="d-btn d-btn--danger" href="/delete">Delete</a>

  <!-- Anchor with circle modifier (icon button) -->
  <a class="d-btn d-btn--circle" href="/avatar">A</a>

  <!-- Stacked modifiers -->
  <a class="d-btn d-btn--lg d-btn--outlined d-btn--critical" href="/delete">Delete</a>

  <!-- Anchor with target / rel (preserved via $attrs fallthrough) -->
  <a
    class="d-btn"
    href="https://example.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    External link
  </a>

  <!-- ============================================ -->
  <!-- 2. <router-link class="d-btn"> → <dt-button :to> -->
  <!-- ============================================ -->

  <!-- Static `to` -->
  <router-link class="d-btn" to="/dashboard">Dashboard</router-link>

  <!-- Bound `:to` -->
  <router-link class="d-btn" :to="{ name: 'dashboard' }">Dashboard</router-link>

  <!-- Bound `:to` with modifiers -->
  <router-link
    class="d-btn d-btn--lg d-btn--critical"
    :to="route"
  >
    Delete
  </router-link>

  <!-- ============================================ -->
  <!-- 3. Vendor & BEM modifiers preserved on class -->
  <!-- ============================================ -->

  <a class="d-btn d-btn--google" href="/auth/google">Sign in with Google</a>

  <!-- Custom user class preserved -->
  <a class="d-btn my-cta-class" href="/upgrade">Upgrade</a>

  <!-- ============================================ -->
  <!-- 4. Patterns that warn (not transformed) -->
  <!-- ============================================ -->

  <!-- Dynamic :href — warn, skip -->
  <a class="d-btn" :href="dynamicUrl">Dynamic</a>

  <!-- Dynamic :class alongside static class — warn, skip -->
  <a class="d-btn" :class="extraClasses" href="/x">Mixed</a>

  <!-- <router-link custom> wrapping <dt-button> — warn, manual review -->
  <router-link
    custom
    v-slot="{ navigate, isActive }"
    :to="{ name: 'profile' }"
  >
    <dt-button :class="{ 'is-active': isActive }" @click="navigate">
      Profile
    </dt-button>
  </router-link>
</template>
