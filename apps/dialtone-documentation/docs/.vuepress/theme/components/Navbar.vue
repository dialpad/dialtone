<template>
  <dt-stack
    as="nav"
    direction="row"
    gap="300"
  >
    <dt-button
      v-for="link in navItems"
      :key="link.text"
      :to="link.link"
      kind="muted"
      importance="clear"
      :size="400"
      class="d-fw-normal"
      :active="isActiveLink(link.link)"
    >
      {{ link.text }}
    </dt-button>
  </dt-stack>
  <dt-stack direction="row" gap="300">
    <dt-button
      v-dt-tooltip="'Storybook'"
      hidden
      class="d-btn d-btn--muted d-btn--icon-only dialtone-shell-btn"
      href="https://dialtone.dialpad.com/vue"
      target="_blank"
      rel="noreferrer noopener"
      kind="muted"
      importance="clear"
      aria-label="Open Storybook"
    >
      <template #startIcon>
        <dt-icon-storybook size="400" />
      </template>
    </dt-button>
    <dt-button
      v-dt-tooltip="'Github Repository'"
      hidden
      class="d-btn d-btn--muted d-btn--icon-only dialtone-shell-btn"
      href="https://github.com/dialpad/dialtone"
      target="_blank"
      rel="noreferrer noopener"
      kind="muted"
      importance="clear"
      aria-label="Open GitHub repository"
    >
      <template #startIcon>
        <dt-icon-github size="400" />
      </template>
    </dt-button>
    <dt-button
      v-dt-tooltip="'Codepen Template'"
      hidden
      class="d-btn d-btn--muted d-btn--icon-only dialtone-shell-btn"
      href="https://codepen.io/pen?template=oNmoRqO"
      target="_blank"
      rel="noopener noreferrer"
      kind="muted"
      importance="clear"
      aria-label="Open Codepen template"
    >
      <template #startIcon>
        <dt-icon-codepen size="400" />
      </template>
    </dt-button>
    <dt-dropdown
      id="theme-toggle-dropdown"
      :hidden="!showThemeSwitcher"
      navigation-type="arrow-keys"
      placement="bottom-start"
      class="theme-toggle-dropdown"
      max-height="33vh"
    >
      <template #anchor>
        <dt-button
          v-dt-tooltip:bottom="`Theme: ${capitalize(currentTheme)}`"
          class="theme-toggle-button dialtone-shell-btn"
          importance="clear"
          kind="muted"
        >
          <template #startIcon>
            <dt-icon
              size="400"
              name="satisfied-filled"
            />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Base Theme"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme('dp')"
          >
            Dialpad (DP)
            <template #end>
              <dt-icon :class="{ 'd-o0': currentTheme !== 'dp' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Partner Themes"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme('tmo')"
          >
            T-Mobile (TMO)
            <template #end>
              <dt-icon :class="{ 'd-o0': currentTheme !== 'tmo' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Accessibility"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme('prota-deuter')"
          >
            Prota-Deuter
            <template #end>
              <dt-icon :class="{ 'd-o0': currentTheme !== 'prota-deuter' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme('trita')"
          >
            Trita
            <template #end>
              <dt-icon :class="{ 'd-o0': currentTheme !== 'trita' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Named Themes"
        >
          <dt-list-item
            v-for="themeName in namedThemes"
            :key="themeName"
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme(themeName)"
          >
            {{ formatThemeName(themeName) }}
            <template #end>
              <dt-icon :class="{ 'd-o0': currentTheme !== themeName }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Experimental (37 themes)"
        >
          <dt-list-item
            v-for="themeNum in numberedThemes"
            :key="themeNum"
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setTheme(themeNum)"
          >
            Theme {{ themeNum }}
            <template #end>
              <dt-icon :class="{ 'd-o0': currentTheme !== themeNum }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
      </template>
    </dt-dropdown>
    <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
      <template #anchor>
        <dt-button
          v-dt-tooltip:bottom="`Mode: ${capitalize(currentMode)}`"
          importance="clear"
          kind="muted"
          class="dialtone-shell-btn"
        >
          <template #startIcon>
            <dt-icon
              size="400"
              :name="currentModeIconName"
            />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Mode"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('system')"
          >
            System
            <template #end>
              <dt-icon :class="{ 'd-o0': currentMode !== 'system' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('light')"
          >
            Light
            <template #end>
              <dt-icon :class="{ 'd-o0': currentMode !== 'light' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('dark')"
          >
            Dark
            <template #end>
              <dt-icon :class="{ 'd-o0': currentMode !== 'dark' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
          heading="Contrast"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setContrast('default')"
          >
            Default
            <template #end>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'default' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setContrast('high')"
          >
            High
            <template #end>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'high' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
      </template>
    </dt-dropdown>
    <dt-button
      v-dt-tooltip:bottom-end="'Search'"
      importance="clear"
      kind="muted"
      @click="$emit('search')"
    >
      <template #startIcon>
        <dt-icon
          name="search"
          size="400"
        />
      </template>
    </dt-button>
  </dt-stack>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { DtIconStorybook, DtIconGithub, DtIconCodepen } from '@dialpad/dialtone-icons/vue';
import { useThemeManager } from '../composables/useThemeManager';

defineEmits(['search']);

const route = useRoute();
const showThemeSwitcher = __VUEPRESS_DEV__ || __DIALTONE_DEPLOY_PREVIEW__;

// Top-level navigation items
const navItems = [
  { text: 'Foundations', link: '/foundations/' },
  { text: 'Design System', link: '/dialtone/' },
  { text: 'UI Kits', link: '/ui-kits/' },
];

// Use theme manager composable with theme switching enabled
const {
  currentMode,
  currentTheme,
  currentContrast,
  currentModeIconName,
  setMode,
  setContrast,
  setTheme,
  namedThemes,
  numberedThemes,
  formatThemeName,
} = useThemeManager({ includeThemes: true });

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const isActiveLink = (link) => {
  // For Design System, check all related paths (same as useSidebarItems.js)
  if (link === '/dialtone/') {
    const designSystemPaths = ['/components/', '/utilities/', '/tokens/', '/guides/', '/about/', '/dialtone/'];
    return designSystemPaths.some(p => route.path.includes(p));
  }
  // For other links, use simple path matching
  return route.path.startsWith(link);
};
</script>

<style scoped>
.theme-toggle-button {
  color: var(--dt-shell-mention-color-surface-primary);
}
</style>
