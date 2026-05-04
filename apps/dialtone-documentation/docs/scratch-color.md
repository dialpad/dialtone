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
              <dt-text tone="tertiary">{{ capitalize(currentMode) }}</dt-text>
            </span>
            <span>
              <dt-text strength="bold">Contrast:</dt-text>
              <dt-text tone="tertiary">{{ capitalize(currentContrast) }}</dt-text>
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
<dt-box surface="primary" padding="400">
  <dt-stack gap="400">
    <dt-stack gap="100">
      <dt-text as="h2" kind="headline" size="500">Black ramp candidates</dt-text>
      <dt-prose class="d-fc-secondary">
        All four ramps share the current black ramp's lightness curve; <strong>L, C, and H all drift gradually</strong> along each ramp — no constants, mirroring how bronze intentionally drifts all three coords.
        <ul>
          <li><strong>Mono</strong>: pure black</li>
          <li><strong>Bronze</strong>: warm</li>
          <li><strong>Steel</strong>: cool</li>
          <li><strong>Graphite</strong>: cool, less saturated</li>
        </ul>
        Toggle Mode at top.
      </dt-prose>
    </dt-stack>
    <dt-box class="d-d-grid d-g-cols4 asdfqwer">
      <base-color color-name="mono" :stops="monoStops" :mode="resolvedMode" />
      <base-color color-name="bronze" :stops="bronzeStops" :mode="resolvedMode" />
      <base-color color-name="steel" :stops="steelStops" :mode="resolvedMode" />
      <base-color color-name="graphite" :stops="graphiteStops" :mode="resolvedMode" />
    </dt-box>
  </dt-stack>
</dt-box>
<dt-box surface="primary" padding="400">
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
        v-for="row in buttonVariants"
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
      <template v-for="kind in badgeKinds" :key="kind || 'text'">
        <dt-badge v-for="t in badgeTypes" :key="`${kind || 'text'}-${t || 'default'}`" :text="kind === 'count' ? '1' : 'Label'" :kind="kind" :type="t" />
      </template>
    </dt-stack>
    <dt-stack direction="row" gap="200">
      <dt-stack v-for="important in [false, true]" :key="important" gap="100">
        <example-notice v-for="k in noticeKinds" :key="k" :important="important" :kind="k" :title="`${capitalize(k)} title (optional)`" />
      </dt-stack>
    </dt-stack>
    <dt-stack direction="row" gap="200">
      <dt-stack v-for="k in progressKinds" :key="k" gap="100">
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
  .asdfqwer [style] * {
    opacity: 0;
  }
  .asdfqwer:hover [style] * {
    opacity: initial;
  }
</style>

<script setup>
import { computed, inject } from 'vue';
import Color from 'colorjs.io';
import BaseColor from '@baseComponents/BaseColor.vue';
import { useThemeManager } from '@composables/useThemeManager';
import ExampleNotice from '@exampleComponents/ExampleNotice.vue';

const tokensDocs = inject('tokensDocs');

