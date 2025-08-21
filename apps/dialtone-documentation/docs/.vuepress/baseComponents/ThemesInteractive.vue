<template>
  <div class="themes-interactive">
    <!-- Theme Controls Bar -->
    <dt-stack gap="500" class="d-p16 d-bgc-secondary d-bar8">
      <dt-stack direction="row" gap="500" class="d-ai-flex-end">
        <dt-select-menu
          name="mode-select"
          label="Mode"
          select-class="d-fl1"
          :value="selectedMode"
          :options="MODES"
          @change="updateMode"
        />
        <dt-select-menu
          name="theme-select"
          label="Theme"
          select-class="d-fl1"
          :value="selectedTheme"
          :options="THEMES"
          @change="updateTheme"
        />
      </dt-stack>
    </dt-stack>

    <!-- SVG Theme Visual Preview -->
    <div class="d-mt16">
      <div :class="containerClasses" :data-theme="selectedTheme" :data-mode="selectedMode" class="themes-container">
        <svg
          class="themes-svg"
          viewBox="0 0 844 380"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10022C" />
              <stop offset="20%" stop-color="#611F93" />
              <stop offset="46%" stop-color="#C52599" />
              <stop offset="66%" stop-color="#EA2F6F" />
              <stop offset="90%" stop-color="#FD6D2D" />
              <stop offset="100%" stop-color="#FF9E0E" />
            </linearGradient>
          </defs>

          <!-- Main Background -->
          <rect width="844" height="380" rx="8" :fill="svgColors.background" />

          <!-- Header Background -->
          <rect width="844" height="60" :fill="svgColors.surface" />

          <!-- Window Controls -->
          <circle cx="21" cy="30" r="6" fill="#FF5F57" />
          <circle cx="43" cy="30" r="6" fill="#FFBD2E" />
          <circle cx="65" cy="30" r="6" fill="#28CA42" />

          <!-- Dialpad Logo -->
          <rect x="104" y="16" width="28" height="28" rx="4" fill="url(#logoGradient)" />

          <!-- Header Navigation Dots -->
          <circle cx="162" cy="30" r="6" :fill="svgColors.navActive" />
          <circle cx="182" cy="30" r="6" :fill="svgColors.navInactive" />
          <circle cx="202" cy="30" r="6" :fill="svgColors.navInactive" />
          <circle cx="222" cy="30" r="6" :fill="svgColors.navInactive" />

          <!-- Search Bar -->
          <rect x="275" y="14" width="490" height="32" rx="16" :fill="svgColors.searchBg" />

          <!-- Header Action Buttons -->
          <circle cx="784" cy="30" r="6" :fill="svgColors.actionBtn" />
          <circle cx="810" cy="30" r="6" :fill="svgColors.actionBtn" />

          <!-- Sidebar Background -->
          <rect x="0" y="60" width="314" height="320" :fill="svgColors.sidebar" />

          <!-- Sidebar Border -->
          <line x1="314" y1="60" x2="314" y2="380" :stroke="svgColors.border" stroke-width="1" />

          <!-- Navigation Item 1 - Orange Avatar with Toggle -->
          <circle cx="39" cy="115" r="19" fill="var(--dt-color-coral-400)" />
          <rect x="73" y="100" width="125" height="8" rx="4" :fill="svgColors.textPrimary" />
          <rect x="73" y="115" width="173" height="6" rx="3" :fill="svgColors.textSecondary" />
          <rect x="276" y="107" width="18" height="12" rx="6" :fill="svgColors.brand" />

          <!-- Navigation Item 2 - Blue Avatar -->
          <circle cx="39" cy="175" r="19" fill="var(--dt-color-blue-400)" />
          <rect x="73" y="160" width="125" height="8" rx="4" :fill="svgColors.textPrimary" />
          <rect x="73" y="175" width="173" height="6" rx="3" :fill="svgColors.textSecondary" />

          <!-- Navigation Item 3 - Purple Avatar with Toggle -->
          <circle cx="39" cy="235" r="19" fill="var(--dt-color-purple-400)" />
          <rect x="73" y="220" width="125" height="8" rx="4" :fill="svgColors.textPrimary" />
          <rect x="73" y="235" width="173" height="6" rx="3" :fill="svgColors.textSecondary" />
          <rect x="276" y="227" width="18" height="12" rx="6" :fill="svgColors.brand" />

          <!-- Navigation Item 4 - Green Avatar -->
          <circle cx="39" cy="295" r="19" fill="var(--dt-color-teal-400)" />
          <rect x="73" y="280" width="125" height="8" rx="4" :fill="svgColors.textPrimary" />
          <rect x="73" y="295" width="173" height="6" rx="3" :fill="svgColors.textSecondary" />

          <!-- Navigation Item 5 - Pink Avatar with Toggle -->
          <circle cx="39" cy="355" r="19" fill="var(--dt-color-magenta-400)" />
          <rect x="73" y="340" width="125" height="8" rx="4" :fill="svgColors.textPrimary" />
          <rect x="73" y="355" width="173" height="6" rx="3" :fill="svgColors.textSecondary" />
          <rect x="276" y="347" width="18" height="12" rx="6" :fill="svgColors.brand" />

          <!-- Main Content Area -->
          <rect x="314" y="60" width="530" height="320" :fill="svgColors.background" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Reactive state for the selected options
const selectedMode = ref('light');
const selectedTheme = ref('dp');

// Mode options (light/dark)
const MODES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Theme options (brand variations)
const THEMES = [
  { value: 'dp', label: 'Dialpad' },
  { value: 'tmo', label: 'T-Mobile' },
  { value: 'expressive', label: 'Expressive' },
];

const updateMode = (newMode) => {
  selectedMode.value = newMode;
};

const updateTheme = (newTheme) => {
  selectedTheme.value = newTheme;
};

// Use Dialtone's semantic tokens directly - no custom datasets needed
const svgColors = computed(() => {
  return {
    background: 'var(--dt-color-surface-primary)',
    surface: 'var(--dt-color-surface-secondary)',
    sidebar: 'var(--dt-color-surface-moderate)',
    border: 'var(--dt-color-border-default)',
    brand: 'var(--dt-color-link-primary)',
    textPrimary: 'var(--dt-color-foreground-primary)',
    textSecondary: 'var(--dt-color-foreground-secondary)',
    controlInactive: 'var(--dt-color-foreground-disabled)',
    navActive: 'var(--dt-color-foreground-primary)',
    navInactive: 'var(--dt-color-foreground-tertiary)',
    searchBg: 'var(--dt-color-surface-moderate)',
    actionBtn: 'var(--dt-color-foreground-tertiary)',
  };
});

const containerClasses = computed(() => {
  return [
    `theme-${selectedTheme.value}`,
    `mode-${selectedMode.value}`,
  ];
});
</script>

<style scoped>
@import url('@dialpad/dialtone/css');
/* @import url("@dialpad/dialtone/vue3/css"); */

.themes-interactive {
  margin: 2rem 0;
  transition: all 0.3s ease;
}

.themes-container {
  transition: all 0.3s ease;
}

/* Theme switching using Dialtone's token system */
/* Each theme automatically uses its semantic token dataset */
.themes-container {
  /* Default uses base Dialtone semantic tokens */
}

/* Themes will be handled by Dialtone's CSS token system */
/* The data-theme attribute should trigger Dialtone's theme switching */

.themes-svg {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 0 auto;
  display: block;
  transition: all 0.3s ease;
  border-radius: 4px;
  border:1px solid var(--dt-color-black-300);
}
</style>
