<template>
  <dt-stack
    as="nav"
    direction="row"
    gap="300"
    role="navigation"
  >
    <dt-button
      v-for="link in items"
      :key="link.text"
      :to="link.link"
      kind="muted"
      importance="clear"
      class="d-fw-normal"
      :active="isActiveLink(link.text)"
    >
      {{ link.text }}
    </dt-button>
  </dt-stack>
  <dt-stack direction="row" gap="300">
    <dt-button
      v-dt-tooltip="'Storybook'"
      href="https://dialtone.dialpad.com/vue"
      target="_blank"
      rel="noreferrer noopener"
      kind="muted"
      importance="clear"
      aria-label="Open Storybook"
    >
      <template #icon>
        <dt-icon-storybook size="400" />
      </template>
    </dt-button>
    <dt-button
      v-dt-tooltip="'Github Repository'"
      href="https://github.com/dialpad/dialtone"
      target="_blank"
      rel="noreferrer noopener"
      kind="muted"
      importance="clear"
      aria-label="Open GitHub repository"
    >
      <template #icon>
        <dt-icon-github size="400" />
      </template>
    </dt-button>
    <dt-button
      v-dt-tooltip="'Codepen Template'"
      href="https://codepen.io/pen?template=oNmoRqO"
      target="_blank"
      rel="noopener noreferrer"
      kind="muted"
      importance="clear"
      aria-label="Open Codepen template"
    >
      <template #icon>
        <dt-icon-codepen size="400" />
      </template>
    </dt-button>
    <dt-button
      v-dt-tooltip:bottom="`Mode: ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} `"
      importance="clear"
      kind="muted"
      @click="toggleMode"
    >
      <template #icon>
        <dt-icon
          size="400"
          :name="currentModeIconName"
        />
      </template>
    </dt-button>
    <dt-button
      v-dt-tooltip:bottom="`Theme: ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} `"
      :circle="true"
      importance="clear"
      kind="muted"
      hidden
      @click="toggleTheme"
    >
      <template #icon>
        <dt-icon
          class="theme-toggle-button"
          size="400"
          name="triangle"
        />
      </template>
    </dt-button>
    <dt-button
      importance="outlined"
      kind="muted"
      class="d-ml8 d-w164 d-bc-subtle h:d-bc-default h:d-bgc-transparent"
      @click="$emit('search')"
    >
      <template #icon>
        <dt-icon
          name="search"
          size="200"
        />
      </template>
      <span class="d-fc-placeholder">Search Dialtone</span>
    </dt-button>
  </dt-stack>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { DtIconStorybook, DtIconGithub, DtIconCodepen } from '@dialpad/dialtone-icons/vue3';
import { onMounted, onUnmounted, inject, computed } from 'vue';
import { setTheme } from '@dialpad/dialtone-tokens/themes/config';

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
defineEmits(['search']);

const route = useRoute();
const currentMode = inject('currentMode');
const currentTheme = inject('currentTheme');
const modes = ['system', 'light', 'dark'];
const themes = inject('themes', {});
const excludedThemeNames = ['dp-deca', 'expressive'];
// window is not available during SSR; the real value is assigned client-side.
const prefersDarkMediaQuery = !__VUEPRESS_SSR__ ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const themesKeys = Array.from(
  new Set(
    Object.keys(themes)
      .filter(key => !excludedThemeNames.some(exclusion => key.startsWith(exclusion)))
      .map(key => key.replace(/-(dark|light)/, '')),
  ),
);

const currentModeIconName = computed(() => {
  switch (currentMode.value) {
    case 'dark':
      return 'moon';
    case 'light':
      return 'sun';
    default:
      return 'circle-half-filled';
  }
});
const isActiveLink = (text) => {
  const linkBase = text.toLowerCase();
  return route.path.search(linkBase) !== -1;
};

const toggleMode = () => {
  const currentIndex = modes.indexOf(currentMode.value);
  const nextIndex = (currentIndex + 1) % modes.length;
  currentMode.value = modes[nextIndex];

  setCss();
  localStorage.setItem('preferredMode', currentMode.value);
};

const toggleTheme = () => {
  const currentIndex = themesKeys.indexOf(currentTheme.value);
  const nextIndex = (currentIndex + 1) % themesKeys.length;
  currentTheme.value = themesKeys[nextIndex];
  setCss();
  localStorage.setItem('preferredTheme', currentTheme.value);
};

const setCss = () => {
  if (!modes.includes(currentMode.value)) {
    currentMode.value = 'system';
    localStorage.setItem('preferredMode', currentMode.value);
  }

  const mode = currentMode.value === 'system' ? (prefersDarkMediaQuery.matches ? 'dark' : 'light') : currentMode.value

  const preferredTheme = `${currentTheme.value}-${mode}`;
  let theme = themes[preferredTheme];

  if (!theme) {
    const defaultTheme = `dp-${mode}`;
    console.warn(`Theme [${preferredTheme}] does not exists, using default theme [${defaultTheme}]`);
    theme = themes[defaultTheme];
  }

  setTheme(theme);
};

onMounted(() => {
  currentMode.value = localStorage.getItem('preferredMode') || 'system';
  prefersDarkMediaQuery?.addEventListener('change', setCss);
  setCss();
});

onUnmounted(() => {
  prefersDarkMediaQuery?.removeEventListener('change', setCss);
});
</script>

<style>
.theme-toggle-button {
  color: var(--dt-shell-mention-color-surface-primary);
}
</style>
