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

const STYLE_IDS = {
  UTILITIES: 'dialtone-css-utilities',
  THEME: 'dialtone-css-theme',
  BRAND: 'dialtone-css-brand',
  CONTRAST: 'dialtone-css-contrast',
};

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

// Update or create a style tag in shadow root
const updateStyleTag = (shadowRoot, id, css, insertBefore = null) => {
  let styleTag = shadowRoot.querySelector(`#${id}`);
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.setAttribute('type', 'text/css');
    styleTag.setAttribute('id', id);
    if (insertBefore) {
      shadowRoot.insertBefore(styleTag, insertBefore);
    } else {
      shadowRoot.appendChild(styleTag);
    }
  }
  // Replace :root with :host for shadow DOM compatibility
  styleTag.innerHTML = css.replace(/:root/g, ':host');
  return styleTag;
};

// Apply or remove contrast theme
const applyContrast = (shadowRoot, themeNameValue, contrast, brandStyle) => {
  const contrastStyle = shadowRoot.querySelector(`#${STYLE_IDS.CONTRAST}`);

  if (contrast !== 'high') {
    contrastStyle?.remove();
    hostElement.value?.setAttribute('data-dt-contrast', 'default');
    return;
  }

  const mode = themeNameValue.includes('light') ? 'light' : 'dark';
  const contrastTheme = themes[`high-contrast-${mode}`];

  if (!contrastTheme?.css) {
    console.warn(`High contrast theme not found: high-contrast-${mode}`);
    return;
  }

  updateStyleTag(shadowRoot, STYLE_IDS.CONTRAST, contrastTheme.css, brandStyle.nextSibling);
  hostElement.value?.setAttribute('data-dt-contrast', 'high');
};

// Apply theme styles to shadow root
const applyTheme = (shadowRoot, themeNameValue, contrast) => {
  const themeObject = themes[themeNameValue];

  if (!themeObject) {
    console.error(`Theme "${themeNameValue}" not found`);
    return;
  }

  // Update theme and brand styles (order matters)
  const themeStyle = updateStyleTag(shadowRoot, STYLE_IDS.THEME, themeObject.base.css, shadowRoot.firstChild);
  const brandStyle = updateStyleTag(shadowRoot, STYLE_IDS.BRAND, themeObject.brand.css, themeStyle.nextSibling);

  // Apply or remove contrast
  applyContrast(shadowRoot, themeNameValue, contrast, brandStyle);

  // Update data attributes on host
  hostElement.value?.setAttribute('data-dt-theme', themeObject.base.name);
  hostElement.value?.setAttribute('data-dt-brand', themeObject.brand.name);
};

// Update the mode island theme
const updateTheme = () => {
  if (!shadowRootRef.value) return;
  applyTheme(shadowRootRef.value, themeName.value, currentContrast.value);
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
