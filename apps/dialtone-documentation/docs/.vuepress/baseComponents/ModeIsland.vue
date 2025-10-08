<template>
  <div ref="hostElement">
    <div ref="slotContent">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, watch, computed } from 'vue';
import dialtoneCSS from '@dialpad/dialtone-css/lib/dist/dialtone.css?inline';

// Shared CSSStyleSheet for all ModeIsland instances (created once, reused)
let sharedDialtoneSheet = null;
const getSharedDialtoneSheet = async () => {
  if (!sharedDialtoneSheet) {
    sharedDialtoneSheet = new CSSStyleSheet();
    await sharedDialtoneSheet.replace(dialtoneCSS);
    console.log('✓ Shared Dialtone stylesheet created');
  }
  return sharedDialtoneSheet;
};

// Cache for theme CSSStyleSheets (one per unique theme+contrast combo)
const themeSheetCache = new Map();

const props = defineProps({
  mode: {
    type: String,
    default: 'dark',
    validator: (value) => ['light', 'dark', 'inverted'].includes(value),
  },
});

const hostElement = ref(null);
const slotContent = ref(null);
const shadowRootRef = ref(null);

// Inject theme context from client.js
const themes = inject('themes', {});
const currentMode = inject('currentMode', ref('light'));
const currentContrast = inject('currentContrast', ref('default'));

// Track system color scheme preference as a reactive value
const systemPrefersDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);

// Computed: Get the effective page mode (resolves 'system' to actual mode)
const effectivePageMode = computed(() => {
  if (currentMode.value === 'system') {
    return systemPrefersDark.value ? 'dark' : 'light';
  }
  return currentMode.value;
});

// Computed: Get the theme name for this mode island
const themeName = computed(() => {
  if (props.mode === 'inverted') {
    const invertedMode = effectivePageMode.value === 'dark' ? 'light' : 'dark';
    return `dp-${invertedMode}`;
  }
  return `dp-${props.mode}`;
});

// Get or create a cached CSSStyleSheet for theme CSS
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

  // Combine base + brand + contrast CSS into one sheet
  let combinedCSS = themeObject.base.css.replace(/:root/g, ':host') + '\n' +
                    themeObject.brand.css.replace(/:root/g, ':host');

  // Add contrast if high
  if (contrast === 'high') {
    const mode = themeNameValue.includes('light') ? 'light' : 'dark';
    const contrastTheme = themes[`high-contrast-${mode}`];
    if (contrastTheme?.css) {
      combinedCSS += '\n' + contrastTheme.css.replace(/:root/g, ':host');
    }
  }

  // Create and cache the stylesheet
  const sheet = new CSSStyleSheet();
  await sheet.replace(combinedCSS);
  themeSheetCache.set(cacheKey, sheet);
  console.log('✓ Theme stylesheet created and cached:', cacheKey);

  return sheet;
};

// Apply theme styles to shadow root using adoptedStyleSheets
const applyTheme = async (shadowRoot, themeNameValue, contrast) => {
  const themeObject = themes[themeNameValue];

  if (!themeObject) {
    console.error(`Theme "${themeNameValue}" not found`);
    return;
  }

  // Get cached theme sheet (or create if first time)
  const themeSheet = await getThemeSheet(themeNameValue, contrast);

  if (!themeSheet) return;

  // Get the current utilities sheet
  const utilitiesSheet = shadowRoot.adoptedStyleSheets[0];

  // Update adopted stylesheets: [utilities, theme]
  shadowRoot.adoptedStyleSheets = [utilitiesSheet, themeSheet];

  // Update data attributes on host
  hostElement.value?.setAttribute('data-dt-theme', themeObject.base.name);
  hostElement.value?.setAttribute('data-dt-brand', themeObject.brand.name);
  hostElement.value?.setAttribute('data-dt-contrast', contrast);
};

// Update the mode island theme
const updateTheme = async () => {
  if (!shadowRootRef.value) return;
  await applyTheme(shadowRootRef.value, themeName.value, currentContrast.value);
};

// Setup watchers
let mediaQueryCleanup = null;

// Watch system color scheme preference
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const handleSystemChange = (e) => {
  systemPrefersDark.value = e.matches;
};
mediaQuery.addEventListener('change', handleSystemChange);
mediaQueryCleanup = () => mediaQuery.removeEventListener('change', handleSystemChange);

// Watch contrast changes (all modes)
watch(currentContrast, updateTheme);

// Watch for inverted mode changes (mode changes trigger themeName computed update)
if (props.mode === 'inverted') {
  watch(currentMode, updateTheme);
  // Watch themeName changes (reactive to systemPrefersDark and currentMode)
  watch(themeName, (newTheme, oldTheme) => {
    if (newTheme !== oldTheme) {
      updateTheme();
    }
  });
}

onMounted(async () => {
  if (!hostElement.value || !slotContent.value) {
    console.error('ModeIsland: Required refs not found');
    return;
  }

  try {
    // Create shadow root and store reference
    const shadowRoot = hostElement.value.attachShadow({ mode: 'open' });
    shadowRootRef.value = shadowRoot;

    // Inject Dialtone CSS utilities using adoptedStyleSheets (shared across all instances)
    const dialtoneSheet = await getSharedDialtoneSheet();
    shadowRoot.adoptedStyleSheets = [dialtoneSheet];

    // Apply theme (injects theme CSS variables into shadow root)
    applyTheme(shadowRoot, themeName.value, currentContrast.value);

    // Move slot content into shadow root
    while (slotContent.value.firstChild) {
      shadowRoot.appendChild(slotContent.value.firstChild);
    }

    console.log('✓ ModeIsland initialized:', { mode: props.mode, theme: themeName.value, contrast: currentContrast.value });
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
