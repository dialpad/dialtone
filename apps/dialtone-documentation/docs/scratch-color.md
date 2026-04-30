---
layout: Blank
---

<dt-box class="d-ps-fixed d-ibs-100 d-iie-200" surface="primary">
  <dt-stack direction="row" gap="100">
    <dt-dropdown
      navigation-type="arrow-keys"
    >
      <template #anchor>
        <dt-button
          importance="outlined"
          kind="muted"
          :size="200"
        >
          <dt-stack gap="100" direction="row">
            <span>
              <dt-text strength="bold">Mode:</dt-text>
              <dt-text tone="tertiary">{{ currentMode.charAt(0).toUpperCase() + currentMode.slice(1) }}</dt-text>
            </span>
            <span>
              <dt-text strength="bold">Contrast:</dt-text>
              <dt-text tone="tertiary">{{ currentContrast.charAt(0).toUpperCase() + currentContrast.slice(1) }}</dt-text>
            </span>
          </dt-stack>
          <template #startIcon="{ iconSize }">
            <dt-icon
              :size="iconSize"
              :name="currentModeIconName"
            />
          </template>
          <template #endIcon="{ iconSize }">
            <dt-icon
              :size="iconSize"
              name="chevron-down"
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
    <dt-dropdown
      navigation-type="arrow-keys"
      max-height="33vh"
    >
      <template #anchor>
        <dt-button
          v-dt-tooltip:bottom="`Theme: ${capitalize(currentTheme)}`"
          class="theme-toggle-button dialtone-shell-btn"
          importance="outlined"
          kind="muted"
          :size="200"
        >
          <dt-stack direction="row" gap="50">
            Theme: {{ currentTheme }}
          </dt-stack>
          <template #endIcon>
            <dt-icon name="chevron-down" size="200" />
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
  </dt-stack>
