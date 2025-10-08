<template>
  <div ref="hostElement" :class="$attrs.class">
    <div ref="slotContent" style="display: none;">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, watch, computed, provide } from 'vue';
import dialtoneCSS from '@dialpad/dialtone-css/lib/dist/dialtone.css?inline';

defineOptions({
  inheritAttrs: false,
});

// ============================================================================
// SHARED STYLESHEET CACHE (shared across all ModeIsland instances)
// ============================================================================

// Dialtone utilities stylesheet (created once, shared by all instances)
let sharedDialtoneSheet = null;

// Theme stylesheets cache (one per unique theme+contrast combination)
const themeSheetCache = new Map();

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  mode: {
    type: String,
    default: 'dark',
    validator: (value) => ['light', 'dark', 'inverted'].includes(value),
  },
});

// ============================================================================
// CONSTANTS
// ============================================================================

const BRAND = 'dp';

// Base styles for shadow root content
const SHADOW_ROOT_STYLES = `
  :host {
    color: var(--dt-color-foreground-primary);
    font: var(--dt-typography-body-md);
  }
`;

// ============================================================================
// REFS
// ============================================================================

const hostElement = ref(null);
const slotContent = ref(null);
const shadowRootRef = ref(null);

// ============================================================================
// INJECT THEME CONTEXT
// ============================================================================

const themes = inject('themes', {});
const currentMode = inject('currentMode', ref('light'));
const currentContrast = inject('currentContrast', ref('default'));

// Check if we're nested inside another ModeIsland
const parentModeIslandTheme = inject('modeIslandTheme', null);

// Track system color scheme preference as a reactive value
const systemPrefersDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================

// Get the effective page mode (resolves 'system' to actual light/dark)
const effectivePageMode = computed(() => {
  return currentMode.value === 'system'
    ? (systemPrefersDark.value ? 'dark' : 'light')
    : currentMode.value;
});

// Get the theme name for this mode island
const themeName = computed(() => {
  if (props.mode === 'inverted') {
    // If nested inside another ModeIsland, invert relative to parent
    if (parentModeIslandTheme?.value) {
      const parentMode = parentModeIslandTheme.value.includes('light') ? 'light' : 'dark';
      const invertedMode = parentMode === 'dark' ? 'light' : 'dark';
      return `${BRAND}-${invertedMode}`;
    }
    // Otherwise, invert relative to page theme
    const invertedMode = effectivePageMode.value === 'dark' ? 'light' : 'dark';
    return `${BRAND}-${invertedMode}`;
  }
  return `${BRAND}-${props.mode}`;
});

// Provide this island's theme to nested ModeIslands
provide('modeIslandTheme', themeName);

// ============================================================================
// STYLESHEET MANAGEMENT
// ============================================================================

// Get or create the shared Dialtone utilities stylesheet
const getSharedDialtoneSheet = async () => {
  if (!sharedDialtoneSheet) {
    sharedDialtoneSheet = new CSSStyleSheet();
    await sharedDialtoneSheet.replace(dialtoneCSS);
  }
  return sharedDialtoneSheet;
};

// Get or create a cached theme stylesheet
const getThemeSheet = async (themeNameValue, contrast) => {
  const cacheKey = `${themeNameValue}-${contrast}`;

  if (themeSheetCache.has(cacheKey)) {
    return themeSheetCache.get(cacheKey);
  }

  const themeObject = themes[themeNameValue];
  if (!themeObject) {
    console.error(`Theme "${themeNameValue}" not found`);
    return null;
  }

  // Combine base + brand CSS
  const cssParts = [
    themeObject.base.css,
    themeObject.brand.css,
  ];

  // Add contrast CSS if high
  if (contrast === 'high') {
    const mode = themeNameValue.includes('light') ? 'light' : 'dark';
    const contrastTheme = themes[`high-contrast-${mode}`];
    if (contrastTheme?.css) {
      cssParts.push(contrastTheme.css);
    }
  }

  // Combine and replace :root with :host for shadow DOM
  const combinedCSS = cssParts
    .map(css => css.replace(/:root/g, ':host'))
    .join('\n');

  // Create and cache the stylesheet
  const sheet = new CSSStyleSheet();
  await sheet.replace(combinedCSS);
  themeSheetCache.set(cacheKey, sheet);

  return sheet;
};

// ============================================================================
// THEME APPLICATION
// ============================================================================

// Apply theme to shadow root via adoptedStyleSheets
const applyTheme = async (shadowRoot, themeNameValue, contrast) => {
  const themeObject = themes[themeNameValue];
  if (!themeObject) {
    console.error(`Theme "${themeNameValue}" not found`);
    return;
  }

  // Get cached theme sheet (or create if first time)
  const themeSheet = await getThemeSheet(themeNameValue, contrast);
  if (!themeSheet) return;

  // Update adopted stylesheets: [utilities, theme]
  const utilitiesSheet = shadowRoot.adoptedStyleSheets[0];
  shadowRoot.adoptedStyleSheets = [utilitiesSheet, themeSheet];

  // Update data attributes on host element
  hostElement.value?.setAttribute('data-dt-theme', themeObject.base.name);
  hostElement.value?.setAttribute('data-dt-brand', themeObject.brand.name);
  hostElement.value?.setAttribute('data-dt-contrast', contrast);
};

// Update the mode island theme (called by watchers)
const updateTheme = async () => {
  if (!shadowRootRef.value) return;
  await applyTheme(shadowRootRef.value, themeName.value, currentContrast.value);
};

// ============================================================================
// WATCHERS
// ============================================================================

let mediaQueryCleanup = null;

// Watch system color scheme preference changes
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (e) => {
  systemPrefersDark.value = e.matches;
});
mediaQueryCleanup = () => mediaQuery.removeEventListener('change', (e) => {
  systemPrefersDark.value = e.matches;
});

// Watch contrast changes (applies to all modes)
watch(currentContrast, updateTheme);

// Watch for inverted mode changes
if (props.mode === 'inverted') {
  watch(currentMode, updateTheme);
  watch(themeName, updateTheme);
}

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

onMounted(async () => {
  if (!hostElement.value || !slotContent.value) {
    console.error('ModeIsland: Required refs not found');
    return;
  }

  try {
    // Create shadow root
    const shadowRoot = hostElement.value.attachShadow({ mode: 'open' });
    shadowRootRef.value = shadowRoot;

    // Adopt shared Dialtone utilities stylesheet
    const dialtoneSheet = await getSharedDialtoneSheet();
    shadowRoot.adoptedStyleSheets = [dialtoneSheet];

    // Apply initial theme
    await applyTheme(shadowRoot, themeName.value, currentContrast.value);

    // Add base styles for shadow root
    const baseStyles = document.createElement('style');
    baseStyles.innerHTML = SHADOW_ROOT_STYLES;
    shadowRoot.appendChild(baseStyles);

    // Move slot content into shadow root
    while (slotContent.value.firstChild) {
      shadowRoot.appendChild(slotContent.value.firstChild);
    }

    console.log('✓ ModeIsland initialized:', {
      mode: props.mode,
      theme: themeName.value,
      contrast: currentContrast.value,
    });
  } catch (error) {
    console.error('ModeIsland initialization error:', error);
    hostElement.value.innerHTML = `
      <div style="padding: 16px; border: 2px solid red; border-radius: 8px; background: #fee;">
        <strong>Error loading mode island:</strong> ${error.message}
      </div>
    `;
  }
});

onUnmounted(() => {
  mediaQueryCleanup?.();
});
</script>
