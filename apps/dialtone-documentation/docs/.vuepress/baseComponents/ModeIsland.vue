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

// Function to apply theme to shadow root
const applyThemeToShadowRoot = (shadowRoot, themeName) => {
  const themeObject = themes[themeName];

  if (!themeObject) {
    console.error(`Theme "${themeName}" not found`);
    return;
  }

  // Replace :root with :host in the CSS
  const baseCSS = themeObject.base.css.replace(/:root/g, ':host');
  const brandCSS = themeObject.brand.css.replace(/:root/g, ':host');

  // Update or create theme style tag
  let themeStyle = shadowRoot.querySelector('#dialtone-css-theme');
  if (!themeStyle) {
    themeStyle = document.createElement('style');
    themeStyle.setAttribute('type', 'text/css');
    themeStyle.setAttribute('id', 'dialtone-css-theme');
    shadowRoot.insertBefore(themeStyle, shadowRoot.firstChild);
  }
  themeStyle.innerHTML = baseCSS;

  // Update or create brand style tag
  let brandStyle = shadowRoot.querySelector('#dialtone-css-brand');
  if (!brandStyle) {
    brandStyle = document.createElement('style');
    brandStyle.setAttribute('type', 'text/css');
    brandStyle.setAttribute('id', 'dialtone-css-brand');
    shadowRoot.insertBefore(brandStyle, themeStyle.nextSibling);
  }
  brandStyle.innerHTML = brandCSS;

  // Update data attributes on host element
  if (hostElement.value) {
    hostElement.value.setAttribute('data-dt-theme', themeObject.base.name);
    hostElement.value.setAttribute('data-dt-brand', themeObject.brand.name);
  }

  console.log('✓ Theme updated to:', themeName);
};

// Helper function to get the current effective mode (resolves 'system' to actual mode)
const getEffectiveMode = () => {
  if (currentMode.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return currentMode.value;
};

// Helper function to update inverted mode island
const updateInvertedTheme = () => {
  if (shadowRootRef.value) {
    const pageMode = getEffectiveMode();
    const invertedMode = pageMode === 'dark' ? 'light' : 'dark';
    const themeName = `dp-${invertedMode}`;
    console.log('Updating inverted mode island to:', themeName, '(page is', pageMode + ')');
    applyThemeToShadowRoot(shadowRootRef.value, themeName);
  }
};

// Watch for theme changes if mode is inverted
if (props.mode === 'inverted') {
  // Watch for manual theme changes
  watch(currentMode, () => {
    updateInvertedTheme();
  });

  // Watch for system theme changes (always listen, check condition inside)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    // Only update if the page is using 'system' mode
    if (currentMode.value === 'system') {
      console.log('System color scheme changed');
      updateInvertedTheme();
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

    // Apply initial theme
    applyThemeToShadowRoot(shadowRoot, themeName);

    hostElement.value.setAttribute('data-dt-contrast', 'default');

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
