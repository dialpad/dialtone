<template>
  <dt-stack
    as="nav"
    direction="row"
    gap="50"
  >
    <template v-for="link in navItems" :key="link.text">
      <dt-hovercard
        v-if="hovercardMap[link.text].length && dismissedKey !== link.text"
        placement="bottom-start"
        dialog-class="d-w-1000 d-p-0"
        padding="medium"
        transition="true"
        :offset="[-8, 8]"
      >
        <template #anchor>
          <dt-button v-bind="navButtonProps(link)">
            {{ link.text }}
          </dt-button>
        </template>
        <template #content>
          <dt-box class="d-d-grid d-g-100 d-g-cols2 d-ai-start">
            <dt-button
              v-for="item in hovercardMap[link.text]"
              :key="item.link"
              size="300"
              kind="muted"
              importance="clear"
              :to="item.link"
              start-icon-class="d-as-start d-pbs-50"
              @click="dismissHovercard(link.text)"
            >
              <template v-if="item.icon" #startIcon="{ iconSize }">
                <dt-icon class="d-fc-muted" :name="item.icon" :size="iconSize" />
              </template>
              <dt-box padding-inline-start="50">
                <dt-stack gap="50">
                  <dt-text kind="headline" size="300">
                    {{ item.text }}
                  </dt-text>
                  <dt-text kind="body" size="200" tone="muted">
                    {{ item.description }}
                  </dt-text>
                </dt-stack>
              </dt-box>
            </dt-button>
          </dt-box>
        </template>
      </dt-hovercard>
      <dt-button v-else v-bind="navButtonProps(link)">
        {{ link.text }}
      </dt-button>
    </template>
  </dt-stack>
  <dt-stack direction="row" gap="50">
    <dt-button
      to="/dialtone/whats-new/"
      class="d-mie-100"
      size="200"
    >
      What's New
      <template #startIcon="{ iconSize }">
        <dt-icon name="megaphone" :size="iconSize" />
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
              size="300"
              name="satisfied-filled"
            />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
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
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
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
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
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
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
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
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
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
              size="300"
              :name="currentModeIconName"
            />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
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
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
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
          size="300"
        />
      </template>
    </dt-button>
  </dt-stack>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { useThemeManager } from '../composables/useThemeManager';

defineEmits(['search']);

const route = useRoute();
const themeData = useThemeLocaleData();
const showThemeSwitcher = __VUEPRESS_DEV__ || __DIALTONE_DEPLOY_PREVIEW__;

// Unmount the hovercard via v-if to guarantee instant dismissal on click —
// bypasses DtHovercard's focus/transition/hover state entirely.
// Reset on route change (so it can remount on the next page) or via a timer
// fallback for same-page clicks that don't trigger navigation.
const dismissedKey = ref(null);
let resetTimer;
const dismissHovercard = (key) => {
  dismissedKey.value = key;
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    if (dismissedKey.value === key) dismissedKey.value = null;
  }, 400);
};
watch(() => route.path, () => {
  if (dismissedKey.value === null) return;
  clearTimeout(resetTimer);
  dismissedKey.value = null;
});
onUnmounted(() => clearTimeout(resetTimer));

const navItems = [
  { text: 'Foundations', link: '/foundations/', group: 'foundations' },
  { text: 'Design System', link: '/dialtone/', group: 'dialtone' },
  { text: 'UI Kits', link: '/ui-kits/', group: 'ui-kits' },
  { text: 'Downloads', link: '/downloads/' },
];

const buildHovercardItems = (link) => {
  if (!link.group) return [];
  const sections = themeData.value.sidebar?.topLevelGroups?.[link.group]?.sections;
  if (!sections) return [];
  const keys = Object.keys(sections);
  // Single-section groups (Foundations, UI Kits) surface the section's items;
  // multi-section groups (Design System) surface each section's top-level entry.
  const items = keys.length === 1
    ? sections[keys[0]]
    : keys.map(k => Array.isArray(sections[k]) ? sections[k][0] : null);
  return (items || []).filter(item => item?.link && item?.description);
};

const hovercardMap = computed(() =>
  Object.fromEntries(navItems.map(link => [link.text, buildHovercardItems(link)])),
);

const navButtonProps = (link) => ({
  to: link.link,
  kind: 'muted',
  importance: 'clear',
  size: 400,
  class: 'd-fw-normal',
  active: isActiveLink(link.link),
});

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
    const designSystemPaths = ['/components/', '/utilities/', '/tokens/', '/guides/', '/about/', '/dialtone/', '/functions-and-utilities/'];
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
