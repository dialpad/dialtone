<!-- eslint-disable max-len -->
<template>
  <dt-stack
    as="nav"
    direction="row"
    gap="300"
    role="navigation"
  >
    <router-link
      v-for="link in items"
      :key="link.text"
      :to="link.link"
      class="d-btn d-btn--muted d-fw-normal"
      :class="{ 'd-btn--active': isActiveLink(link.text) }"
    >
      <span class="d-btn__label">{{ link.text }}</span>
    </router-link>
  </dt-stack>
  <dt-stack direction="row" gap="300">
    <a
      v-dt-tooltip="'Storybook'"
      class="d-btn d-btn--muted d-btn--icon-only"
      href="https://dialtone.dialpad.com/vue"
      target="_blank"
      rel="noreferrer noopener"
    >
      <span class="d-btn__icon d-btn__icon--left">
        <svg
          aria-labelledby="storybookIconTitle"
          class="d-icon d-icon--system d-icon--storybook d-icon--size-400"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="storybookIconTitle">Open Storybook</title>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
            d="M3.9733 3.92004L4.5933 20.43C4.60283 20.6823 4.70682 20.9207 4.88465 21.0998C5.06248 21.2789 5.30115 21.3847 5.5533 21.396L18.9753
            21.999C19.111 22.0051 19.2465 21.9837 19.3736 21.936C19.5008 21.8882 19.617 21.8153 19.7152 21.7215C19.8134 21.6277 19.8916 21.5149
            19.9451 21.3901C19.9985 21.2652 20.0262 21.1309 20.0263 20.995V3.00604C20.0264 2.86858 19.9984 2.73256 19.9439 2.60638C19.8893
            2.48019 19.8095 2.36654 19.7093 2.27244C19.6091 2.17833 19.4907 2.10578 19.3613 2.05927C19.232 2.01277 19.0945 1.99329 18.9573
            2.00204L17.8536 2.07106L17.9346 4.3788C17.9357 4.40743 17.9285 4.43575 17.9139 4.46042C17.8993 4.4851 17.878 4.50508 17.8525
            4.51802C17.8269 4.53096 17.7982 4.5363 17.7697 4.53343C17.7412 4.53056 17.7141 4.51958 17.6916 4.5018L16.9476 3.9158L16.0676
            4.5838C16.0449 4.60086 16.0179 4.61112 15.9896 4.61341C15.9613 4.61569 15.9329 4.6099 15.9078 4.5967C15.8826 4.58351 15.8618
            4.56345 15.8476 4.53886C15.8334 4.51427 15.8265 4.48617 15.8276 4.4578L15.9216 2.19188L4.9173 2.88004C4.6554 2.89604 4.41011
            3.01374 4.23376 3.20803C4.05741 3.40232 3.96394 3.65782 3.9733 3.92004ZM13.3606 9.7318C13.3606 10.1228 15.9966 9.9358 16.3496
            9.6608C16.3496 6.9968 14.9206 5.5968 12.3026 5.5968C9.68463 5.5968 8.21863 7.0188 8.21863 9.1508C8.21863 11.2878 9.87663
            12.2188 11.2856 13.0098C12.3266 13.5938 13.2306 14.1018 13.2306 14.9628C13.2306 15.5308 12.9526 15.8688 12.3396 15.8688C11.5416
            15.8688 11.2256 15.4608 11.2636 14.0748C11.2636 13.7748 8.21863 13.6808 8.12563 14.0748C7.88963 17.4338 9.98263 18.4028 12.3776
            18.4028C14.6976 18.4028 16.5176 17.1668 16.5176 14.9268C16.5176 12.591 14.7649 11.662 13.318 10.895C12.299 10.355 11.4306 9.8948
            11.4306 9.0798C11.4306 8.2798 12.0246 8.1738 12.3766 8.1738C12.7486 8.1738 13.4166 8.2388 13.3606 9.7318Z"
          />
        </svg>
      </span>
    </a>
    <a
      v-dt-tooltip="'Github Repository'"
      class="d-btn d-btn--muted d-btn--icon-only"
      href="https://github.com/dialpad/dialtone"
      target="_blank"
      rel="noreferrer noopener"
    >
      <span class="d-btn__icon d-btn__icon--left">
        <svg
          aria-labelledby="githubIconTitle"
          class="d-icon d-icon--system d-icon--Github d-icon--size-400"
          height="24"
          viewBox="0 0 18 18"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="githubIconTitle">Open github repository</title>
          <path
            fill="currentColor"
            d="M9 1a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
            1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0
            .67-.21 2.2.82a7.42 7.42 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65
            3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 009 1z"
          />
        </svg>
      </span>
    </a>
    <a
      v-dt-tooltip="'Codepen Template'"
      class="d-btn d-btn--muted d-btn--icon-only"
      href="https://codepen.io/pen?template=oNmoRqO"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span class="d-btn__icon d-btn__icon--left">
        <svg
          aria-labelledby="codepenIconTitle"
          role="img"
          class="d-icon d-icon--system d-icon--Codepen d-icon--size-400"
          height="24"
          viewBox="0 0 18 18"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="codepenIconTitle">Open codepen template</title>
          <path
            fill="currentColor"
            d="M12.67 8.17l-2.98-2v-3.2l5.38 3.6-2.4 1.6zM13.9 9l1.73-1.15v2.3L13.9 9zm-4.2 2.82l2.98-2 2.4
            1.62-5.38 3.59v-3.2zm-4.36-2l2.98 2v3.2l-5.38-3.58 2.4-1.61zM4.1 9l-1.73 1.15v-2.3L4.1
            9zm4.2-2.82l-2.98 2-2.4-1.62L8.3 2.97v3.2zm.7 4.45L6.57 9 9 7.37 11.43 9 9
            10.63zm7.99-4.19l-.01-.05-.01-.04-.02-.05-.02-.03a.6.6 0 0 0-.02-.05l-.02-.03a.69.69 0 0
            0-.15-.17L16.7 6h-.02L9.4 1.11a.69.69 0 0 0-.77 0L1.3 5.99h-.02c0 .02-.02.02-.03.03a.81.81 0 0
            0-.12.13.69.69 0 0 0-.03.04l-.02.03-.02.05-.02.03-.02.05v.04L1 6.44v.03a.7.7 0 0 0-.01.1v4.87a.7.7
            0 0 0 0 .09l.01.03.01.05.01.04.02.05.02.03a.51.51 0 0 0 .07.12.53.53 0 0 0 .08.1c.02 0
            .03.02.04.03l.03.02h.02l7.3 4.88a.69.69 0 0 0 .77 0l7.31-4.87h.02c0-.02.02-.02.03-.03a.72.72 0 0 0
            .04-.04l.02-.02a.62.62 0 0 0 .13-.19l.02-.03a.6.6 0 0 0 .02-.05v-.04l.02-.05v-.03a.7.7 0 0 0
            .01-.1V6.57a.7.7 0 0 0 0-.09l-.01-.03z"
          />
        </svg>
      </span>
    </a>
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
      v-dt-tooltip:bottom="`Contrast: ${currentContrast.charAt(0).toUpperCase() + currentContrast.slice(1)} `"
      importance="clear"
      kind="muted"
      @click="toggleContrast"
    >
      <template #icon>
        <dt-icon
          size="400"
          :name="currentContrastIconName"
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
import { onMounted, onUnmounted, inject, computed } from 'vue';
import { setTheme, applyContrast } from '@dialpad/dialtone-tokens/themes/config';

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
const currentContrast = inject('currentContrast');
const modes = ['system', 'light', 'dark'];
const contrasts = ['default', 'high'];
const themes = inject('themes');
const excludedThemeNames = ['expressive'];
const prefersDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
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

const currentContrastIconName = computed(() => {
  switch (currentContrast.value) {
    case 'high':
      return 'accessibility';
    case 'default':
    default:
      return 'eye';
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

const toggleContrast = () => {
  const currentIndex = contrasts.indexOf(currentContrast.value);
  const nextIndex = (currentIndex + 1) % contrasts.length;
  currentContrast.value = contrasts[nextIndex];
  applyCurrentContrast();
  localStorage.setItem('preferredContrast', currentContrast.value);
};

const applyCurrentContrast = () => {
  if (currentContrast.value === 'high') {
    const contrastTheme = themes['high-contrast'];
    applyContrast('high', contrastTheme);
  } else {
    applyContrast('default');
  }
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
  applyCurrentContrast();
};

onMounted(() => {
  prefersDarkMediaQuery.addEventListener('change', setCss);
  setCss();
});

onUnmounted(() => {
  prefersDarkMediaQuery.removeEventListener('change', setCss);
});
</script>

<style>
.theme-toggle-button {
  color: var(--dt-shell-mention-color-surface-primary);
}
</style>