// APCA Lc — port of ColorsCatalog.vue logic so the candidate ramps share its
// contrast model. Constants tuned together; do not alter individually.
function colorToRGB (colorValue) {
  const c = new Color(colorValue).to('srgb');
  return {
    r: Math.max(0, Math.min(255, Math.round(c.coords[0] * 255))),
    g: Math.max(0, Math.min(255, Math.round(c.coords[1] * 255))),
    b: Math.max(0, Math.min(255, Math.round(c.coords[2] * 255))),
  };
}
function sRGBtoY (r, g, b) {
  const lin = (val) => {
    const v = val / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126729 * lin(r) + 0.7151522 * lin(g) + 0.0721750 * lin(b);
}
function apcaContrast (bg, fg) {
  const bgY = sRGBtoY(bg.r, bg.g, bg.b);
  const fgY = sRGBtoY(fg.r, fg.g, fg.b);
  const SOFT = 0.022;
  const bgYc = bgY > SOFT ? bgY : bgY + Math.pow(SOFT - bgY, 1.414);
  const fgYc = fgY > SOFT ? fgY : fgY + Math.pow(SOFT - fgY, 1.414);
  let contrast;
  if (bgYc >= fgYc) {
    contrast = (Math.pow(bgYc, 0.56) - Math.pow(fgYc, 0.57)) * 1.14;
  } else {
    contrast = (Math.pow(bgYc, 0.65) - Math.pow(fgYc, 0.62)) * 1.14;
  }
  if (Math.abs(contrast) < 0.1) return 0;
  return contrast > 0 ? (contrast - 0.027) * 100 : (contrast + 0.027) * 100;
}

const messages = {
  warning: { "message": "Warning validation message", "type": "warning" },
  critical: { "message": "Critical validation message", "type": "critical" },
  positive: { "message": "Positive validation message", "type": "positive" },
};

// Each section renders twice: once normally and once inside a v-dt-mode:invert
// wrapper, which swaps all tokens to their *-inverted counterparts automatically.

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
const buttonVariants = [
  { kind: undefined, importances: [undefined, 'outlined', 'clear'] },
  { kind: 'critical', importances: [undefined, 'outlined', 'clear'] },
  { kind: 'positive', importances: [undefined, 'outlined', 'clear'] },
  { kind: 'muted', importances: ['clear', 'outlined'] },
];
const badgeKinds = [undefined, 'count'];
const badgeTypes = [undefined, 'info', 'positive', 'warning', 'critical'];
const noticeKinds = ['base', 'critical', 'info', 'positive', 'warning'];
const progressKinds = ['default', 'brand', 'critical', 'positive', 'warning', 'info', 'ai'];

const {
  currentMode,
  currentContrast,
  currentModeIconName,
  resolvedMode,
  setMode,
  setContrast,
  currentTheme,
  setTheme,
  namedThemes,
  numberedThemes,
  formatThemeName,
} = useThemeManager({ includeThemes: true });

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Build candidate stop arrays. Each ramp shares the current black ramp's L
// curve (read from tokensDocs per active mode); only C/H differ.
//   bronze   = current values verbatim (yellow-warm)
//   mono     = C=0 (true achromatic)
//   steel    = blend of two cool reference tables
//   graphite = single cool reference table (quietest)
function buildAllStops (mkValue) {
  if (!tokensDocs) return [];
  const mode = resolvedMode.value;
  const fgP = tokensDocs['--dt-color-foreground-primary']?.[`dp-${mode}`]?.value;
  const fgI = tokensDocs['--dt-color-foreground-primary-inverted']?.[`dp-${mode}`]?.value;
  if (!fgP || !fgI) return [];
  const fgPrimaryRGB = colorToRGB(fgP);
  const fgInvertedRGB = colorToRGB(fgI);
  const blackKeys = Object.keys(tokensDocs)
    .filter(name => /^--dt-color-black-\d{2,4}$/.test(name))
    .sort((a, b) => Number(a.match(/\d+$/)[0]) - Number(b.match(/\d+$/)[0]));
  return blackKeys.map(name => {
    const stop = name.match(/\d+$/)[0];
    const sourceValue = tokensDocs[name][`base-${mode}`].value;
    const [L] = new Color(sourceValue).to('oklch').coords;
    const value = mkValue(sourceValue, L);
    const bgRGB = colorToRGB(value);
    return {
      stop,
      value,
      lightness: L,
      primaryContrast: Math.abs(apcaContrast(bgRGB, fgPrimaryRGB)),
      invertedContrast: Math.abs(apcaContrast(bgRGB, fgInvertedRGB)),
    };
  });
}

const bronzeStops = computed(() => buildAllStops((v) => v));
const monoStops = computed(() => buildAllStops((_, L) => `oklch(${L} 0 0)`));

// Steel and graphite — both C and H per stop interpolated from an L→C/H
// reference table, evaluated at the bronze-derived L per stop. All three of
// L, C, H drift gradually along each ramp (no constant-anything), matching
// the pattern of the curated bronze `color.black`. Because bronze light's L
// curve and bronze dark's L curve already diverge slightly (per-mode smoothing),
// the per-stop H interp lands at different angles in the two modes — so each
// ramp's dark mode is no longer just an L-flip of its light mode.
//
// Reference tables are starting points only; values may be retuned to fit
// Dialtone's own design intent.
const STEEL_REF_LCH = [
  [0.130, 0.028, 261.692],
  [0.210, 0.034, 264.665],
  [0.279, 0.041, 260.031],
  [0.373, 0.034, 259.733],
  [0.446, 0.030, 256.802],
  [0.551, 0.027, 264.365],
  [0.707, 0.022, 261.325],
  [0.872, 0.010, 258.338],
  [0.928, 0.006, 264.531],
  [0.967, 0.003, 264.542],
  [0.985, 0.002, 247.839],
];
const GRAPHITE_REF_LCH = [
  [0.141, 0.005, 285.823],
  [0.210, 0.006, 285.885],
  [0.274, 0.006, 286.033],
  [0.370, 0.013, 285.805],
  [0.442, 0.017, 285.786],
  [0.552, 0.016, 285.938],
  [0.705, 0.015, 286.067],
  [0.871, 0.006, 286.286],
  [0.920, 0.004, 286.320],
  [0.967, 0.001, 286.375],
  [0.985, 0.001, 286.375],
];
function coordsFromTable (L, table) {
  if (L >= 1.0) return [0, 0]; // pure white anchor
  if (L <= table[0][0]) return [table[0][1], table[0][2]];
  const top = table[table.length - 1];
  if (L >= top[0]) {
    // Taper C toward 0 between (top.L, top.C) and (1.0, 0); hold H
    const t = (L - top[0]) / (1.0 - top[0]);
    return [top[1] * (1 - t), top[2]];
  }
  for (let i = 0; i < table.length - 1; i++) {
    const [L1, C1, H1] = table[i];
    const [L2, C2, H2] = table[i + 1];
    if (L1 <= L && L <= L2) {
      const t = (L - L1) / (L2 - L1);
      return [C1 + t * (C2 - C1), H1 + t * (H2 - H1)];
    }
  }
  return [0, 0];
}

const makeRampStops = (table) => computed(() => buildAllStops((_, L) => {
  if (L >= 0.9999) return 'oklch(1 0 0)';
  const [C, H] = coordsFromTable(L, table);
  return `oklch(${L} ${C.toFixed(4)} ${H.toFixed(2)})`;
}));

// Blend two reference tables — at each L, evaluate both and lerp C/H by `t`
// (0 = pure tableA, 1 = pure tableB). Used by steel to sit between the two
// reference tables (steel-ref leans bluer; graphite-ref is quieter and more
// violet).
const makeBlendedStops = (tableA, tableB, t) => computed(() => buildAllStops((_, L) => {
  if (L >= 0.9999) return 'oklch(1 0 0)';
  const [Ca, Ha] = coordsFromTable(L, tableA);
  const [Cb, Hb] = coordsFromTable(L, tableB);
  const C = Ca * (1 - t) + Cb * t;
  const H = Ha * (1 - t) + Hb * t;
  return `oklch(${L} ${C.toFixed(4)} ${H.toFixed(2)})`;
}));

const steelStops = makeBlendedStops(STEEL_REF_LCH, GRAPHITE_REF_LCH, 0.4);
const graphiteStops = makeRampStops(GRAPHITE_REF_LCH);
</script>
