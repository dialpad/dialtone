---
layout: Blank
---

<!-- Just an empty utilitarian page to explore some in a completely blank context -->

<script setup>
import { ref } from 'vue';
import { useThemeManager } from '@composables/useThemeManager';

const {
  currentMode,
  currentContrast,
  currentModeIconName,
  setMode,
  setContrast,
} = useThemeManager();

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const borderless = ref(false);
const outlined = ref(false);
const muted = ref(false);
const showIcon = ref(true);
const showPrefix = ref(true);
const showSuffix = ref(true);
const size = ref('md');
const selectOnFocus = ref(false);
const isDisabled = ref(false);
</script>

<dt-stack class="d-p32" gap="600">
  <dt-stack direction="row" gap="400">
    <dt-text as="h1" kind="headline" size="2xl">
      Scratchpad
    </dt-text>
    <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
      <template #anchor>
        <dt-button
          v-dt-tooltip:bottom="`Mode: ${capitalize(currentMode)}`"
          importance="outlined"
          size="sm"
          kind="muted"
          icon-position="right"
          class="dialtone-shell-btn"
        >
          <template #icon="{ iconSize }">
            <dt-icon :name="currentModeIconName" :size="iconSize" />
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
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'system' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('light')"
          >
            Light
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'light' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('dark')"
          >
            Dark
            <template #right>
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
            <template #right>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'default' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setContrast('high')"
          >
            High
            <template #right>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'high' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
      </template>
    </dt-dropdown>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Disabled Button
    </dt-text>
    <dt-text as="p" kind="body" size="lg">
      Not just a matter of applying opacity to whole button, but w/ combination of `color-mix()` and tweaking existing DtButton css variables via `oklch()` of specific properties – separate opacity and saturation for border, bgc, fc, etc.
    </dt-text>
    <dt-checkbox v-model="isDisabled">Disabled</dt-checkbox>
    <dt-stack gap="400" ref="disabledAll">
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" importance="outlined"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" importance="clear"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="danger"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="outlined"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="clear"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="positive">Place Call<template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="outlined">Place Call<template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="clear">Place Call<template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="muted" importance="clear"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="muted" importance="outlined"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
      </dt-stack>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Button: Prefix/Suffix
    </dt-text>
    <dt-text as="p" kind="body" size="lg">
      Freeform elements that are rendered before/after the button content.
    </dt-text>
    <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
      <dt-button kind="muted" importance="outlined" size="xs">
        Place Call
        <template #prefix> a </template>
        <template #suffix>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" size="sm">
        Place Call
        <template #prefix> a </template>
        <template #suffix>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" size="md">
        Place Call
        <template #prefix> a </template>
        <template #suffix>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" size="lg">
        Place Call
        <template #prefix> a </template>
        <template #suffix>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" size="xl">
        Place Call
        <template #prefix> a </template>
        <template #suffix>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Sizing update: Button/Input/Select
    </dt-text>
    <dt-stack direction="row">
      <dt-select-menu
        size="xs"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="xs" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="xs"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row">
      <dt-select-menu
        size="sm"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="sm" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="sm"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row">
      <dt-select-menu
        size="md"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="md" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="md"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row">
      <dt-select-menu
        size="lg"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="lg" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="lg"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row">
      <dt-select-menu
        size="xl"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="xl" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="xl"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Tabs
    </dt-text>
    <dt-text as="p" kind="body" size="lg">
      Just straight up refactor to use DtButton instead of custom markup/style. Use mix of DtButton variants depending on `active`. Uses all DtButton sizes (currently at least).
    </dt-text>
    <dt-stack gap="500" direction="row">
      <dt-checkbox v-model="borderless">
        Borderless
      </dt-checkbox>
      <dt-checkbox v-model="outlined">
        Outlined
      </dt-checkbox>
      <dt-checkbox v-model="muted">
        Muted
      </dt-checkbox>
      <dt-checkbox v-model="showIcon">
        Show Icon
      </dt-checkbox>
      <dt-checkbox v-model="showPrefix">
        Show Prefix
      </dt-checkbox>
      <dt-checkbox v-model="showSuffix">
        Show Suffix
      </dt-checkbox>
      <dt-checkbox v-model="selectOnFocus">
        Select on focus
      </dt-checkbox>
      <dt-select-menu
        :options="[
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md (default)' },
          { value: 'lg', label: 'lg' },
          { value: 'xl', label: 'xl' },
        ]"
        :model-value="size"
        @change="size = $event"
      />
    </dt-stack>
    <dt-tab-group :borderless="borderless" :kind="muted ? 'muted' : 'default'" :outlined="outlined" :size="size" :activation-mode="selectOnFocus ? 'auto' : 'manual'">
      <template #tabs>
        <dt-tab id="1" panel-id="2" selected>
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="sun" :size="iconSize" />
          </template>
          Argentina
          <template v-if="showPrefix" #prefix>
            <dt-badge kind="count" text="1" />
          </template>
          <template v-if="showSuffix" #suffix>
            <dt-badge kind="count" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="3" panel-id="4">
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="keypad" :size="iconSize" />
          </template>
          United States
          <template v-if="showPrefix" #prefix>
            <dt-badge kind="count" text="1" />
          </template>
          <template v-if="showSuffix" #suffix>
            <dt-badge kind="count" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="5" panel-id="6">
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="moon" :size="iconSize" />
          </template>
          United Kingdom
        </dt-tab>
        <dt-tab id="7" panel-id="8">
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="mic" :size="iconSize" />
          </template>
          India
        </dt-tab>
        <dt-tab id="9" panel-id="10" disabled>
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="grid" :size="iconSize" />
          </template>
          Canada
        </dt-tab>
      </template>
      <div class="d-py8">
        <dt-tab-panel id="2" tab-id="1">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">Argentina stretches from subtropical forests in the north to glacial landscapes in the south, encompassing the towering Andes mountains and the vast Pampas grasslands in between.</dt-text>
            <dt-text as="p" kind="body" size="md">Its cities blend European architectural influences with a vibrant local character, while rural traditions of horsemanship and cattle ranching continue to shape the national identity.</dt-text>
            <dt-text as="p" kind="body" size="md">The country is celebrated for its contributions to tango, wine production, and a culinary culture built around shared meals and regional flavors.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="4" tab-id="3">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">The United States spans a broad continental range, from Atlantic coastlines and Appalachian ridges to Great Plains, Rocky Mountain summits, and Pacific shores beyond.</dt-text>
            <dt-text as="p" kind="body" size="md">Major metropolitan areas serve as centers for finance, technology, and the arts, while smaller communities maintain distinct regional customs, dialects, and culinary traditions.</dt-text>
            <dt-text as="p" kind="body" size="md">The nation's history of immigration has produced a diverse cultural fabric, with influences from virtually every corner of the globe woven into daily life.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="6" tab-id="5">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">The United Kingdom comprises England, Scotland, Wales, and Northern Ireland, each with distinct landscapes ranging from chalk cliffs and moors to highland lochs and green valleys.</dt-text>
            <dt-text as="p" kind="body" size="md">Its cities layer centuries of history alongside modern architecture, with institutions in education, finance, and governance that have influenced systems around the world.</dt-text>
            <dt-text as="p" kind="body" size="md">A strong tradition in literature, theater, and music continues to thrive, supported by public institutions and a widespread culture of creative expression.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="8" tab-id="7">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">India extends from the Himalayan ranges in the north through fertile river plains to tropical coastlines in the south, supporting an extraordinary range of ecosystems and climates.</dt-text>
            <dt-text as="p" kind="body" size="md">Hundreds of languages and traditions coexist across its states and territories, producing one of the most culturally varied societies on earth with deep historical roots.</dt-text>
            <dt-text as="p" kind="body" size="md">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="10" tab-id="9">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">Canada stretches from the Atlantic to the Pacific and northward into the Arctic, encompassing boreal forests, prairies, mountain ranges, and thousands of lakes and waterways.</dt-text>
            <dt-text as="p" kind="body" size="md">Its cities are known for cultural diversity and livability, while vast rural and wilderness areas support forestry, mining, and agriculture across multiple climate zones.</dt-text>
            <dt-text as="p" kind="body" size="md">Official bilingualism in English and French reflects a history shaped by Indigenous peoples, European settlement, and ongoing immigration from around the world.</dt-text>
          </dt-stack>
        </dt-tab-panel>
      </div>
    </dt-tab-group>
  </dt-stack>
</dt-stack>
<div class="d-h768"></div>
