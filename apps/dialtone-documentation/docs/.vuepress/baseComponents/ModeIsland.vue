<template>
  <div ref="hostElement" class="mode-island-host">
    <div ref="slotContent">
      <slot>
        default slot
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue';

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

// Inject the themes and setTheme function that were provided in client.js
const themes = inject('themes', {});
const setTheme = inject('setTheme');
const currentMode = inject('currentMode', ref('light')); // Injected from client.js
const currentContrast = inject('currentContrast', ref('default')); // Injected from client.js

// Helper to update or create a style tag in shadow root
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
  styleTag.innerHTML = css.replace(/:root/g, ':host');
  return styleTag;
};

// Helper to apply contrast theme
const applyContrast = (shadowRoot, themeName, contrast, brandStyle) => {
  if (contrast !== 'high') {
    const contrastStyle = shadowRoot.querySelector('#dialtone-css-contrast');
    if (contrastStyle) contrastStyle.remove();
    if (hostElement.value) hostElement.value.setAttribute('data-dt-contrast', 'default');
    return;
  }

  const mode = themeName.includes('light') ? 'light' : 'dark';
  const contrastThemeName = `high-contrast-${mode}`;
  const contrastThemeObject = themes[contrastThemeName];

  if (contrastThemeObject?.css) {
    updateStyleTag(shadowRoot, 'dialtone-css-contrast', contrastThemeObject.css, brandStyle.nextSibling);
    if (hostElement.value) hostElement.value.setAttribute('data-dt-contrast', 'high');
    console.log('✓ High contrast applied:', contrastThemeName);
  } else {
    console.warn('High contrast theme not found:', contrastThemeName);
  }
};

// Function to apply theme to shadow root
const applyThemeToShadowRoot = (shadowRoot, themeName, contrast = 'default') => {
  const themeObject = themes[themeName];

  if (!themeObject) {
    console.error(`Theme "${themeName}" not found`);
    return;
  }

  // Update theme and brand styles
  const themeStyle = updateStyleTag(shadowRoot, 'dialtone-css-theme', themeObject.base.css, shadowRoot.firstChild);
  const brandStyle = updateStyleTag(shadowRoot, 'dialtone-css-brand', themeObject.brand.css, themeStyle.nextSibling);

  // Apply contrast
  applyContrast(shadowRoot, themeName, contrast, brandStyle);

  // Update data attributes on host element
  if (hostElement.value) {
    hostElement.value.setAttribute('data-dt-theme', themeObject.base.name);
    hostElement.value.setAttribute('data-dt-brand', themeObject.brand.name);
  }

  console.log('✓ Theme updated to:', themeName, 'contrast:', contrast);
};

// Helper function to get the current effective mode (resolves 'system' to actual mode)
const getEffectiveMode = () => {
  if (currentMode.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return currentMode.value;
};

// Helper function to update theme based on current mode
const updateTheme = () => {
  if (!shadowRootRef.value) return;

  let themeName;
  if (props.mode === 'inverted') {
    const pageMode = getEffectiveMode();
    const invertedMode = pageMode === 'dark' ? 'light' : 'dark';
    themeName = `dp-${invertedMode}`;
  } else {
    themeName = `dp-${props.mode}`;
  }

  console.log('Updating mode island to:', themeName, 'contrast:', currentContrast.value);
  applyThemeToShadowRoot(shadowRootRef.value, themeName, currentContrast.value);
};

// Watch for contrast changes (applies to all modes)
watch(currentContrast, (newContrast) => {
  console.log('Contrast changed to:', newContrast);
  updateTheme();
});

// Watch for theme changes if mode is inverted
if (props.mode === 'inverted') {
  // Watch for manual theme changes
  watch(currentMode, () => {
    updateTheme();
  });

  // Watch for system theme changes (always listen, check condition inside)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    // Only update if the page is using 'system' mode
    if (currentMode.value === 'system') {
      console.log('System color scheme changed');
      updateTheme();
    }
  };
  mediaQuery.addEventListener('change', handleSystemThemeChange);
}

onMounted(async () => {
  // Determine the theme name based on mode prop
  let themeName;

  if (props.mode === 'inverted') {
    // Invert the current page mode
    const pageMode = getEffectiveMode();
    const invertedMode = pageMode === 'dark' ? 'light' : 'dark';
    themeName = `dp-${invertedMode}`;
    console.log('ModeIsland component mounted, mode: inverted (page is', pageMode, ') -> theme:', themeName);
  } else {
    // Use explicit mode
    themeName = `dp-${props.mode}`;
    console.log('ModeIsland component mounted, mode:', props.mode, '-> theme:', themeName);
  }

  console.log('Available themes:', Object.keys(themes));

  if (!hostElement.value) {
    console.error('Host element not found');
    return;
  }

  if (!setTheme) {
    console.error('setTheme function not available');
    return;
  }

  try {
    console.log('Creating shadow root...');
    const shadowRoot = hostElement.value.attachShadow({ mode: 'open' });
    shadowRootRef.value = shadowRoot; // Store reference for watcher

    // Create a wrapper div to hold the content
    const wrapper = document.createElement('div');
    wrapper.className = 'mode-island-wrapper';

    // Move slot content into the wrapper
    if (slotContent.value) {
      while (slotContent.value.firstChild) {
        wrapper.appendChild(slotContent.value.firstChild);
      }
      console.log('✓ Content moved to wrapper, children:', wrapper.childNodes.length);
    }

    // Add wrapper to shadow root
    shadowRoot.appendChild(wrapper);

    // Apply initial theme with current contrast
    applyThemeToShadowRoot(shadowRoot, themeName, currentContrast.value);

    console.log('✓ Mode island created successfully with mode:', props.mode, '(theme:', themeName + ')');
  } catch (error) {
    console.error('Error setting up mode island:', error);
    // Fallback: show error in regular DOM
    hostElement.value.innerHTML = `
      <div style="padding: 16px; border: 2px solid red; border-radius: 8px; background: #fee;">
        <strong>Error loading mode island:</strong> ${error.message}
      </div>
    `;
  }
});
</script>

<style scoped>
</style>
