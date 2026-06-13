<!-- eslint-disable max-lines -->
<template>
  <DtStack direction="row" gap="50">
    <DtStack direction="row" gap="100">
      <dt-button
        class="dialtone-shell-btn"
        active
        to="/dialtone/"
      >
        Product Design
      </dt-button>
      <dt-button
        class="dialtone-shell-btn"
        href="https://dialpad.design/brand"
      >
        Brand Design
      </dt-button>
    </DtStack>
    <!-- <dt-button
      to="/dialtone/whats-new/"
      class="d-mie-100"
      size="100"
    >
      What's New
      <template #startIcon="{ iconSize }">
        <dt-icon name="megaphone" :size="iconSize" />
      </template>
    </dt-button> -->
    <dt-button
      v-dt-tooltip="'Storybook'"
      href="https://dialtone.dialpad.com/vue"
      target="_blank"
      rel="noreferrer noopener"
      kind="muted"
      importance="clear"
      aria-label="Open Storybook"
    >
      <template #startIcon="{ iconSize }">
        <dt-icon name="storybook" :size="iconSize" />
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
      <template #startIcon="{ iconSize }">
        <dt-icon name="github" :size="iconSize" />
      </template>
    </dt-button>
    <dt-dropdown
      id="theme-toggle-dropdown"
      navigation-type="arrow-keys"
      placement="bottom-end"
      class="theme-toggle-dropdown"
      max-height="33vh"
      :hidden="!showThemeSwitcher"
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
          heading-class="d-px-100"
          heading=" "
        >
          <template #heading>
            <dt-text as="label" kind="label" size="100" tone="tertiary">
              Base Theme
            </dt-text>
          </template>
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
          heading=" "
          heading-class="d-px-100"
        >
          <template #heading>
            <dt-text as="label" kind="label" size="100" tone="tertiary">
              Partner Themes
            </dt-text>
          </template>
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
          heading=" "
          heading-class="d-px-100"
        >
          <template #heading>
            <dt-text as="label" kind="label" size="100" tone="tertiary">
              Accessibility
            </dt-text>
          </template>
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
          heading=" "
          heading-class="d-px-100"
        >
          <template #heading>
            <dt-text as="label" kind="label" size="100" tone="tertiary">
              Named Themes
            </dt-text>
          </template>
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
          heading=" "
          heading-class="d-px-100"
        >
          <template #heading>
            <dt-text as="label" kind="label" size="100" tone="tertiary">
              Experimental (37 themes)
            </dt-text>
          </template>
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
    <dt-dropdown navigation-type="arrow-keys" placement="bottom-end">
      <template #anchor>
        <dt-button
          v-dt-tooltip:bottom="`Mode: ${capitalize(currentMode)}`"
          importance="clear"
          kind="muted"
          class="dialtone-shell-btn"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon :name="currentModeIconName" :size="iconSize" />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading=" "
          heading-class="d-px-100"
        >
          <template #heading>
            <dt-text as="label" kind="label" size="100" tone="tertiary">
              Mode
            </dt-text>
          </template>
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
          heading=" "
          heading-class="d-px-100"
        >
          <template #heading>
            <dt-text as="label" kind="label" size="100" tone="tertiary">
              Contrast
            </dt-text>
          </template>
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
        <template v-if="!isMaterialLocked">
          <dt-dropdown-separator />
          <dt-list-item-group
            heading=" "
            heading-class="d-px-100"
          >
            <template #heading>
              <dt-text as="label" kind="label" size="100" tone="tertiary">
                Material
              </dt-text>
            </template>
            <dt-list-item
              v-for="material in materials"
              :key="material"
              role="menuitem"
              navigation-type="arrow-keys"
              @click="setMaterial(material)"
            >
              {{ formatMaterial(material) }}
              <template #end>
                <dt-icon :class="{ 'd-o0': currentMaterial !== material }" name="check" size="200" />
              </template>
            </dt-list-item>
          </dt-list-item-group>
        </template>
      </template>
    </dt-dropdown>
  </DtStack>
</template>

<script setup>
import { useThemeManager } from '../composables/useThemeManager';

defineEmits(['search']);

const showThemeSwitcher = __VUEPRESS_DEV__ || __DIALTONE_DEPLOY_PREVIEW__;

// Use theme manager composable with theme switching enabled
const {
  currentMode,
  currentTheme,
  currentContrast,
  currentModeIconName,
  setMode,
  setContrast,
  setMaterial,
  setTheme,
  namedThemes,
  numberedThemes,
  formatThemeName,
  materials,
  currentMaterial,
  isMaterialLocked,
} = useThemeManager({ includeThemes: true });

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const formatMaterial = (m) => m === 'sandstone' ? 'Sandstone (default)' : capitalize(m);
</script>

<style scoped>
.theme-toggle-button {
  color: var(--dt-shell-mention-color-surface-primary);
}
</style>