</dt-box>
<dt-box class="foo" surface="primary" padding="400">
  <dt-stack gap="400">
    <dt-stack gap="200">
      <dt-text as="h3" kind="label" size="200" strength="bold" tone="primary">Surfaces</dt-text>
      <dt-stack direction="row" align="start">
        <dt-stack
          v-for="surfaceItem in primarySurfaces"
          :key="surfaceItem.name"
        >
          <dt-box padding="300" :surface="surfaceItem.name">
            <dt-text v-if="surfaceItem.dark" v-dt-mode:invert as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceItem.name }}</dt-text>
            <dt-text v-else as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceItem.name }}</dt-text>
          </dt-box>
          <dt-box padding="300" :surface="`${surfaceItem.name}-opaque`">
            <dt-text v-if="surfaceItem.dark" v-dt-mode:invert as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceItem.name }}-opaque</dt-text>
            <dt-text v-else as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceItem.name }}-opaque</dt-text>
          </dt-box>
        </dt-stack>
      </dt-stack>
      <dt-stack direction="row" align="start">
        <dt-stack v-for="surfaceName in semanticSubtleSurfaces" :key="surfaceName">
          <dt-box padding="300" :surface="surfaceName"><dt-text as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceName }}</dt-text></dt-box>
          <dt-box padding="300" :surface="`${surfaceName}-opaque`"><dt-text as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceName }}-opaque</dt-text></dt-box>
        </dt-stack>
      </dt-stack>
      <dt-stack direction="row" align="start">
        <dt-box v-for="surfaceName in semanticStrongSurfaces" :key="surfaceName" padding="300" :surface="surfaceName">
          <dt-text as="p" kind="code" size="100" strength="bold" tone="primary" v-dt-mode:invert>{{ surfaceName }}</dt-text>
        </dt-box>
      </dt-stack>
      <dt-stack direction="row" align="start">
        <dt-box padding="300" surface="backdrop"><dt-text as="p" kind="code" size="100" strength="bold" tone="primary">backdrop</dt-text></dt-box>
      </dt-stack>
    </dt-stack>
    <dt-box surface="primary" padding="300" border-radius="200" v-dt-mode:invert>
      <dt-stack gap="200">
        <dt-text as="h3" kind="label" size="200" strength="bold" tone="primary">Surfaces — inverted</dt-text>
        <dt-stack direction="row" align="start">
          <dt-stack
            v-for="surfaceItem in primarySurfaces"
            :key="surfaceItem.name"
          >
            <dt-box padding="300" :surface="surfaceItem.name">
              <dt-text as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceItem.name }}-inv</dt-text>
            </dt-box>
            <dt-box padding="300" :surface="`${surfaceItem.name}-opaque`">
              <dt-text as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceItem.name }}-opa-inv</dt-text>
            </dt-box>
          </dt-stack>
        </dt-stack>
        <dt-stack direction="row" align="start">
          <dt-stack v-for="surfaceName in semanticSubtleSurfaces" :key="surfaceName">
            <dt-box padding="300" :surface="surfaceName"><dt-text as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceName }}-inv</dt-text></dt-box>
            <dt-box padding="300" :surface="`${surfaceName}-opaque`"><dt-text as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceName }}-opa-inv</dt-text></dt-box>
          </dt-stack>
        </dt-stack>
        <dt-stack direction="row" align="start">
          <dt-box v-for="surfaceName in semanticStrongSurfaces" :key="surfaceName" padding="300" :surface="surfaceName">
            <dt-text as="p" kind="code" size="100" strength="bold" tone="primary">{{ surfaceName }}-inv</dt-text>
          </dt-box>
        </dt-stack>
      </dt-stack>
    </dt-box>
    <dt-stack gap="200">
      <dt-text as="h3" kind="label" size="200" strength="bold" tone="primary">Borders</dt-text>
      <dt-stack
        v-for="borderRow in borderRows"
        :key="borderRow.join()"
        direction="row"
        align="stretch"
        gap="200"
      >
        <dt-box v-for="borderName in borderRow" :key="borderName" padding="200" border-width="200" border-radius="500" :border-color="borderName">
          <dt-text as="p" kind="code" size="100" strength="bold" tone="primary">{{ borderName }}</dt-text>
        </dt-box>
      </dt-stack>
    </dt-stack>
    <dt-box surface="primary" padding="300" border-radius="200" v-dt-mode:invert>
      <dt-stack gap="200">
        <dt-text as="h3" kind="label" size="200" strength="bold" tone="primary">Borders — inverted</dt-text>
        <dt-stack
          v-for="borderRow in borderRows"
          :key="borderRow.join()"
          direction="row"
          align="stretch"
          gap="200"
        >
          <dt-box v-for="borderName in borderRow" :key="borderName" padding="200" border-width="200" border-radius="500" :border-color="borderName">
            <dt-text as="p" kind="code" size="100" strength="bold" tone="primary">{{ borderName }}-inv</dt-text>
          </dt-box>
        </dt-stack>
      </dt-stack>
    </dt-box>
    <dt-stack gap="200">
      <dt-text as="h3" kind="label" size="200" strength="bold" tone="primary">Foreground (text tones)</dt-text>
      <dt-stack direction="row" gap="100" align="baseline">
        <dt-text v-for="toneName in foregroundTones" :key="toneName" :tone="toneName">{{ toneName }}</dt-text>
      </dt-stack>
    </dt-stack>
    <dt-box surface="primary" padding="300" border-radius="200" v-dt-mode:invert>
      <dt-stack gap="200">
        <dt-text as="h3" kind="label" size="200" strength="bold" tone="primary">Foreground — inverted</dt-text>
        <dt-stack direction="row" gap="100" align="baseline">
          <dt-text v-for="toneName in foregroundTones" :key="toneName" :tone="toneName">{{ toneName }}</dt-text>
        </dt-stack>
      </dt-stack>
    </dt-box>
    <dt-stack gap="200">
      <dt-text as="h3" kind="label" size="200" strength="bold" tone="primary">Links</dt-text>
      <dt-stack direction="row" gap="100" align="baseline">
        <dt-link v-for="linkTone in linkTones" :key="linkTone" href="#link" :tone="linkTone === 'base' ? undefined : linkTone">{{ capitalize(linkTone) }} link</dt-link>
      </dt-stack>
    </dt-stack>
    <dt-box surface="primary" padding="300" border-radius="200" v-dt-mode:invert>
      <dt-stack gap="200">
        <dt-text as="h3" kind="label" size="200" strength="bold" tone="primary">Links — inverted</dt-text>
        <dt-stack direction="row" gap="100" align="baseline">
          <dt-link v-for="linkTone in linkTones" :key="linkTone" href="#link" :tone="linkTone === 'base' ? undefined : linkTone">{{ capitalize(linkTone) }} link</dt-link>
        </dt-stack>
      </dt-stack>
    </dt-box>
    <dt-stack gap="200">
      <dt-stack
        v-for="row in [
          { kind: undefined, importances: [undefined, 'outlined', 'clear'] },
          { kind: 'critical', importances: [undefined, 'outlined', 'clear'] },
          { kind: 'positive', importances: [undefined, 'outlined', 'clear'] },
          { kind: 'muted', importances: ['clear', 'outlined'] },
        ]"
        :key="row.kind || 'default'"
        gap="100"
        direction="row"
      >
        <dt-button v-for="imp in row.importances" :key="imp || 'filled'" :kind="row.kind" :importance="imp">Place Call</dt-button>
      </dt-stack>
    </dt-stack>
    <dt-stack direction="row" gap="100">
      <dt-presence presence="active" />
      <dt-presence presence="busy" />
      <dt-presence presence="away" />
    </dt-stack>
    <dt-stack direction="row" gap="100">
      <template v-for="kind in [undefined, 'count']" :key="kind || 'text'">
        <dt-badge v-for="t in [undefined, 'info', 'positive', 'warning', 'critical']" :key="`${kind || 'text'}-${t || 'default'}`" :text="kind === 'count' ? '1' : 'Label'" :kind="kind" :type="t" />
      </template>
    </dt-stack>
    <dt-stack direction="row" gap="200">
      <dt-stack v-for="important in [false, true]" :key="important" gap="100">
        <example-notice v-for="k in ['base', 'critical', 'info', 'positive', 'warning']" :key="k" :important="important" :kind="k" :title="`${capitalize(k)} title (optional)`" />
      </dt-stack>
    </dt-stack>
    <dt-stack direction="row" gap="200">
      <dt-stack v-for="k in ['default', 'brand', 'critical', 'positive', 'warning', 'info', 'ai']" :key="k" gap="100">
        <dt-progress-circle :kind="k" :progress="66" :aria-label="`kind ${k}`" />
      </dt-stack>
    </dt-stack>
    <div class="d-d-grid d-g-200 d-g-cols3">
      <template v-for="t in ['email', 'textarea']" :key="t">
        <dt-input v-for="m in ['critical', 'positive', 'warning']" :key="`${t}-${m}`" label="Label" :type="t" model-value="Value" :messages="[messages[m]]" />
      </template>
    </div>
<dialtone-usage>
<template #do>

- To flag and draw awareness to a specific element or feature of focus. For example, something is unique about that separates it from other like content.
- As a notification system with minimal footprint.
</template>

<template #dont>

- To indicate that interaction by the user is required.
</template>

</dialtone-usage>
  </dt-stack>
</dt-box>

<style>
.foo {
  /* background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H20V20H0V0Z' fill='var(--dt-color-surface-primary)'/%3E%3Cpath d='M0 0L20 20M20 0L0 20' stroke='%23666' stroke-width='1'/%3E%3C/svg%3E"); */
}
</style>

<script setup>
import { useThemeManager } from '@composables/useThemeManager';
import ExampleNotice from '@exampleComponents/ExampleNotice.vue';

const messages = {
  warning: { "message": "Warning validation message", "type": "warning" },
  critical: { "message": "Critical validation message", "type": "critical" },
  positive: { "message": "Positive validation message", "type": "positive" },
};

// Data tables for the comprehensive token visualization. Each row exists
// twice — once on a light wrapper (regular tokens) and once on a contrast
// wrapper with v-dt-mode:invert (which auto-resolves to *-inverted tokens).

const primarySurfaces = [
  { name: 'primary' },
  { name: 'secondary' },
  { name: 'moderate' },
  { name: 'bold' },
  { name: 'strong', dark: true },
  { name: 'contrast', dark: true },
];
const semanticSubtleSurfaces = [
  'info-subtle', 'info',
  'brand-subtle', 'brand',
  'positive-subtle', 'positive',
  'warning-subtle', 'warning',
  'critical-subtle', 'critical',
];
const semanticStrongSurfaces = [
  'info-strong', 'brand-strong', 'positive-strong', 'warning-strong', 'critical-strong',
];

const borderRows = [
  ['subtle', 'default', 'moderate', 'bold'],
  ['critical-subtle', 'critical', 'critical-strong', 'info-subtle', 'info', 'info-strong', 'positive-subtle', 'positive', 'positive-strong', 'warning-subtle', 'warning', 'warning-strong', 'brand-subtle', 'brand', 'brand-strong'],
  ['focus', 'accent'],
];

const foregroundTones = [
  'primary', 'secondary', 'tertiary', 'muted', 'disabled', 'placeholder',
  'positive', 'warning', 'critical', 'info',
];
const linkTones = ['base', 'critical', 'muted', 'positive', 'warning', 'info', 'mention'];

const {
  currentMode,
  currentContrast,
  currentModeIconName,
  setMode,
  setContrast,
  currentTheme,
  setTheme,
  namedThemes,
  numberedThemes,
  formatThemeName,
} = useThemeManager({ includeThemes: true });

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
</script>
